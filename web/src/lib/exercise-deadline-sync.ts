import { andClauseContenuPourEleve } from "@/lib/eleve-visibility";
import { prisma } from "@/lib/prisma";

const AUTO_ZERO_FEEDBACK = "Date limite dépassée — exercice non rendu (0).";

/**
 * Pour chaque exercice visible par l’élève dont l’échéance est passée et sans aucune tentative,
 * crée une tentative automatique notée 0 / 20.
 */
export async function applyAutoZeroForPastDeadlines(params: {
  studentId: string;
  groupe: string | null;
  anneeScolaire: string | null;
}): Promise<void> {
  const now = new Date();
  const exercises = await prisma.exercise.findMany({
    where: {
      published: true,
      deadlineAt: { not: null, lte: now },
      AND: andClauseContenuPourEleve({
        groupe: params.groupe,
        anneeScolaire: params.anneeScolaire,
      }),
    },
    select: { id: true },
  });

  for (const ex of exercises) {
    const count = await prisma.exerciseAttempt.count({
      where: { exerciseId: ex.id, studentId: params.studentId },
    });
    if (count > 0) continue;

    await prisma.exerciseAttempt.create({
      data: {
        exerciseId: ex.id,
        studentId: params.studentId,
        answersJson: "{}",
        score: 0,
        maxScore: 20,
        status: "CORRIGE",
        feedback: AUTO_ZERO_FEEDBACK,
        gradedAt: now,
      },
    });
  }
}

export function isExerciseDeadlinePassed(deadlineAt: Date | null): boolean {
  if (!deadlineAt) return false;
  return new Date(deadlineAt).getTime() < Date.now();
}
