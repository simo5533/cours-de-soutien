import { PLANS, PUBLIC_PLANS, VALUE_PROPOSITION, type PlanDefinition } from "@/lib/plans";
import { FILE_LIMITS } from "@/lib/ai/config";
import { Link } from "@/i18n/navigation";

function formatPrice(plan: PlanDefinition): string {
  if (plan.priceMAD === 0) return "0 DH";
  return `${plan.priceMAD} DH`;
}

function PlanCard({ plan, maxPdfPages }: { plan: PlanDefinition; maxPdfPages: number }) {
  const inscriptionHref = `/inscription?plan=${plan.pricingId}`;
  const quotaFeatures = [
    plan.seats > 1
      ? `${plan.monthlyCredits} analyses / mois pour toute l'équipe`
      : `${plan.monthlyCredits} analyses / mois`,
    ...(plan.seats > 1 ? [`Jusqu'à ${plan.seats} comptes`] : []),
    `Analyse des PDF jusqu'à ${maxPdfPages} pages`,
  ];

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
      <p className="text-xs font-semibold uppercase tracking-wide text-electric">{plan.tagline}</p>
      <h3 className="mt-1 text-lg font-bold text-navy">{plan.name}</h3>
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-electric">
        {formatPrice(plan)}
        <span className="text-base font-semibold text-muted-text"> / mois</span>
      </p>
      <p className="mt-2 text-sm text-muted-text">{plan.description}</p>
      <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm text-muted-text">
        {[...quotaFeatures, ...plan.features].map((f) => (
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
  id?: string;
};

export function PricingSection({
  title,
  subtitle,
  showValueProp = true,
  id = "formules",
}: PricingSectionProps) {
  const maxPdfPages = FILE_LIMITS.maxPdfPages;
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

      <div className="mx-auto mt-8 grid max-w-6xl gap-6 sm:mt-10 sm:gap-8 md:grid-cols-3">
        {PUBLIC_PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} maxPdfPages={maxPdfPages} />
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-xl text-center text-sm text-muted-text">
        1 photo = 1 analyse · 1 page de PDF = 1 analyse.{" "}
        <Link href="/inscription?plan=free" className="font-semibold text-electric underline-offset-2 hover:underline">
          {PLANS.FREE.monthlyCredits} analyses offertes
        </Link>{" "}
        à l&apos;inscription — sans carte bancaire.
      </p>
    </section>
  );
}
