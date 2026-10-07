/**
 * Source de vérité — offres CorrecteurPlus (prix, crédits d'analyse, limites).
 * Ne pas dupliquer les prix / quotas ailleurs : importer depuis ce fichier.
 *
 * Unité interne : 1 crédit d'analyse = 1 photo analysée = 1 page de PDF analysée.
 */

export const PLAN_IDS = {
  FREE: "FREE",
  /** Valeur stockée historique (`AI_PLUS`) conservée pour les abonnés existants. */
  PARTICULIER: "AI_PLUS",
  PROF: "PROF",
  CENTRE: "CENTRE",
  /** Ancienne formule 39 MAD — plus vendue, conservée pour les abonnés existants. */
  ESSENTIAL_AI: "ESSENTIAL_AI",
} as const;

export type SubscriptionPlanId = (typeof PLAN_IDS)[keyof typeof PLAN_IDS];

/** ID marketing / URL (?plan=) */
export type PricingPlanId = "free" | "particulier" | "prof" | "centre" | "essential_ai";

/** ID transmis au checkout (Lemon / Stripe / Paddle). */
export type CheckoutPlan = "free" | "essential" | "ai_plus" | "prof" | "centre";

/** Anciennes valeurs encore acceptées en entrée (liens, formulaires, paiements en attente). */
export type CheckoutElevePlan = CheckoutPlan | "bacplus" | "family" | "particulier";

export type PlanAudience = "decouverte" | "particulier" | "prof" | "centre";

export type PlanDefinition = {
  id: SubscriptionPlanId;
  pricingId: PricingPlanId;
  checkoutPlan: CheckoutPlan;
  audience: PlanAudience;
  name: string;
  /** Prix mensuel en MAD (0 = gratuit). */
  priceMAD: number;
  /** Crédits d'analyse par cycle (ou à vie si quotaMode = lifetime). */
  monthlyCredits: number;
  /** Plafond journalier anti-abus (crédits consommés par jour). */
  dailyCreditCap: number;
  /** Messages d'assistant (explications, exercices similaires, quiz) par jour et par utilisateur. */
  assistantDailyLimit: number;
  /** Autorise l'escalade vers le modèle supérieur (voir lib/ai/models.ts). */
  allowPremiumModel: boolean;
  /** Nombre de comptes inclus (Centre uniquement). */
  seats: number;
  quotaMode: "lifetime" | "monthly";
  /** Affiché sur /tarifs et la page d'accueil. */
  public: boolean;
  badge: string | null;
  tagline: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  /** Clés d'env des identifiants de prix, par ordre de priorité. */
  lemonVariantEnvKeys: string[];
  stripePriceEnvKeys: string[];
  paddlePriceEnvKeys: string[];
};

