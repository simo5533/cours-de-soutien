import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { CourseFavoriteButton } from "@/components/course-favorite-button";
import { elevePeutVoirContenu } from "@/lib/eleve-visibility";
import { prisma } from "@/lib/prisma";

export default async function EleveCoursDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const [course, user, favorite] = await Promise.all([
    prisma.course.findUnique({
      where: { id },
      include: { author: { select: { name: true } } },
    }),
    prisma.user.findUnique({ where: { id: session!.user.id } }),
    prisma.courseFavorite.findUnique({
      where: {
        userId_courseId: { userId: session!.user.id, courseId: id },
      },
    }),
  ]);

  if (!course || !course.published) {
    notFound();
  }

  if (
    !user ||
    !elevePeutVoirContenu({
      eleveGroupe: user.groupe,
      eleveAnnee: user.anneeScolaire,
      groupeCible: course.groupeCible,
      anneeScolaireCible: course.anneeScolaireCible,
    })
  ) {
    notFound();
  }

  return (
    <div className="max-w-none">
      <Link
        href="/eleve/cours"
        className="mb-6 inline-block text-sm text-navy hover:underline dark:text-brandblue"
      >
        ← Tous les cours
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 className="text-xl font-semibold text-navy dark:text-white">{course.title}</h2>
        <CourseFavoriteButton courseId={course.id} initialFavorited={!!favorite} />
      </div>
      <p className="text-sm text-zinc-500">
        {course.matiere} · {course.niveau} · {course.chapitre} — par{" "}
        {course.author.name}
      </p>
      {course.description ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {course.description}
        </p>
      ) : null}
      {course.pdfFileName ? (
        <p className="mt-4">
          <a
            href={`/api/courses/${course.id}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-navy underline-offset-2 hover:underline dark:text-brandblue"
          >
            Ouvrir le PDF
          </a>
        </p>
      ) : null}
      {course.contentText ? (
        <article className="mt-6 whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50/80 p-6 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
          {course.contentText}
        </article>
      ) : null}
    </div>
  );
}
