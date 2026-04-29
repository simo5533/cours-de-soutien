import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { EleveCoursesExplorer } from "@/components/eleve-courses-explorer";
import { andClauseContenuPourEleve } from "@/lib/eleve-visibility";
import { prisma } from "@/lib/prisma";

export default async function EleveFavorisPage() {
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
        Cours que vous avez ajoutés aux favoris parmi ceux visibles pour votre classe.{" "}
        <Link href="/eleve/cours" className="font-medium text-brandblue underline">
          Voir tous les cours
        </Link>
      </p>
      {favoriteIds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gold/40 bg-gold/5 p-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Aucun favori pour l’instant. Ouvrez un cours et cliquez sur « Ajouter aux favoris ».
        </div>
      ) : (
        <EleveCoursesExplorer
          courses={allRows}
          favoriteIds={favoriteIds}
          favorisOnly
        />
      )}
    </div>
  );
}
