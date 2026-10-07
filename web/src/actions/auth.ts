"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { startEleveLemonSqueezyCheckout } from "@/actions/eleve-inscription-lemon-squeezy";
import { startElevePaddleCheckout } from "@/actions/eleve-inscription-paddle";
import { startEleveStripeCheckout } from "@/actions/eleve-inscription-stripe";
import { prisma } from "@/lib/prisma";
import {
  getLemonVariantIdForElevePlan,
  isLemonSqueezyConfigured,
} from "@/lib/lemon-squeezy-server";
import { getPaddle, getPaddlePriceIdForElevePlan } from "@/lib/paddle-server";
import { getPaymentProvider } from "@/lib/payment-provider";
import { normalizeCheckoutPlan, type CheckoutPlan } from "@/lib/plans";
import { getStripe, getStripePriceIdForElevePlan } from "@/lib/stripe-server";

/** Inscription publique : toujours un compte ELEVE (espace correcteur), le profil est indicatif. */
const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.literal("ELEVE"),
    accountType: z.enum(["PARENT", "ELEVE", "PROF", "CENTRE"]).default("ELEVE"),
    centreName: z.string().trim().max(120).optional(),
    groupe: z.string().optional(),
    anneeScolaire: z.string().optional(),
  });

/** État formulaire inscription — `paymentSkippedInDev` = élève créé sans paiement (mode dev uniquement). */
export type RegisterState =
  | { error?: string }
  | { ok: true; paymentSkippedInDev?: boolean; redirectTo?: string }
  | { checkoutUrl: string }
  | undefined;

const AFTER_SIGNUP_PATH = "/eleve/correcteur";

function formString(formData: FormData, key: string): string | undefined {
  const v = formData.get(key);
  return typeof v === "string" && v.trim() ? v : undefined;
}

/** Les offres Prof et Centre exigent un prix dédié chez le prestataire (jamais de montant par défaut). */
function missingDedicatedPrice(provider: string, plan: CheckoutPlan): boolean {
  if (plan !== "prof" && plan !== "centre") return false;
  if (provider === "lemonsqueezy") return !getLemonVariantIdForElevePlan(plan);
  if (provider === "paddle") return !getPaddlePriceIdForElevePlan(plan);
  return !getStripePriceIdForElevePlan(plan);
}

export async function registerAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") ?? "ELEVE",
    accountType: formString(formData, "accountType"),
    centreName: formString(formData, "centreName"),
    groupe: formString(formData, "groupe"),
    anneeScolaire: formString(formData, "anneeScolaire"),
  });
  if (!parsed.success) {
    return { error: "Données invalides (mot de passe ≥ 6 caractères)." };
  }

  const rawPlan = formString(formData, "elevePlan") ?? "free";
  const isFree = rawPlan === "free";
  const plan = normalizeCheckoutPlan(rawPlan);
  const centreName = parsed.data.centreName?.trim();
  if (!isFree && plan === "centre" && (!centreName || centreName.length < 2)) {
    return { error: "Indiquez le nom du centre." };
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (existing) {
      return { error: "Cet e-mail est déjà utilisé." };
    }

    const devBypass =
      process.env.NODE_ENV === "development" &&
      process.env.STRIPE_BYPASS_IN_DEV?.trim() === "true";

    const provider = getPaymentProvider();
    const locale = String(formData.get("locale") || "fr");

    const eleveDefaults = {
      groupe: parsed.data.groupe?.trim() || "À compléter",
      anneeScolaire: parsed.data.anneeScolaire?.trim() || "2025-2026",
    };
    const profile = {
      accountType: parsed.data.accountType,
      centreName: plan === "centre" ? centreName : undefined,
    };

    const createFreeUser = async () =>
      prisma.user.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash: await bcrypt.hash(parsed.data.password, 10),
          role: "ELEVE",
          subscriptionPlan: "FREE",
          subscriptionStatus: "free",
          aiCorrectionsUsedInPeriod: 0,
          accountType: parsed.data.accountType,
          ...eleveDefaults,
        },
      });

    if (!getStripe() && !getPaddle() && !isLemonSqueezyConfigured() && devBypass) {
      await createFreeUser();
      return { ok: true, paymentSkippedInDev: true, redirectTo: AFTER_SIGNUP_PATH };
    }

    if (isFree) {
      await createFreeUser();
      return { ok: true, redirectTo: AFTER_SIGNUP_PATH };
    }

    if (missingDedicatedPrice(provider, plan)) {
      return {
        error:
          "Cette offre n'est pas encore disponible au paiement en ligne. Contactez-nous ou choisissez une autre offre.",
      };
    }

    const base = {
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      groupe: eleveDefaults.groupe,
      anneeScolaire: eleveDefaults.anneeScolaire,
      ...profile,
    };

    if (provider === "lemonsqueezy") {
      if (!isLemonSqueezyConfigured()) {
        return {
          error:
            "Paiement Lemon Squeezy indisponible : ajoutez LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID et LEMONSQUEEZY_VARIANT_ID_* sur le serveur.",
        };
      }
      const checkout = await startEleveLemonSqueezyCheckout({ ...base, lemonPlan: plan }, locale);
      if ("error" in checkout) return { error: checkout.error };
      return { checkoutUrl: checkout.checkoutUrl };
    }

    if (provider === "paddle") {
      if (!getPaddle()) {
        return {
          error:
            "Paiement Paddle indisponible : ajoutez PADDLE_API_KEY dans web/.env (sandbox : developer.paddle.com). PAYMENT_PROVIDER=paddle.",
        };
      }
      const checkout = await startElevePaddleCheckout({ ...base, paddlePlan: plan }, locale);
      if ("error" in checkout) return { error: checkout.error };
      return { checkoutUrl: checkout.checkoutUrl };
    }

    if (!getStripe()) {
      return {
        error:
          "Paiement en ligne indisponible : configurez Lemon Squeezy (défaut), Paddle (PAYMENT_PROVIDER=paddle) ou Stripe (PAYMENT_PROVIDER=stripe). En local uniquement, STRIPE_BYPASS_IN_DEV=true permet de créer un compte sans paiement.",
      };
    }
    const checkout = await startEleveStripeCheckout({ ...base, stripePlan: plan }, locale);
    if ("error" in checkout) return { error: checkout.error };
    return { checkoutUrl: checkout.checkoutUrl };
  } catch (e) {
    console.error("[registerAction]", e);
    return {
      error: "Erreur serveur lors de l'inscription. Réessayez dans quelques instants.",
    };
  }
}
