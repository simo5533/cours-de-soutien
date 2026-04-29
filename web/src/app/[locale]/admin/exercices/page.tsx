import { prisma } from "@/lib/prisma";
import { ExerciseDeleteButton } from "@/components/exercise-delete-button";

export default async function AdminExercicesPage() {
  const exercises = await prisma.exercise.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Inventaire des exercices — suppression définitive possible.
      </p>
      {exercises.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          Aucun exercice.
        </div>
      ) : (
        <ul className="space-y-2">
          {exercises.map((ex) => (
            <li
              key={ex.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
            >
              <div>
                <span className="font-medium">{ex.title}</span>
                <span className="ml-2 text-xs text-zinc-500">
                  {ex.type} · {ex.matiere} — {ex.author.name}
                </span>
              </div>
              <ExerciseDeleteButton exerciseId={ex.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
