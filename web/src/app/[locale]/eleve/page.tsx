import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import {
  DashboardActionCard,
  DashboardHero,
  DashboardStatCard,
} from "@/components/dashboard-overview";
import { andClauseContenuPourEleve } from "@/lib/eleve-visibility";
import { prisma } from "@/lib/prisma";

const icons = {
  book: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13"
      />
    </svg>
  ),
  clipboard: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ),
  chart: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  calendar: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  star: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  ),
};

export default async function EleveDashboardPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
  });

  const vis = {
    groupe: user?.groupe ?? null,
    anneeScolaire: user?.anneeScolaire ?? null,
  };
  const contenu = { AND: andClauseContenuPourEleve(vis) };

  const [courseCount, exerciseCount, favoriteCount] = await Promise.all([
    prisma.course.count({
      where: { published: true, ...contenu },
    }),
    prisma.exercise.count({
      where: { published: true, ...contenu },
    }),
    prisma.courseFavorite.count({
      where: { userId: session!.user.id },
    }),
  ]);

  return (
    <div className="space-y-10">
      <DashboardHero accent="teal" eyebrow="Tableau de bord" title="Bonjour — voici votre espace">
        <p>
          <span className="text-slate-700 dark:text-slate-300">Classe :</span>{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {user?.groupe ?? "non renseignée"}
          </span>
          <span className="mx-2 text-slate-400">·</span>
          <span className="text-slate-700 dark:text-slate-300">Année :</span>{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {user?.anneeScolaire ?? "—"}
          </span>
        </p>
        <p className="mt-3">
          Les contenus ciblés par groupe ou année ne s’affichent que si votre profil correspond.{" "}
          <Link
            href="/eleve/profil"
            className="font-semibold text-navy underline decoration-brandblue/40 underline-offset-2 transition hover:text-navy dark:text-brandblue dark:hover:text-brandblue"
          >
            Mettre à jour ma classe
          </Link>
        </p>
      </DashboardHero>

      <section>
        <h3 className="brand-section-title mb-4">Aperçu</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <DashboardStatCard
            accent="teal"
            label="Cours accessibles"
            value={courseCount}
            hint="Publiés et visibles pour votre profil"
            icon={icons.book}
          />
          <DashboardStatCard
            accent="teal"
            label="Exercices & QCM"
            value={exerciseCount}
            hint="Disponibles pour vous"
            icon={icons.clipboard}
          />
          <DashboardStatCard
            accent="teal"
            label="Favoris"
            value={favoriteCount}
            hint="Cours marqués — voir l’onglet Mes favoris"
            icon={icons.star}
          />
        </div>
      </section>

      <section>
        <h3 className="brand-section-title mb-4">Accès rapides</h3>
        <ul className="grid gap-4 sm:grid-cols-2">
          <li>
            <DashboardActionCard
              accent="teal"
              href="/eleve/cours"
              title="Mes cours"
              description="Par matière, niveau et chapitre — texte et PDF."
              icon={icons.book}
            />
          </li>
          <li>
            <DashboardActionCard
              accent="teal"
              href="/eleve/favoris"
              title="Mes favoris"
              description="Retrouvez rapidement les cours que vous avez épinglés."
              icon={icons.star}
            />
          </li>
          <li>
            <DashboardActionCard
              accent="teal"
              href="/eleve/exercices"
              title="Exercices & QCM"
              description="Entraînement et corrections par vos professeurs."
              icon={icons.clipboard}
            />
          </li>
          <li>
            <DashboardActionCard
              accent="teal"
              href="/eleve/notes"
              title="Mes notes"
              description="Historique des évaluations et retours."
              icon={icons.chart}
            />
          </li>
          <li>
            <DashboardActionCard
              accent="teal"
              href="/eleve/progression"
              title="Progression"
              description="Vue d’ensemble de votre avancement."
              icon={icons.chart}
            />
          </li>
          <li className="sm:col-span-2">
            <DashboardActionCard
              accent="teal"
              href="/eleve/emploi-du-temps"
              title="Emploi du temps"
              description="Créneaux et matières pour votre groupe."
              icon={icons.calendar}
            />
          </li>
        </ul>
      </section>
    </div>
  );
}
