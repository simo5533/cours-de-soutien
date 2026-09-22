import { getAiConsumptionDashboard, getAiQuotaAnalytics } from "@/lib/ai/analytics";

export const dynamic = "force-dynamic";

function usd(n: number | null | undefined): string {
  if (n == null) return "—";
  return `$${n.toFixed(4)}`;
}

export default async function AdminConsommationIaPage() {
  const [dash, analytics] = await Promise.all([
    getAiConsumptionDashboard(),
    getAiQuotaAnalytics(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Consommation IA</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Tokens et coûts OpenAI estimés à partir des réponses API réellement enregistrées.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Aujourd’hui">
          <Row label="Corrections" value={String(dash.today.corrections)} />
          <Row label="Input tokens" value={String(dash.today.inputTokens)} />
          <Row label="Output tokens" value={String(dash.today.outputTokens)} />
          <Row label="Coût API estimé" value={usd(dash.today.estimatedCostUsd)} />
        </StatCard>
        <StatCard title="Ce mois">
          <Row label="Corrections" value={String(dash.month.corrections)} />
          <Row label="Tokens totaux" value={String(dash.month.totalTokens)} />
          <Row label="Coût API estimé" value={usd(dash.month.estimatedCostUsd)} />
          <Row
            label="Coût moyen / correction"
            value={usd(dash.month.avgCostPerCorrection)}
          />
        </StatCard>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Abonnés actifs">
          <Row label="Essentiel IA" value={String(dash.subscribers.essential)} />
          <Row label="IA Plus" value={String(dash.subscribers.aiPlus)} />
        </StatCard>
        <StatCard title="Utilisation du quota">
          <Row
            label="Utilisation moyenne"
            value={`${(analytics.avgQuotaUtilization * 100).toFixed(1)} %`}
          />
          <Row label="≥ 80 % du quota" value={`${analytics.pctReach80.toFixed(1)} %`} />
          <Row label="100 % du quota" value={`${analytics.pctReach100.toFixed(1)} %`} />
        </StatCard>
      </section>

      {dash.margeAvantAutresCouts ? (
        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Marge avant autres coûts
          </h2>
          <p className="mt-1 text-xs text-zinc-500">{dash.margeAvantAutresCouts.note}</p>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <Row
              label="Revenu abonnement estimé"
              value={`${dash.margeAvantAutresCouts.revenueMad} MAD / mois`}
            />
            <Row
              label="Coût OpenAI estimé (mois)"
              value={usd(dash.margeAvantAutresCouts.costUsd)}
            />
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Par plan (ce mois)
        </h2>
        <ul className="mt-3 divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
          {dash.monthByPlan.length === 0 ? (
            <li className="py-2 text-zinc-500">Aucune correction enregistrée ce mois.</li>
          ) : (
            dash.monthByPlan.map((row) => (
              <li key={row.planAtTime ?? "null"} className="flex justify-between gap-4 py-2">
                <span>{row.planAtTime ?? "inconnu"}</span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {row._count._all} corr. · {usd(row._sum.estimatedCostUsd)} ·{" "}
                  {row._sum.totalTokens ?? 0} tok.
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

function StatCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium text-zinc-900 dark:text-zinc-100">{value}</span>
    </div>
  );
}
