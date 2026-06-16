import {
  adminRefuseCoursEnLigneDemandeAction,
  adminValidateCoursEnLigneDemandeAction,
} from "@/actions/cours-en-ligne-demande";
import { Link } from "@/i18n/navigation";
import { canJoinLessonRoom } from "@/lib/online-lessons";
import { prisma } from "@/lib/prisma";

const DEMANDE_STATUS: Record<string, string> = {
  EN_ATTENTE_ADMIN: "En attente",
  VALIDEE: "Validée",
  REFUSEE: "Refusée",
};

export default async function AdminCoursEnLignePage() {
  const [demandes, profs] = await Promise.all([
    prisma.coursEnLigneDemande.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: {
        assignedTeacher: { select: { name: true } },
        booking: {
          select: {
            id: true,
            startsAt: true,
            endsAt: true,
            status: true,
            matiere: true,
          },
        },
      },
    }),
    prisma.user.findMany({
      where: { role: "PROFESSEUR" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const pending = demandes.filter((d) => d.status === "EN_ATTENTE_ADMIN");

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-lg font-semibold">Cours en ligne — demandes</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Vérifiez les créneaux, validez la demande (création du compte élève +
          RDV), puis rejoignez le live si besoin.
        </p>
      </div>

      <section>
        <h3 className="font-semibold text-amber-800 dark:text-amber-200">
          À traiter ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">Aucune demande en attente.</p>
        ) : (
          <ul className="mt-4 space-y-6">
            {pending.map((d) => (
              <li
                key={d.id}
                className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-5 dark:border-amber-900/40 dark:bg-amber-950/20"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">{d.name}</p>
                  <span className="text-xs text-zinc-500">
                    {d.createdAt.toLocaleString("fr-FR")}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {d.email}
                  {d.phone ? ` · ${d.phone}` : ""}
                </p>
                <p className="mt-2 text-sm">
                  <strong>{d.langue}</strong>
                  {d.matiere ? ` — ${d.matiere}` : ""}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {d.preferredDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  à {d.preferredTime} · {d.durationMinutes} min
                </p>
                {d.message ? (
                  <p className="mt-2 text-sm italic text-zinc-600">
                    &laquo; {d.message} &raquo;
                  </p>
                ) : null}

                <form
                  action={adminValidateCoursEnLigneDemandeAction}
                  className="mt-4 flex flex-wrap items-end gap-3 border-t border-amber-200/60 pt-4 dark:border-amber-900/30"
                >
                  <input type="hidden" name="demandeId" value={d.id} />
                  <label className="flex flex-col gap-1 text-sm">
                    <span>Professeur assigné *</span>
                    <select
                      name="teacherId"
                      required
                      className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      <option value="">Choisir…</option>
                      {profs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-sm">
                    <span>Note admin (optionnel)</span>
                    <input
                      name="adminNote"
                      className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    Valider, créer le compte et le RDV
                  </button>
                </form>

                <form action={adminRefuseCoursEnLigneDemandeAction} className="mt-2">
                  <input type="hidden" name="demandeId" value={d.id} />
                  <input type="hidden" name="adminNote" value="Demande refusée" />
                  <button
                    type="submit"
                    className="text-sm text-red-600 hover:underline"
                  >
                    Refuser
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="font-semibold">Historique des demandes</h3>
        <ul className="mt-3 space-y-3 text-sm">
          {demandes
            .filter((d) => d.status !== "EN_ATTENTE_ADMIN")
            .map((d) => {
              const b = d.booking;
              const canLive =
                b &&
                canJoinLessonRoom({
                  startsAt: b.startsAt,
                  endsAt: b.endsAt,
                  status: b.status as "CONFIRME",
                });
              return (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 px-4 py-2 dark:border-zinc-800"
                >
                  <span>
                    {d.name} — {d.langue} — {DEMANDE_STATUS[d.status]}
                    {d.assignedTeacher ? ` — Prof. ${d.assignedTeacher.name}` : ""}
                    {d.phone ? ` · ${d.phone}` : ""}
                  </span>
                  {b && d.status === "VALIDEE" ? (
                    <Link
                      href={`/admin/cours-en-ligne/salle/${b.id}`}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        canLive
                          ? "bg-amber-600 text-white"
                          : "border border-zinc-300 text-zinc-600 dark:border-zinc-600"
                      }`}
                    >
                      Rejoindre le live
                    </Link>
                  ) : null}
                </li>
              );
            })}
        </ul>
      </section>
    </div>
  );
}
