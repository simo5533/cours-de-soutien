import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

type Accent = "teal" | "indigo" | "amber";

const accentTopBar: Record<Accent, string> = {
  teal: "from-brandblue to-navy",
  indigo: "from-navy to-brandblue",
  amber: "from-gold to-navy",
};

const accentHero: Record<
  Accent,
  { ring: string; glow: string; badge: string; pill: string; blur: string }
> = {
  teal: {
    ring: "ring-gold/20 dark:ring-gold/25",
    glow: "from-brandblue/[0.12] via-white to-transparent dark:from-brandblue/[0.18] dark:via-slate-900/80 dark:to-transparent",
    badge:
      "border border-brandblue/25 bg-brandblue/10 text-navy dark:border-brandblue/30 dark:bg-brandblue/15 dark:text-brandblue",
    pill: "bg-brandblue/12 text-navy ring-1 ring-brandblue/20 dark:bg-brandblue/15 dark:text-brandblue dark:ring-brandblue/25",
    blur: "bg-brandblue/20 dark:bg-brandblue/12",
  },
  indigo: {
    ring: "ring-gold/20 dark:ring-gold/25",
    glow: "from-navy/[0.08] via-white to-brandblue/[0.06] dark:from-navy/30 dark:via-slate-900 dark:to-brandblue/[0.08]",
    badge:
      "border border-navy/20 bg-navy/[0.06] text-navy dark:border-slate-600 dark:bg-navy/25 dark:text-white",
    pill: "bg-navy/10 text-navy ring-1 ring-navy/15 dark:bg-navy/30 dark:text-white dark:ring-navy/40",
    blur: "bg-navy/15 dark:bg-brandblue/10",
  },
  amber: {
    ring: "ring-gold/30 dark:ring-gold/25",
    glow: "from-gold/[0.15] via-white to-navy/[0.04] dark:from-gold/10 dark:via-slate-900 dark:to-navy/20",
    badge:
      "border border-gold/35 bg-gold/12 text-navy dark:border-gold/40 dark:bg-gold/15 dark:text-gold",
    pill: "bg-gold/12 text-navy ring-1 ring-gold/30 dark:bg-gold/18 dark:text-gold dark:ring-gold/35",
    blur: "bg-gold/25 dark:bg-gold/15",
  },
};

export function DashboardHero({
  accent,
  eyebrow,
  title,
  children,
}: {
  accent: Accent;
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  const a = accentHero[accent];
  const bar = accentTopBar[accent];
  return (
    <section className="brand-card relative overflow-hidden p-0 shadow-md">
      <div className={`h-1.5 w-full bg-gradient-to-r ${bar}`} aria-hidden />
      <div
        className={`pointer-events-none absolute end-0 top-8 h-40 w-40 rounded-full ${a.blur} blur-3xl`}
        aria-hidden
      />
      <div className="relative p-6 sm:p-7">
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.glow}`}
          aria-hidden
        />
        <div className="relative">
          <p
            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${a.badge}`}
          >
            {eyebrow}
          </p>
          <h2 className="mt-4 text-xl font-extrabold tracking-tight text-navy dark:text-white sm:text-2xl">
            {title}
          </h2>
          {children ? (
            <div className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function DashboardStatCard({
  label,
  value,
  hint,
  accent,
  icon,
}: {
  label: string;
  value: number | string;
  hint?: string;
  accent: Accent;
  icon?: ReactNode;
}) {
  const bar = accentTopBar[accent];
  const a = accentHero[accent];
  return (
    <div className="brand-card group relative overflow-hidden p-0 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/10 dark:hover:shadow-black/30">
      <div className={`h-1 w-full bg-gradient-to-r ${bar} opacity-90`} aria-hidden />
      <div className="relative p-5">
        <div
          className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full ${a.blur} opacity-50 blur-2xl`}
          aria-hidden
        />
        <div className="relative flex items-start justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-navy dark:text-gold/90">
            {label}
          </p>
          {icon ? (
            <span className="text-navy/50 opacity-90 dark:text-brandblue/80 [&>svg]:h-5 [&>svg]:w-5">
              {icon}
            </span>
          ) : null}
        </div>
        <p className="relative mt-2 text-3xl font-bold tabular-nums tracking-tight text-navy dark:text-white">
          {value}
        </p>
        {hint ? (
          <p className="relative mt-2 text-xs leading-snug text-slate-600 dark:text-slate-400">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function DashboardActionCard({
  href,
  title,
  description,
  accent,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  accent: Accent;
  icon: ReactNode;
}) {
  const bar = accentTopBar[accent];
  const a = accentHero[accent];
  return (
    <Link
      href={href}
      className="brand-card group relative flex flex-col overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/12 dark:hover:shadow-black/35"
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${bar}`} aria-hidden />
      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div
          className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${bar} text-white shadow-md shadow-navy/15`}
        >
          <span className="[&>svg]:h-6 [&>svg]:w-6">{icon}</span>
        </div>
        <h3 className="font-bold text-navy dark:text-white">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
        <span
          className={`mt-5 inline-flex w-fit items-center rounded-full px-3 py-1.5 text-sm font-semibold ${a.pill}`}
        >
          Ouvrir
          <svg
            className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
