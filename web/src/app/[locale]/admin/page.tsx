import { Link } from "@/i18n/navigation";
import {
  DashboardHero,
  DashboardStatCard,
} from "@/components/dashboard-overview";
import { prisma } from "@/lib/prisma";

const icons = {
  users: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
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
  attempts: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
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
  assign: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
};

export default async function AdminDashboardPage() {
  const [users, courses, exercises, attempts, creneaux, affectations] =
    await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.exercise.count(),
      prisma.exerciseAttempt.count(),
      prisma.scheduleEntry.count(),
      prisma.professeurAffectation.count(),
    ]);

  return (
    <div className="space-y-10">
      <DashboardHero accent="amber" eyebrow="Pilotage" title="Vue globale de la plateforme">
        <p>
          Comptes, contenus pédagogiques et activité des élèves. Utilisez les raccourcis ci-dessous
          pour l’emploi du temps et les affectations profs.
        </p>
      </DashboardHero>

      <section>
        <h3 className="brand-section-title mb-4">Indicateurs</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStatCard
            accent="amber"
            label="Utilisateurs"
            value={users}
            hint="Comptes enregistrés"
            icon={icons.users}
          />
          <DashboardStatCard
            accent="amber"
            label="Cours"
            value={courses}
            hint="Fiches et PDF"
            icon={icons.book}
          />
          <DashboardStatCard
            accent="amber"
            label="Exercices"
            value={exercises}
            hint="QCM & ouverts"
            icon={icons.clipboard}
          />
          <DashboardStatCard
            accent="amber"
            label="Tentatives"
            value={attempts}
            hint="Réponses élèves"
            icon={icons.attempts}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div
          className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ring-1 ring-gold/25 dark:border-slate-700/80 dark:bg-slate-900/45 dark:ring-gold/25"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-navy dark:bg-gold/15 dark:text-gold">
              {icons.calendar}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Emploi du temps
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                <strong className="tabular-nums text-slate-800 dark:text-slate-200">{creneaux}</strong>{" "}
                créneau(x) planifié(s) — salles, groupes, profs désignés.
              </p>
              <Link
                href="/admin/emploi-du-temps"
                className="mt-4 inline-flex items-center rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-navy dark:bg-navy dark:hover:bg-gold/80"
              >
                Gérer les créneaux
              </Link>
            </div>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ring-1 ring-gold/25 dark:border-slate-700/80 dark:bg-slate-900/45 dark:ring-gold/25"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-navy dark:bg-gold/15 dark:text-gold">
              {icons.assign}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Affectations professeurs
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                <strong className="tabular-nums text-slate-800 dark:text-slate-200">{affectations}</strong>{" "}
                liaison(s) matière / groupe / année.
              </p>
              <Link
                href="/admin/affectations"
                className="mt-4 inline-flex items-center rounded-full border border-navy/30 bg-gold/10 px-4 py-2 text-sm font-semibold text-navy transition hover:bg-gold/15 dark:border-gold/40 dark:bg-navy/50 dark:text-gold dark:hover:bg-navy/80"
              >
                Gérer les affectations
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="brand-section-title mb-4">Administration</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/utilisateurs"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Utilisateurs
          </Link>
          <Link
            href="/admin/groupes"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Groupes
          </Link>
          <Link
            href="/admin/absences"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Absences
          </Link>
          <Link
            href="/admin/finances"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Finances
          </Link>
          <Link
            href="/admin/cours"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Cours
          </Link>
          <Link
            href="/admin/exercices"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Exercices
          </Link>
          <Link
            href="/admin/statistiques"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Statistiques
          </Link>
        </div>
      </section>
    </div>
  );
}
