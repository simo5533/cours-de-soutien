"use client";

import { Link } from "@/i18n/navigation";
import { useMemo, useState } from "react";

const matiereAccent: Record<string, string> = {
  Mathématiques: "from-brandblue to-navy",
  "Physique-Chimie": "from-navy to-brandblue",
  Français: "from-gold/90 to-navy",
  Anglais: "from-brandblue/90 to-navy",
  SVT: "from-navy to-gold/80",
  "Histoire-Géographie": "from-gold to-navy",
};

function gradientForMatiere(m: string) {
  return matiereAccent[m] ?? "from-brandblue to-navy";
}

export type PublicCourseItem = {
  id: string;
  title: string;
  matiere: string;
  niveau: string;
  chapitre: string;
  description: string | null;
};

export function PublicCatalogGrid({ courses }: { courses: PublicCourseItem[] }) {
  const [query, setQuery] = useState("");
  const [matiere, setMatiere] = useState("");

  const matieres = useMemo(() => {
    const s = new Set(courses.map((c) => c.matiere));
    return Array.from(s).sort();
  }, [courses]);

  const filtered = useMemo(() => {
    let list = courses;
    if (matiere) list = list.filter((c) => c.matiere === matiere);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.matiere.toLowerCase().includes(q) ||
          c.chapitre.toLowerCase().includes(q) ||
          c.niveau.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [courses, matiere, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-navy/10 bg-white/85 p-4 dark:border-slate-700 dark:bg-slate-900/55 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-xs font-semibold text-navy dark:text-gold/90">
          Rechercher
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Titre, matière, mot-clé…"
            className="select-field py-2"
          />
        </label>
        <label className="flex w-full flex-col gap-1 text-xs font-semibold text-navy dark:text-gold/90 sm:w-52">
          Matière
          <select
            value={matiere}
            onChange={(e) => setMatiere(e.target.value)}
            className="select-field py-2"
          >
            <option value="">Toutes</option>
            {matieres.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400 sm:ms-auto sm:pb-2">
          {filtered.length} / {courses.length} fiche(s)
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brandblue/30 bg-brandblue/[0.04] px-8 py-12 text-center dark:border-brandblue/25 dark:bg-brandblue/[0.06]">
          <p className="text-base font-medium text-navy dark:text-gold">
            Aucun résultat pour ces critères.
          </p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2">
          {filtered.map((c) => (
            <li
              key={c.id}
              className="group brand-card flex flex-col overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-navy/10 dark:hover:shadow-black/40"
            >
              <div
                className={`h-1.5 w-full bg-gradient-to-r ${gradientForMatiere(c.matiere)}`}
                aria-hidden
              />
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-navy dark:bg-gold/15 dark:text-gold">
                    {c.matiere}
                  </span>
                  <span className="rounded-full border border-brandblue/25 bg-brandblue/5 px-2.5 py-0.5 text-[11px] font-medium text-navy dark:border-brandblue/30 dark:bg-brandblue/10 dark:text-brandblue">
                    {c.niveau}
                  </span>
                  <span className="rounded-full border border-slate-200/90 px-2.5 py-0.5 text-[11px] text-slate-600 dark:border-slate-600 dark:text-slate-400">
                    {c.chapitre}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900 transition group-hover:text-navy dark:text-white dark:group-hover:text-gold">
                  {c.title}
                </h3>
                {c.description ? (
                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {c.description}
                  </p>
                ) : (
                  <p className="mt-2 flex-1 text-sm italic text-slate-400 dark:text-slate-500">
                    Pas de résumé — ouvrez la fiche une fois connecté.
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between border-t border-navy/5 pt-4 dark:border-slate-700/80">
                  <span className="text-xs text-slate-500 dark:text-slate-500">
                    PDF & leçon : espace élève
                  </span>
                  <Link
                    href="/connexion"
                    className="text-xs font-semibold text-brandblue transition hover:text-navy dark:hover:text-gold"
                  >
                    Se connecter →
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
