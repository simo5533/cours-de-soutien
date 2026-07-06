import {
  MAIN_PRICING_PLANS,
  ONE_SHOT_OFFERS,
  SECONDARY_PRICING_PLANS,
  TEACHER_CREDIT_ROWS,
  VALUE_PROPOSITION,
  type PricingPlan,
} from "@/config/correcteurplus-pricing";
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
      className={`plan-card relative flex flex-col rounded-2xl border p-5 transition duration-300 sm:rounded-[22px] sm:p-6 md:hover:-translate-y-1 ${
        plan.highlighted
          ? "plan-card-highlight z-10 lg:scale-[1.02] sm:p-7"
          : "border-border-soft"
      }`}
    >
      {plan.badge ? (
        <span
          className={`absolute -top-3 start-1/2 w-max max-w-[90%] -translate-x-1/2 rounded-full px-3 py-1 text-center text-xs font-bold text-white shadow-md rtl:translate-x-1/2 ${
            plan.highlighted ? "bg-gradient-to-r from-electric to-cyan-ai" : "bg-premium"
          }`}
        >
          {plan.badge}
        </span>
      ) : null}
      <h3 className="text-lg font-bold text-navy">{plan.name}</h3>
      <p className="mt-1 text-2xl font-extrabold text-electric">
        {formatPrice(plan)}
      </p>
      <p className="mt-2 text-sm text-muted-text">{plan.forWho}</p>
      <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-sm text-muted-text">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2">
            <CheckIcon />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {plan.limits.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-1.5 border-t border-border-soft pt-4 text-xs text-muted-text">
          {plan.limits.map((l) => (
            <li key={l}>— {l}</li>
          ))}
        </ul>
      ) : null}
      <Link
        href={inscriptionHref}
        className={`mt-8 block w-full rounded-full py-3.5 text-center text-sm font-semibold transition ${
          plan.highlighted
            ? "btn-primary !w-full"
            : "btn-secondary !w-full"
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
      className="mt-0.5 h-5 w-5 shrink-0 text-success"
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
          className="font-display text-2xl font-bold tracking-tight text-navy sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-text">{subtitle}</p>
        {showValueProp ? (
          <p className="pricing-value-prop mx-auto mt-6 max-w-3xl rounded-[22px] border border-border-soft px-5 py-4 text-base font-medium leading-relaxed text-navy backdrop-blur-sm">
            {VALUE_PROPOSITION}
          </p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
        {MAIN_PRICING_PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {showSecondary && SECONDARY_PRICING_PLANS.length > 0 ? (
        <div className="mt-16">
          <h3 className="text-center text-base font-semibold text-navy sm:text-lg">
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
        <div className="mt-16 card-elevated p-6 sm:p-8">
          <h3 className="text-lg font-bold text-navy">
            Comment fonctionnent les crédits professeur ?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-text">
            Les crédits professeur permettent de demander une correction humaine détaillée. Un
            exercice simple consomme peu de crédits, tandis qu&apos;un devoir long ou un sujet
            complet peut consommer plusieurs crédits.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[280px] text-left text-sm">
              <thead>
                <tr className="border-b border-border-soft">
                  <th className="pb-3 font-semibold text-navy">Type</th>
                  <th className="pb-3 font-semibold text-navy">Crédits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {TEACHER_CREDIT_ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="py-2.5 text-muted-text">{row.label}</td>
                    <td className="py-2.5 font-medium text-electric">{row.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-text">
            Un crédit professeur correspond à la correction détaillée d&apos;un exercice standard.
            Les devoirs longs ou sujets complets peuvent consommer plusieurs crédits.
          </p>
        </div>
      ) : null}

      {showOneShot ? (
        <div className="pricing-one-shot-box mt-12 rounded-[22px] border border-dashed border-cyan-ai/40 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-navy">
            Besoin d&apos;une correction sans abonnement ?
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ONE_SHOT_OFFERS.map((offer) => (
              <li
                key={offer.id}
                className="pricing-offer-chip flex items-center justify-between rounded-xl border border-border-soft px-4 py-3 text-sm backdrop-blur-sm"
              >
                <span className="font-medium text-navy">{offer.name}</span>
                <span className="font-bold text-electric">{offer.price} MAD</span>
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
