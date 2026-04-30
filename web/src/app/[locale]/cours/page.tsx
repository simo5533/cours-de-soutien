import { Link } from "@/i18n/navigation";
import { PublicQuizCatalog } from "@/components/public-quiz-catalog";
import { SiteHeader } from "@/components/site-header";
import {
  CATALOG_LANGUAGE_MATIERES,
  CATALOG_MATIERE_I18N_KEY,
  groupQuizzesForCatalog,
} from "@/lib/language-quiz-catalog";
import { NIVEAU_CATALOG_I18N_KEY, NIVEAUX } from "@/lib/course-taxonomy";
import { prisma } from "@/lib/prisma";
import { ExerciseType } from "@prisma/client";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CoursPublicPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ta = await getTranslations("FreeLangCourses");
  const t = await getTranslations("CatalogPage");
  const quizzes = await prisma.exercise.findMany({
    where: { published: true, type: ExerciseType.QCM },
    orderBy: [{ matiere: "asc" }, { niveau: "asc" }, { title: "asc" }],
    take: 200,
    select: {
      id: true,
      title: true,
      matiere: true,
      niveau: true,
      chapitre: true,
    },
  });

  const catalogRows = quizzes.map((q) => ({
    id: q.id,
    title: q.title,
    matiere: q.matiere,
    niveau: q.niveau,
    chapitre: q.chapitre,
  }));

  const groups = groupQuizzesForCatalog(catalogRows);
  const quizCount = catalogRows.length;

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
              {t("heroBadge")}
            </p>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-navy dark:text-white sm:text-4xl sm:leading-tight">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {t.rich("heroLead", {
                highlight: (chunks) => (
                  <strong className="font-semibold text-navy dark:text-white">
                    {chunks}
                  </strong>
                ),
              })}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-2 rounded-xl border border-brandblue/20 bg-brandblue/5 px-4 py-2 font-medium text-navy dark:border-brandblue/25 dark:bg-brandblue/10 dark:text-brandblue">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-sm font-bold text-gold"
                  aria-hidden
                >
                  {quizCount}
                </span>
                {t("qcmPublished")}
              </span>
              <Link href="/inscription" className="btn-secondary !py-2.5">
                {t("createStudentAccount")}
              </Link>
            </div>
          </div>
        </section>

        {/* Langues — article partie gratuite */}
        <section
          className="relative mt-14 overflow-hidden rounded-3xl border border-brandblue/20 bg-gradient-to-br from-white via-brandblue/[0.04] to-white px-6 py-8 shadow-md ring-1 ring-gold/10 dark:border-slate-700/80 dark:from-slate-900/80 dark:via-brandblue/[0.06] dark:to-slate-900/70 sm:px-8"
          aria-labelledby="langues-gratuit-heading"
        >
          <div
            className="pointer-events-none absolute -end-16 -top-12 h-40 w-40 rounded-full bg-brandblue/10 blur-2xl dark:bg-brandblue/15"
            aria-hidden
          />
          <h2
            id="langues-gratuit-heading"
            className="relative text-lg font-bold text-navy dark:text-white sm:text-xl"
          >
            {ta("catalogTeaserTitle")}
          </h2>
          <p className="relative mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {ta("catalogTeaserBody")}
          </p>
          <Link
            href="/cours-gratuits-langues"
            className="relative mt-4 inline-flex items-center rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-gold shadow-md transition hover:bg-navy/90 dark:bg-brandblue dark:text-white dark:hover:bg-brandblue/90"
          >
            {ta("catalogTeaserCta")}
          </Link>
        </section>

        {/* Langues = matières des quiz */}
        <section className="mt-14" aria-labelledby="langues-quiz-heading">
          <h2 id="langues-quiz-heading" className="brand-section-title">
            {t("taxonomyTitle")}
          </h2>
          <p className="brand-section-subtitle mt-2 max-w-2xl">
            {t("taxonomySubtitle")}
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="brand-card p-5">
              <div className="brand-card-inner border-s-4 border-gold/50 ps-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-navy dark:text-gold">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brandblue to-navy text-white shadow-md"
                    aria-hidden
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                  </span>
                  {t("livingLanguagesTitle")}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {CATALOG_LANGUAGE_MATIERES.map((m) => (
                    <li
                      key={m}
                      className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brandblue" />
                      {t(
                        `matieres.${CATALOG_MATIERE_I18N_KEY[m]}` as Parameters<
                          typeof t
                        >[0],
                      )}
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
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </span>
                  {t("levelsCardTitle")}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {NIVEAUX.map((n) => (
                    <li
                      key={n}
                      className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {t(
                        `niveaux.${NIVEAU_CATALOG_I18N_KEY[n]}` as Parameters<
                          typeof t
                        >[0],
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {t("chapterHint")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Liste QCM par langue */}
        <section className="mt-16" aria-labelledby="liste-qcm-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="liste-qcm-heading"
                className="text-xl font-bold tracking-tight text-navy dark:text-white sm:text-2xl"
              >
                {t("listTitle")}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {t("listSubtitle")}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <PublicQuizCatalog groups={groups} />
          </div>
        </section>

        {/* CTA bandeau */}
        <section className="mt-16 overflow-hidden rounded-3xl border border-gold/30 bg-navy px-6 py-10 text-center shadow-xl sm:px-10">
          <h2 className="text-xl font-bold text-gold sm:text-2xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
            {t("ctaBody")}
          </p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/connexion" className="btn-primary !px-8">
              {t("ctaLogin")}
            </Link>
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              {t("ctaSignup")}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
