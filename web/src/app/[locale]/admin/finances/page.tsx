import { Link } from "@/i18n/navigation";
import { createPaymentAction, deletePaymentAction } from "@/actions/payments";
import { formatDh } from "@/lib/format-currency-ma";
import { prisma } from "@/lib/prisma";

const METHODS = ["ESPECES", "VIREMENT", "CARTE", "AUTRE"] as const;

export default async function AdminFinancesPage() {
  const [eleves, payments] = await Promise.all([
    prisma.user.findMany({
      where: { role: "ELEVE" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.payment.findMany({
      orderBy: { paidAt: "desc" },
      take: 150,
      include: { student: { select: { name: true } } },
    }),
  ]);

  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-8">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        <Link href="/admin" className="text-navy hover:underline dark:text-gold">
          ← Tableau de bord
        </Link>
      </p>

      <section className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="text-lg font-semibold">Nouveau paiement</h3>
        <form action={createPaymentAction} className="mt-3 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs">
            Élève
            <select
              name="studentId"
              required
              className="min-w-[200px] rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700"
            >
              <option value="">—</option>
              {eleves.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs">
            Montant (dh)
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              className="w-28 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            Date de paiement
            <input
              type="datetime-local"
              name="paidAt"
              required
              className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            Libellé
            <input
              name="label"
              required
              placeholder="Mensualité janvier"
              className="min-w-[180px] rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            Mode
            <select
              name="method"
              className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700"
              defaultValue="ESPECES"
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs">
            Note interne
            <input name="note" className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700" />
          </label>
          <button
            type="submit"
            className="rounded-full bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90"
          >
            Enregistrer le paiement
          </button>
        </form>
      </section>

      <section>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">Paiements récents</h3>
          <p className="text-sm text-zinc-600">
            Total affiché :{" "}
            <span className="font-semibold text-navy">
              {formatDh(total)}
            </span>
          </p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50">
              <tr>
                <th className="p-3">Reçu</th>
                <th className="p-3">Date</th>
                <th className="p-3">Élève</th>
                <th className="p-3">Libellé</th>
                <th className="p-3">Montant</th>
                <th className="p-3">Mode</th>
                <th className="p-3 w-32" />
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-3 font-mono text-xs">#{p.receiptNumber}</td>
                  <td className="p-3 whitespace-nowrap">
                    {new Date(p.paidAt).toLocaleString("fr-FR")}
                  </td>
                  <td className="p-3">{p.student.name}</td>
                  <td className="p-3">{p.label}</td>
                  <td className="p-3 font-medium">
                    {formatDh(p.amount)}
                  </td>
                  <td className="p-3 text-xs">{p.method}</td>
                  <td className="p-3">
                    <Link
                      href={`/imprimer/recu/${p.id}`}
                      className="text-xs font-medium text-navy hover:underline dark:text-gold"
                      target="_blank"
                    >
                      Imprimer reçu
                    </Link>
                    <form action={deletePaymentAction.bind(null, p.id)} className="mt-1">
                      <button
                        type="submit"
                        className="text-xs text-red-600 hover:underline dark:text-red-400"
                      >
                        Supprimer
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
