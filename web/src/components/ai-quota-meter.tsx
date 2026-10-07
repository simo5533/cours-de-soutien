import { Link } from "@/i18n/navigation";
import type { QuotaSnapshot } from "@/lib/ai/quota";

function formatDate(d: Date | null): string | null {
  if (!d) return null;
  return d.toLocaleDateString("fr-MA", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function AiQuotaMeter({ quota }: { quota: QuotaSnapshot }) {
  const pct = quota.limit > 0 ? Math.min(100, Math.round((quota.used / quota.limit) * 100)) : 0;
  const renewLabel = formatDate(quota.periodEnd);

  return (
    <div className="card-elevated space-y-3 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-navy">Crédits d&apos;analyse</p>
          <p className="text-xs text-muted-text">
            {quota.scope === "centre" && quota.centreName
              ? `Quota partagé — ${quota.centreName}`
              : `Formule ${quota.planName}`}
          </p>
        </div>
        {quota.upgradeHref && pct >= 60 ? (
          <Link
            href={quota.upgradeHref}
            className="rounded-full bg-gradient-to-r from-electric to-cyan-ai px-3 py-1.5 text-xs font-bold text-white shadow-sm"
          >
            Voir les formules
          </Link>
        ) : null}
      </div>

      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-zinc-700"
        role="progressbar"
        aria-valuenow={quota.used}
        aria-valuemin={0}
        aria-valuemax={quota.limit}
        aria-label="Crédits d'analyse utilisés"
      >
        <div
          className={`h-full rounded-full transition-all ${
            pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-gradient-to-r from-electric to-cyan-ai"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <p className="font-medium text-navy">
          {quota.remaining} crédit{quota.remaining === 1 ? "" : "s"} restant
          {quota.remaining === 1 ? "" : "s"}
        </p>
        <p className="text-muted-text">
          {quota.used} / {quota.limit} utilisés
        </p>
      </div>

      <p className="text-xs text-muted-text">
        1 photo = 1 crédit · 1 page de PDF = 1 crédit
        {renewLabel && quota.planId !== "FREE" ? ` · Renouvellement le ${renewLabel}` : ""}
      </p>

      {quota.remaining <= 0 ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
          {quota.scope === "centre"
            ? "Le quota du centre est épuisé pour ce mois. Il sera renouvelé au prochain cycle."
            : quota.planId === "FREE"
              ? "Vos analyses offertes sont utilisées."
              : "Votre quota est épuisé pour ce mois. Il sera renouvelé au prochain cycle."}
          {quota.upgradeHref ? (
            <>
              {" "}
              <Link href={quota.upgradeHref} className="font-semibold underline">
                Voir les formules
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
