import {
  getAiConsumptionDashboard,
  getAiQuotaAnalytics,
  getCentresUsage,
  getTopUsersThisMonth,
} from "@/lib/ai/analytics";
import { AI_MODELS } from "@/lib/ai/config";

export const dynamic = "force-dynamic";

function usd(n: number | null | undefined): string {
  if (n == null) return "—";
  return `$${n.toFixed(4)}`;
}

function num(n: number): string {
  return n.toLocaleString("fr-FR");
}

export default async function AdminConsommationIaPage() {
  const [dash, analytics, topUsers, centres] = await Promise.all([
    getAiConsumptionDashboard(),
    getAiQuotaAnalytics(),
    getTopUsersThisMonth(),
    getCentresUsage(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Consommation IA</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Tokens et coûts estimés à partir des réponses API réellement enregistrées. Modèle
          économique : <code>{AI_MODELS.economy}</code> · modèle premium : <code>{AI_MODELS.premium}</code>.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        {([
          ["Aujourd’hui", dash.today],
          ["Ce mois", dash.month],
        ] as const).map(([title, p]) => (
          <StatCard key={title} title={title}>
            <Row label="Corrections" value={num(p.corrections)} />
            <Row label="Photos analysées" value={num(p.photos)} />
            <Row label="Pages PDF / documents" value={num(p.documentPages)} />
            <Row label="Crédits consommés" value={num(p.credits)} />
            <Row label="Appels IA (toutes actions)" value={num(p.aiCalls)} />
            <Row label="Tokens entrée" value={num(p.inputTokens)} />
            <Row label="Tokens sortie" value={num(p.outputTokens)} />
            <Row label="Tokens en cache" value={num(p.cachedInputTokens)} />
            <Row label="Coût API estimé" value={usd(p.estimatedCostUsd)} />
            <Row label="Coût moyen / correction" value={usd(p.avgCostPerCorrection)} />
          </StatCard>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Revenu théorique mensuel (abonnés actifs × prix catalogue)">
          {dash.revenue.rows.map((r) => (
            <Row
              key={r.planId}
              label={`${r.planName} (${r.subscribers})`}
              value={`${num(r.revenueMad)} DH`}
            />
          ))}
          <Row label="Total" value={`${num(dash.revenue.totalMad)} DH`} />
        </StatCard>
        <StatCard title="Utilisation du quota (abonnés individuels)">
          <Row label="Abonnés" value={num(analytics.subscribers)} />
          <Row
            label="Utilisation moyenne"
            value={`${(analytics.avgQuotaUtilization * 100).toFixed(1)} %`}
          />
          <Row label="≥ 80 % du quota" value={`${analytics.pctReach80.toFixed(1)} %`} />
          <Row label="100 % du quota" value={`${analytics.pctReach100.toFixed(1)} %`} />
        </StatCard>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Marge avant autres coûts (ce mois)
        </h2>
        {dash.margeAvantAutresCouts ? (
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
            <Row label="Revenu théorique" value={`${num(dash.revenue.totalMad)} DH`} />
            <Row
              label={`Coût IA (1 $ = ${dash.margeAvantAutresCouts.rate} DH)`}
              value={`${dash.margeAvantAutresCouts.costMad.toFixed(2)} DH`}
            />
            <Row
              label="Marge avant autres coûts"
              value={`${dash.margeAvantAutresCouts.marginMad.toFixed(2)} DH`}
            />
          </div>
        ) : (
          <p className="mt-2 text-xs text-zinc-500">
            Définissez <code>ADMIN_USD_TO_MAD_RATE</code> pour comparer revenu (DH) et coût IA (USD).
          </p>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <GroupTable
          title="Par modèle (ce mois)"
          rows={dash.byModel.map((r) => ({
            key: r.model ?? "inconnu",
            calls: r._count._all,
            tokens: r._sum.totalTokens ?? 0,
            cost: r._sum.estimatedCostUsd,
          }))}
        />
        <GroupTable
          title="Par action (ce mois)"
          rows={dash.byAction.map((r) => ({
            key: r.actionType ?? "correction (ancien format)",
            calls: r._count._all,
            tokens: r._sum.totalTokens ?? 0,
            cost: r._sum.estimatedCostUsd,
          }))}
        />
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Utilisateurs les plus consommateurs (ce mois)
        </h2>
        {topUsers.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">Aucun appel IA ce mois.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-zinc-500">
                <tr>
                  <th className="py-2 pe-3">Utilisateur</th>
                  <th className="py-2 pe-3">Offre</th>
                  <th className="py-2 pe-3">Appels</th>
                  <th className="py-2 pe-3">Crédits</th>
                  <th className="py-2 pe-3">Tokens</th>
                  <th className="py-2">Coût</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {topUsers.map((u) => (
                  <tr key={u.userId}>
                    <td className="py-2 pe-3">
                      <span className="font-medium">{u.name}</span>
                      <span className="block text-xs text-zinc-500">{u.email}</span>
                    </td>
                    <td className="py-2 pe-3">
                      {u.planName}
                      {u.accountType ? <span className="text-xs text-zinc-500"> · {u.accountType}</span> : null}
                    </td>
                    <td className="py-2 pe-3">{num(u.calls)}</td>
                    <td className="py-2 pe-3">{num(u.credits)}</td>
                    <td className="py-2 pe-3">{num(u.tokens)}</td>
                    <td className="py-2">{usd(u.costUsd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Centres</h2>
        {centres.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">Aucun centre pour le moment.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-zinc-500">
                <tr>
                  <th className="py-2 pe-3">Centre</th>
                  <th className="py-2 pe-3">Statut</th>
                  <th className="py-2 pe-3">Comptes</th>
                  <th className="py-2 pe-3">Crédits (cycle)</th>
                  <th className="py-2 pe-3">Tokens (mois)</th>
                  <th className="py-2">Coût (mois)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {centres.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2 pe-3">
                      <span className="font-medium">{c.name}</span>
                      <span className="block text-xs text-zinc-500">{c.ownerEmail}</span>
                    </td>
                    <td className="py-2 pe-3">{c.status}</td>
                    <td className="py-2 pe-3">
                      {c.members} / {c.seats}
                    </td>
                    <td className="py-2 pe-3">
                      {num(c.creditsUsed)} / {num(c.creditsLimit)}
                      <span className="block text-xs text-zinc-500">reste {num(c.creditsRemaining)}</span>
                    </td>
                    <td className="py-2 pe-3">{num(c.tokens)}</td>
                    <td className="py-2">{usd(c.costUsd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function GroupTable({
  title,
  rows,
}: {
  title: string;
  rows: { key: string; calls: number; tokens: number; cost: number | null }[];
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      <ul className="mt-3 divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
        {rows.length === 0 ? (
          <li className="py-2 text-zinc-500">Aucun appel enregistré ce mois.</li>
        ) : (
          rows.map((row) => (
            <li key={row.key} className="flex justify-between gap-4 py-2">
              <span>{row.key}</span>
              <span className="text-zinc-600 dark:text-zinc-400">
                {num(row.calls)} appels · {usd(row.cost)} · {num(row.tokens)} tok.
              </span>
            </li>
          ))
        )}
      </ul>
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
