"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  createLemonSqueezyCheckout,
  getLemonSqueezyStoreId,
  getLemonVariantIdForElevePlan,
  validateLemonSqueezyResources,
  type EleveLemonPlan,
} from "@/lib/lemon-squeezy-server";
import { getAppBaseUrl } from "@/lib/stripe-server";

export type EleveLemonCheckoutState =
  | { error: string }
  | { checkoutUrl: string };

type EleveRegisterInput = {
  name: string;
  email: string;
  password: string;
  groupe: string;
  anneeScolaire: string;
  lemonPlan?: EleveLemonPlan;
};

export async function startEleveLemonSqueezyCheckout(
  input: EleveRegisterInput,
  locale: string,
): Promise<EleveLemonCheckoutState> {
  const storeId = getLemonSqueezyStoreId();
  const plan = input.lemonPlan ?? "essential";
  const variantId = getLemonVariantIdForElevePlan(plan);

  if (!storeId || !variantId) {
    return {
      error:
        "Paiement Lemon Squeezy indisponible : configurez LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID et au moins un LEMONSQUEEZY_VARIANT_ID_* sur le serveur.",
    };
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.trim() },
    });
    if (existing) {
      return { error: "Cet e-mail est déjà utilisé." };
    }

    await prisma.eleveRegistrationPending.deleteMany({
      where: { email: input.email.trim(), consumedAt: null },
    });

    const passwordHash = await bcrypt.hash(input.password, 10);

    const pending = await prisma.eleveRegistrationPending.create({
      data: {
        email: input.email.trim(),
        passwordHash,
        name: input.name.trim(),
        groupe: input.groupe.trim(),
        anneeScolaire: input.anneeScolaire.trim(),
      },
    });

    const base = getAppBaseUrl();
    const loc = locale === "ar" ? "ar" : "fr";
    const redirectUrl = `${base}/${loc}/inscription/succes?order_id=[order_id]`;

    let checkoutUrl: string;
    try {
      const check = await validateLemonSqueezyResources(storeId, variantId);
      if (!check.ok) {
        await prisma.eleveRegistrationPending
          .delete({ where: { id: pending.id } })
          .catch(() => {});
        return { error: check.error };
      }

      checkoutUrl = await createLemonSqueezyCheckout({
        variantId,
        storeId,
        email: input.email.trim(),
        pendingId: pending.id,
        redirectUrl,
      });
    } catch (e) {
      console.error("[startEleveLemonSqueezyCheckout] API", e);
      await prisma.eleveRegistrationPending
        .delete({ where: { id: pending.id } })
        .catch(() => {});
      const msg = e instanceof Error ? e.message : String(e);
      return {
        error: `Impossible d'ouvrir la page de paiement Lemon Squeezy. ${msg}`,
      };
    }

    return { checkoutUrl };
  } catch (e) {
    console.error("[startEleveLemonSqueezyCheckout]", e);
    const raw = e instanceof Error ? e.message : String(e);
    return {
      error: `Erreur lors de la préparation du paiement. ${raw.slice(0, 380)}`,
    };
  }
}
