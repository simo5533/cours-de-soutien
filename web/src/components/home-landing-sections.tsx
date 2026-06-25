import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

function StepIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brandblue to-navy text-white shadow-md shadow-navy/15">
      {children}
    </span>
  );
}

export async function HomeHeroMockup() {
  const t = await getTranslations("HomePage");

  return (
    <div className="relative mx-auto mt-10 max-w-lg lg:absolute lg:end-8 lg:top-1/2 lg:mt-0 lg:max-w-md lg:-translate-y-1/2">
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xl shadow-navy/10 dark:border-slate-700 dark:bg-slate-900/90">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ms-2 text-xs font-medium text-slate-500">Methodix</span>
        </div>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-dashed border-brandblue/40 bg-brandblue/5 p-4 text-center dark:bg-brandblue/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-brandblue">
              {t("mockupStep1")}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t("mockupPhoto")}</p>
          </div>
          <div className="flex justify-center text-brandblue" aria-hidden>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/30">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              {t("mockupStep2")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {t("mockupCorrection")}
            </p>
          </div>
          <div className="rounded-xl border border-navy/10 bg-slate-50 p-3 text-center dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-xs font-medium text-navy dark:text-brandblue">{t("mockupStep3")}</p>
          </div>
        </div>
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

  return (
    <section className="mt-20" aria-labelledby="how-heading">
      <div className="text-center">
        <p className="brand-section-title">{t("howEyebrow")}</p>
        <h2 id="how-heading" className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          {t("howTitle")}
        </h2>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((key, i) => (
          <div
            key={key}
            className="card-elevated flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-700 dark:bg-slate-900/40"
          >
            <StepIcon>{icons[i]}</StepIcon>
            <h3 className="mt-4 font-bold text-navy dark:text-white">{t(`${key}Title`)}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t(`${key}Desc`)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/inscription" className="btn-primary inline-flex px-8 py-3">
          {t("ctaFreeCorrections")}
        </Link>
      </div>
    </section>
  );
}

export async function HomeHelpTypeCards() {
  const t = await getTranslations("HomePage");
  const cards = [
    { key: "ai" as const, href: "/inscription", accent: "from-brandblue to-cyan-500" },
    { key: "teacher" as const, href: "/cours-en-ligne", accent: "from-navy to-brandblue" },
    { key: "quiz" as const, href: "/cours", accent: "from-emerald-500 to-brandblue" },
  ];

  return (
    <section className="mt-20" aria-labelledby="help-heading">
      <div className="text-center">
        <p className="brand-section-title">{t("helpEyebrow")}</p>
        <h2 id="help-heading" className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          {t("helpTitle")}
        </h2>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.key}
            className="card-elevated flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-700 dark:bg-slate-900/40"
          >
            <div className={`h-1.5 bg-gradient-to-r ${c.accent}`} />
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <h3 className="text-lg font-bold text-navy dark:text-white">{t(`help${c.key}Title`)}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {t(`help${c.key}Desc`)}
              </p>
              <Link
                href={c.href}
                className="mt-6 inline-flex w-full justify-center rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy/90 dark:bg-brandblue dark:hover:bg-brandblue/90"
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
  const points = ["trustA", "trustB", "trustC", "trustD"] as const;

  return (
    <section className="mt-20 rounded-3xl border border-brandblue/15 bg-gradient-to-br from-brandblue/5 via-white to-slate-50 px-6 py-10 dark:border-brandblue/10 dark:from-brandblue/10 dark:via-slate-900/50 dark:to-navy/30 sm:px-10">
      <h2 className="text-center text-2xl font-bold text-navy dark:text-white sm:text-3xl">
        {t("whyTitle")}
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((key) => (
          <div
            key={key}
            className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/60"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brandblue/15 text-brandblue">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <h3 className="mt-3 font-semibold text-navy dark:text-white">{t(`${key}Title`)}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t(`${key}Desc`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
