import {
  MAIN_PRICING_PLANS,
  ONE_SHOT_OFFERS,
  SECONDARY_PRICING_PLANS,
  TEACHER_CREDIT_ROWS,
  VALUE_PROPOSITION,
  type PricingPlan,
} from "@/config/methodix-pricing";
import { Link } from "@/i18n/navigation";

function formatPrice(plan: PricingPlan): string {
  if (plan.price === 0) return "0 MAD";
  return `${plan.price} MAD/mois`;
}

function PlanCard({ plan }: { plan: PricingPlan }) {
  const inscriptionHref =
    plan.legacyElevePlan === "free"
      ? "/inscription?plan=free"
      : `/inscription?plan=${plan.id}`;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 ${
        plan.highlighted
          ? "z-10 scale-[1.02] border-brandblue/60 bg-gradient-to-b from-brandblue/12 to-white shadow-xl shadow-navy/15 ring-2 ring-brandblue/35 dark:from-navy/50 dark:to-slate-900 dark:ring-brandblue/30 sm:p-7"
          : "border-slate-200/80 bg-white dark:border-slate-700 dark:bg-slate-900/40"
      }`}
    >
      {plan.badge ? (
        <span
          className={`absolute -top-3 start-1/2 w-max max-w-[90%] -translate-x-1/2 rounded-full px-3 py-1 text-center text-xs font-bold text-white shadow-md ${
            plan.highlighted ? "bg-navy dark:bg-brandblue" : "bg-brandblue/90"
          }`}
        >
          {plan.badge}
        </span>
      ) : null}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
      <p className="mt-1 text-2xl font-extrabold text-brandblue dark:text-brandblue/90">
        {formatPrice(plan)}
      </p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{plan.forWho}</p>
      <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-sm text-slate-600 dark:text-slate-300">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2">
            <CheckIcon />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {plan.limits.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-1.5 border-t border-slate-200/80 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-500">
          {plan.limits.map((l) => (
            <li key={l}>— {l}</li>
          ))}
        </ul>
      ) : null}
      <Link
        href={inscriptionHref}
        className={`mt-8 block w-full rounded-xl py-3.5 text-center text-sm font-semibold transition ${
          plan.highlighted
            ? "bg-navy text-white shadow-lg hover:bg-navy/90 dark:bg-brandblue dark:hover:bg-brandblue/90"
            : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
        }`}
      >
        {plan.cta}
      </Link>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-brandblue"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

type PricingSectionProps = {
  title: string;
  subtitle: string;
  showValueProp?: boolean;
  showSecondary?: boolean;
  showCredits?: boolean;
  showOneShot?: boolean;
  id?: string;
};

export function PricingSection({
  title,
  subtitle,
  showValueProp = true,
  showSecondary = true,
  showCredits = true,
  showOneShot = true,
  id = "formules",
}: PricingSectionProps) {
  return (
    <section id={id} className="scroll-mt-[calc(var(--header-h)+1rem)]" aria-labelledby="pricing-heading">
      <div className="text-center">
        <h2
          id="pricing-heading"
          className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">{subtitle}</p>
        {showValueProp ? (
          <p className="mx-auto mt-6 max-w-3xl rounded-xl border border-gold/30 bg-gold/5 px-5 py-4 text-base font-medium leading-relaxed text-navy dark:border-gold/25 dark:bg-gold/10 dark:text-gold/95">
            {VALUE_PROPOSITION}
          </p>
        ) : null}
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {MAIN_PRICING_PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {showSecondary && SECONDARY_PRICING_PLANS.length > 0 ? (
        <div className="mt-16">
          <h3 className="text-center text-lg font-semibold text-slate-700 dark:text-slate-300">
            Besoin d&apos;un accompagnement plus avancé ?
          </h3>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {SECONDARY_PRICING_PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      ) : null}

      {showCredits ? (
        <div className="mt-16 rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-700 dark:bg-slate-900/40 sm:p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Comment fonctionnent les crédits professeur ?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Les crédits professeur permettent de demander une correction humaine détaillée. Un
            exercice simple consomme peu de crédits, tandis qu&apos;un devoir long ou un sujet
            complet peut consommer plusieurs crédits.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[280px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-semibold text-slate-900 dark:text-white">Type</th>
                  <th className="pb-3 font-semibold text-slate-900 dark:text-white">Crédits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {TEACHER_CREDIT_ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="py-2.5 text-slate-600 dark:text-slate-400">{row.label}</td>
                    <td className="py-2.5 font-medium text-navy dark:text-brandblue">{row.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
            Un crédit professeur correspond à la correction détaillée d&apos;un exercice standard.
            Les devoirs longs ou sujets complets peuvent consommer plusieurs crédits.
          </p>
        </div>
      ) : null}

      {showOneShot ? (
        <div className="mt-12 rounded-2xl border border-dashed border-brandblue/30 bg-brandblue/5 p-6 dark:border-brandblue/20 dark:bg-brandblue/10 sm:p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Besoin d&apos;une correction sans abonnement ?
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ONE_SHOT_OFFERS.map((offer) => (
              <li
                key={offer.id}
                className="flex items-center justify-between rounded-xl border border-white/60 bg-white/80 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900/60"
              >
                <span className="font-medium text-slate-800 dark:text-slate-200">{offer.name}</span>
                <span className="font-bold text-brandblue">{offer.price} MAD</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-center">
            <Link href="/inscription" className="btn-secondary inline-flex px-6 py-3">
              Acheter une correction
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
