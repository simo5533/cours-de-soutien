/**
 * Configuration centralisée IA — modèles, limites de sortie, fichiers, anti-abus.
 * Toutes les valeurs sont surchargeables par variables d'environnement serveur.
 * Aucune référence à un nom de modèle ne doit exister ailleurs que dans ce fichier.
 */

function envInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function envBool(name: string, fallback: boolean): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  if (!raw) return fallback;
  return raw === "1" || raw === "true" || raw === "yes";
}

export type AiTask =
  | "correction"
  | "correction_escalation"
  | "detailed_explanation"
  | "assistant"
  | "similar_exercise"
  | "quiz";

export const AI_MODELS = {
  /** Modèle par défaut (économique). */
  get economy(): string {
    return (
      process.env.OPENAI_MODEL_ECONOMY?.trim() ||
      process.env.OPENAI_MODEL?.trim() ||
      "gpt-4o-mini"
    );
  },
  /** Modèle supérieur, réservé aux cas d'escalade. */
  get premium(): string {
    return process.env.OPENAI_MODEL_PREMIUM?.trim() || "gpt-4o";
  },
};

export const AI_ESCALATION = {
  /** Active l'escalade vers le modèle supérieur. */
  get enabled(): boolean {
    return envBool("AI_ESCALATION_ENABLED", true);
  },
  /** Relance la correction avec le modèle supérieur si le modèle économique signale une confiance faible. */
  get onLowConfidence(): boolean {
    return envBool("AI_ESCALATE_ON_LOW_CONFIDENCE", true);
  },
  /** Utilise le modèle supérieur pour « Voir une explication plus détaillée ». */
  get onDetailedExplanation(): boolean {
    return envBool("AI_ESCALATE_ON_DETAILED", true);
  },
  /** Nombre maximal d'appels au modèle supérieur par utilisateur et par jour. */
  get maxPremiumCallsPerUserPerDay(): number {
    return envInt("AI_PREMIUM_DAILY_LIMIT", 5);
  },
};

/** Plafonds de tokens de sortie par type d'action. */
export const AI_MAX_OUTPUT_TOKENS: Record<AiTask, number> = {
  get correction() {
    return envInt("AI_MAX_TOKENS_CORRECTION", 1100);
  },
  get correction_escalation() {
    return envInt("AI_MAX_TOKENS_CORRECTION", 1100);
  },
  get detailed_explanation() {
    return envInt("AI_MAX_TOKENS_DETAILED", 1600);
  },
  get assistant() {
    return envInt("AI_MAX_TOKENS_ASSISTANT", 500);
  },
  get similar_exercise() {
    return envInt("AI_MAX_TOKENS_SIMILAR", 700);
  },
  get quiz() {
    return envInt("AI_MAX_TOKENS_QUIZ", 900);
  },
};

export const FILE_LIMITS = {
  /** Pages maximum par PDF. */
  get maxPdfPages(): number {
    return envInt("MAX_PDF_PAGES", 20);
  },
  /** Poids maximum d'un PDF / Word envoyé tel quel (Mo) — Vercel refuse les requêtes > 4,5 Mo. */
  get maxDocumentMb(): number {
    return envInt("MAX_DOCUMENT_MB", 4);
  },
  /** Poids maximum d'une photo après compression navigateur (Mo). */
  get maxImageMb(): number {
    return envInt("MAX_IMAGE_MB", 5);
  },
  /** Photos maximum par analyse. */
  get maxImagesPerAnalysis(): number {
    return envInt("MAX_IMAGES_PER_ANALYSIS", 5);
  },
  /** Caractères estimés par page pour un document Word (calcul des crédits). */
  get docxCharsPerPage(): number {
    return envInt("DOCX_CHARS_PER_PAGE", 3000);
  },
  /** Caractères de texte extrait transmis au modèle (protection coût). */
  get maxExtractedChars(): number {
    return envInt("MAX_EXTRACTED_CHARS", 60000);
  },
  /** Détail d'analyse des images côté OpenAI : low | high | auto. */
  get imageDetail(): "low" | "high" | "auto" {
    const v = process.env.AI_IMAGE_DETAIL?.trim().toLowerCase();
    return v === "low" || v === "auto" ? v : "high";
  },
};

export const ACCEPTED_IMAGE_MIME = ["image/jpeg", "image/png", "image/webp"] as const;

export const ABUSE_LIMITS = {
  /** Analyses démarrées par minute et par utilisateur. */
  get analysesPerMinute(): number {
    return envInt("AI_ANALYSES_PER_MINUTE", 6);
  },
  /** Messages d'assistant par minute et par utilisateur. */
  get assistantPerMinute(): number {
    return envInt("AI_ASSISTANT_PER_MINUTE", 10);
  },
  /** Messages d'assistant maximum par correction. */
  get assistantPerCorrection(): number {
    return envInt("AI_ASSISTANT_PER_CORRECTION", 30);
  },
  /** Réutilisation d'une correction identique (même fichier) pendant N jours. */
  get cacheDays(): number {
    return envInt("AI_CORRECTION_CACHE_DAYS", 30);
  },
};