export const PLANS: Record<SubscriptionPlanId, PlanDefinition> = {
  FREE: {
    id: "FREE",
    pricingId: "free",
    checkoutPlan: "free",
    audience: "decouverte",
    name: "Découverte",
    priceMAD: 0,
    monthlyCredits: 3,
    dailyCreditCap: 3,
    assistantDailyLimit: 10,
    allowPremiumModel: false,
    seats: 1,
    quotaMode: "lifetime",
    public: false,
    badge: "Gratuit",
    tagline: "Pour tester",
    description: "Testez CorrecteurPlus avec 3 analyses offertes, sans carte bancaire.",
    features: ["3 analyses offertes", "Photo ou PDF", "Quiz & entraînement"],
    cta: "Tester gratuitement",
    highlighted: false,
    lemonVariantEnvKeys: [],
    stripePriceEnvKeys: [],
    paddlePriceEnvKeys: [],
  },
  AI_PLUS: {
    id: "AI_PLUS",
    pricingId: "particulier",
    checkoutPlan: "ai_plus",
    audience: "particulier",
    name: "Particulier",
    priceMAD: 69,
    monthlyCredits: 250,
    dailyCreditCap: 40,
    assistantDailyLimit: 60,
    allowPremiumModel: true,
    seats: 1,
    quotaMode: "monthly",
    public: true,
    badge: null,
    tagline: "Parents & élèves",
    description: "Pour aider votre enfant à comprendre ses erreurs, même à la maison.",
    features: [
      "Photo ou PDF, toutes matières",
      "Correction expliquée étape par étape",
      "Exercices similaires et mini-quiz",
      "Historique et points à améliorer",
    ],
    cta: "Choisir Particulier",
    highlighted: false,
    lemonVariantEnvKeys: [
      "LEMONSQUEEZY_VARIANT_ID_PARTICULIER",
      "LEMONSQUEEZY_VARIANT_ID_ELEVE_AI_PLUS",
      "LEMONSQUEEZY_VARIANT_ID_ELEVE_BAC_PLUS",
      "LEMONSQUEEZY_VARIANT_ID_ELEVE_INSCRIPTION",
    ],
    stripePriceEnvKeys: [
      "STRIPE_PRICE_ID_PARTICULIER",
      "STRIPE_PRICE_ID_ELEVE_AI_PLUS",
      "STRIPE_PRICE_ID_ELEVE_BAC_PLUS",
      "STRIPE_PRICE_ID_ELEVE_INSCRIPTION",
    ],
    paddlePriceEnvKeys: [
      "PADDLE_PRICE_ID_PARTICULIER",
      "PADDLE_PRICE_ID_ELEVE_AI_PLUS",
      "PADDLE_PRICE_ID_ELEVE_BAC_PLUS",
      "PADDLE_PRICE_ID_ELEVE_INSCRIPTION",
    ],
  },
  PROF: {
    id: "PROF",
    pricingId: "prof",
    checkoutPlan: "prof",
    audience: "prof",
    name: "Prof",
    priceMAD: 149,
    monthlyCredits: 800,
    dailyCreditCap: 120,
    assistantDailyLimit: 150,
    allowPremiumModel: true,
    seats: 1,
    quotaMode: "monthly",
    public: true,
    badge: "Le plus populaire",
    tagline: "Professeurs de soutien",
    description: "Corrigez et préparez vos exercices plus rapidement.",
    features: [
      "Photo ou PDF, toutes matières",
      "Exercices similaires et quiz à la demande",
      "Assistant IA lié à chaque correction",
      "Analyse des erreurs et historique complet",
    ],
    cta: "Choisir Prof",
    highlighted: true,
    lemonVariantEnvKeys: ["LEMONSQUEEZY_VARIANT_ID_PROF"],
    stripePriceEnvKeys: ["STRIPE_PRICE_ID_PROF"],
    paddlePriceEnvKeys: ["PADDLE_PRICE_ID_PROF"],
  },
  CENTRE: {
    id: "CENTRE",
    pricingId: "centre",
    checkoutPlan: "centre",
    audience: "centre",
    name: "Centre",
    priceMAD: 590,
    monthlyCredits: 4000,
    dailyCreditCap: 600,
    assistantDailyLimit: 150,
    allowPremiumModel: true,
    seats: 10,
    quotaMode: "monthly",
    public: true,
    badge: null,
    tagline: "Centres de soutien",
    description: "Un outil de correction IA pour toute votre équipe pédagogique.",
    features: [
      "Quota d'analyses partagé par l'équipe",
      "Gestion des membres",
      "Suivi de la consommation de l'équipe",
      "Toutes les fonctions de la formule Prof",
    ],
    cta: "Choisir Centre",
    highlighted: false,
    lemonVariantEnvKeys: ["LEMONSQUEEZY_VARIANT_ID_CENTRE"],
    stripePriceEnvKeys: ["STRIPE_PRICE_ID_CENTRE"],
    paddlePriceEnvKeys: ["PADDLE_PRICE_ID_CENTRE"],
  },
  ESSENTIAL_AI: {
    id: "ESSENTIAL_AI",
    pricingId: "essential_ai",
    checkoutPlan: "essential",
    audience: "particulier",
    name: "Essentiel IA",
    priceMAD: 39,
    monthlyCredits: 100,
    dailyCreditCap: 30,
    assistantDailyLimit: 30,
    allowPremiumModel: false,
    seats: 1,
    quotaMode: "monthly",
    public: false,
    badge: null,
    tagline: "Ancienne formule",
    description: "Ancienne formule, conservée pour les abonnés existants.",
    features: ["100 analyses par mois"],
    cta: "Choisir",
    highlighted: false,
    lemonVariantEnvKeys: [
      "LEMONSQUEEZY_VARIANT_ID_ELEVE_ESSENTIAL",
      "LEMONSQUEEZY_VARIANT_ID_ELEVE_INSCRIPTION",
    ],
    stripePriceEnvKeys: ["STRIPE_PRICE_ID_ELEVE_ESSENTIAL", "STRIPE_PRICE_ID_ELEVE_INSCRIPTION"],
    paddlePriceEnvKeys: ["PADDLE_PRICE_ID_ELEVE_ESSENTIAL", "PADDLE_PRICE_ID_ELEVE_INSCRIPTION"],
  },
};

