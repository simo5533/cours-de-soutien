import { SiteHeader } from "@/components/site-header";
import { CoursEnLigneDemandeForm } from "@/components/cours-en-ligne-demande-form";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

type PageProps = { params: Promise<{ locale: string }> };

export default async function CoursEnLignePublicPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("CoursEnLignePage");

  return (
    <>
      <SiteHeader />
      <main className="page-bg mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/"
          className="text-sm font-medium text-brandblue hover:underline"
        >
          ← {t("backHome")}
        </Link>

        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brandblue">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy dark:text-white sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {t("intro")}
          </p>
        </header>

        <section className="mt-10 grid gap-6 sm:grid-cols-3" aria-label={t("stepsTitle")}>
          {[
            { n: "1", title: t("step1Title"), desc: t("step1Desc") },
            { n: "2", title: t("step2Title"), desc: t("step2Desc") },
            { n: "3", title: t("step3Title"), desc: t("step3Desc") },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 dark:border-slate-700 dark:bg-slate-900/40"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                {s.n}
              </span>
              <h2 className="mt-3 font-semibold text-navy dark:text-white">
                {s.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {s.desc}
              </p>
            </div>
          ))}
        </section>

        <ul className="mt-8 space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>✓ {t("bullet1")}</li>
          <li>✓ {t("bullet2")}</li>
          <li>✓ {t("bullet3")}</li>
        </ul>

        <div className="mt-10">
          <CoursEnLigneDemandeForm />
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          {t("alreadyAccount")}{" "}
          <Link href="/connexion" className="font-semibold text-brandblue hover:underline">
            {t("login")}
          </Link>
          {" · "}
          <Link href="/inscription" className="font-semibold text-brandblue hover:underline">
            {t("signup")}
          </Link>
        </p>
      </main>
    </>
  );
}
