/**
 * Assistant lié à une correction : contexte compact (résumé + extrait + derniers messages),
 * jamais l'historique complet.
 */
import type { ChatMessage } from "@/lib/ai/client";
import type { AiTask } from "@/lib/ai/config";
import type { CorrectionResult } from "@/lib/ai/correction";

export const ASSISTANT_ACTIONS = {
  explain_differently: { label: "Explique autrement", task: "assistant" },
  simpler: { label: "Explique plus simplement", task: "assistant" },
  why_wrong: { label: "Pourquoi cette réponse est fausse ?", task: "assistant" },
  example: { label: "Donne-moi un exemple", task: "assistant" },
  similar_exercise: { label: "Créer un exercice similaire", task: "similar_exercise" },
  quiz: { label: "Créer un quiz", task: "quiz" },
  arabic: { label: "Expliquer en arabe", task: "assistant" },
  darija: { label: "Expliquer en darija", task: "assistant" },
  detailed: { label: "Voir une explication plus détaillée", task: "detailed_explanation" },
  question: { label: "Question", task: "assistant" },
} as const satisfies Record<string, { label: string; task: AiTask }>;

export type AssistantAction = keyof typeof ASSISTANT_ACTIONS;

export function isAssistantAction(v: unknown): v is AssistantAction {
  return typeof v === "string" && v in ASSISTANT_ACTIONS;
}

const HISTORY_MESSAGES = 4;
const CONTEXT_CHARS = 3500;
const SOURCE_CHARS = 1500;

const SYSTEM = `Tu es l'assistant pédagogique de CorrecteurPlus. Tu aides uniquement à propos de la correction fournie en contexte.
Règles : réponses courtes et claires (10 lignes max sauf demande d'explication détaillée), adaptées à un élève.
Ne donne pas de réponses toutes faites à d'autres devoirs sans rapport. Refuse poliment les demandes hors cadre scolaire.
Texte simple : pas de Markdown (**, ##), pas de LaTeX ($). Maths : x², ×, ÷, √, ≤, ≥, π.`;

const INSTRUCTIONS: Record<AssistantAction, string> = {
  explain_differently:
    "Explique la correction autrement, avec une autre approche ou un autre angle, en restant bref.",
  simpler:
    "Explique la correction plus simplement, avec des mots simples, comme à un élève qui découvre la notion.",
  why_wrong:
    "Explique pourquoi la réponse ou l'erreur principale est fausse, et comment l'éviter la prochaine fois.",
  example: "Donne un exemple court et concret qui illustre la notion principale, avec sa solution.",
  similar_exercise: `Crée UN exercice similaire (même notion, même niveau, valeurs ou contexte différents).
Réponds UNIQUEMENT en JSON : { "enonce": "...", "indice": "un indice court", "solution": "solution rédigée brièvement" }`,
  quiz: `Crée un mini-quiz de 4 questions à choix multiples sur la notion principale et les erreurs détectées.
Réponds UNIQUEMENT en JSON : { "questions": [ { "question": "...", "options": ["A", "B", "C", "D"], "correct": 0, "explication": "..." } ] }
"correct" est l'index (0 à 3) de la bonne option.`,
  arabic: "Explique la correction en arabe standard (فصحى), simplement et brièvement.",
  darija:
    "Explique la correction en darija marocaine (écriture arabe), simplement et brièvement, en gardant les termes techniques en français si nécessaire.",
  detailed:
    "Donne une explication plus détaillée de la correction, étape par étape, en justifiant chaque étape et en revenant sur chaque erreur.",
  question: "Réponds à la question de l'élève ci-dessous, en restant dans le contexte de cette correction.",
};

export type HistoryMessage = { role: "user" | "assistant"; content: string };

export function buildAssistantMessages(params: {
  action: AssistantAction;
  question: string | null;
  correction: CorrectionResult;
  sourceText: string | null;
  history: HistoryMessage[];
}): ChatMessage[] {
  const c = params.correction;
  const summary = JSON.stringify({
    titre: c.titre,
    matiere: c.matiere,
    notion: c.notion,
    enonce: c.enonce,
    resultat: c.resultat,
    etapes: c.etapes,
    erreurs: c.erreurs,
    conseil: c.conseil,
  }).slice(0, CONTEXT_CHARS);

  const context = [
    `Contexte — correction en cours (JSON) : ${summary}`,
    params.sourceText ? `Extrait de l'exercice : ${params.sourceText.slice(0, SOURCE_CHARS)}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const recent = params.history.slice(-HISTORY_MESSAGES).map(
    (m): ChatMessage => ({ role: m.role, content: m.content.slice(0, 800) }),
  );

  const instruction =
    params.action === "question" && params.question
      ? `${INSTRUCTIONS.question}\nQuestion : ${params.question.slice(0, 500)}`
      : INSTRUCTIONS[params.action];

  return [
    { role: "system", content: SYSTEM },
    { role: "system", content: context },
    ...recent,
    { role: "user", content: instruction },
  ];
}

export type SimilarExercise = { enonce: string; indice: string; solution: string };
export type GeneratedQuiz = {
  questions: { question: string; options: string[]; correct: number; explication: string }[];
};

function tryJson(raw: string): Record<string, unknown> | null {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try {
      return JSON.parse(m[0]) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}

export function parseSimilarExercise(raw: string): SimilarExercise | null {
  const o = tryJson(raw);
  if (!o || typeof o.enonce !== "string") return null;
  return {
    enonce: o.enonce.slice(0, 2000),
    indice: typeof o.indice === "string" ? o.indice.slice(0, 600) : "",
    solution: typeof o.solution === "string" ? o.solution.slice(0, 3000) : "",
  };
}

export function parseQuiz(raw: string): GeneratedQuiz | null {
  const o = tryJson(raw);
  if (!o || !Array.isArray(o.questions)) return null;
  const questions = o.questions
    .map((q) => {
      const x = (q ?? {}) as Record<string, unknown>;
      const options = Array.isArray(x.options)
        ? x.options.filter((v): v is string => typeof v === "string").slice(0, 4)
        : [];
      const correct = typeof x.correct === "number" ? x.correct : -1;
      return {
        question: typeof x.question === "string" ? x.question.slice(0, 500) : "",
        options,
        correct,
        explication: typeof x.explication === "string" ? x.explication.slice(0, 600) : "",
      };
    })
    .filter((q) => q.question && q.options.length >= 2 && q.correct >= 0 && q.correct < q.options.length)
    .slice(0, 6);
  return questions.length ? { questions } : null;
}
