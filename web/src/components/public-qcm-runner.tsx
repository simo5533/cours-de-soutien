"use client";

import { gradePublicQcmAction } from "@/actions/public-quiz";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

type QcmQuestionPublic = {
  id: string;
  prompt: string;
  options: string[];
};

type QcmContentPublic = { questions: QcmQuestionPublic[] };

type QuizResult = {
  score: number;
  maxScore: number;
  errorCount: number;
};

export function PublicQcmRunner({
  exerciseId,
  contentJson,
}: {
  exerciseId: string;
  contentJson: string;
}) {
  const t = useTranslations("PublicQcmRunner");
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [pending, setPending] = useState(false);

  const content = JSON.parse(contentJson) as QcmContentPublic;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    const answers: Record<string, number> = {};
    for (const q of content.questions) {
      const v = fd.get(q.id);
      if (v === null) {
        setMessage(t("answerAll"));
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
    if (res && "ok" in res && res.ok && res.score !== undefined && res.maxScore !== undefined) {
      const errorCount = Math.max(0, Math.round(res.maxScore - res.score));
      setResult({
        score: res.score,
        maxScore: res.maxScore,
        errorCount,
      });
      setMessage(
        errorCount > 0
          ? t("scoreResult", {
              score: res.score.toFixed(1),
              max: res.maxScore,
              errors: errorCount,
            })
          : t("scoreResultNoErrors", {
              score: res.score.toFixed(1),
              max: res.maxScore,
            }),
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
        <div className="space-y-4 rounded-xl border border-brandblue/20 bg-brandblue/10 px-4 py-4 dark:border-brandblue/25 dark:bg-brandblue/10">
          <p className="text-sm font-medium text-navy dark:text-brandblue/95">{message}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">{t("freeNote")}</p>
          {result && result.errorCount > 0 ? (
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href="/inscription?plan=free"
                className="inline-flex justify-center rounded-full bg-navy px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-navy/90 dark:bg-brandblue"
              >
                {t("correctErrorsCta")}
              </Link>
              <Link
                href="/tarifs"
                className="inline-flex justify-center rounded-full border border-navy/30 bg-white px-5 py-2.5 text-center text-sm font-semibold text-navy transition hover:bg-slate-50 dark:border-brandblue/40 dark:bg-slate-900 dark:text-brandblue"
              >
                {t("teacherValidationCta")}
              </Link>
            </div>
          ) : null}
          {result && result.errorCount > 0 ? (
            <p className="text-xs text-slate-600 dark:text-slate-400">{t("teacherValidationHint")}</p>
          ) : null}
          {result ? (
            <p className="text-xs text-slate-500">{t("signupForAi")}</p>
          ) : null}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-navy px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
