import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CoursePublishToggle } from "@/components/course-actions";
import { DuplicateCourseButton } from "@/components/duplicate-course-button";

export default async function ProfesseurCoursPage() {
  const session = await auth();
  const courses = await prisma.course.findMany({
    where: { authorId: session!.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Vos cours publiés ou brouillons. <strong>Dupliquer</strong> crée une
          copie en brouillon sans PDF (à joindre à nouveau).
        </p>
        <Link
          href="/professeur/cours/nouveau"
          className="rounded-full bg-navy px-5 py-2 text-sm font-medium text-white hover:bg-navy/90"
        >
          + Nouveau cours
        </Link>
      </div>
      {courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          Aucun cours pour l’instant.
        </div>
      ) : (
        <ul className="space-y-3">
          {courses.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-zinc-500">
                  {c.matiere} · {c.niveau} · {c.chapitre}
                  {c.groupeCible || c.anneeScolaireCible ? (
                    <span className="ml-2 block text-navy dark:text-brandblue">
                      Cible :{" "}
                      {[c.groupeCible, c.anneeScolaireCible]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  ) : null}
                  {c.published ? (
                    <span className="ml-2 text-navy">· Publié</span>
                  ) : (
                    <span className="ml-2 text-gold">· Brouillon</span>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <DuplicateCourseButton courseId={c.id} />
                <CoursePublishToggle courseId={c.id} published={c.published} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
