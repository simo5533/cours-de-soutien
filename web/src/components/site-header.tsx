import Image from "next/image";
import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { SiteHeaderNav } from "@/components/site-header-nav";
import { getTranslations } from "next-intl/server";

export async function SiteHeader() {
  const session = await auth();
  const t = await getTranslations("SiteHeader");

  return (
    <header className="header-glass">
      <div className="relative mx-auto flex h-[var(--header-h)] max-w-6xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 max-w-[min(100%,200px)] items-center gap-2 sm:max-w-none sm:gap-3"
        >
          <Image
            src="/brand/correcteurplus-logo.png"
            alt={t("brandTitle")}
            width={240}
            height={72}
            priority
            className="h-8 w-auto max-h-8 shrink-0 object-contain object-left sm:h-10 sm:max-h-10"
          />
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
