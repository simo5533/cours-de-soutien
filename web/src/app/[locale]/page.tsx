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

function HeroTitle({ title }: { title: string }) {
  const parts = title.split(/(IA|l'IA|الذكاء الاصطناعي)/);
  return (
    <h1 className="font-display mt-6 text-3xl font-extrabold tracking-tight text-navy sm:text-5xl sm:leading-[1.1]">
      {parts.map((part, i) =>
        /^(IA|l'IA|الذكاء الاصطناعي)$/.test(part) ? (
          <span key={i} className="text-gradient-ai">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </h1>
  );
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");
  const seo = getMethodixHomeSeo(locale);

  const badges = [t("badgeFree"), t("badgeNoCard"), t("badgeMorocco"), t("badgeAiProf")] as const;

  return (
    <PublicPageShell>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[24px] border border-border-soft bg-white/50 px-6 py-12 shadow-md shadow-electric/[0.06] backdrop-blur-md sm:px-10 sm:py-16 lg:pe-[24rem] xl:pe-[26rem]">
        <div
          className="pointer-events-none absolute -start-20 -top-20 h-64 w-64 rounded-full bg-cyan-ai/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -end-10 top-0 h-48 w-48 rounded-full bg-success/10 blur-3xl"
          aria-hidden
        />
        <div className="relative max-w-2xl">
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-border-soft bg-white/80 px-3 py-1 text-xs font-semibold text-navy shadow-sm backdrop-blur-sm"
              >
                {b}
              </span>
            ))}
          </div>
          <HeroTitle title={seo.heroTitle} />
          <p className="mt-5 text-base leading-relaxed text-muted-text sm:text-lg">
            {seo.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/inscription" className="btn-primary inline-flex justify-center px-8 py-3.5 text-base font-semibold">
              {t("ctaFreeCorrections")}
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
        <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-muted-text">
          <Link href="/tarifs" className="font-semibold text-electric underline-offset-4 hover:underline">
            {t("pricingSeeAll")}
          </Link>
        </p>
        <div className="mt-8 text-center">
          <Link href="/inscription" className="btn-primary inline-flex px-8 py-3">
            {t("ctaFreeCorrections")}
          </Link>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-muted-text">
          {t("disclaimer")}
        </p>
      </div>

      {/* FAQ */}
      <section className="mt-20" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="font-display text-center text-2xl font-bold text-navy sm:text-3xl">
          {seo.faqTitle}
        </h2>
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-border-soft rounded-[22px] border border-border-soft bg-white/60 backdrop-blur-md">
          {seo.faq.slice(0, 5).map((item) => (
            <details key={item.q} className="group px-4 py-1 first:pt-4 last:pb-4 sm:px-6">
              <summary className="cursor-pointer list-none py-3 text-start font-semibold text-navy marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  <span>{item.q}</span>
                  <span className="mt-0.5 shrink-0 text-electric transition group-open:rotate-180">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </span>
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-muted-text">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mt-20 overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-navy via-premium to-navy px-6 py-12 text-center text-white shadow-xl shadow-navy/20 sm:px-10">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          <span className="text-gradient-ai !bg-gradient-to-r !from-cyan-ai !to-white">{t("finalCtaTitle")}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/75">{t("finalCtaSubtitle")}</p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/inscription" className="btn-primary inline-flex justify-center px-8 py-3.5 text-base">
            {t("ctaFreeCorrections")}
          </Link>
          <Link
            href="/connexion"
            className="inline-flex justify-center rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/15"
          >
            {t("ctaLogin")}
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
