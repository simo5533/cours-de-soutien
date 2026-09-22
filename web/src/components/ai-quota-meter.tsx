import { Link } from "@/i18n/navigation";
import type { QuotaSnapshot } from "@/lib/ai/quota";

function formatDate(d: Date | null): string | null {
  if (!d) return null;
  return d.toLocaleDateString("fr-MA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function AiQuotaMeter({ quota }: { quota: QuotaSnapshot }) {
  const pct = quota.limit > 0 ? Math.min(100, Math.round((quota.used / quota.limit) * 100)) : 0;
  const renewLabel = formatDate(quota.periodEnd);

  return (
    <div className="card-elevated space-y-3 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-navy">Corrections IA</p>
          <p className="text-xs text-muted-text">Formule {quota.planName}</p>
        </div>
        {quota.canUpgradeToAiPlus ? (
          <Link
            href="/inscription?plan=ai_plus"
            className="rounded-full bg-gradient-to-r from-electric to-cyan-ai px-3 py-1.5 text-xs font-bold text-white shadow-sm"
          >
            Passer à IA Plus
          </Link>
        ) : null}
      </div>

      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-zinc-700"
        role="progressbar"
        aria-valuenow={quota.used}
        aria-valuemin={0}
        aria-valuemax={quota.limit}
        aria-label="Corrections IA utilisées"
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
          {quota.used} / {quota.limit} corrections utilisées
        </p>
        <p className="text-muted-text">
          {quota.remaining} correction{quota.remaining === 1 ? "" : "s"} restante
          {quota.remaining === 1 ? "" : "s"}
        </p>
      </div>

      {renewLabel && quota.planId !== "FREE" ? (
        <p className="text-xs text-muted-text">Renouvellement le {renewLabel}</p>
      ) : null}

      {quota.remaining <= 0 ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
          {quota.planId === "AI_PLUS"
            ? "Votre quota mensuel est épuisé. Il sera renouvelé au prochain cycle."
            : quota.planId === "ESSENTIAL_AI"
              ? "Vous avez utilisé toutes vos corrections IA pour ce mois."
              : "Vous avez utilisé vos corrections IA offertes."}
          {quota.canUpgradeToAiPlus ? (
            <>
              {" "}
              <Link href="/inscription?plan=ai_plus" className="font-semibold underline">
                Passer à IA Plus
              </Link>
            </>
          ) : quota.planId === "FREE" ? (
            <>
              {" "}
              <Link href="/tarifs" className="font-semibold underline">
                Voir les formules
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
