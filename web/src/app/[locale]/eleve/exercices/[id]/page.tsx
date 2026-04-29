import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ExerciseRunner } from "@/components/exercise-runner";
import { elevePeutVoirContenu } from "@/lib/eleve-visibility";
import {
  applyAutoZeroForPastDeadlines,
  isExerciseDeadlinePassed,
} from "@/lib/exercise-deadline-sync";
import { prisma } from "@/lib/prisma";

export default async function EleveExerciceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const [exercise, user] = await Promise.all([
    prisma.exercise.findUnique({ where: { id } }),
    prisma.user.findUnique({ where: { id: session!.user.id } }),
  ]);

  if (!exercise || !exercise.published) {
    notFound();
  }

  if (
    !user ||
    !elevePeutVoirContenu({
      eleveGroupe: user.groupe,
      eleveAnnee: user.anneeScolaire,
      groupeCible: exercise.groupeCible,
      anneeScolaireCible: exercise.anneeScolaireCible,
    })
  ) {
    notFound();
  }

  await applyAutoZeroForPastDeadlines({
    studentId: user.id,
    groupe: user.groupe,
    anneeScolaire: user.anneeScolaire,
  });

  const deadlinePassed = isExerciseDeadlinePassed(exercise.deadlineAt);

  const latestAttempt = await prisma.exerciseAttempt.findFirst({
    where: { exerciseId: exercise.id, studentId: user.id },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <Link
        href="/eleve/exercices"
        className="text-sm text-navy hover:underline dark:text-brandblue"
      >
        ← Tous les exercices
      </Link>
      <div>
        <h2 className="text-xl font-semibold">{exercise.title}</h2>
        <p className="text-sm text-zinc-500">
          {exercise.type} · {exercise.matiere} · {exercise.niveau} ·{" "}
          {exercise.chapitre}
        </p>
        {exercise.deadlineAt ? (
          <p
            className={`mt-2 text-sm font-medium ${
              deadlinePassed
                ? "text-red-700 dark:text-red-400"
                : "text-zinc-700 dark:text-zinc-300"
            }`}
          >
            Date limite :{" "}
            {new Date(exercise.deadlineAt).toLocaleString("fr-FR", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
            {deadlinePassed ? " — échéance terminée, le devoir est clos." : ""}
          </p>
        ) : null}
      </div>
      {deadlinePassed ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-900/50">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            Devoir clos
          </p>
          {latestAttempt ? (
            latestAttempt.status === "EN_ATTENTE" ? (
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                Votre copie a été envoyée avant la date limite. Elle est en
                attente de correction par le professeur.
              </p>
            ) : (
              <div className="mt-2 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                <p>
                  Note :{" "}
                  <span className="font-semibold text-navy dark:text-brandblue">
                    {latestAttempt.score != null
                      ? latestAttempt.score.toFixed(1)
                      : "—"}{" "}
                    /{" "}
                    {latestAttempt.maxScore != null
                      ? latestAttempt.maxScore.toFixed(1)
                      : "20"}
                  </span>
                </p>
                {latestAttempt.feedback ? (
                  <p className="rounded-lg bg-white px-3 py-2 dark:bg-zinc-950">
                    <span className="font-medium">Commentaire : </span>
                    {latestAttempt.feedback}
                  </p>
                ) : null}
              </div>
            )
          ) : (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Aucune tentative enregistrée.
            </p>
          )}
        </div>
      ) : (
        <ExerciseRunner
          exerciseId={exercise.id}
          type={exercise.type}
          contentJson={exercise.contentJson}
        />
      )}
    </div>
  );
}
