import { CtaPremiumSection } from "@/components/cta-premium-section";
import { Link } from "@/i18n/navigation";
import { PublicQuizCatalog } from "@/components/public-quiz-catalog";
import { PublicPageShell } from "@/components/public-page-shell";
import {
  CATALOG_LANGUAGE_MATIERES,
  CATALOG_MATIERE_I18N_KEY,
  CATALOG_STEM_MATIERES,
  CATALOG_STEM_MATIERE_I18N_KEY,
  LANGUAGE_LEVEL_KEYS,
  STEM_LEVEL_KEYS,
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
  const popular = catalogRows.slice(0, 6);

  return (
    <PublicPageShell>
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[24px] border border-border-soft bg-white/50 px-6 py-10 shadow-md shadow-electric/[0.06] backdrop-blur-md sm:px-10 sm:py-12">
          <div
            className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-cyan-ai/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-12 -start-16 h-48 w-48 rounded-full bg-success/10 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            <p className="brand-section-title inline-flex items-center rounded-full border border-border-soft bg-white/70 px-3 py-1">
              {t("heroBadge")}
            </p>
            <h1 className="font-display mt-5 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl sm:leading-tight">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-text">
              {t.rich("heroLead", {
                highlight: (chunks) => (
                  <strong className="font-semibold text-navy">
                    {chunks}
                  </strong>
                ),
              })}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-white/70 px-4 py-2 font-medium text-navy backdrop-blur-sm">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-electric to-cyan-ai text-sm font-bold text-white"
                  aria-hidden
                >
                  {quizCount}
                </span>
                {t("qcmPublished")}
              </span>
              <Link href="/cours" className="btn-primary !py-2.5">
                {t("startFreeQuiz")}
              </Link>
            </div>
          </div>
        </section>

        {/* Langues — article partie gratuite */}
        <section
          className="relative mt-14 overflow-hidden rounded-[24px] border border-border-soft bg-white/[0.74] px-6 py-8 shadow-md backdrop-blur-md sm:px-8"
          aria-labelledby="langues-gratuit-heading"
        >
          <div
            className="pointer-events-none absolute -end-16 -top-12 h-40 w-40 rounded-full bg-cyan-ai/10 blur-2xl"
            aria-hidden
          />
          <h2
            id="langues-gratuit-heading"
            className="relative text-lg font-bold text-navy sm:text-xl"
          >
            {ta("catalogTeaserTitle")}
          </h2>
          <p className="relative mt-2 max-w-2xl text-sm leading-relaxed text-muted-text sm:text-base">
            {ta("catalogTeaserBody")}
          </p>
          <Link
            href="/cours-gratuits-langues"
            className="btn-primary relative mt-4 inline-flex items-center !py-2.5"
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
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="brand-card p-5">
              <div className="brand-card-inner border-s-4 border-cyan-ai/40 ps-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-electric to-cyan-ai text-white shadow-md"
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
                <ul className="mt-4 space-y-4">
                  {CATALOG_LANGUAGE_MATIERES.map((m) => (
                    <li key={m} className="text-sm text-muted-text">
                      <div className="flex items-center gap-2 font-semibold text-navy">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brandblue" />
                        {t(
                          `matieres.${CATALOG_MATIERE_I18N_KEY[m]}` as Parameters<
                            typeof t
                          >[0],
                        )}
                      </div>
                      <ul className="ms-5 mt-2 space-y-1 border-s border-brandblue/25 ps-3">
                        {LANGUAGE_LEVEL_KEYS.map((lv) => (
                          <li
                            key={`${m}-${lv}`}
                            className="text-xs leading-relaxed text-muted-text"
                          >
                            {t(
                              `langLevels.${lv}` as Parameters<typeof t>[0],
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="brand-card p-5">
              <div className="brand-card-inner border-s-4 border-cyan-ai/40 ps-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-brandblue text-white shadow-md"
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
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2-4H3m18 4h2m-2 4h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      />
                    </svg>
                  </span>
                  {t("stemSectionTitle")}
                </h3>
                <ul className="mt-4 space-y-4">
                  {CATALOG_STEM_MATIERES.map((m) => (
                    <li key={m} className="text-sm text-muted-text">
                      <div className="flex items-center gap-2 font-semibold text-navy">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                        {t(
                          `matieres.${CATALOG_STEM_MATIERE_I18N_KEY[m]}` as Parameters<
                            typeof t
                          >[0],
                        )}
                      </div>
                      <ul className="ms-5 mt-2 space-y-1 border-s border-violet-400/35 ps-3">
                        {STEM_LEVEL_KEYS.map((lv) => (
                          <li
                            key={`${m}-${lv}`}
                            className="text-xs leading-relaxed text-muted-text"
                          >
                            {t(
                              `niveaux.${NIVEAU_CATALOG_I18N_KEY[lv]}` as Parameters<
                                typeof t
                              >[0],
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="brand-card p-5">
              <div className="brand-card-inner border-s-4 border-cyan-ai/40 ps-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-navy">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-premium to-electric text-white shadow-md"
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
                      className="flex items-center gap-2 text-sm text-muted-text"
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
                <p className="mt-4 text-sm leading-relaxed text-muted-text">
                  {t("chapterHint")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz populaires */}
        {popular.length > 0 ? (
          <section className="mt-14" aria-labelledby="popular-quiz-heading">
            <h2 id="popular-quiz-heading" className="text-xl font-bold text-navy">
              {t("popularTitle")}
            </h2>
            <p className="mt-1 text-sm text-muted-text">{t("popularSubtitle")}</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popular.map((q) => (
                <li key={q.id}>
                  <Link
                    href={`/quiz/${q.id}`}
                    className="card-elevated flex h-full flex-col rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span className="text-xs font-bold uppercase tracking-wide text-brandblue">QCM</span>
                    <h3 className="mt-2 font-bold text-navy">{q.title}</h3>
                    <p className="mt-2 text-xs text-muted-text">
                      {q.matiere} · {q.niveau}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-brandblue">{t("startFreeQuiz")} →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Liste QCM */}
        <section className="mt-16" aria-labelledby="liste-qcm-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="liste-qcm-heading"
                className="text-xl font-bold tracking-tight text-navy sm:text-2xl"
              >
                {t("listTitle")}
              </h2>
              <p className="mt-1 text-sm text-muted-text">
                {t("listSubtitle")}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <PublicQuizCatalog groups={groups} />
          </div>
        </section>

        <CtaPremiumSection
          className="mt-16"
          title={t("ctaTitle")}
          subtitle={t("ctaBody")}
          primaryHref="/connexion"
          primaryLabel={t("ctaLogin")}
          secondaryHref="/inscription"
          secondaryLabel={t("ctaSignup")}
        />
    </PublicPageShell>
  );
}
