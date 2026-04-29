import { auth } from "@/auth";
import { logoutAction } from "@/actions/logout";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getLocale, getTranslations } from "next-intl/server";

export async function SiteHeader() {
  const session = await auth();
  const t = await getTranslations("SiteHeader");
  const locale = await getLocale();

  return (
    <header className="sticky top-0 z-30 border-b border-gold/25 bg-navy text-white shadow-md shadow-navy/30">
      <div className="mx-auto flex h-[var(--header-h)] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 max-w-[min(100%,280px)] items-center gap-3 sm:max-w-none"
        >
          <img
            src="/methodix-logo.png"
            alt={t("brandTitle")}
            width={220}
            height={72}
            fetchPriority="high"
            decoding="async"
            className="h-9 w-auto max-h-9 shrink-0 object-contain object-left drop-shadow-sm"
          />
          <span className="hidden min-w-0 flex-col leading-tight md:flex">
            <span className="text-[11px] font-medium text-white/80">
              {t("brandSubtitle")}
            </span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
          <LanguageSwitcher variant="onDark" />
          <a
            href={`/${locale}#langues-vivantes`}
            className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-gold"
          >
            {t("languages")}
          </a>
          <Link
            href="/blog"
            className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-gold"
          >
            {t("blog")}
          </Link>
          <Link
            href="/cours"
            className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-gold"
          >
            {t("catalog")}
          </Link>
          {session?.user ? (
            <>
              <Link
                href={
                  session.user.role === "ELEVE"
                    ? "/eleve"
                    : session.user.role === "PROFESSEUR"
                      ? "/professeur"
                      : "/admin"
                }
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-gold"
              >
                {t("mySpace")}
              </Link>
              <span className="hidden max-w-[140px] truncate text-sm text-white/70 sm:inline">
                {session.user.name}
              </span>
              <form action={logoutAction} className="inline">
                <button
                  type="submit"
                  className="rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  {t("logout")}
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-gold"
              >
                {t("login")}
              </Link>
              <Link href="/inscription" className="btn-primary !py-2 !text-sm">
                {t("signup")}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
