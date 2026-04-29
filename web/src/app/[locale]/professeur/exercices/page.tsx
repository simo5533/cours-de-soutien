import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfesseurExercicesPage() {
  const session = await auth();
  const exercises = await prisma.exercise.findMany({
    where: { authorId: session!.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Exercices et QCM que vous avez créés.
        </p>
        <Link
          href="/professeur/exercices/nouveau"
          className="rounded-full bg-navy px-5 py-2 text-sm font-medium text-white hover:bg-navy/90"
        >
          + Nouvel exercice
        </Link>
      </div>
      {exercises.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          Aucun exercice.
        </div>
      ) : (
        <ul className="space-y-2">
          {exercises.map((ex) => (
            <li
              key={ex.id}
              className="rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
            >
              <span className="font-medium">{ex.title}</span>
              <span className="ml-2 text-xs text-zinc-500">
                {ex.type} · {ex.matiere} · {ex.niveau} · {ex.chapitre}
                {ex.deadlineAt
                  ? ` · limite ${new Date(ex.deadlineAt).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}`
                  : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
