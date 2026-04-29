import { DashboardNav, type NavItem } from "@/components/dashboard-nav";

export type { NavItem };

type Accent = "teal" | "indigo" | "amber";

const asideAccent: Record<Accent, string> = {
  teal: "border-t-[3px] border-t-brandblue/60 md:border-t-0 md:border-l-[3px] md:border-l-brandblue/60 dark:border-t-brandblue/50 dark:md:border-l-brandblue/50",
  indigo:
    "border-t-[3px] border-t-navy/60 md:border-t-0 md:border-l-[3px] md:border-l-navy/60 dark:border-t-brandblue/50 dark:md:border-l-brandblue/50",
  amber:
    "border-t-[3px] border-t-gold/60 md:border-t-0 md:border-l-[3px] md:border-l-gold/60 dark:border-t-gold/50 dark:md:border-l-gold/50",
};

const headerAccent: Record<Accent, string> = {
  teal: "from-white via-white to-brandblue/[0.07] dark:from-slate-900 dark:via-slate-900 dark:to-brandblue/[0.08]",
  indigo:
    "from-white via-white to-navy/[0.06] dark:from-slate-900 dark:via-slate-900 dark:to-navy/25",
  amber:
    "from-white via-white to-gold/[0.08] dark:from-slate-900 dark:via-slate-900 dark:to-gold/[0.06]",
};

type DashboardShellProps = {
  title: string;
  subtitle?: string;
  nav: NavItem[];
  accent: Accent;
  children: React.ReactNode;
};

export function DashboardShell({
  title,
  subtitle,
  nav,
  accent,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-h))] flex-col md:flex-row">
      <aside
        className={`border-b border-navy/8 bg-gradient-to-b from-white/95 to-slate-50/90 px-3 py-6 dark:border-slate-800/90 dark:from-slate-950/90 dark:to-slate-900/80 md:w-64 md:border-b-0 md:border-r md:border-navy/8 md:bg-gradient-to-b md:from-white/90 md:to-brandblue/[0.04] md:dark:from-slate-950 md:dark:to-slate-900/90 ${asideAccent[accent]} md:pt-7`}
      >
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-navy/70 dark:text-gold/80">
          Navigation
        </p>
        <DashboardNav nav={nav} accent={accent} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col bg-[var(--background)]">
        <header
          className={`relative overflow-hidden border-b border-navy/10 bg-gradient-to-br px-6 py-7 dark:border-slate-800/80 ${headerAccent[accent]}`}
        >
          <div
            className="pointer-events-none absolute -end-16 -top-12 h-40 w-40 rounded-full bg-brandblue/10 blur-3xl dark:bg-brandblue/8"
            aria-hidden
          />
          <div className="relative">
            <h1 className="text-2xl font-extrabold tracking-tight text-navy dark:text-white md:text-[1.65rem]">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {subtitle}
              </p>
            ) : null}
          </div>
        </header>
        <main className="flex-1 px-6 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
