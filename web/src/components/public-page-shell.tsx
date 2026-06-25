import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function PublicPageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="page-bg mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
