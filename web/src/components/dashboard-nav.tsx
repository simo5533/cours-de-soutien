"use client";

import { Link, usePathname } from "@/i18n/navigation";

export type NavItem = { href: string; label: string };

type Accent = "teal" | "indigo" | "amber";

const activeByAccent: Record<Accent, string> = {
  teal: "border-l-brandblue bg-brandblue/[0.08] text-slate-900 dark:border-l-brandblue dark:bg-brandblue/10 dark:text-white",
  indigo:
    "border-l-navy bg-navy/[0.08] text-slate-900 dark:border-l-brandblue dark:bg-navy/10 dark:text-white",
  amber:
    "border-l-gold bg-gold/[0.1] text-slate-900 dark:border-l-gold dark:bg-gold/15 dark:text-white",
};

export function DashboardNav({
  nav,
  accent,
}: {
  nav: NavItem[];
  accent: Accent;
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (pathname === href) return true;
    const sectionRoots = ["/eleve", "/professeur", "/admin"];
    if (sectionRoots.includes(href)) return false;
    return pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="flex flex-col gap-0.5">
      {nav.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-r-lg border-l-[3px] border-transparent px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100/90 hover:text-slate-950 dark:hover:bg-slate-800/80 dark:hover:text-white ${
              active ? activeByAccent[accent] : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