/** Offres affichées publiquement, dans l'ordre. */
export const PUBLIC_PLANS: PlanDefinition[] = [PLANS.AI_PLUS, PLANS.PROF, PLANS.CENTRE];

/** @deprecated Utiliser PUBLIC_PLANS */
export const PUBLIC_PAID_PLANS = PUBLIC_PLANS;
/** @deprecated Utiliser PUBLIC_PLANS */
export const MAIN_PRICING_PLANS = PUBLIC_PLANS;

export const VALUE_PROPOSITION =
  "Scannez un exercice ou envoyez un PDF : CorrecteurPlus corrige, explique les erreurs et aide à s'entraîner sur les notions à améliorer.";

export function getPlanByPricingId(id: string | null | undefined): PlanDefinition | undefined {
  if (!id) return undefined;
  if (id === "ai_plus") return PLANS.AI_PLUS;
  return Object.values(PLANS).find((p) => p.pricingId === id);
}

export function getPlanById(id: string | null | undefined): PlanDefinition {
  if (id && id in PLANS) return PLANS[id as SubscriptionPlanId];
  return PLANS.FREE;
}

/** Normalise le plan checkout (y compris anciens alias). */
export function normalizeCheckoutPlan(raw: string | null | undefined): CheckoutPlan {
  switch (raw) {
    case "free":
      return "free";
    case "prof":
      return "prof";
    case "centre":
      return "centre";
    case "essential":
      return "essential";
    case "ai_plus":
    case "particulier":
    case "bacplus":
    case "family":
      return "ai_plus";
    default:
      return "ai_plus";
  }
}

export function checkoutPlanToSubscription(plan: CheckoutElevePlan): SubscriptionPlanId {
  const normalized = normalizeCheckoutPlan(plan);
  const hit = Object.values(PLANS).find((p) => p.checkoutPlan === normalized);
  return hit?.id ?? PLAN_IDS.PARTICULIER;
}

export function getPlanByCheckout(plan: CheckoutElevePlan): PlanDefinition {
  return PLANS[checkoutPlanToSubscription(plan)];
}

export function pricingIdToCheckout(id: PricingPlanId): CheckoutPlan {
  return getPlanByPricingId(id)?.checkoutPlan ?? "ai_plus";
}

export function monthlyLimitForPlan(planId: SubscriptionPlanId): number {
  return PLANS[planId].monthlyCredits;
}

/** Premier identifiant de prix configuré parmi les clés d'env de l'offre. */
export function resolvePriceEnv(keys: string[]): string | null {
  for (const k of keys) {
    const v = process.env[k]?.trim();
    if (v) return v;
  }
  return null;
}
