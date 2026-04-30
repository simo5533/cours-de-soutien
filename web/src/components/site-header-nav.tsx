"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { logoutAction } from "@/actions/logout";
import { LanguageSwitcher } from "@/components/language-switcher";

type HeaderUser = {
  name?: string | null;
  role: string;
};

function navLinkClass(activeMobile?: boolean) {
  return (
    "rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-white/10 hover:text-gold " +
    (activeMobile
      ? "text-white border border-white/15 bg-white/5"
      : "text-white/90")
  );
}

export function SiteHeaderNav({ user }: { user: HeaderUser | null }) {
  const t = useTranslations("SiteHeader");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const langAnchor = `/${locale}#langues-vivantes`;

  return (
    <>
      <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
        <LanguageSwitcher variant="icon" />

        <nav
          className="hidden flex-wrap items-center gap-1 md:flex lg:gap-2"
          aria-label="Principal"
        >
          <a href={langAnchor} className={navLinkClass()}>
            {t("languages")}
          </a>
          <Link href="/blog" className={navLinkClass()}>
            {t("blog")}
          </Link>
          <Link href="/cours" className={navLinkClass()}>
            {t("catalog")}
          </Link>
          <Link href="/cours-gratuits-langues" className={navLinkClass()}>
            {t("freeLangCourses")}
          </Link>
          {user ? (
            <>
              <Link
                href={
                  user.role === "ELEVE"
                    ? "/eleve"
                    : user.role === "PROFESSEUR"
                      ? "/professeur"
                      : "/admin"
                }
                className={navLinkClass()}
              >
                {t("mySpace")}
              </Link>
              <span className="hidden max-w-[140px] truncate text-sm text-white/70 lg:inline">
                {user.name}
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
              <Link href="/connexion" className={navLinkClass()}>
                {t("login")}
              </Link>
              <Link href="/inscription" className="btn-primary !py-2 !text-sm">
                {t("signup")}
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-white transition hover:bg-white/10 md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-site-nav"
          aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? (
            <svg
              className="h-6 w-6 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 bg-black/40 md:hidden"
            aria-hidden
            tabIndex={-1}
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-site-nav"
            className="fixed left-0 right-0 top-[var(--header-h)] z-[60] border-b border-gold/25 bg-navy px-4 py-4 shadow-xl md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Principal mobile">
              <a
                href={langAnchor}
                className={navLinkClass(true)}
                onClick={() => setMobileOpen(false)}
              >
                {t("languages")}
              </a>
              <Link
                href="/blog"
                className={navLinkClass(true)}
                onClick={() => setMobileOpen(false)}
              >
                {t("blog")}
              </Link>
              <Link
                href="/cours"
                className={navLinkClass(true)}
                onClick={() => setMobileOpen(false)}
              >
                {t("catalog")}
              </Link>
              <Link
                href="/cours-gratuits-langues"
                className={navLinkClass(true)}
                onClick={() => setMobileOpen(false)}
              >
                {t("freeLangCourses")}
              </Link>
              {user ? (
                <>
                  <Link
                    href={
                      user.role === "ELEVE"
                        ? "/eleve"
                        : user.role === "PROFESSEUR"
                          ? "/professeur"
                          : "/admin"
                    }
                    className={navLinkClass(true)}
                    onClick={() => setMobileOpen(false)}
                  >
                    {t("mySpace")}
                  </Link>
                  {user.name ? (
                    <span className="truncate px-3 py-1 text-xs text-white/60">
                      {user.name}
                    </span>
                  ) : null}
                  <form action={logoutAction} className="pt-1">
                    <button
                      type="submit"
                      className="w-full rounded-lg border border-white/25 bg-white/5 px-3 py-2.5 text-left text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      {t("logout")}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/connexion"
                    className={navLinkClass(true)}
                    onClick={() => setMobileOpen(false)}
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/inscription"
                    className="btn-primary mt-1 text-center !py-2.5 !text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t("signup")}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </>
      ) : null}
    </>
  );
}
