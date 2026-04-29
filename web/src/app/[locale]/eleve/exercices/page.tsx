import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { andClauseContenuPourEleve } from "@/lib/eleve-visibility";
import { applyAutoZeroForPastDeadlines } from "@/lib/exercise-deadline-sync";
import { isExerciseDeadlinePast } from "@/lib/is-exercise-deadline-past";
import { prisma } from "@/lib/prisma";

export default async function EleveExercicesPage() {
  const session = await auth();
  const eleve = await prisma.user.findUnique({
    where: { id: session!.user.id },
  });

  if (eleve) {
    await applyAutoZeroForPastDeadlines({
      studentId: eleve.id,
      groupe: eleve.groupe,
      anneeScolaire: eleve.anneeScolaire,
    });
  }

  const exercises = await prisma.exercise.findMany({
    where: {
      published: true,
      AND: andClauseContenuPourEleve({
        groupe: eleve?.groupe ?? null,
        anneeScolaire: eleve?.anneeScolaire ?? null,
      }),
    },
    orderBy: [{ matiere: "asc" }, { title: "asc" }],
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Exercices pour votre groupe et votre année scolaire. Sans cible sur le
        contenu, l’exercice est proposé à toutes les classes.
      </p>
      {exercises.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          Aucun exercice disponible.
        </div>
      ) : (
        <ul className="space-y-2">
          {exercises.map((ex) => {
            const past = isExerciseDeadlinePast(ex.deadlineAt);
            return (
              <li key={ex.id}>
                <Link
                  href={`/eleve/exercices/${ex.id}`}
                  className="block rounded-xl border border-zinc-200 p-4 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  <span className="font-medium">{ex.title}</span>
                  <span className="mt-1 block text-xs text-zinc-500">
                    {ex.type} · {ex.matiere} · {ex.niveau} · {ex.chapitre}
                  </span>
                  {ex.deadlineAt ? (
                    <span
                      className={`mt-1 block text-xs font-medium ${
                        past
                          ? "text-red-600 dark:text-red-400"
                          : "text-amber-800 dark:text-amber-400/90"
                      }`}
                    >
                      À rendre avant :{" "}
                      {new Date(ex.deadlineAt).toLocaleString("fr-FR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                      {past ? " (échéance passée)" : ""}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
