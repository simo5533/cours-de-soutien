"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { startEleveLemonSqueezyCheckout } from "@/actions/eleve-inscription-lemon-squeezy";
import { startElevePaddleCheckout } from "@/actions/eleve-inscription-paddle";
import { startEleveStripeCheckout } from "@/actions/eleve-inscription-stripe";
import { prisma } from "@/lib/prisma";
import { isLemonSqueezyConfigured } from "@/lib/lemon-squeezy-server";
import { getPaddle } from "@/lib/paddle-server";
import type { ElevePaddlePlan } from "@/lib/paddle-server";
import { getPaymentProvider } from "@/lib/payment-provider";
import { getStripe } from "@/lib/stripe-server";

const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["ELEVE", "PROFESSEUR"]),
    groupe: z.string().optional(),
    anneeScolaire: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "PROFESSEUR") return;
    // Groupe / année complétés plus tard dans le profil élève.
  });

/** État formulaire inscription — `paymentSkippedInDev` = élève créé sans paiement (mode dev uniquement). */
export type RegisterState =
  | { error?: string }
  | { ok: true; paymentSkippedInDev?: boolean; redirectTo?: string }
  | { checkoutUrl: string }
  | undefined;

export async function registerAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    groupe: formData.get("groupe") ?? undefined,
    anneeScolaire: formData.get("anneeScolaire") ?? undefined,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const fe = flat.fieldErrors;
    const first =
      fe.groupe?.[0] ||
      fe.anneeScolaire?.[0] ||
      fe.role?.[0] ||
      "Données invalides (mot de passe ≥ 6 caractères).";
    return { error: first };
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (existing) {
      return { error: "Cet e-mail est déjà utilisé." };
    }

    if (parsed.data.role === "ELEVE") {
    const devBypass =
      process.env.NODE_ENV === "development" &&
      process.env.STRIPE_BYPASS_IN_DEV?.trim() === "true";

    const provider = getPaymentProvider();

    const eleveDefaults = {
      groupe: parsed.data.groupe?.trim() || "À compléter",
      anneeScolaire: parsed.data.anneeScolaire?.trim() || "2025-2026",
    };

    if (!getStripe() && !getPaddle() && !isLemonSqueezyConfigured() && devBypass) {
      await prisma.user.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash: await bcrypt.hash(parsed.data.password, 10),
          role: "ELEVE",
          ...eleveDefaults,
        },
      });
      return { ok: true, paymentSkippedInDev: true, redirectTo: "/eleve/aide-scolaire" };
    }

    const locale = String(formData.get("locale") || "fr");
    const rawPlan = formData.get("elevePlan");

    if (rawPlan === "free") {
      await prisma.user.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash: await bcrypt.hash(parsed.data.password, 10),
          role: "ELEVE",
          ...eleveDefaults,
        },
      });
      return { ok: true, redirectTo: "/eleve/aide-scolaire" };
    }

    const elevePlan: ElevePaddlePlan =
      rawPlan === "bacplus"
        ? "bacplus"
        : rawPlan === "family"
          ? "family"
          : "essential";

    if (provider === "lemonsqueezy") {
      if (!isLemonSqueezyConfigured()) {
        return {
          error:
            "Paiement Lemon Squeezy indisponible : ajoutez LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID et LEMONSQUEEZY_VARIANT_ID_ELEVE_INSCRIPTION (ou par formule) sur le serveur.",
        };
      }
      const checkout = await startEleveLemonSqueezyCheckout(
        {
          name: parsed.data.name,
          email: parsed.data.email,
          password: parsed.data.password,
          groupe: eleveDefaults.groupe,
          anneeScolaire: eleveDefaults.anneeScolaire,
          lemonPlan: elevePlan,
        },
        locale,
      );
      if ("error" in checkout) {
        return { error: checkout.error };
      }
      return { checkoutUrl: checkout.checkoutUrl };
    }

    if (provider === "paddle") {
      const paddle = getPaddle();
      if (!paddle) {
        return {
          error:
            "Paiement Paddle indisponible : ajoutez PADDLE_API_KEY dans web/.env (sandbox : developer.paddle.com). PAYMENT_PROVIDER=paddle.",
        };
      }
      const checkout = await startElevePaddleCheckout(
        {
          name: parsed.data.name,
          email: parsed.data.email,
          password: parsed.data.password,
          groupe: eleveDefaults.groupe,
          anneeScolaire: eleveDefaults.anneeScolaire,
          paddlePlan: elevePlan,
        },
        locale,
      );
      if ("error" in checkout) {
        return { error: checkout.error };
      }
      return { checkoutUrl: checkout.checkoutUrl };
    }

    const stripe = getStripe();
    if (!stripe) {
      return {
        error:
          "Paiement en ligne indisponible : configurez Lemon Squeezy (défaut), Paddle (PAYMENT_PROVIDER=paddle) ou Stripe (PAYMENT_PROVIDER=stripe). En local uniquement, STRIPE_BYPASS_IN_DEV=true permet de créer un compte élève sans paiement.",
      };
    }

    const checkout = await startEleveStripeCheckout(
      {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        groupe: parsed.data.groupe!.trim(),
        anneeScolaire: parsed.data.anneeScolaire!.trim(),
        stripePlan: elevePlan,
      },
      locale,
    );
    if ("error" in checkout) {
      return { error: checkout.error };
    }
    return { checkoutUrl: checkout.checkoutUrl };
    }

    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash: await bcrypt.hash(parsed.data.password, 10),
        role: parsed.data.role,
        groupe: null,
        anneeScolaire: null,
      },
    });

    return { ok: true };
  } catch (e) {
    console.error("[registerAction]", e);
    const raw = e instanceof Error ? e.message : String(e);
    const tail = raw.length > 420 ? `${raw.slice(0, 420)}…` : raw;
    return {
      error: `Erreur serveur lors de l'inscription. Détail technique : ${tail}`,
    };
  }
}

