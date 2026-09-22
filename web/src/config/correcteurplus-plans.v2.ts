/**
 * @deprecated Ancien référentiel CMI (99/149/229 MAD, corrections « illimitées »).
 * Source de vérité actuelle : `@/lib/plans` (Essentiel 39 MAD / 100, IA Plus 69 MAD / 250).
 * Conservé uniquement pour référence CMI stub — ne pas utiliser pour l’UI ni les quotas.
 */
export const CORRECTEURPLUS_PLANS_VERSION = "2.0.0-deprecated";
export const METHODIX_PLANS_VERSION = CORRECTEURPLUS_PLANS_VERSION;

export {
  PLANS,
  getPlanById,
  monthlyLimitForPlan as getCorrectionsLimitForPlan,
} from "@/lib/plans";

/** @deprecated stubs CMI — IDs historiques */
export const PLAN_HIERARCHY = ["starter", "essential", "bac_plus", "family"] as const;
export type CorrecteurPlusPlanId = (typeof PLAN_HIERARCHY)[number];

export const IMPORTANT_CMI_NOTE =
  "CMI : brancher les product IDs sur ESSENTIAL_AI (39 MAD) et AI_PLUS (69 MAD) via @/lib/plans.";
