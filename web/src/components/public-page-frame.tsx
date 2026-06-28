import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/** Pages publiques avec header + footer, sans contrainte max-w-6xl sur le main */
export function PublicPageFrame({
  children,
  mainClassName = "page-bg page-x mx-auto flex w-full max-w-6xl flex-1 flex-col pb-12 pb-safe pt-6 sm:pb-16 sm:pt-12",
}: {
  children: React.ReactNode;
  mainClassName?: string;
}) {
  return (
    <div className="site-bg flex min-h-full flex-col">
      <SiteHeader />
      <main className={mainClassName}>{children}</main>
      <SiteFooter />
    </div>
  );
}
