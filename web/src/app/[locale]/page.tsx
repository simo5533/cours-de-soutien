import { CtaPremiumSection } from "@/components/cta-premium-section";
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
    <h1 className="font-display mt-4 text-2xl font-extrabold leading-tight tracking-tight text-navy sm:mt-6 sm:text-3xl sm:leading-[1.15] md:text-5xl md:leading-[1.1]">
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
      <section className="relative overflow-hidden rounded-2xl border border-border-soft bg-white/50 px-4 py-8 shadow-md shadow-electric/[0.06] backdrop-blur-md sm:rounded-[24px] sm:px-10 sm:py-16 lg:pe-[24rem] xl:pe-[26rem]">
        <div
          className="pointer-events-none absolute -start-20 -top-20 h-64 w-64 rounded-full bg-cyan-ai/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -end-10 top-0 h-48 w-48 rounded-full bg-success/10 blur-3xl"
          aria-hidden
        />
        <div className="relative max-w-2xl">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {badges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-border-soft bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold leading-snug text-navy shadow-sm backdrop-blur-sm sm:px-3 sm:py-1 sm:text-xs"
              >
                {b}
              </span>
            ))}
          </div>
          <HeroTitle title={seo.heroTitle} />
          <p className="mt-4 text-sm leading-relaxed text-muted-text sm:mt-5 sm:text-base md:text-lg">
            {seo.heroSubtitle}
          </p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link href="/inscription" className="btn-primary inline-flex w-full justify-center px-6 py-3.5 text-sm font-semibold sm:w-auto sm:px-8 sm:text-base">
              {t("ctaFreeCorrections")}
            </Link>
            <a
              href="#comment-ca-marche"
              className="btn-secondary inline-flex w-full justify-center px-6 py-3.5 text-sm font-semibold sm:w-auto sm:px-8 sm:text-base"
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

      <div className="section-stack">
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
        <div className="mt-6 text-center sm:mt-8">
          <Link href="/inscription" className="btn-primary inline-flex w-full justify-center px-6 py-3 text-sm sm:w-auto sm:px-8 sm:text-base">
            {t("ctaFreeCorrections")}
          </Link>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-muted-text">
          {t("disclaimer")}
        </p>
      </div>

      {/* FAQ */}
      <section className="section-stack" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="font-display text-center text-xl font-bold text-navy sm:text-2xl md:text-3xl">
          {seo.faqTitle}
        </h2>
        <div className="mx-auto mt-6 max-w-3xl divide-y divide-border-soft rounded-2xl border border-border-soft bg-white/60 backdrop-blur-md sm:mt-10 sm:rounded-[22px]">
          {seo.faq.slice(0, 5).map((item) => (
            <details key={item.q} className="group px-3 py-1 first:pt-3 last:pb-3 sm:px-6 sm:first:pt-4 sm:last:pb-4">
              <summary className="cursor-pointer list-none py-3 text-start text-sm font-semibold text-navy marker:content-none sm:text-base [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0 flex-1">{item.q}</span>
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

      <CtaPremiumSection
        title={t("finalCtaTitle")}
        subtitle={t("finalCtaSubtitle")}
        primaryHref="/inscription"
        primaryLabel={t("ctaFreeCorrections")}
        secondaryHref="/connexion"
        secondaryLabel={t("ctaLogin")}
      />
    </PublicPageShell>
  );
}
