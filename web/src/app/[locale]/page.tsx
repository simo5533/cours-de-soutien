import { PricingSection } from "@/components/pricing-section";
import {
  HomeHelpTypeCards,
  HomeHeroMockup,
  HomeHowItWorks,
  HomeTrustSection,
} from "@/components/home-landing-sections";
import { PublicPageShell } from "@/components/public-page-shell";
import { getMethodixHomeSeo } from "@/content/methodix-home-seo";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

type PageProps = { params: Promise<{ locale: string }> };

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");
  const seo = getMethodixHomeSeo(locale);

  const badges = [t("badgeFree"), t("badgeNoCard"), t("badgeMorocco"), t("badgeAiProf")] as const;

  return (
    <PublicPageShell>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-brandblue/15 bg-gradient-to-br from-slate-50 via-white to-brandblue/[0.08] px-6 py-12 shadow-sm dark:border-brandblue/10 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-navy/40 sm:px-10 sm:py-16 lg:pe-[22rem]">
        <div
          className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-brandblue/15 blur-3xl"
          aria-hidden
        />
        <div className="relative max-w-2xl">
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-brandblue/25 bg-white/90 px-3 py-1 text-xs font-semibold text-navy shadow-sm dark:border-brandblue/20 dark:bg-slate-900/80 dark:text-brandblue"
              >
                {b}
              </span>
            ))}
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-navy dark:text-white sm:text-5xl sm:leading-[1.1]">
            {seo.heroTitle}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-lg">
            {seo.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/inscription" className="btn-primary inline-flex justify-center px-8 py-3.5 text-base font-semibold shadow-lg shadow-navy/15">
              {t("ctaRegisterNow")}
            </Link>
            <a
              href="#comment-ca-marche"
              className="btn-secondary inline-flex justify-center px-8 py-3.5 text-base font-semibold"
            >
              {t("ctaHowItWorks")}
            </a>
          </div>
        </div>
        <HomeHeroMockup />
      </section>

      <div id="comment-ca-marche">
        <HomeHowItWorks />
      </div>

      <HomeHelpTypeCards />

      <HomeTrustSection />

      <div className="mt-20">
        <PricingSection
          title={t("pricingTitle")}
          subtitle={t("pricingSubtitle")}
          showValueProp={false}
          showSecondary={false}
          showCredits={false}
          showOneShot={false}
        />
        <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-slate-600 dark:text-slate-400">
          <Link href="/tarifs" className="font-semibold text-brandblue underline-offset-4 hover:underline">
            {t("pricingSeeAll")}
          </Link>
        </p>
        <div className="mt-8 text-center">
          <Link href="/inscription" className="btn-primary inline-flex px-8 py-3">
            {t("ctaFreeCorrections")}
          </Link>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-slate-500">
          {t("disclaimer")}
        </p>
      </div>

      {/* FAQ */}
      <section className="mt-20" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-center text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          {seo.faqTitle}
        </h2>
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200/80 bg-white dark:divide-slate-700 dark:border-slate-700/80 dark:bg-slate-900/40">
          {seo.faq.slice(0, 5).map((item) => (
            <details key={item.q} className="group px-4 py-1 first:pt-4 last:pb-4 sm:px-6">
              <summary className="cursor-pointer list-none py-3 text-start font-semibold text-slate-900 marker:content-none dark:text-white [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  <span>{item.q}</span>
                  <span className="mt-0.5 shrink-0 text-brandblue transition group-open:rotate-180">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </span>
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mt-20 overflow-hidden rounded-3xl border border-gold/25 bg-navy px-6 py-12 text-center text-white shadow-xl sm:px-10">
        <h2 className="text-2xl font-bold text-gold sm:text-3xl">{t("finalCtaTitle")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">{t("finalCtaSubtitle")}</p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/inscription" className="btn-primary inline-flex justify-center px-8 py-3.5 text-base shadow-lg">
            {t("ctaFreeCorrections")}
          </Link>
          <Link
            href="/connexion"
            className="inline-flex justify-center rounded-xl border border-white/25 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            {t("ctaLogin")}
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
