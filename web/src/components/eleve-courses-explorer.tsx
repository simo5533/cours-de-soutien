"use client";

import { Link } from "@/i18n/navigation";
import { useMemo, useState } from "react";

export type EleveCourseRow = {
  id: string;
  title: string;
  matiere: string;
  niveau: string;
  chapitre: string;
};

export function EleveCoursesExplorer({
  courses,
  favoriteIds,
  favorisOnly,
}: {
  courses: EleveCourseRow[];
  favoriteIds: string[];
  favorisOnly: boolean;
}) {
  const favSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const [query, setQuery] = useState("");
  const [matiere, setMatiere] = useState("");

  const matieres = useMemo(() => {
    const s = new Set(courses.map((c) => c.matiere));
    return Array.from(s).sort();
  }, [courses]);

  const filtered = useMemo(() => {
    let list = courses;
    if (favorisOnly) {
      list = list.filter((c) => favSet.has(c.id));
    }
    if (matiere) {
      list = list.filter((c) => c.matiere === matiere);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.matiere.toLowerCase().includes(q) ||
          c.chapitre.toLowerCase().includes(q) ||
          c.niveau.toLowerCase().includes(q),
      );
    }
    return list;
  }, [courses, favSet, favorisOnly, matiere, query]);

  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-navy/10 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/50 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-xs font-semibold text-navy dark:text-gold/90">
          Rechercher
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Titre, matière, chapitre…"
            className="select-field py-2"
          />
        </label>
        <label className="flex w-full flex-col gap-1 text-xs font-semibold text-navy dark:text-gold/90 sm:w-48">
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
        <div className="flex flex-wrap gap-2 pb-0.5 sm:ms-auto">
          <Link
            href="/eleve/cours"
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              !favorisOnly
                ? "bg-navy text-white dark:bg-brandblue"
                : "border border-navy/20 text-navy hover:bg-navy/5 dark:border-slate-600 dark:text-slate-300"
            }`}
          >
            Tous
          </Link>
          <Link
            href="/eleve/favoris"
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              favorisOnly
                ? "bg-gold text-navy dark:bg-gold/90"
                : "border border-gold/40 text-navy hover:bg-gold/10 dark:text-gold"
            }`}
          >
            Favoris ({favoriteIds.length})
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brandblue/30 bg-brandblue/[0.04] p-8 text-center text-sm text-slate-600 dark:border-brandblue/25 dark:text-slate-400">
          Aucun cours ne correspond à ces critères.
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((c) => (
            <li key={c.id}>
              <Link
                href={`/eleve/cours/${c.id}`}
                className="brand-card group flex flex-wrap items-start justify-between gap-3 p-4 transition hover:-translate-y-0.5"
              >
                <div>
                  <span className="font-semibold text-navy dark:text-white">{c.title}</span>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    {c.matiere} · {c.niveau} · {c.chapitre}
                  </span>
                </div>
                {favSet.has(c.id) ? (
                  <span
                    className="shrink-0 text-gold"
                    title="Favori"
                    aria-label="Favori"
                  >
                    ★
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
