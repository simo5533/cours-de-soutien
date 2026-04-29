import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { EleveCoursesExplorer } from "@/components/eleve-courses-explorer";
import { andClauseContenuPourEleve } from "@/lib/eleve-visibility";
import { prisma } from "@/lib/prisma";

export default async function EleveCoursPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
  });

  const allCourses = await prisma.course.findMany({
    where: {
      published: true,
      AND: andClauseContenuPourEleve({
        groupe: user?.groupe ?? null,
        anneeScolaire: user?.anneeScolaire ?? null,
      }),
    },
    orderBy: [{ matiere: "asc" }, { niveau: "asc" }, { chapitre: "asc" }],
  });

  const favRows = await prisma.courseFavorite.findMany({
    where: { userId: session!.user.id },
    select: { courseId: true },
  });
  const favoriteIds = favRows.map((r) => r.courseId);

  const allRows = allCourses.map((c) => ({
    id: c.id,
    title: c.title,
    matiere: c.matiere,
    niveau: c.niveau,
    chapitre: c.chapitre,
  }));

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Cours pour votre groupe{" "}
        <strong className="font-medium text-navy dark:text-slate-200">
          {user?.groupe ?? "—"}
        </strong>{" "}
        et l’année{" "}
        <strong className="font-medium text-navy dark:text-slate-200">
          {user?.anneeScolaire ?? "—"}
        </strong>
        . Les contenus sans cible précise sont visibles par tous les élèves.
      </p>
      {allCourses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-navy/20 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
          Aucun cours pour votre classe cette année. Vérifiez votre profil (
          <Link href="/eleve/profil" className="font-medium text-brandblue underline">
            groupe / année
          </Link>
          ).
        </div>
      ) : (
        <EleveCoursesExplorer
          courses={allRows}
          favoriteIds={favoriteIds}
          favorisOnly={false}
        />
      )}
    </div>
  );
}
