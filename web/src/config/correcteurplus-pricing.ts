/**
 * @deprecated Importer depuis `@/lib/plans` (source de vérité).
 * Ce fichier conserve des alias pour les imports existants.
 */
export {
  PLANS,
  PUBLIC_PAID_PLANS,
  VALUE_PROPOSITION,
  getPlanByPricingId,
  getPlanById,
  pricingIdToCheckout as legacyPlanFromPricingId,
  type PricingPlanId,
  type CheckoutElevePlan as LegacyElevePlan,
  type PlanDefinition as PricingPlan,
  MAIN_PRICING_PLANS,
} from "@/lib/plans";

/** Anciennes offres retirées de l’UI — gardées vides pour éviter les crashes d’imports. */
export const SECONDARY_PRICING_PLANS: never[] = [];
export const ONE_SHOT_OFFERS: never[] = [];
export const TEACHER_CREDIT_ROWS: never[] = [];
