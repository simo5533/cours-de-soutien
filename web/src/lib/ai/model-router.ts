/**
 * AIModelRouter — choisit le modèle pour chaque appel.
 * Règles volontairement explicites et configurables (lib/ai/config.ts) :
 * modèle économique par défaut, modèle supérieur seulement sur escalade autorisée.
 */
import { AI_ESCALATION, AI_MAX_OUTPUT_TOKENS, AI_MODELS, type AiTask } from "@/lib/ai/config";
import type { PlanDefinition } from "@/lib/plans";

export type RouteDecision = {
  model: string;
  tier: "economy" | "premium";
  maxTokens: number;
  reason: string;
};

export type RouteInput = {
  task: AiTask;
  plan: PlanDefinition;
  /** Appels au modèle supérieur déjà effectués aujourd'hui par l'utilisateur. */
  premiumCallsToday: number;
};

function premiumAllowed(input: RouteInput): { ok: boolean; reason: string } {
  if (!AI_ESCALATION.enabled) return { ok: false, reason: "escalade désactivée" };
  if (!input.plan.allowPremiumModel) return { ok: false, reason: "offre sans modèle supérieur" };
  if (input.premiumCallsToday >= AI_ESCALATION.maxPremiumCallsPerUserPerDay) {
    return { ok: false, reason: "plafond journalier du modèle supérieur atteint" };
  }
  return { ok: true, reason: "" };
}

export function routeModel(input: RouteInput): RouteDecision {
  const maxTokens = AI_MAX_OUTPUT_TOKENS[input.task];
  const economy: RouteDecision = {
    model: AI_MODELS.economy,
    tier: "economy",
    maxTokens,
    reason: "modèle par défaut",
  };

  const wantsPremium =
    (input.task === "correction_escalation" && AI_ESCALATION.onLowConfidence) ||
    (input.task === "detailed_explanation" && AI_ESCALATION.onDetailedExplanation);

  if (!wantsPremium) return economy;

  const allowed = premiumAllowed(input);
  if (!allowed.ok) return { ...economy, reason: allowed.reason };

  return {
    model: AI_MODELS.premium,
    tier: "premium",
    maxTokens,
    reason:
      input.task === "correction_escalation"
        ? "confiance faible du modèle économique"
        : "explication détaillée demandée",
  };
}

/** Indique si une relance avec le modèle supérieur est possible après une correction peu fiable. */
export function canEscalateCorrection(input: Omit<RouteInput, "task">): boolean {
  return routeModel({ ...input, task: "correction_escalation" }).tier === "premium";
}
