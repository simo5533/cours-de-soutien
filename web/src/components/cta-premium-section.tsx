import { Link } from "@/i18n/navigation";

type CtaPremiumSectionProps = {
  title: string;
  subtitle: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
};

export function CtaPremiumSection({
  title,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  className = "section-stack",
}: CtaPremiumSectionProps) {
  return (
    <section className={`cta-premium-card ${className}`}>
      <div className="relative">
        <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-text">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
          <Link href={primaryHref} className="btn-primary inline-flex w-full justify-center px-8 py-3.5 text-base sm:w-auto">
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link href={secondaryHref} className="btn-secondary inline-flex w-full justify-center px-8 py-3.5 text-base sm:w-auto">
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
