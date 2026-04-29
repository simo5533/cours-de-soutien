import Image from "next/image";
import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { SiteHeaderNav } from "@/components/site-header-nav";
import { getTranslations } from "next-intl/server";

export async function SiteHeader() {
  const session = await auth();
  const t = await getTranslations("SiteHeader");

  return (
    <header className="sticky top-0 z-40 border-b border-gold/25 bg-navy text-white shadow-md shadow-navy/30">
      <div className="relative mx-auto flex h-[var(--header-h)] max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 max-w-[min(100%,260px)] items-center gap-2 sm:max-w-none sm:gap-3"
        >
          <Image
            src="/methodix-logo.png"
            alt={t("brandTitle")}
            width={220}
            height={72}
            priority
            className="h-8 w-auto max-h-8 shrink-0 object-contain object-left drop-shadow-sm sm:h-9 sm:max-h-9"
          />
          <span className="hidden min-w-0 flex-col leading-tight md:flex">
            <span className="text-[11px] font-medium text-white/80">
              {t("brandSubtitle")}
            </span>
          </span>
        </Link>
        <SiteHeaderNav
          user={
            session?.user
              ? {
                  name: session.user.name,
                  role: session.user.role ?? "",
                }
              : null
          }
        />
      </div>
    </header>
  );
}
