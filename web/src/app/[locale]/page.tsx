import { SiteHeader } from "@/components/site-header";
import { getMethodixHomeSeo } from "@/content/methodix-home-seo";
import { PLAN_HIERARCHY } from "@/config/methodix-plans.v2";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

const cards = [
  {
    key: "student" as const,
    bar: "from-brandblue to-navy",
    href: "/eleve",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    ),
    ring: "ring-brandblue/20 hover:ring-brandblue/35",
    iconBg: "from-brandblue to-navy",
    hrefStyle:
      "group-hover:text-navy dark:group-hover:text-brandblue",
  },
  {
    key: "teacher" as const,
    bar: "from-navy to-brandblue",
    href: "/professeur",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    ),
    ring: "ring-navy/20 hover:ring-navy/35",
    iconBg: "from-navy to-brandblue",
    hrefStyle:
      "group-hover:text-navy dark:group-hover:text-brandblue",
  },
  {
    key: "admin" as const,
    bar: "from-gold to-navy",
    href: "/admin",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
    ),
    ring: "ring-gold/40 hover:ring-gold/50",
    iconBg: "from-gold to-navy",
    hrefStyle:
      "group-hover:text-navy dark:group-hover:text-gold",
  },
] as const;

type PageProps = { params: Promise<{ locale: string }> };

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");
  const seo = getMethodixHomeSeo(locale);

  return (
    <>
      <SiteHeader />
      <main className="page-bg mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-brandblue/15 bg-gradient-to-br from-brandblue/15 via-slate-50/80 to-brandblue/10 px-6 py-12 shadow-sm dark:border-brandblue/10 dark:from-brandblue/10 dark:via-slate-900/60 dark:to-navy/40 sm:px-10 sm:py-16">
          <div
            className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-brandblue/20 blur-3xl dark:bg-brandblue/15"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -start-16 h-56 w-56 rounded-full bg-brandblue/15 blur-3xl dark:bg-navy/10"
            aria-hidden
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center rounded-full border border-navy/25 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy shadow-sm dark:border-brandblue/25 dark:bg-slate-900/70 dark:text-brandblue/90">
              {seo.badge}
            </p>
            <h1 className="mt-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl sm:leading-[1.1] dark:from-white dark:via-slate-100 dark:to-slate-400">
              {seo.heroTitle}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {seo.heroSubtitle}
            </p>
            <p className="mx-auto mt-4 max-w-xl rounded-xl border border-brandblue/20 bg-brandblue/5 px-4 py-3 text-sm font-medium text-navy dark:border-brandblue/20 dark:bg-brandblue/10 dark:text-brandblue/90">
              {seo.heroNote}
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/inscription"
                className="btn-primary inline-flex justify-center px-8 py-3.5 text-base font-semibold shadow-lg shadow-navy/20"
              >
                {t("ctaRegisterNow")}
              </Link>
              <Link
                href="/cours"
                className="btn-secondary inline-flex justify-center px-8 py-3.5 text-base font-semibold"
              >
                {t("ctaDiscover")}
              </Link>
            </div>
            <p className="mt-4 text-center">
              <a
                href="#langues-vivantes"
                className="text-sm font-semibold text-brandblue underline decoration-brandblue/30 underline-offset-4 transition hover:text-navy hover:decoration-navy dark:text-brandblue dark:hover:text-gold"
              >
                {t("ctaLanguagesLink")}
              </a>
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brandblue" />
                {seo.trust[0]}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brandblue" />
                {seo.trust[1]}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brandblue" />
                {seo.trust[2]}
              </span>
            </div>
          </div>
        </section>

        {/* Pourquoi Methodix */}
        <section className="mt-20" aria-labelledby="why-heading">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="why-heading"
              className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
            >
              {seo.whyTitle}
            </h2>
            <p className="mt-4 text-left text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-center">
              {seo.whyP1}
            </p>
            <p className="mt-4 text-left text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-center">
              {seo.whyP2}
            </p>
          </div>
        </section>

        {/* Matières (programme scolaire — distinct des langues vivantes) */}
        <section className="mt-20" aria-labelledby="subjects-heading">
          <div className="text-center">
            <p className="brand-section-title">{t("subjectsEyebrow")}</p>
            <h2
              id="subjects-heading"
              className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
            >
              {seo.subjectsTitle}
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {seo.subjects.map((s) => (
              <div
                key={s.title}
                className="card-elevated rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-700/80 dark:bg-slate-900/40"
              >
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Langues vivantes — bloc visuel isolé du programme matières */}
        <section
          id="langues-vivantes"
          className="relative mt-24 scroll-mt-[calc(var(--header-h)+1rem)] overflow-hidden rounded-3xl border border-navy/10 bg-gradient-to-br from-white via-white to-brandblue/[0.06] px-6 py-12 shadow-lg shadow-navy/[0.05] ring-1 ring-gold/15 dark:border-slate-700/80 dark:from-slate-900/90 dark:via-slate-900/75 dark:to-brandblue/[0.08] dark:shadow-black/25 dark:ring-gold/20 sm:px-10 sm:py-14"
          aria-labelledby="languages-heading"
        >
          <div
            className="pointer-events-none absolute -end-24 -top-20 h-72 w-72 rounded-full bg-brandblue/12 blur-3xl dark:bg-brandblue/10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -start-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl dark:bg-gold/8"
            aria-hidden
          />
          <div className="relative text-center">
            <p className="brand-section-title">{t("languagesEyebrow")}</p>
            <h2
              id="languages-heading"
              className="mt-3 text-2xl font-extrabold tracking-tight text-navy dark:text-white sm:text-3xl"
            >
              {t("languagesSectionTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-left text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-center">
              {t("languagesSectionIntro")}
            </p>
            <p className="mx-auto mt-4 max-w-3xl rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-left text-sm font-medium text-navy dark:border-gold/25 dark:bg-gold/10 dark:text-gold/95 sm:text-center">
              {t("languagesSeparateNote")}
            </p>
          </div>

          <div className="relative mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-navy/10 bg-white/90 p-5 dark:border-slate-600/80 dark:bg-slate-900/60 sm:p-6">
              <h3 className="text-base font-bold text-navy dark:text-white">
                {t("languagesWhoTitle")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {t("languagesWhoBody")}
              </p>
            </div>
            <div className="rounded-2xl border border-brandblue/20 bg-white/90 p-5 dark:border-brandblue/25 dark:bg-slate-900/60 sm:p-6">
              <h3 className="text-base font-bold text-navy dark:text-white">
                {t("languagesAgeTitle")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {t("languagesAgeBody")}
              </p>
            </div>
          </div>

          <div className="relative mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {(
              [
                { key: "french" as const, accent: "from-navy to-brandblue" },
                { key: "spanish" as const, accent: "from-brandblue to-navy" },
                { key: "english" as const, accent: "from-gold/90 to-navy" },
                { key: "englishUS" as const, accent: "from-brandblue via-navy to-brandblue" },
                { key: "german" as const, accent: "from-navy via-gold/70 to-navy" },
                { key: "chinese" as const, accent: "from-red-700/90 via-gold to-navy" },
              ] as const
            ).map((item) => (
              <div
                key={item.key}
                className="brand-card overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 dark:border-slate-700/80 dark:bg-slate-900/50"
              >
                <div
                  className={`h-1 w-full bg-gradient-to-r ${item.accent}`}
                  aria-hidden
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-bold text-navy dark:text-white">
                    {t(`languages.${item.key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {t(`languages.${item.key}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative mt-8 flex flex-col items-center gap-3">
            <Link href="/inscription" className="btn-primary px-8 py-3 text-base">
              {t("languagesCta")}
            </Link>
            <Link
              href="/cours-gratuits-langues"
              className="text-sm font-semibold text-brandblue underline decoration-brandblue/30 underline-offset-4 transition hover:text-navy hover:decoration-navy dark:text-brandblue dark:hover:text-gold"
            >
              {t("languagesFreeArticleLink")}
            </Link>
          </div>
        </section>

        {/* Services */}
        <section className="mt-20" aria-labelledby="services-heading">
          <div className="text-center">
            <p className="brand-section-title">{seo.serviceEyebrow}</p>
            <h2
              id="services-heading"
              className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
            >
              {seo.servicesTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              {seo.servicesSubtitle}
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                accent: "from-brandblue to-navy",
                title: seo.services[0].title,
                desc: seo.services[0].desc,
              },
              {
                accent: "from-navy to-brandblue",
                title: seo.services[1].title,
                desc: seo.services[1].desc,
              },
              {
                accent: "from-gold to-navy",
                title: seo.services[2].title,
                desc: seo.services[2].desc,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card-elevated flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-700/80 dark:bg-slate-900/40"
              >
                <div
                  className={`inline-flex w-fit rounded-xl bg-gradient-to-br ${item.accent} px-3 py-1 text-xs font-bold tracking-wide text-white shadow-md`}
                >
                  {t("svcCardBadge")}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Formules (sans prix) */}
        <section
          id="formules"
          className="mt-20"
          aria-labelledby="pricing-heading"
        >
          <div className="text-center">
            <h2
              id="pricing-heading"
              className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
            >
              {t("pricingTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              {t("pricingSubtitle")}
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {PLAN_HIERARCHY.map((planId) => {
              const ui =
                planId === "starter"
                  ? {
                      name: t("planStarterName"),
                      price: t("planStarterPrice"),
                      features: [t("planStarterF1"), t("planStarterF2"), t("planStarterF3")],
                      highlight: false,
                    }
                  : planId === "essential"
                    ? {
                        name: t("planEssentialName"),
                        price: t("planEssentialPrice"),
                        features: [
                          t("planEssentialF1"),
                          t("planEssentialF2"),
                          t("planEssentialF3"),
                        ],
                        highlight: true,
                      }
                    : planId === "bac_plus"
                      ? {
                          name: t("planBacPlusName"),
                          price: t("planBacPlusPrice"),
                          features: [
                            t("planBacPlusF1"),
                            t("planBacPlusF2"),
                            t("planBacPlusF3"),
                          ],
                          highlight: false,
                        }
                      : {
                          name: t("planFamilyName"),
                          price: t("planFamilyPrice"),
                          features: [
                            t("planFamilyF1"),
                            t("planFamilyF2"),
                            t("planFamilyF3"),
                          ],
                          highlight: false,
                        };

              return (
              <div
                key={planId}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  ui.highlight
                    ? "border-brandblue/50 bg-gradient-to-b from-brandblue/10 to-white shadow-xl shadow-navy/10 ring-2 ring-brandblue/30 dark:from-navy/50 dark:to-slate-900 dark:ring-brandblue/25"
                    : "border-slate-200/80 bg-white dark:border-slate-700 dark:bg-slate-900/40"
                }`}
              >
                {ui.highlight ? (
                  <span className="absolute -top-3 start-1/2 -translate-x-1/2 rounded-full bg-navy px-3 py-1 text-xs font-bold text-white shadow-md dark:bg-brandblue">
                    {t("planPopular")}
                  </span>
                ) : null}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {ui.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-brandblue dark:text-brandblue/90">
                  {ui.price}
                </p>
                <ul className="mt-5 flex flex-1 flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
                  {ui.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <svg
                        className="mt-0.5 h-5 w-5 shrink-0 text-brandblue dark:text-brandblue"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/inscription"
                  className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition ${
                    ui.highlight
                      ? "bg-navy text-white hover:bg-navy dark:bg-brandblue dark:hover:bg-brandblue/90"
                      : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                  }`}
                >
                  {t("planCta")}
                </Link>
              </div>
              );
            })}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-slate-500 dark:text-slate-500">
            {t("disclaimer")}
          </p>
        </section>

        {/* Correcteur IA */}
        <section className="mt-20" aria-labelledby="ai-heading">
          <div className="mx-auto max-w-3xl">
            <h2
              id="ai-heading"
              className="text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
            >
              {seo.aiTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {seo.aiP1}
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {seo.aiP2}
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {seo.aiP3}
            </p>
          </div>
        </section>

        {/* Espaces plateforme — même esprit que le catalogue */}
        <section
          className="relative mt-20 overflow-hidden rounded-3xl border border-navy/10 bg-gradient-to-br from-white via-white to-brandblue/[0.06] px-6 py-12 shadow-lg shadow-navy/[0.05] ring-1 ring-gold/15 dark:border-slate-700/80 dark:from-slate-900/90 dark:via-slate-900/75 dark:to-brandblue/[0.08] dark:shadow-black/25 dark:ring-gold/20 sm:px-10 sm:py-14"
          aria-labelledby="spaces-heading"
        >
          <div
            className="pointer-events-none absolute -end-24 -top-20 h-72 w-72 rounded-full bg-brandblue/12 blur-3xl dark:bg-brandblue/10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -start-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl dark:bg-gold/8"
            aria-hidden
          />
          <div className="relative text-center">
            <p className="brand-section-title">{t("spacesEyebrow")}</p>
            <h2
              id="spaces-heading"
              className="mt-3 text-2xl font-extrabold tracking-tight text-navy dark:text-white sm:text-3xl"
            >
              {t("spacesSectionTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              {t("spacesSectionSubtitle")}
            </p>
          </div>
          <div className="relative mt-10 grid gap-6 sm:grid-cols-3">
            {cards.map((e) => (
              <Link
                key={e.key}
                href={e.href}
                className={`group brand-card flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/12 dark:hover:shadow-black/40 ${e.ring}`}
              >
                <div
                  className={`h-1.5 w-full bg-gradient-to-r ${e.bar}`}
                  aria-hidden
                />
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <span
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${e.iconBg} text-white shadow-lg shadow-navy/20`}
                    aria-hidden
                  >
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {e.icon}
                    </svg>
                  </span>
                  <h3
                    className={`mt-5 text-lg font-bold text-slate-900 transition dark:text-white ${e.hrefStyle}`}
                  >
                    {t(`spaces.${e.key}.title`)}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {t(`spaces.${e.key}.desc`)}
                  </p>
                  <span className="mt-6 inline-flex items-center rounded-full bg-brandblue/10 px-3 py-1.5 text-sm font-semibold text-navy transition group-hover:bg-brandblue/18 dark:bg-brandblue/15 dark:text-brandblue dark:group-hover:bg-brandblue/25">
                    {t("cardCta")}
                    <svg
                      className="ms-1.5 h-4 w-4 transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-20" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
          >
            {seo.faqTitle}
          </h2>
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200/80 bg-white dark:divide-slate-700 dark:border-slate-700/80 dark:bg-slate-900/40">
            {seo.faq.map((item) => (
              <details
                key={item.q}
                className="group px-4 py-1 first:pt-4 last:pb-4 sm:px-6"
              >
                <summary className="cursor-pointer list-none py-3 text-start font-semibold text-slate-900 marker:content-none dark:text-white [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-3">
                    <span>{item.q}</span>
                    <span className="mt-0.5 shrink-0 text-brandblue transition group-open:rotate-180">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </span>
                </summary>
                <p className="pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="mt-20 overflow-hidden rounded-3xl border border-gold/25 bg-navy px-6 py-12 text-center text-white shadow-xl sm:px-10">
          <h2 className="text-2xl font-bold text-gold sm:text-3xl">{t("finalCtaTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            {t("finalCtaSubtitle")}
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/inscription"
              className="btn-primary inline-flex justify-center px-8 py-3.5 text-base shadow-lg"
            >
              {t("finalCtaButton")}
            </Link>
            <Link
              href="/connexion"
              className="inline-flex justify-center rounded-xl border border-white/25 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              {t("ctaLogin")}
            </Link>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/cours" className="btn-secondary">
            {t("ctaCatalog")}
          </Link>
        </div>
      </main>
    </>
  );
}
