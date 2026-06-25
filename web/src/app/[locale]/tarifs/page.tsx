import { PricingSection } from "@/components/pricing-section";
import { PublicPageShell } from "@/components/public-page-shell";
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
    <PublicPageShell>
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
    </PublicPageShell>
  );
}
