import { auth } from "@/auth";
import {
  DashboardActionCard,
  DashboardHero,
  DashboardStatCard,
} from "@/components/dashboard-overview";
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
  pen: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  ),
  inbox: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  ),
  users: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  clock: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

export default async function ProfesseurDashboardPage() {
  const session = await auth();
  const authorId = session!.user.id;

  const [courses, exercises, aCorriger] = await Promise.all([
    prisma.course.count({ where: { authorId } }),
    prisma.exercise.count({ where: { authorId } }),
    prisma.exerciseAttempt.count({
      where: {
        status: "EN_ATTENTE",
        exercise: { authorId },
      },
    }),
  ]);

  return (
    <div className="space-y-10">
      <DashboardHero
        accent="indigo"
        eyebrow="Espace enseignant"
        title="Pilotez vos contenus et le suivi des élèves"
      >
        <p>
          Publiez des cours, créez des exercices et des QCM, corrigez les copies et consultez les
          performances — tout est regroupé ici.
        </p>
      </DashboardHero>

      <section>
        <h3 className="brand-section-title mb-4">Chiffres clés</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <DashboardStatCard
            accent="indigo"
            label="Cours rédigés"
            value={courses}
            hint="Tous statuts confondus"
            icon={icons.book}
          />
          <DashboardStatCard
            accent="indigo"
            label="Exercices"
            value={exercises}
            hint="QCM et questions ouvertes"
            icon={icons.pen}
          />
          <DashboardStatCard
            accent="indigo"
            label="À corriger"
            value={aCorriger}
            hint="Réponses en attente"
            icon={icons.inbox}
          />
        </div>
      </section>

      <section>
        <h3 className="brand-section-title mb-4">Raccourcis</h3>
        <ul className="grid gap-4 sm:grid-cols-2">
          <li>
            <DashboardActionCard
              accent="indigo"
              href="/professeur/cours"
              title="Mes cours"
              description="Créer ou modifier des cours, joindre un PDF, publier."
              icon={icons.book}
            />
          </li>
          <li>
            <DashboardActionCard
              accent="indigo"
              href="/professeur/exercices"
              title="Exercices / QCM"
              description="Nouveaux devoirs et questionnaires à choix multiples."
              icon={icons.pen}
            />
          </li>
          <li>
            <DashboardActionCard
              accent="indigo"
              href="/professeur/corrections"
              title="Corrections"
              description="File des copies à traiter et feedback aux élèves."
              icon={icons.inbox}
            />
          </li>
          <li>
            <DashboardActionCard
              accent="indigo"
              href="/professeur/eleves"
              title="Élèves & performances"
              description="Suivi par élève et par matière."
              icon={icons.users}
            />
          </li>
          <li className="sm:col-span-2">
            <DashboardActionCard
              accent="indigo"
              href="/professeur/emploi-du-temps"
              title="Emploi du temps"
              description="Vos créneaux et affectations groupe / matière."
              icon={icons.clock}
            />
          </li>
        </ul>
      </section>
    </div>
  );
}
