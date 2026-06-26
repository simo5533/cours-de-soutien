import Image from "next/image";
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
    <footer className="mt-auto border-t border-white/10 bg-navy text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Image
              src="/brand/correcteurplus-logo.png"
              alt="CorrecteurPlus"
              width={200}
              height={56}
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {t("tagline")}
            </p>
            <Link
              href="/inscription"
              className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
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
                className="font-medium text-white/70 transition hover:text-cyan-ai"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/connexion" className="transition hover:text-cyan-ai">
              {t("contact")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
