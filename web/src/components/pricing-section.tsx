import {
  PUBLIC_PAID_PLANS,
  VALUE_PROPOSITION,
  type PlanDefinition,
} from "@/lib/plans";
import { Link } from "@/i18n/navigation";

function formatPrice(plan: PlanDefinition): string {
  if (plan.priceMAD === 0) return "0 MAD";
  return `${plan.priceMAD} MAD/mois`;
}

function PlanCard({ plan }: { plan: PlanDefinition }) {
  const inscriptionHref =
    plan.checkoutPlan === "free"
      ? "/inscription?plan=free"
      : `/inscription?plan=${plan.pricingId}`;

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
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-electric">
        {formatPrice(plan)}
      </p>
      <p className="mt-2 text-sm font-semibold text-navy">
        {plan.monthlyCorrections} corrections IA / mois
      </p>
      <p className="mt-2 text-sm text-muted-text">{plan.description}</p>
      <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm text-muted-text">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2">
            <CheckIcon />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={inscriptionHref}
        className={`mt-6 block w-full rounded-full py-3.5 text-center text-sm font-semibold transition ${
          plan.highlighted ? "btn-primary !w-full" : "btn-secondary !w-full"
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
  /** @deprecated — offres professeur / Bac / Famille retirées */
  showSecondary?: boolean;
  /** @deprecated */
  showCredits?: boolean;
  /** @deprecated */
  showOneShot?: boolean;
  id?: string;
};

export function PricingSection({
  title,
  subtitle,
  showValueProp = true,
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

      <div className="mx-auto mt-8 grid max-w-4xl gap-6 sm:mt-10 sm:gap-8 md:grid-cols-2">
        {PUBLIC_PAID_PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-xl text-center text-sm text-muted-text">
        Nouveau ?{" "}
        <Link href="/inscription?plan=free" className="font-semibold text-electric underline-offset-2 hover:underline">
          3 corrections IA offertes
        </Link>{" "}
        à l&apos;inscription — sans carte bancaire.
      </p>
    </section>
  );
}
