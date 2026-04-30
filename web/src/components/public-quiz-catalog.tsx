"use client";

import { Link } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import type { QuizCatalogGroup } from "@/lib/language-quiz-catalog";

export function PublicQuizCatalog({ groups }: { groups: QuizCatalogGroup[] }) {
  const [query, setQuery] = useState("");

  const flatCount = useMemo(
    () => groups.reduce((n, g) => n + g.items.length, 0),
    [groups],
  );

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (it) =>
            it.title.toLowerCase().includes(q) ||
            it.chapitre.toLowerCase().includes(q) ||
            it.niveau.toLowerCase().includes(q) ||
            it.matiere.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  const filteredCount = useMemo(
    () => filteredGroups.reduce((n, g) => n + g.items.length, 0),
    [filteredGroups],
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-3 rounded-2xl border border-navy/10 bg-white/85 p-4 dark:border-slate-700 dark:bg-slate-900/55 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-xs font-semibold text-navy dark:text-gold/90">
          Rechercher un quiz
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Titre, chapitre, niveau…"
            className="select-field py-2"
          />
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400 sm:ms-auto sm:pb-2">
          {filteredCount} / {flatCount} QCM
        </p>
      </div>

      {filteredGroups.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brandblue/30 bg-brandblue/[0.04] px-8 py-12 text-center dark:border-brandblue/25 dark:bg-brandblue/[0.06]">
          <p className="text-base font-medium text-navy dark:text-gold">
            Aucun résultat pour cette recherche.
          </p>
        </div>
      ) : (
        filteredGroups.map((g) => (
          <section
            key={g.label}
            className="scroll-mt-[calc(var(--header-h)+1rem)]"
            aria-labelledby={`quiz-lang-${g.label}`}
          >
            <div className="flex flex-wrap items-end gap-3 border-b border-slate-200/90 pb-4 dark:border-slate-700/80">
              <div
                className={`h-1.5 w-14 shrink-0 rounded-full bg-gradient-to-r ${g.gradient}`}
                aria-hidden
              />
              <h2
                id={`quiz-lang-${g.label}`}
                className="text-lg font-bold text-navy dark:text-white sm:text-xl"
              >
                {g.label}
              </h2>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {g.items.length} quiz
              </span>
            </div>

            {g.items.length === 0 ? (
              <p className="mt-4 text-sm italic text-slate-500 dark:text-slate-500">
                Aucun QCM publié pour cette langue pour le moment — revenez
                bientôt.
              </p>
            ) : (
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {g.items.map((q) => (
                  <li
                    key={q.id}
                    className="group brand-card flex flex-col overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/10 dark:hover:shadow-black/40"
                  >
                    <div
                      className={`h-1 w-full bg-gradient-to-r ${g.gradient}`}
                      aria-hidden
                    />
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                          QCM
                        </span>
                        <span className="rounded-full border border-brandblue/25 bg-brandblue/5 px-2.5 py-0.5 text-[11px] font-medium text-navy dark:border-brandblue/30 dark:bg-brandblue/10 dark:text-brandblue">
                          {q.niveau}
                        </span>
                        <span className="rounded-full border border-slate-200/90 px-2.5 py-0.5 text-[11px] text-slate-600 dark:border-slate-600 dark:text-slate-400">
                          {q.chapitre}
                        </span>
                      </div>
                      <h3 className="mt-3 text-base font-bold leading-snug text-slate-900 dark:text-white">
                        {q.title}
                      </h3>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-navy/5 pt-3 dark:border-slate-700/80">
                        <span className="text-xs text-slate-500 dark:text-slate-500">
                          Gratuit sans compte
                        </span>
                        <Link
                          href={`/quiz/${q.id}`}
                          className="text-xs font-semibold text-brandblue transition hover:text-navy dark:hover:text-gold"
                        >
                          Lancer le quiz →
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))
      )}
    </div>
  );
}
