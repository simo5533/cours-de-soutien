import Stripe from "stripe";

let stripe: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  if (stripe === undefined) {
    stripe = new Stripe(key);
  }
  return stripe;
}

/** Montant en centimes MAD (ex. 9900 = 99,00 MAD). */
export function getEleveInscriptionUnitAmount(): number {
  const raw = process.env.STRIPE_ELEVE_INSCRIPTION_AMOUNT?.trim();
  const n = raw ? Number.parseInt(raw, 10) : 9900;
  return Number.isFinite(n) && n > 0 ? n : 9900;
}

export function getStripePriceIdEleve(): string | null {
  const id = process.env.STRIPE_PRICE_ID_ELEVE_INSCRIPTION?.trim();
  return id || null;
}

export type EleveStripePlan = "essential" | "bacplus" | "family";

/** `price_…` pour la formule ; repli sur `STRIPE_PRICE_ID_ELEVE_INSCRIPTION`. */
export function getStripePriceIdForElevePlan(plan: EleveStripePlan): string | null {
  const fromPlan =
    plan === "essential"
      ? process.env.STRIPE_PRICE_ID_ELEVE_ESSENTIAL?.trim()
      : plan === "bacplus"
        ? process.env.STRIPE_PRICE_ID_ELEVE_BAC_PLUS?.trim()
        : process.env.STRIPE_PRICE_ID_ELEVE_FAMILY?.trim();
  if (fromPlan) return fromPlan;
  return getStripePriceIdEleve();
}

export function getAppBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.AUTH_URL?.trim() ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
