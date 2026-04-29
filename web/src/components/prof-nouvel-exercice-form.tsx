"use client";

import { createExerciseAction } from "@/actions/exercises";
import { MATIERES, NIVEAUX } from "@/lib/course-taxonomy";
import { ANNEES_SCOLAIRES } from "@/lib/school-years";
import { Link } from "@/i18n/navigation";
import { useState } from "react";

function encodeCibleOption(groupe: string, anneeScolaire: string) {
  return `${encodeURIComponent(groupe)}###${encodeURIComponent(anneeScolaire)}`;
}

type Cible = { groupe: string; anneeScolaire: string };

type QcmDraft = { prompt: string; options: string[]; correct: number };
type OpenDraft = { prompt: string };

export function ProfNouvelExerciceForm({
  ciblesUniques,
}: {
  ciblesUniques: Cible[];
}) {
  const [exerciseType, setExerciseType] = useState<"QCM" | "OUVERT">("QCM");
  const [formError, setFormError] = useState<string | null>(null);
  const [qcmQuestions, setQcmQuestions] = useState<QcmDraft[]>([
    { prompt: "", options: ["", ""], correct: 0 },
  ]);
  const [openQuestions, setOpenQuestions] = useState<OpenDraft[]>([
    { prompt: "" },
  ]);

  function buildContentJson(type: "QCM" | "OUVERT"): string | null {
    setFormError(null);
    if (type === "QCM") {
      const questions: {
        id: string;
        prompt: string;
        options: string[];
        correct: number;
      }[] = [];
      for (let i = 0; i < qcmQuestions.length; i++) {
        const q = qcmQuestions[i];
        const prompt = q.prompt.trim();
        const options = q.options.map((o) => o.trim()).filter(Boolean);
        if (!prompt) {
          setFormError(`Question ${i + 1} : saisissez l’intitulé.`);
          return null;
        }
        if (options.length < 2) {
          setFormError(
            `Question ${i + 1} : au moins deux réponses possibles sont nécessaires.`,
          );
          return null;
        }
        const correct = Math.min(Math.max(0, q.correct), options.length - 1);
        questions.push({
          id: `q${i + 1}`,
          prompt,
          options,
          correct,
        });
      }
      if (questions.length === 0) {
        setFormError("Ajoutez au moins une question.");
        return null;
      }
      return JSON.stringify({ questions });
    }

    const questions = openQuestions
      .map((q) => q.prompt.trim())
      .filter(Boolean)
      .map((prompt, i) => ({ id: `q${i + 1}`, prompt }));
    if (questions.length === 0) {
      setFormError("Ajoutez au moins une question avec un intitulé.");
      return null;
    }
    return JSON.stringify({ questions });
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link
        href="/professeur/exercices"
        className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
      >
        ← Retour aux exercices
      </Link>
      <h2 className="text-lg font-semibold">Nouvel exercice ou QCM</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Rédigez les questions comme dans un manuel : intitulé, choix pour un
        QCM, ou réponse libre pour un exercice ouvert. Aucun code à saisir.
      </p>
      <form
        action={createExerciseAction}
        className="space-y-4"
        onSubmit={(e) => {
          const json = buildContentJson(exerciseType);
          if (!json) {
            e.preventDefault();
            return;
          }
          const el = e.currentTarget.elements.namedItem(
            "contentJson",
          ) as HTMLTextAreaElement;
          el.value = json;
        }}
      >
        <textarea
          name="contentJson"
          className="hidden"
          readOnly
          aria-hidden
          tabIndex={-1}
          defaultValue=""
        />
        {formError ? (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-100"
          >
            {formError}
          </p>
        ) : null}
        <label className="flex flex-col gap-1 text-sm">
          <span>Titre de l’exercice</span>
          <input
            name="title"
            required
            placeholder="ex. Équations du second degré — entraînement"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Matière</span>
          <select
            name="matiere"
            required
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {MATIERES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Niveau</span>
          <select
            name="niveau"
            required
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {NIVEAUX.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Chapitre</span>
          <input
            name="chapitre"
            required
            placeholder="ex. Fonctions affines"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Date limite de rendu (optionnel)</span>
          <input
            type="datetime-local"
            name="deadlineAt"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <span className="text-xs font-normal text-zinc-500">
            Après cette date, l’élève ne peut plus répondre. S’il n’a rien
            rendu, la note est mise à 0 / 20 automatiquement.
          </span>
        </label>
        <p className="text-xs text-zinc-500">
          Ciblage optionnel : sans filtre, tous les élèves concernés par ce
          niveau voient l’exercice ; avec un groupe et une année, seulement
          cette classe.
        </p>
        {ciblesUniques.length > 0 ? (
          <label className="flex flex-col gap-1 text-sm">
            <span>Groupe et année cibles</span>
            <select
              name="groupeCiblePreset"
              defaultValue=""
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="">
                Tous les élèves (pas de filtre groupe / année)
              </option>
              {ciblesUniques.map((a) => {
                const v = encodeCibleOption(a.groupe, a.anneeScolaire);
                return (
                  <option key={v} value={v}>
                    {a.groupe} — {a.anneeScolaire}
                  </option>
                );
              })}
            </select>
            <span className="text-xs text-zinc-500">
              Liste issue de vos affectations. Les élèves doivent avoir le même
              groupe et la même année sur leur fiche.
            </span>
          </label>
        ) : (
          <>
            <p className="text-xs text-amber-700 dark:text-amber-400/90">
              Aucune affectation enregistrée : indiquez le groupe comme sur la
              fiche élève, et l’année si besoin.
            </p>
            <label className="flex flex-col gap-1 text-sm">
              <span>Groupe cible</span>
              <input
                name="groupeCible"
                placeholder="ex. Terminale 1 (vide = tous)"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Année scolaire cible</span>
              <select
                name="anneeScolaireCible"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                defaultValue=""
              >
                <option value="">Toutes</option>
                {ANNEES_SCOLAIRES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        <label className="flex flex-col gap-1 text-sm">
          <span>Type d’exercice</span>
          <select
            name="type"
            required
            value={exerciseType}
            onChange={(e) =>
              setExerciseType(e.target.value as "QCM" | "OUVERT")
            }
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="QCM">QCM (choix multiples)</option>
            <option value="OUVERT">Réponse ouverte (rédaction)</option>
          </select>
        </label>

        {exerciseType === "QCM" ? (
          <div className="space-y-6 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Questions du QCM
            </p>
            {qcmQuestions.map((q, qi) => (
              <div
                key={qi}
                className="space-y-3 border-b border-zinc-200 pb-4 last:border-0 dark:border-zinc-700"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-zinc-500">
                    Question {qi + 1}
                  </span>
                  {qcmQuestions.length > 1 ? (
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:underline dark:text-red-400"
                      onClick={() =>
                        setQcmQuestions((prev) =>
                          prev.filter((_, i) => i !== qi),
                        )
                      }
                    >
                      Supprimer
                    </button>
                  ) : null}
                </div>
                <label className="flex flex-col gap-1 text-sm">
                  <span>Intitulé</span>
                  <textarea
                    value={q.prompt}
                    onChange={(e) => {
                      const v = e.target.value;
                      setQcmQuestions((prev) =>
                        prev.map((x, i) =>
                          i === qi ? { ...x, prompt: v } : x,
                        ),
                      );
                    }}
                    rows={2}
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                    placeholder="Votre question…"
                  />
                </label>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Réponses possibles (cochez la bonne)
                </p>
                <ul className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <li
                      key={oi}
                      className="flex flex-wrap items-center gap-2"
                    >
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={q.correct === oi}
                        onChange={() =>
                          setQcmQuestions((prev) =>
                            prev.map((x, i) =>
                              i === qi ? { ...x, correct: oi } : x,
                            ),
                          )
                        }
                        className="shrink-0"
                        title="Bonne réponse"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const v = e.target.value;
                          setQcmQuestions((prev) =>
                            prev.map((x, i) => {
                              if (i !== qi) return x;
                              const next = [...x.options];
                              next[oi] = v;
                              return { ...x, options: next };
                            }),
                          );
                        }}
                        placeholder={`Proposition ${oi + 1}`}
                        className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      />
                      {q.options.length > 2 ? (
                        <button
                          type="button"
                          className="text-xs text-zinc-500 hover:text-red-600"
                          onClick={() =>
                            setQcmQuestions((prev) =>
                              prev.map((x, i) => {
                                if (i !== qi) return x;
                                const next = x.options.filter(
                                  (_, j) => j !== oi,
                                );
                                let correct = x.correct;
                                if (oi === correct) correct = 0;
                                else if (oi < correct) correct -= 1;
                                return {
                                  ...x,
                                  options: next,
                                  correct: Math.min(
                                    correct,
                                    next.length - 1,
                                  ),
                                };
                              }),
                            )
                          }
                        >
                          Retirer
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="text-sm font-medium text-navy hover:underline dark:text-brandblue"
                  onClick={() =>
                    setQcmQuestions((prev) =>
                      prev.map((x, i) =>
                        i === qi
                          ? { ...x, options: [...x.options, ""] }
                          : x,
                      ),
                    )
                  }
                >
                  + Ajouter une proposition
                </button>
              </div>
            ))}
            <button
              type="button"
              className="w-full rounded-lg border border-dashed border-zinc-300 py-2 text-sm font-medium text-zinc-700 hover:bg-white dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              onClick={() =>
                setQcmQuestions((prev) => [
                  ...prev,
                  { prompt: "", options: ["", ""], correct: 0 },
                ])
              }
            >
              + Ajouter une question
            </button>
          </div>
        ) : (
          <div className="space-y-6 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Questions à rédaction libre
            </p>
            {openQuestions.map((q, qi) => (
              <div
                key={qi}
                className="space-y-2 border-b border-zinc-200 pb-4 last:border-0 dark:border-zinc-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500">
                    Question {qi + 1}
                  </span>
                  {openQuestions.length > 1 ? (
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:underline dark:text-red-400"
                      onClick={() =>
                        setOpenQuestions((prev) =>
                          prev.filter((_, i) => i !== qi),
                        )
                      }
                    >
                      Supprimer
                    </button>
                  ) : null}
                </div>
                <textarea
                  value={q.prompt}
                  onChange={(e) => {
                    const v = e.target.value;
                    setOpenQuestions((prev) =>
                      prev.map((x, i) => (i === qi ? { prompt: v } : x)),
                    );
                  }}
                  rows={3}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  placeholder="Consigne pour l’élève (réponse libre)…"
                />
              </div>
            ))}
            <button
              type="button"
              className="w-full rounded-lg border border-dashed border-zinc-300 py-2 text-sm font-medium text-zinc-700 hover:bg-white dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              onClick={() =>
                setOpenQuestions((prev) => [...prev, { prompt: "" }])
              }
            >
              + Ajouter une question
            </button>
          </div>
        )}

        <button
          type="submit"
          className="rounded-full bg-navy px-5 py-2 text-sm font-medium text-white hover:bg-navy/90"
        >
          Publier l’exercice
        </button>
      </form>
    </div>
  );
}
