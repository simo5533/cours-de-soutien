import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

function StepIcon({ children, variant = "blue" }: { children: React.ReactNode; variant?: "blue" | "cyan" | "green" }) {
  const bg =
    variant === "green"
      ? "from-success to-emerald-400"
      : variant === "cyan"
        ? "from-cyan-ai to-electric"
        : "from-electric to-premium";
  return (
    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${bg} text-white shadow-md shadow-electric/20`}>
      {children}
    </span>
  );
}

export async function HomeHeroMockup() {
  const t = await getTranslations("HomePage");

  return (
    <div className="relative mx-auto mt-8 max-w-sm sm:mt-10 sm:max-w-lg lg:absolute lg:end-6 lg:top-1/2 lg:mt-0 lg:max-w-[420px] lg:-translate-y-1/2 xl:end-10">
      <div
        className="pointer-events-none absolute -inset-4 rounded-[32px] bg-gradient-to-br from-cyan-ai/25 via-electric/10 to-success/10 blur-2xl"
        aria-hidden
      />
      <div className="glass-card relative overflow-hidden p-4 sm:p-5">
        <div className="absolute end-4 top-12 flex items-center gap-1.5 rounded-full border border-cyan-ai/30 bg-cyan-ai/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-premium sm:top-4">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-ai" />
          {t("mockupBadgeAi")}
        </div>

        <div className="relative mt-6 rounded-2xl border border-border-soft bg-gradient-to-br from-white/90 to-background-secondary/80 p-4 shadow-inner">
          <div className="absolute -end-1 -top-1 rotate-3 rounded-lg bg-white px-2 py-0.5 text-[10px] font-medium text-muted-text shadow-sm">
            {t("mockupBadgeExercise")}
          </div>
          <div className="space-y-2.5 pt-2">
            <div className="h-2 w-3/4 rounded-full bg-navy/10" />
            <div className="h-2 w-full rounded-full bg-navy/10" />
            <div className="h-2 w-5/6 rounded-full bg-navy/10" />
            <div className="mt-3 space-y-1.5 border-s-2 border-success/40 ps-3">
              <div className="h-1.5 w-full rounded-full bg-success/20" />
              <div className="h-1.5 w-4/5 rounded-full bg-success/15" />
            </div>
            <div className="h-2 w-2/3 rounded-full bg-navy/10" />
          </div>

          <div className="absolute bottom-3 start-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-electric/30 bg-white shadow-lg shadow-electric/15">
            <span className="text-sm font-extrabold text-gradient-ai">A+</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-success/25 bg-success/10 p-3">
          <div className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success text-white">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold text-navy">{t("mockupStep2")}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-text">{t("mockupCorrection")}</p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-xs font-medium text-electric">{t("mockupStep3")}</p>
      </div>
    </div>
  );
}

export async function HomeHowItWorks() {
  const t = await getTranslations("HomePage");
  const steps = ["step1", "step2", "step3", "step4"] as const;
  const icons = [
    <svg key="1" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    <svg key="2" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    <svg key="3" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    <svg key="4" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  ];
  const variants: ("blue" | "cyan" | "green")[] = ["blue", "cyan", "green", "blue"];

  return (
    <section className="section-stack" aria-labelledby="how-heading">
      <div className="text-center">
        <p className="brand-section-title">{t("howEyebrow")}</p>
        <h2 id="how-heading" className="font-display mt-2 text-2xl font-bold text-navy sm:text-3xl">
          {t("howTitle")}
        </h2>
      </div>
      <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {steps.map((key, i) => (
          <div key={key} className="card-elevated flex flex-col p-5 sm:p-6">
            <StepIcon variant={variants[i]}>{icons[i]}</StepIcon>
            <h3 className="mt-4 font-bold text-navy">{t(`${key}Title`)}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-text">
              {t(`${key}Desc`)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center sm:mt-10">
        <Link href="/inscription" className="btn-primary inline-flex w-full justify-center px-6 py-3 text-sm sm:w-auto sm:px-8 sm:text-base">
          {t("ctaFreeCorrections")}
        </Link>
      </div>
    </section>
  );
}

export async function HomeHelpTypeCards() {
  const t = await getTranslations("HomePage");
  const cards = [
    { key: "ai" as const, href: "/inscription", accent: "from-electric to-cyan-ai", icon: "ai" },
    { key: "teacher" as const, href: "/cours-en-ligne", accent: "from-premium to-electric", icon: "teacher" },
    { key: "quiz" as const, href: "/cours", accent: "from-success to-cyan-ai", icon: "quiz" },
  ];

  return (
    <section className="section-stack" aria-labelledby="help-heading">
      <div className="text-center">
        <p className="brand-section-title">{t("helpEyebrow")}</p>
        <h2 id="help-heading" className="font-display mt-2 text-2xl font-bold text-navy sm:text-3xl">
          {t("helpTitle")}
        </h2>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.key} className="card-elevated flex flex-col overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${c.accent}`} />
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <h3 className="text-lg font-bold text-navy">{t(`help${c.key}Title`)}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-text">
                {t(`help${c.key}Desc`)}
              </p>
              <Link
                href={c.href}
                className="btn-primary mt-6 inline-flex w-full justify-center !py-3"
              >
                {t(`help${c.key}Cta`)}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export async function HomeTrustSection() {
  const t = await getTranslations("HomePage");
  const points = [
    { key: "trustA" as const, variant: "cyan" as const },
    { key: "trustB" as const, variant: "blue" as const },
    { key: "trustC" as const, variant: "green" as const },
    { key: "trustD" as const, variant: "cyan" as const },
  ];

  return (
    <section
      className="section-stack rounded-2xl border border-border-soft bg-gradient-to-br from-white/60 via-background-secondary/50 to-cyan-ai/5 px-4 py-8 backdrop-blur-sm sm:rounded-[24px] sm:px-10 sm:py-10"
      aria-labelledby="trust-heading"
    >
      <h2 id="trust-heading" className="font-display text-center text-2xl font-bold text-navy sm:text-3xl">
        {t("whyTitle")}
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {points.map(({ key, variant }) => (
          <div key={key} className="glass-card p-4 transition md:hover:-translate-y-1 sm:p-5">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                variant === "green"
                  ? "bg-success/15 text-success"
                  : variant === "cyan"
                    ? "bg-cyan-ai/15 text-electric"
                    : "bg-electric/10 text-premium"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <h3 className="mt-3 font-semibold text-navy">{t(`${key}Title`)}</h3>
            <p className="mt-1 text-sm text-muted-text">{t(`${key}Desc`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
