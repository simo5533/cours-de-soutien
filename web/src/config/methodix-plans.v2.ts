/**
 * Methodix 2.0 — référentiel des packs et micro-services (paiement cible : CMI).
 * Les garde-fous métier (limites corrections, accès cours) doivent s’appuyer sur ces définitions + données utilisateur en base.
 *
 * @see `.env.example` — variables CMI / URLs de retour.
 */

export const METHODIX_PLANS_VERSION = "2.0.0";

export const IMPORTANT_CMI_NOTE = {
  warning:
    "CMI ne gère PAS les abonnements récurrents automatiques nativement",
  solution:
    "Gérer le renouvellement mensuel via job planifié — envoyer un lien de paiement CMI par e-mail chaque mois",
  alternative:
    "CMI Tokenisation si disponible dans le contrat — vérifier avec CMI",
  currency: "MAD",
  amounts_in_centimes: true,
  webhook_endpoint: "https://methodix.ma/api/webhooks/cmi",
  success_url: "https://methodix.ma/dashboard?payment=success",
  cancel_url: "https://methodix.ma/abonnement?payment=cancelled",
} as const;

/** Ordre d’upgrade des offres (du plus léger au plus complet). */
export const PLAN_HIERARCHY = [
  "starter",
  "essential",
  "bac_plus",
  "family",
] as const;

export type MethodixPlanId = (typeof PLAN_HIERARCHY)[number];

export type PlanSummary = {
  id: MethodixPlanId;
  name: string;
  priceMad: number;
  priceMadAnnual?: number;
  cmiAmountCentimes: number;
  cmiAmountCentimesAnnual?: number;
  tagline: string;
  cmiProductId: string | null;
  isRecommended?: boolean;
  includesAllOf?: string;
};

export const PLAN_SUMMARIES: Record<MethodixPlanId, PlanSummary> = {
  starter: {
    id: "starter",
    name: "Gratuit",
    priceMad: 0,
    cmiAmountCentimes: 0,
    tagline: "Découverte — sans carte bancaire",
    cmiProductId: null,
  },
  essential: {
    id: "essential",
    name: "Essentiel",
    priceMad: 99,
    priceMadAnnual: 799,
    cmiAmountCentimes: 9900,
    cmiAmountCentimesAnnual: 79900,
    tagline: "Tout pour réviser toute l'année",
    cmiProductId: "REPLACE_WITH_CMI_PRODUCT_ID_ESSENTIAL",
    isRecommended: true,
  },
  bac_plus: {
    id: "bac_plus",
    name: "Bac+",
    priceMad: 149,
    priceMadAnnual: 1188,
    cmiAmountCentimes: 14900,
    cmiAmountCentimesAnnual: 118800,
    tagline: "Préparation intensive bac + suivi parental complet",
    cmiProductId: "REPLACE_WITH_CMI_PRODUCT_ID_BAC_PLUS",
    includesAllOf: "essential",
  },
  family: {
    id: "family",
    name: "Famille",
    priceMad: 229,
    priceMadAnnual: 1908,
    cmiAmountCentimes: 22900,
    cmiAmountCentimesAnnual: 190800,
    tagline: "Jusqu'à 3 enfants — 1 seul abonnement",
    cmiProductId: "REPLACE_WITH_CMI_PRODUCT_ID_FAMILY",
    includesAllOf: "essential_per_child",
  },
};

/** Limites correcteur IA (-1 = illimité). */
export function getCorrectionsLimitForPlan(planId: MethodixPlanId): number {
  if (planId === "starter") return 3;
  return -1;
}

export function isPaidPlan(planId: MethodixPlanId): boolean {
  return planId !== "starter";
}

/** URLs de retour — surcharger via env en prod. */
export function getCmiReturnUrls() {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "";
  return {
    success:
      process.env.CMI_SUCCESS_URL ||
      (base ? `${base}/fr/apres-connexion?payment=success` : IMPORTANT_CMI_NOTE.success_url),
    cancel:
      process.env.CMI_CANCEL_URL ||
      (base ? `${base}/fr/inscription?payment=cancelled` : IMPORTANT_CMI_NOTE.cancel_url),
    webhook:
      process.env.CMI_WEBHOOK_PUBLIC_URL || IMPORTANT_CMI_NOTE.webhook_endpoint,
  };
}
