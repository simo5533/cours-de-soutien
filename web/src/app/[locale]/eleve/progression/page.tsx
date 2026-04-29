import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function EleveProgressionPage() {
  const session = await auth();
  const attempts = await prisma.exerciseAttempt.findMany({
    where: {
      studentId: session!.user.id,
      status: "CORRIGE",
      score: { not: null },
    },
    include: { exercise: true },
  });

  const byMatiere = new Map<string, { sum: number; n: number }>();
  for (const a of attempts) {
    if (a.score == null || a.maxScore == null || a.maxScore === 0) continue;
    const ratio = a.score / a.maxScore;
    const cur = byMatiere.get(a.exercise.matiere) ?? { sum: 0, n: 0 };
    cur.sum += ratio;
    cur.n += 1;
    byMatiere.set(a.exercise.matiere, cur);
  }

  const rows = [...byMatiere.entries()].map(([matiere, v]) => ({
    matiere,
    moyennePct: Math.round((v.sum / v.n) * 100),
    n: v.n,
  }));

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Moyenne des scores (sur tentatives corrigées), par matière.
      </p>
      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          Pas assez de données — passez des exercices notés.
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li
              key={r.matiere}
              className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
            >
              <span className="font-medium">{r.matiere}</span>
              <span className="tabular-nums text-zinc-600 dark:text-zinc-400">
                {r.moyennePct}% ({r.n} essai{r.n > 1 ? "s" : ""})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
