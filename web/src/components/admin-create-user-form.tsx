"use client";

import { adminCreateUserAction } from "@/actions/admin-users";
import { MATIERES } from "@/lib/course-taxonomy";
import { formatDh } from "@/lib/format-currency-ma";
import { useMemo, useState } from "react";

type SubjectLine = { name: string; priceDh: string };

const roles = [
  { value: "ELEVE", label: "Élève" },
  { value: "PROFESSEUR", label: "Professeur" },
  { value: "ADMIN", label: "Administrateur" },
] as const;

function todayIsoDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function AdminCreateUserForm({
  anneesScolaires,
}: {
  anneesScolaires: readonly string[];
}) {
  const [role, setRole] = useState<string>("ELEVE");
  const [lines, setLines] = useState<SubjectLine[]>([{ name: "", priceDh: "0" }]);

  const subjectsPayload = useMemo(() => {
    return lines
      .map((l) => ({
        name: l.name.trim(),
        priceDh: Number(String(l.priceDh).replace(",", ".")) || 0,
      }))
      .filter((l) => l.name.length > 0);
  }, [lines]);

  const totalPreview = useMemo(
    () => subjectsPayload.reduce((s, l) => s + l.priceDh, 0),
    [subjectsPayload],
  );

  const subjectsJson = useMemo(
    () => JSON.stringify(subjectsPayload),
    [subjectsPayload],
  );

  function addLine() {
    setLines((prev) => [...prev, { name: "", priceDh: "0" }]);
  }

  function removeLine(i: number) {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((_, j) => j !== i)));
  }

  function updateLine(i: number, patch: Partial<SubjectLine>) {
    setLines((prev) =>
      prev.map((row, j) => (j === i ? { ...row, ...patch } : row)),
    );
  }

  const isEleve = role === "ELEVE";

  return (
    <form
      action={adminCreateUserAction}
      onSubmit={(e) => {
        if (role === "ELEVE" && subjectsPayload.length === 0) {
          e.preventDefault();
          alert(
            "Ajoutez au moins une matière avec un nom renseigné et un prix en dirhams (dh).",
          );
        }
      }}
      className="mt-3 space-y-6 rounded-xl border border-navy/10 bg-white/90 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 sm:p-5"
    >
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-navy dark:text-gold/90">
          Nom
          <input
            name="name"
            required
            className="select-field max-w-[14rem]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-navy dark:text-gold/90">
          E-mail
          <input
            name="email"
            type="email"
            required
            className="select-field max-w-[16rem]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-navy dark:text-gold/90">
          Mot de passe
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="select-field max-w-[12rem]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-navy dark:text-gold/90">
          Rôle
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="select-field min-w-[10rem]"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isEleve ? (
        <div className="space-y-4 border-t border-gold/25 pt-4 dark:border-gold/20">
          <p className="text-xs font-bold uppercase tracking-wider text-navy dark:text-gold">
            Scolarité
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-xs font-medium text-navy dark:text-gold/90">
              Groupe / classe
              <input
                name="groupe"
                required
                placeholder="ex. 4ème A"
                className="select-field max-w-[12rem]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-navy dark:text-gold/90">
              Année scolaire
              <select
                name="anneeScolaire"
                required
                className="select-field min-w-[11rem]"
                defaultValue=""
              >
                <option value="" disabled>
                  Choisir…
                </option>
                {anneesScolaires.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-navy dark:text-gold/90">
              Nombre de langues suivies
              <input
                name="enrollmentLanguageCount"
                type="number"
                min={0}
                max={50}
                defaultValue={0}
                required
                className="select-field w-24"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-navy dark:text-gold/90">
              Date d&apos;inscription
              <input
                name="enrolledAt"
                type="date"
                required
                defaultValue={todayIsoDate()}
                className="select-field w-[11rem]"
              />
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-navy dark:text-gold">
                Matières — nom et prix (dh) par ligne
              </p>
              <button
                type="button"
                onClick={addLine}
                className="rounded-lg border border-brandblue/40 bg-brandblue/10 px-3 py-1 text-xs font-semibold text-navy transition hover:bg-brandblue/20 dark:text-brandblue"
              >
                + Ligne
              </button>
            </div>
            <datalist id="matieres-suggestions">
              {MATIERES.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            <ul className="space-y-2">
              {lines.map((line, i) => (
                <li
                  key={i}
                  className="flex flex-wrap items-end gap-2 rounded-lg border border-navy/8 bg-navy/[0.02] p-2 dark:border-slate-600 dark:bg-slate-800/40"
                >
                  <label className="flex min-w-[8rem] flex-1 flex-col gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    Matière
                    <input
                      value={line.name}
                      onChange={(e) => updateLine(i, { name: e.target.value })}
                      list="matieres-suggestions"
                      placeholder="ex. Mathématiques"
                      className="select-field py-1.5 text-sm"
                    />
                  </label>
                  <label className="flex w-32 flex-col gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    Prix (dh)
                    <input
                      value={line.priceDh}
                      onChange={(e) => updateLine(i, { priceDh: e.target.value })}
                      type="text"
                      inputMode="decimal"
                      className="select-field py-1.5 text-sm"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeLine(i)}
                    className="mb-0.5 rounded-md border border-red-200 px-2 py-1 text-[11px] text-red-700 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    Retirer
                  </button>
                </li>
              ))}
            </ul>
            <input type="hidden" name="enrollmentSubjectsJson" value={subjectsJson} />
            <p className="rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-sm font-semibold text-navy dark:bg-gold/15 dark:text-gold">
              Total estimé : {formatDh(totalPreview)}{" "}
              <span className="text-xs font-normal text-slate-600 dark:text-slate-400">
                (recalculé à l&apos;enregistrement)
              </span>
            </p>
          </div>
        </div>
      ) : (
        <>
          <input type="hidden" name="groupe" value="" />
          <input type="hidden" name="anneeScolaire" value="" />
        </>
      )}

      <button type="submit" className="btn-primary">
        Créer le compte
      </button>
    </form>
  );
}
