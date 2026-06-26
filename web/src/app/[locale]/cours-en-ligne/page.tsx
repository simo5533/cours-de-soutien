import { CoursEnLigneDemandeForm } from "@/components/cours-en-ligne-demande-form";
import { PublicPageShell } from "@/components/public-page-shell";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

type PageProps = { params: Promise<{ locale: string }> };

export default async function CoursEnLignePublicPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("CoursEnLignePage");

  return (
    <PublicPageShell>
      <Link href="/" className="text-sm font-medium text-electric hover:underline">
        ← {t("backHome")}
      </Link>

      <header className="mt-6 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-brandblue">
          {t("eyebrow")}
        </p>
        <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-text">
          {t("intro")}
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-3" aria-label={t("stepsTitle")}>
        {[
          { n: "1", title: t("step1Title"), desc: t("step1Desc") },
          { n: "2", title: t("step2Title"), desc: t("step2Desc") },
          { n: "3", title: t("step3Title"), desc: t("step3Desc") },
        ].map((s) => (
          <div
            key={s.n}
            className="card-elevated rounded-2xl p-5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-electric to-cyan-ai text-sm font-bold text-white">
              {s.n}
            </span>
            <h2 className="mt-3 font-semibold text-navy dark:text-white">{s.title}</h2>
            <p className="mt-2 text-sm text-muted-text">{s.desc}</p>
          </div>
        ))}
      </section>

      <ul className="mt-8 grid gap-2 text-sm text-muted-text sm:grid-cols-3">
        <li className="flex items-center gap-2"><span className="text-success">✓</span> {t("bullet1")}</li>
        <li className="flex items-center gap-2"><span className="text-success">✓</span> {t("bullet2")}</li>
        <li className="flex items-center gap-2"><span className="text-success">✓</span> {t("bullet3")}</li>
      </ul>

      <div className="mt-10">
        <CoursEnLigneDemandeForm />
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        {t("alreadyAccount")}{" "}
        <Link href="/connexion" className="font-semibold text-brandblue hover:underline">
          {t("login")}
        </Link>
      </p>
    </PublicPageShell>
  );
}
