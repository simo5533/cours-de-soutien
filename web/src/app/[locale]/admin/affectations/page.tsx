import { Link } from "@/i18n/navigation";
import { createProfAffectationAction } from "@/actions/prof-affectations";
import { prisma } from "@/lib/prisma";
import { MATIERES } from "@/lib/course-taxonomy";
import { AffectationRowDelete } from "@/components/affectation-row-delete";

export default async function AdminAffectationsPage() {
  const [profs, groups, rows] = await Promise.all([
    prisma.user.findMany({
      where: { role: "PROFESSEUR" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.group.findMany({
      orderBy: [{ anneeScolaire: "desc" }, { name: "asc" }],
      include: { _count: { select: { students: true } } },
    }),
    prisma.professeurAffectation.findMany({
      orderBy: [{ anneeScolaire: "desc" }, { groupe: "asc" }, { matiere: "asc" }],
      include: { professeur: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="brand-card overflow-hidden p-5 sm:p-6">
        <div className="brand-card-inner">
          <p className="brand-section-title">Affectations professeurs</p>
          <p className="brand-section-subtitle mt-2">
            <Link
              href="/admin"
              className="font-medium text-brandblue underline-offset-2 hover:text-navy hover:underline dark:text-brandblue dark:hover:text-gold"
            >
              ← Tableau de bord
            </Link>
            <span className="text-slate-400 dark:text-slate-500"> · </span>
            Choisissez un <strong className="text-navy dark:text-slate-200">groupe créé dans « Groupes »</strong>{" "}
            : les élèves que vous y affectez apparaissent dans « Mes affectations » du professeur (même nom et
            année).
          </p>
        </div>
      </div>

      <div className="brand-card p-5 sm:p-6">
        <h2 className="brand-section-title mb-4">Nouvelle affectation</h2>
        <form
          action={createProfAffectationAction}
          className="flex flex-wrap items-end gap-4"
        >
          <label className="flex min-w-[12rem] flex-col gap-1.5">
            <span className="text-xs font-semibold text-navy dark:text-gold/90">Professeur</span>
            <select name="professeurId" required className="select-field min-w-[12rem]">
              <option value="">Choisir…</option>
              {profs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-navy dark:text-gold/90">Matière</span>
            <select name="matiere" required className="select-field">
              {MATIERES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-w-[14rem] flex-col gap-1.5">
            <span className="text-xs font-semibold text-navy dark:text-gold/90">Groupe (référentiel)</span>
            <select name="groupId" required className="select-field min-w-[14rem]">
              <option value="">Choisir un groupe…</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} — {g.matiere} — {g.anneeScolaire}
                  {g._count.students > 0 ? ` (${g._count.students} élève(s))` : ""}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={groups.length === 0}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enregistrer
          </button>
        </form>

        {groups.length === 0 ? (
          <p className="mt-4 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-navy dark:bg-gold/10 dark:text-gold/90">
            Créez d’abord au moins un groupe dans{" "}
            <Link href="/admin/groupes" className="font-semibold text-brandblue underline-offset-2 hover:underline dark:text-brandblue">
              Groupes
            </Link>{" "}
            pour pouvoir lier un professeur à une classe.
          </p>
        ) : null}
      </div>

      <section>
        <h2 className="brand-section-title mb-3">Affectations enregistrées</h2>
        <ul className="space-y-3">
          {rows.length === 0 ? (
            <li className="rounded-xl border border-dashed border-navy/15 bg-navy/[0.02] px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-900/30 dark:text-slate-400">
              Aucune affectation pour le moment.
            </li>
          ) : (
            rows.map((r) => (
              <li
                key={r.id}
                className="brand-list-item flex flex-wrap items-center justify-between gap-3"
              >
                <span className="text-sm text-slate-800 dark:text-slate-200">
                  <span className="font-semibold text-navy dark:text-gold">{r.professeur.name}</span>
                  <span className="mx-2 text-gold/80 dark:text-gold/50">·</span>
                  <span className="text-brandblue dark:text-brandblue">{r.matiere}</span>
                  <span className="mx-2 text-slate-300 dark:text-slate-600">—</span>
                  {r.groupe}
                  <span className="mx-1.5 text-slate-400">·</span>
                  <span className="text-slate-600 dark:text-slate-400">{r.anneeScolaire}</span>
                </span>
                <AffectationRowDelete id={r.id} />
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
