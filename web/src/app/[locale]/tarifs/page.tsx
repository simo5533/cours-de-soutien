import { SiteHeader } from "@/components/site-header";
import { PricingSection } from "@/components/pricing-section";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PricingPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function TarifsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PricingPage");

  return (
    <>
      <SiteHeader />
      <main className="page-bg mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="brand-section-title">{t("eyebrow")}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            {t("lead")}
          </p>
        </div>

        <div className="mt-12">
          <PricingSection
            title={t("sectionTitle")}
            subtitle={t("sectionSubtitle")}
            showValueProp
            showSecondary
            showCredits
            showOneShot
          />
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link href="/cours" className="btn-secondary">
            {t("ctaQuiz")}
          </Link>
          <Link href="/inscription" className="btn-primary">
            {t("ctaSignup")}
          </Link>
        </div>
      </main>
    </>
  );
}
