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
        <fieldset
          key={q.id}
          className="site-card-bg space-y-3 rounded-xl border border-border-soft p-4"
        >
          <legend className="text-base font-medium leading-snug break-words text-navy">
            {q.prompt}
          </legend>
          <div className="flex flex-col gap-2">
            {q.options.map((opt, idx) => (
              <label
                key={opt}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-2 py-2 text-sm transition hover:border-border-soft hover:bg-white/80"
              >
                <input
                  type="radio"
                  name={q.id}
                  value={idx}
                  required
                  className="mt-0.5 shrink-0 accent-brandblue"
                />
                <span className="min-w-0 flex-1 break-words leading-snug">{opt}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      {message ? (
        <div className="site-card-bg space-y-4 rounded-xl border border-border-soft px-4 py-4 backdrop-blur-sm">
          <p className="text-sm font-medium text-navy">{message}</p>
          <p className="text-xs text-muted-text">{t("freeNote")}</p>
          {result && result.errorCount > 0 ? (
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href="/inscription?plan=free"
                className="btn-primary inline-flex justify-center !py-2.5"
              >
                {t("correctErrorsCta")}
              </Link>
              <Link
                href="/tarifs"
                className="btn-secondary inline-flex justify-center !py-2.5"
              >
                {t("teacherValidationCta")}
              </Link>
            </div>
          ) : null}
          {result && result.errorCount > 0 ? (
            <p className="text-xs text-muted-text">{t("teacherValidationHint")}</p>
          ) : null}
          {result ? (
            <p className="text-xs text-muted-text">{t("signupForAi")}</p>
          ) : null}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full sm:w-auto disabled:opacity-60"
      >
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
