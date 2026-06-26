"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { logoutAction } from "@/actions/logout";
import { LanguageSwitcher } from "@/components/language-switcher";

type HeaderUser = {
  name?: string | null;
  role: string;
};

function navLinkClass(activeMobile?: boolean) {
  return (
    "rounded-full px-3 py-2 text-sm font-medium transition " +
    (activeMobile
      ? "bg-electric/10 text-navy"
      : "text-navy/80 hover:bg-background-secondary hover:text-navy")
  );
}

export function SiteHeaderNav({ user }: { user: HeaderUser | null }) {
  const t = useTranslations("SiteHeader");
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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navItems = (
    <>
      <Link href="/inscription" className={navLinkClass()}>
        {t("correctionAi")}
      </Link>
      <Link href="/cours-en-ligne" className={navLinkClass()}>
        {t("teacherLive")}
      </Link>
      <Link href="/cours" className={navLinkClass()}>
        {t("quizFree")}
      </Link>
      <Link href="/tarifs" className={navLinkClass()}>
        {t("pricing")}
      </Link>
    </>
  );

  return (
    <>
      <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
        <LanguageSwitcher variant="icon" />

        <nav
          className="hidden flex-wrap items-center gap-1 md:flex lg:gap-2"
          aria-label="Principal"
        >
          {navItems}
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
              <span className="hidden max-w-[140px] truncate text-sm text-muted-text lg:inline">
                {user.name}
              </span>
              <form action={logoutAction} className="inline">
                <button
                  type="submit"
                  className="rounded-full border border-border-soft bg-white/50 px-3 py-2 text-sm font-medium text-navy transition hover:bg-background-secondary"
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
                {t("tryFree")}
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full p-2 text-navy transition hover:bg-background-secondary md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-site-nav"
          aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? (
            <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-site-nav"
          className="fixed inset-0 top-[var(--header-h)] z-[60] flex flex-col bg-white/97 px-4 py-6 backdrop-blur-xl md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <nav className="flex flex-col gap-2" aria-label="Principal mobile">
            <Link href="/inscription" className={navLinkClass(true)} onClick={() => setMobileOpen(false)}>
              {t("correctionAi")}
            </Link>
            <Link
              href="/cours-en-ligne"
              className={navLinkClass(true)}
              onClick={() => setMobileOpen(false)}
            >
              {t("teacherLive")}
            </Link>
            <Link href="/cours" className={navLinkClass(true)} onClick={() => setMobileOpen(false)}>
              {t("quizFree")}
            </Link>
            <Link href="/tarifs" className={navLinkClass(true)} onClick={() => setMobileOpen(false)}>
              {t("pricing")}
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
                  <span className="truncate px-3 py-1 text-xs text-muted-text">{user.name}</span>
                ) : null}
                <form action={logoutAction} className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-2xl border border-border-soft bg-white/60 px-3 py-3 text-left text-sm font-medium text-navy transition hover:bg-background-secondary"
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
                  className="btn-primary mt-2 text-center !py-3 !text-base"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("tryFree")}
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </>
  );
}
