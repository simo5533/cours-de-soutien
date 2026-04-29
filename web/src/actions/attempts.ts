"use server";

import { revalidatePathAllLocales } from "@/lib/revalidate-i18n";
import { z } from "zod";
import { auth } from "@/auth";
import { elevePeutVoirContenu } from "@/lib/eleve-visibility";
import { prisma } from "@/lib/prisma";

type QcmQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
};

type ContentQcm = { questions: QcmQuestion[] };
type ContentOuvert = { questions: { id: string; prompt: string }[] };

function gradeQcm(content: ContentQcm, answers: Record<string, number>) {
  let correct = 0;
  const total = content.questions.length;
  for (const q of content.questions) {
    if (answers[q.id] === q.correct) correct += 1;
  }
  const score = total === 0 ? 0 : (correct / total) * 20;
  return { score, maxScore: 20, correct, total };
}

export async function submitExerciseAttemptAction(
  exerciseId: string,
  answers: Record<string, string | number>,
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ELEVE") {
    return { error: "Réservé aux élèves." };
  }

  const [exercise, student] = await Promise.all([
    prisma.exercise.findUnique({ where: { id: exerciseId } }),
    prisma.user.findUnique({ where: { id: session.user.id } }),
  ]);
  if (!exercise || !exercise.published) {
    return { error: "Exercice introuvable." };
  }
  if (
    !student ||
    !elevePeutVoirContenu({
      eleveGroupe: student.groupe,
      eleveAnnee: student.anneeScolaire,
      groupeCible: exercise.groupeCible,
      anneeScolaireCible: exercise.anneeScolaireCible,
    })
  ) {
    return { error: "Cet exercice n’est pas disponible pour votre groupe ou votre année." };
  }

  if (
    exercise.deadlineAt &&
    new Date(exercise.deadlineAt).getTime() < Date.now()
  ) {
    return {
      error:
        "La date limite de rendu est dépassée. Vous ne pouvez plus envoyer de réponse.",
    };
  }

  const content = JSON.parse(exercise.contentJson) as ContentQcm | ContentOuvert;

  if (exercise.type === "QCM") {
    const qcm = content as ContentQcm;
    const numeric: Record<string, number> = {};
    for (const [k, v] of Object.entries(answers)) {
      numeric[k] = typeof v === "number" ? v : Number(v);
    }
    const { score, maxScore } = gradeQcm(qcm, numeric);

    await prisma.exerciseAttempt.create({
      data: {
        exerciseId,
        studentId: session.user.id,
        answersJson: JSON.stringify(numeric),
        score,
        maxScore,
        status: "CORRIGE",
        gradedAt: new Date(),
      },
    });

    revalidatePathAllLocales("/eleve/exercices");
    revalidatePathAllLocales("/eleve/notes");
    revalidatePathAllLocales("/eleve/progression");
    revalidatePathAllLocales("/professeur/eleves");
    return { ok: true, score, maxScore };
  }

  await prisma.exerciseAttempt.create({
    data: {
      exerciseId,
      studentId: session.user.id,
      answersJson: JSON.stringify(answers),
      status: "EN_ATTENTE",
    },
  });

  revalidatePathAllLocales("/eleve/exercices");
  revalidatePathAllLocales("/professeur/corrections");
  return { ok: true, pending: true };
}

const gradeOpenSchema = z.object({
  attemptId: z.string(),
  score: z.coerce.number().min(0),
  maxScore: z.coerce.number().min(0),
  feedback: z.string().optional(),
});

export async function gradeOpenAttemptAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PROFESSEUR") {
    return;
  }

  const parsed = gradeOpenSchema.safeParse({
    attemptId: formData.get("attemptId"),
    score: formData.get("score"),
    maxScore: formData.get("maxScore"),
    feedback: formData.get("feedback") || undefined,
  });
  if (!parsed.success) {
    return;
  }

  const attempt = await prisma.exerciseAttempt.findUnique({
    where: { id: parsed.data.attemptId },
    include: { exercise: true },
  });
  if (!attempt || attempt.exercise.authorId !== session.user.id) {
    return;
  }
  if (attempt.exercise.type !== "OUVERT") {
    return;
  }

  await prisma.exerciseAttempt.update({
    where: { id: attempt.id },
    data: {
      score: parsed.data.score,
      maxScore: parsed.data.maxScore,
      feedback: parsed.data.feedback || null,
      status: "CORRIGE",
      gradedAt: new Date(),
      gradedById: session.user.id,
    },
  });

  revalidatePathAllLocales("/professeur/corrections");
  revalidatePathAllLocales("/eleve/notes");
}
