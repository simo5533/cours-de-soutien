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
    <footer className="site-footer mt-auto text-navy">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-3 py-8 sm:gap-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="max-w-sm">
            <p className="text-sm font-semibold leading-relaxed text-navy">
              CorrecteurPlus
            </p>
            <p className="mt-2 text-sm leading-relaxed text-navy/75">
              {t("tagline")}
            </p>
            <Link
              href="/inscription"
              className="btn-primary mt-4 inline-flex w-full justify-center sm:mt-5 sm:w-auto"
            >
              {t("ctaFree")}
            </Link>
          </div>
          <nav
            className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm sm:grid-cols-2 md:grid-cols-3 sm:gap-x-8 sm:gap-y-3"
            aria-label={t("navLabel")}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex min-h-[40px] items-center font-medium text-navy/80 transition hover:text-electric sm:min-h-0"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-3 border-t border-navy/10 pt-5 text-xs text-navy/55 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/connexion" className="transition hover:text-electric">
              {t("contact")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
