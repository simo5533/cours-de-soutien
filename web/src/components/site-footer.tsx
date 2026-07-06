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
    <footer className="mt-auto border-t border-white/10 bg-[#061B4E] text-[#F8FBFF]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-3 py-8 sm:gap-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="max-w-sm">
            <Image
              src="/brand/correcteurplus-logo.png"
              alt="CorrecteurPlus"
              width={200}
              height={56}
              className="footer-brand-logo h-9 w-auto object-contain object-left sm:h-10"
            />
            <p className="mt-3 text-sm leading-relaxed text-[#F8FBFF]/75">
              {t("tagline")}
            </p>
            <Link
              href="/inscription"
              className="mt-4 inline-flex w-full justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 sm:mt-5 sm:w-auto"
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
                className="inline-flex min-h-[40px] items-center font-medium text-[#F8FBFF]/75 transition hover:text-cyan-ai sm:min-h-0"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-[#F8FBFF]/55 sm:flex-row sm:items-center sm:justify-between">
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
