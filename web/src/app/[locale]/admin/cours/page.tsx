import { prisma } from "@/lib/prisma";
import { CourseDeleteButton, CoursePublishToggle } from "@/components/course-actions";

export default async function AdminCoursPage() {
  const courses = await prisma.course.findMany({
    include: { author: { select: { name: true, email: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Tous les cours — modération et publication.
      </p>
      {courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          Aucun cours.
        </div>
      ) : (
        <ul className="space-y-3">
          {courses.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div>
                <span className="font-medium">{c.title}</span>
                <p className="text-xs text-zinc-500">
                  {c.matiere} · {c.niveau} · {c.chapitre} — {c.author.name}
                  {c.published ? (
                    <span className="ml-2 text-navy">Publié</span>
                  ) : (
                    <span className="ml-2 text-gold">Brouillon</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CoursePublishToggle courseId={c.id} published={c.published} />
                <CourseDeleteButton courseId={c.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
