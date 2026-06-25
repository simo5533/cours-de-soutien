import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations("SiteFooter");

  const links = [
    { href: "/inscription", label: t("correctionAi") },
    { href: "/cours-en-ligne", label: t("teacherLive") },
    { href: "/cours", label: t("quizFree") },
    { href: "/tarifs", label: t("pricing") },
    { href: "/blog", label: t("blog") },
    { href: "/cours-gratuits-langues", label: t("languages") },
    { href: "/connexion", label: t("contact") },
  ] as const;

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="text-lg font-bold text-navy dark:text-white">Methodix</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t("tagline")}
            </p>
            <Link href="/inscription" className="btn-primary mt-5 inline-flex text-sm">
              {t("ctaFree")}
            </Link>
          </div>
          <nav
            className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3"
            aria-label={t("navLabel")}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-medium text-slate-600 transition hover:text-navy dark:text-slate-400 dark:hover:text-brandblue"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/connexion" className="hover:text-navy dark:hover:text-brandblue">
              {t("contact")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
