import { prisma } from "@/lib/prisma";

export default async function AdminStatistiquesPage() {
  const [
    userCount,
    eleveCount,
    profCount,
    coursePub,
    attemptCount,
    gradedCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ELEVE" } }),
    prisma.user.count({ where: { role: "PROFESSEUR" } }),
    prisma.course.count({ where: { published: true } }),
    prisma.exerciseAttempt.count(),
    prisma.exerciseAttempt.count({ where: { status: "CORRIGE" } }),
  ]);

  const recent = await prisma.exerciseAttempt.findMany({
    orderBy: { submittedAt: "desc" },
    take: 12,
    include: {
      student: { select: { name: true } },
      exercise: { select: { title: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { l: "Utilisateurs totaux", v: userCount },
          { l: "Élèves", v: eleveCount },
          { l: "Professeurs", v: profCount },
          { l: "Cours publiés", v: coursePub },
          { l: "Tentatives d’exercices", v: attemptCount },
          { l: "Tentatives corrigées", v: gradedCount },
        ].map((x) => (
          <div
            key={x.l}
            className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <p className="text-2xl font-semibold tabular-nums">{x.v}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{x.l}</p>
          </div>
        ))}
      </div>

      <section>
        <h3 className="text-lg font-semibold">Activité récente</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {recent.map((a) => (
            <li
              key={a.id}
              className="rounded-lg border border-zinc-100 px-3 py-2 dark:border-zinc-900"
            >
              {a.student.name} — {a.exercise.title}
              <span className="text-zinc-500">
                {" "}
                ({new Date(a.submittedAt).toLocaleString("fr-FR")})
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
