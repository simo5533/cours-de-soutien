/**
 * Tarifs OpenAI pour estimation de coût (USD).
 *
 * IMPORTANT :
 * - Les prix OpenAI changent. Mettre à jour cette config manuellement.
 * - Ne pas inventer de consommation : n’utiliser que les tokens retournés par l’API.
 * - Source indicative : https://openai.com/api/pricing (à vérifier périodiquement).
 * - Dernière revue des montants ci-dessous : 2026-07-07 (gpt-4o-mini).
 *
 * Montants en USD par 1 million de tokens.
 */

export type ModelTokenPricing = {
  inputPer1M: number;
  outputPer1M: number;
  /** Si non fourni par l’API → null (ne pas estimer) */
  cachedInputPer1M?: number;
};

/**
 * Clés = noms de modèles tels que retournés / configurés (OPENAI_MODEL).
 * Le projet utilise par défaut `gpt-4o-mini` (voir maths-ai.ts).
 */
export const MODEL_PRICING: Record<string, ModelTokenPricing> = {
  "gpt-4o-mini": {
    inputPer1M: 0.15,
    outputPer1M: 0.6,
    cachedInputPer1M: 0.075,
  },
  "gpt-4o": {
    inputPer1M: 2.5,
    outputPer1M: 10,
    cachedInputPer1M: 1.25,
  },
};

export type OpenaiUsageMetrics = {
  model: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
  cachedInputTokens: number | null;
};

/**
 * Calcule un coût estimé USD à partir des tokens réellement retournés.
 * Retourne null si le modèle n’a pas de tarif configuré ou si les tokens manquent.
 */
export function estimateCostUsd(usage: OpenaiUsageMetrics): number | null {
  const model = usage.model?.trim();
  if (!model) return null;

  const pricing = MODEL_PRICING[model] ?? MODEL_PRICING[normalizeModelKey(model)];
  if (!pricing) return null;

  const input = usage.inputTokens;
  const output = usage.outputTokens;
  if (input == null && output == null) return null;

  const inTok = input ?? 0;
  const outTok = output ?? 0;
  const cached = usage.cachedInputTokens ?? 0;
  const billableInput = Math.max(0, inTok - cached);

  let cost = 0;
  cost += (billableInput / 1_000_000) * pricing.inputPer1M;
  if (cached > 0 && pricing.cachedInputPer1M != null) {
    cost += (cached / 1_000_000) * pricing.cachedInputPer1M;
  } else if (cached > 0) {
    cost += (cached / 1_000_000) * pricing.inputPer1M;
  }
  cost += (outTok / 1_000_000) * pricing.outputPer1M;

  return Math.round(cost * 1_000_000) / 1_000_000;
}

function normalizeModelKey(model: string): string {
  // ex. gpt-4o-mini-2024-07-18 → gpt-4o-mini
  const known = Object.keys(MODEL_PRICING);
  const hit = known.find((k) => model === k || model.startsWith(`${k}-`));
  return hit ?? model;
}

export function parseOpenaiUsageFromResponse(data: unknown): OpenaiUsageMetrics {
  const d = data as {
    model?: string;
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
      prompt_tokens_details?: { cached_tokens?: number };
    };
  };

  const usage = d.usage;
  if (!usage) {
    return {
      model: d.model?.trim() || null,
      inputTokens: null,
      outputTokens: null,
      totalTokens: null,
      cachedInputTokens: null,
    };
  }

  return {
    model: d.model?.trim() || null,
    inputTokens: typeof usage.prompt_tokens === "number" ? usage.prompt_tokens : null,
    outputTokens:
      typeof usage.completion_tokens === "number" ? usage.completion_tokens : null,
    totalTokens: typeof usage.total_tokens === "number" ? usage.total_tokens : null,
    cachedInputTokens:
      typeof usage.prompt_tokens_details?.cached_tokens === "number"
        ? usage.prompt_tokens_details.cached_tokens
        : null,
  };
}
