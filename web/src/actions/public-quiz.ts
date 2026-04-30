"use server";

import { prisma } from "@/lib/prisma";

type QcmQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
};

type ContentQcm = { questions: QcmQuestion[] };

function gradeQcm(content: ContentQcm, answers: Record<string, number>) {
  let correct = 0;
  const total = content.questions.length;
  for (const q of content.questions) {
    if (answers[q.id] === q.correct) correct += 1;
  }
  const score = total === 0 ? 0 : (correct / total) * 20;
  return { score, maxScore: 20, correct, total };
}

/** QCM publié : notation sans compte (pas d’enregistrement en base). */
export async function gradePublicQcmAction(
  exerciseId: string,
  answers: Record<string, number>,
) {
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
  });

  if (!exercise || !exercise.published || exercise.type !== "QCM") {
    return { error: "Quiz introuvable ou indisponible." };
  }

  let content: ContentQcm;
  try {
    content = JSON.parse(exercise.contentJson) as ContentQcm;
  } catch {
    return { error: "Contenu du quiz invalide." };
  }

  if (!Array.isArray(content.questions) || content.questions.length === 0) {
    return { error: "Aucune question dans ce quiz." };
  }

  const numeric: Record<string, number> = {};
  for (const [k, v] of Object.entries(answers)) {
    numeric[k] = typeof v === "number" ? v : Number(v);
  }

  for (const q of content.questions) {
    if (!(q.id in numeric) || Number.isNaN(numeric[q.id])) {
      return { error: "Répondez à toutes les questions." };
    }
  }

  const { score, maxScore } = gradeQcm(content, numeric);
  return { ok: true as const, score, maxScore };
}
