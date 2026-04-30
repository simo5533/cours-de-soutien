"use client";

import { gradePublicQcmAction } from "@/actions/public-quiz";
import { useState } from "react";

type QcmQuestionPublic = {
  id: string;
  prompt: string;
  options: string[];
};

type QcmContentPublic = { questions: QcmQuestionPublic[] };

export function PublicQcmRunner({
  exerciseId,
  contentJson,
}: {
  exerciseId: string;
  contentJson: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const content = JSON.parse(contentJson) as QcmContentPublic;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    const answers: Record<string, number> = {};
    for (const q of content.questions) {
      const v = fd.get(q.id);
      if (v === null) {
        setMessage("Répondez à toutes les questions.");
        setPending(false);
        return;
      }
      answers[q.id] = Number(v);
    }
    const res = await gradePublicQcmAction(exerciseId, answers);
    setPending(false);
    if (res && "error" in res && res.error) {
      setMessage(res.error);
      return;
    }
    if (res && "ok" in res && res.ok && res.score !== undefined) {
      setMessage(
        `Score : ${res.score.toFixed(1)} / ${res.maxScore} (gratuit, non enregistré). Connexion élève requise pour sauvegarder la note.`,
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {content.questions.map((q) => (
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
        {pending ? "Calcul…" : "Valider le QCM"}
      </button>
    </form>
  );
}
