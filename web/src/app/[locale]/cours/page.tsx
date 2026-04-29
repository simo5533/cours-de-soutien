import { Link } from "@/i18n/navigation";
import { PublicCatalogGrid } from "@/components/public-catalog-grid";
import { SiteHeader } from "@/components/site-header";
import { MATIERES, NIVEAUX } from "@/lib/course-taxonomy";
import { prisma } from "@/lib/prisma";

export default async function CoursPublicPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: [{ matiere: "asc" }, { niveau: "asc" }, { chapitre: "asc" }],
    take: 60,
  });

  const catalogItems = courses.map((c) => ({
    id: c.id,
    title: c.title,
    matiere: c.matiere,
    niveau: c.niveau,
    chapitre: c.chapitre,
    description: c.description,
  }));

  return (
    <>
      <SiteHeader />
      <main className="page-bg mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-navy/10 bg-gradient-to-br from-white via-white to-brandblue/[0.07] px-6 py-10 shadow-lg shadow-navy/[0.06] ring-1 ring-gold/20 dark:border-slate-700/80 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-brandblue/[0.08] dark:shadow-black/30 dark:ring-gold/25 sm:px-10 sm:py-12">
          <div
            className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-brandblue/15 blur-3xl dark:bg-brandblue/10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-12 -start-16 h-48 w-48 rounded-full bg-gold/12 blur-3xl dark:bg-gold/10"
            aria-hidden
          />
          <div className="relative">
            <p className="inline-flex items-center rounded-full border border-navy/15 bg-navy/[0.04] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy dark:border-gold/30 dark:bg-gold/10 dark:text-gold">
              Catalogue public
            </p>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-navy dark:text-white sm:text-4xl sm:leading-tight">
              Nos cours publiés
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Parcourez les fiches par matière et niveau. Pour ouvrir le contenu
              détaillé et les PDF,{" "}
              <Link
                href="/connexion"
                className="font-semibold text-brandblue underline-offset-2 hover:underline dark:text-brandblue"
              >
                connectez-vous
              </Link>{" "}
              avec un compte élève.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-2 rounded-xl border border-brandblue/20 bg-brandblue/5 px-4 py-2 font-medium text-navy dark:border-brandblue/25 dark:bg-brandblue/10 dark:text-brandblue">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-sm font-bold text-gold"
                  aria-hidden
                >
                  {courses.length}
                </span>
                cours disponibles
              </span>
              <Link
                href="/inscription"
                className="btn-secondary !py-2.5"
              >
                Créer un compte élève
              </Link>
            </div>
          </div>
        </section>

        {/* Taxonomie */}
        <section
          className="mt-14"
          aria-labelledby="taxonomie-heading"
        >
          <h2
            id="taxonomie-heading"
            className="brand-section-title"
          >
            Organisation des contenus
          </h2>
          <p className="brand-section-subtitle mt-2 max-w-2xl">
            Les enseignants structurent chaque cours selon ces axes — la liste
            ci-dessous reflète ce qui est déjà publié.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="brand-card p-5">
              <div className="brand-card-inner border-s-4 border-gold/50 ps-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-navy dark:text-gold">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brandblue to-navy text-white shadow-md"
                    aria-hidden
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13" />
                    </svg>
                  </span>
                  Matières
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {MATIERES.map((m) => (
                    <li
                      key={m}
                      className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brandblue" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="brand-card p-5">
              <div className="brand-card-inner border-s-4 border-gold/50 ps-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-navy dark:text-gold">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-brandblue text-white shadow-md"
                    aria-hidden
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </span>
                  Niveaux
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {NIVEAUX.map((n) => (
                    <li
                      key={n}
                      className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="brand-card p-5">
              <div className="brand-card-inner border-s-4 border-gold/50 ps-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-navy dark:text-gold">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-navy text-white shadow-md"
                    aria-hidden
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  Chapitres
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Chaque fiche indique son chapitre pédagogique. Utilisez les
                  pastilles sur les cartes cours pour repérer la progression.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Liste cours */}
        <section className="mt-16" aria-labelledby="liste-cours-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="liste-cours-heading"
                className="text-xl font-bold tracking-tight text-navy dark:text-white sm:text-2xl"
              >
                Fiches publiées
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Aperçu des titres — contenu complet après connexion.
              </p>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-brandblue/30 bg-brandblue/[0.04] px-8 py-16 text-center dark:border-brandblue/25 dark:bg-brandblue/[0.06]">
              <p className="text-base font-medium text-navy dark:text-gold">
                Aucun cours public pour le moment.
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
                Revenez bientôt : les équipes publient les supports au fil de
                l’année.
              </p>
            </div>
          ) : (
            <div className="mt-8">
              <PublicCatalogGrid courses={catalogItems} />
            </div>
          )}
        </section>

        {/* CTA bandeau */}
        <section className="mt-16 overflow-hidden rounded-3xl border border-gold/30 bg-navy px-6 py-10 text-center shadow-xl sm:px-10">
          <h2 className="text-xl font-bold text-gold sm:text-2xl">
            Accédez au catalogue complet
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
            Connexion élève pour télécharger les PDF, suivre les exercices et
            votre progression.
          </p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/connexion" className="btn-primary !px-8">
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              Inscription
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
