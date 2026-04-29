import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function EleveNotesPage() {
  const session = await auth();
  const attempts = await prisma.exerciseAttempt.findMany({
    where: { studentId: session!.user.id },
    include: { exercise: true },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Notes et retours sur vos exercices.
      </p>
      {attempts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          Pas encore de tentative enregistrée.
        </div>
      ) : (
        <ul className="space-y-3">
          {attempts.map((a) => (
            <li
              key={a.id}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <p className="font-medium">{a.exercise.title}</p>
              <p className="text-xs text-zinc-500">
                {a.exercise.matiere} · {a.exercise.type}
              </p>
              {a.status === "CORRIGE" && a.score != null && a.maxScore != null ? (
                <p className="mt-2 text-sm">
                  Note :{" "}
                  <span className="font-semibold tabular-nums">
                    {a.score.toFixed(1)} / {a.maxScore.toFixed(1)}
                  </span>
                </p>
              ) : (
                <p className="mt-2 text-sm text-navy dark:text-gold">
                  En attente de correction
                </p>
              )}
              {a.feedback ? (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Commentaire : {a.feedback}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
