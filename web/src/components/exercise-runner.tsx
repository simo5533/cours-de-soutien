"use client";

import { useState } from "react";
import { submitExerciseAttemptAction } from "@/actions/attempts";

type QcmQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
};

type QcmContent = { questions: QcmQuestion[] };
type OuvertContent = { questions: { id: string; prompt: string }[] };

export function ExerciseRunner({
  exerciseId,
  type,
  contentJson,
}: {
  exerciseId: string;
  type: "QCM" | "OUVERT";
  contentJson: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const content =
    type === "QCM"
      ? (JSON.parse(contentJson) as QcmContent)
      : (JSON.parse(contentJson) as OuvertContent);

  async function onSubmitQcm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    const answers: Record<string, number> = {};
    for (const q of (content as QcmContent).questions) {
      const v = fd.get(q.id);
      if (v === null) {
        setMessage("Répondez à toutes les questions.");
        setPending(false);
        return;
      }
      answers[q.id] = Number(v);
    }
    const res = await submitExerciseAttemptAction(exerciseId, answers);
    setPending(false);
    if (res?.error) {
      setMessage(res.error);
      return;
    }
    if (res && "score" in res && res.score !== undefined) {
      setMessage(`Score : ${res.score.toFixed(1)} / ${res.maxScore}`);
    }
  }

  async function onSubmitOuvert(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    const answers: Record<string, string> = {};
    for (const q of (content as OuvertContent).questions) {
      answers[q.id] = String(fd.get(q.id) ?? "");
    }
    const res = await submitExerciseAttemptAction(exerciseId, answers);
    setPending(false);
    if (res?.error) {
      setMessage(res.error);
      return;
    }
    if (res && "pending" in res && res.pending) {
      setMessage("Réponse envoyée. En attente de correction par le professeur.");
    }
  }

  if (type === "QCM") {
    const c = content as QcmContent;
    return (
      <form onSubmit={onSubmitQcm} className="space-y-6">
        {c.questions.map((q) => (
          <fieldset key={q.id} className="space-y-2">
            <legend className="font-medium">{q.prompt}</legend>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, idx) => (
                <label
                  key={opt}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={idx}
                    required
                    className="accent-brandblue"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {message ? (
          <p className="rounded-lg bg-brandblue/10 px-3 py-2 text-sm text-navy dark:bg-navy dark:text-brandblue/90">
            {message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-navy px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? "Envoi…" : "Valider le QCM"}
        </button>
      </form>
    );
  }

  const o = content as OuvertContent;
  return (
    <form onSubmit={onSubmitOuvert} className="space-y-6">
      {o.questions.map((q) => (
        <label key={q.id} className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{q.prompt}</span>
          <textarea
            name={q.id}
            required
            rows={5}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
      ))}
      {message ? (
        <p className="rounded-lg bg-gold/10 px-3 py-2 text-sm text-navy dark:bg-navy dark:text-gold">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-navy px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}
