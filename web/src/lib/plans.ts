/**
 * Source de vérité — plans CorrecteurPlus (tarification + quotas IA).
 * Ne pas dupliquer les prix / quotas ailleurs.
 */

export const PLAN_IDS = {
  FREE: "FREE",
  ESSENTIAL_AI: "ESSENTIAL_AI",
  AI_PLUS: "AI_PLUS",
} as const;

export type SubscriptionPlanId = (typeof PLAN_IDS)[keyof typeof PLAN_IDS];

/** ID marketing / URL (?plan=) */
export type PricingPlanId = "free" | "essential_ai" | "ai_plus";

/**
 * ID envoyé au checkout (Lemon / Stripe / Paddle).
 * `bacplus` / `family` = aliases dépréciés (mappent vers AI_PLUS).
 */
export type CheckoutElevePlan =
  | "free"
  | "essential"
  | "ai_plus"
  | "bacplus"
  | "family";

export type PlanDefinition = {
  id: SubscriptionPlanId;
  pricingId: PricingPlanId;
  checkoutPlan: Exclude<CheckoutElevePlan, "free" | "bacplus" | "family"> | "free";
  name: string;
  priceMAD: number;
  monthlyCorrections: number;
  /** FREE = lifetime (pas de reset mensuel) */
  quotaMode: "lifetime" | "monthly";
  badge: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  lemonVariantEnvKey?: string;
  stripePriceEnvKey?: string;
  paddlePriceEnvKey?: string;
};

export const PLANS: Record<SubscriptionPlanId, PlanDefinition> = {
  FREE: {
    id: "FREE",
    pricingId: "free",
    checkoutPlan: "free",
    name: "Découverte",
    priceMAD: 0,
    monthlyCorrections: 3,
    quotaMode: "lifetime",
    badge: "Gratuit",
    description: "Teste CorrecteurPlus avec 3 corrections IA offertes.",
    features: [
      "3 corrections IA offertes",
      "Quiz illimités",
      "Toutes les matières principales",
    ],
    cta: "Tester gratuitement",
    highlighted: false,
  },
  ESSENTIAL_AI: {
    id: "ESSENTIAL_AI",
    pricingId: "essential_ai",
    checkoutPlan: "essential",
    name: "Essentiel IA",
    priceMAD: 39,
    monthlyCorrections: 100,
    quotaMode: "monthly",
    badge: "Pour réviser à petit prix",
    description:
      "Corrige tes exercices, comprends tes erreurs et progresse avec l'IA.",
    features: [
      "100 corrections IA par mois",
      "Correction détaillée étape par étape",
      "Explication des erreurs",
      "Quiz illimités",
      "Toutes les matières principales",
      "Historique des exercices",
      "Réponses adaptées au niveau de l'élève",
    ],
    cta: "Commencer avec l'IA",
    highlighted: false,
    lemonVariantEnvKey: "LEMONSQUEEZY_VARIANT_ID_ELEVE_ESSENTIAL",
    stripePriceEnvKey: "STRIPE_PRICE_ID_ELEVE_ESSENTIAL",
    paddlePriceEnvKey: "PADDLE_PRICE_ID_ELEVE_ESSENTIAL",
  },
  AI_PLUS: {
    id: "AI_PLUS",
    pricingId: "ai_plus",
    checkoutPlan: "ai_plus",
    name: "IA Plus",
    priceMAD: 69,
    monthlyCorrections: 250,
    quotaMode: "monthly",
    badge: "Le plus populaire",
    description:
      "Pour les élèves qui utilisent régulièrement l'IA pour s'entraîner et progresser.",
    features: [
      "250 corrections IA par mois",
      "Correction détaillée étape par étape",
      "Explication approfondie des erreurs",
      "Quiz illimités",
      "Toutes les matières principales",
      "Historique complet",
      "Recommandations d'exercices selon les lacunes",
      "Suivi de progression",
      "Analyse des erreurs fréquentes",
    ],
    cta: "Choisir IA Plus",
    highlighted: true,
    lemonVariantEnvKey: "LEMONSQUEEZY_VARIANT_ID_ELEVE_AI_PLUS",
    stripePriceEnvKey: "STRIPE_PRICE_ID_ELEVE_AI_PLUS",
    paddlePriceEnvKey: "PADDLE_PRICE_ID_ELEVE_AI_PLUS",
  },
};

/** Cartes affichées en public (sans Découverte — proposée à l’inscription). */
export const PUBLIC_PAID_PLANS: PlanDefinition[] = [
  PLANS.ESSENTIAL_AI,
  PLANS.AI_PLUS,
];

export const VALUE_PROPOSITION =
  "Corrigez vos exercices, comprenez vos erreurs et progressez à votre rythme.";

export function getPlanByPricingId(id: string): PlanDefinition | undefined {
  return Object.values(PLANS).find((p) => p.pricingId === id);
}

export function getPlanById(id: string | null | undefined): PlanDefinition {
  if (id && id in PLANS) return PLANS[id as SubscriptionPlanId];
  return PLANS.FREE;
}

/** Normalise le plan checkout (y compris aliases dépréciés). */
export function normalizeCheckoutPlan(
  raw: string | null | undefined,
): CheckoutElevePlan {
  if (raw === "free") return "free";
  if (raw === "ai_plus" || raw === "bacplus" || raw === "family") return "ai_plus";
  if (raw === "essential") return "essential";
  return "essential";
}

export function checkoutPlanToSubscription(
  plan: CheckoutElevePlan,
): SubscriptionPlanId {
  switch (plan) {
    case "free":
      return "FREE";
    case "essential":
      return "ESSENTIAL_AI";
    case "ai_plus":
    case "bacplus":
    case "family":
      return "AI_PLUS";
    default: {
      const _exhaustive: never = plan;
      void _exhaustive;
      return "ESSENTIAL_AI";
    }
  }
}

export function pricingIdToCheckout(id: PricingPlanId): CheckoutElevePlan {
  return getPlanByPricingId(id)?.checkoutPlan ?? "essential";
}

export function monthlyLimitForPlan(planId: SubscriptionPlanId): number {
  return PLANS[planId].monthlyCorrections;
}

/** @deprecated Utiliser PLANS / PUBLIC_PAID_PLANS */
export const MAIN_PRICING_PLANS = PUBLIC_PAID_PLANS;
