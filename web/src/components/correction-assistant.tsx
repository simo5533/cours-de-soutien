"use client";

import { useState } from "react";

type Msg = { id?: string; role: "user" | "assistant"; action: string | null; content: string };

type QuickAction = { action: string; label: string };

const QUICK_ACTIONS: QuickAction[] = [
  { action: "explain_differently", label: "Explique autrement" },
  { action: "simpler", label: "Explique plus simplement" },
  { action: "why_wrong", label: "Pourquoi cette réponse est fausse ?" },
  { action: "example", label: "Donne-moi un exemple" },
  { action: "arabic", label: "Expliquer en arabe" },
  { action: "darija", label: "Expliquer en darija" },
];

function SimilarExerciseCard({ content }: { content: string }) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  let data: { enonce: string; indice: string; solution: string } | null = null;
  try {
    data = JSON.parse(content);
  } catch {
    data = null;
  }
  if (!data) return <p className="whitespace-pre-wrap">{content}</p>;
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wide text-electric">Exercice similaire</p>
      <p className="whitespace-pre-wrap font-medium text-navy">{data.enonce}</p>
      <p className="text-xs text-muted-text">Essaie d&apos;abord seul, puis vérifie.</p>
      <div className="flex flex-wrap gap-2">
        {data.indice ? (
          <button type="button" className="btn-secondary !py-1.5 !text-xs" onClick={() => setShowHint((v) => !v)}>
            {showHint ? "Masquer l'indice" : "Voir un indice"}
          </button>
        ) : null}
        {data.solution ? (
          <button
            type="button"
            className="btn-secondary !py-1.5 !text-xs"
            onClick={() => setShowSolution((v) => !v)}
          >
            {showSolution ? "Masquer la solution" : "Voir la solution"}
          </button>
        ) : null}
      </div>
      {showHint ? <p className="rounded-lg bg-cyan-ai/10 px-3 py-2 text-sm">{data.indice}</p> : null}
      {showSolution ? (
        <p className="whitespace-pre-wrap rounded-lg bg-success/10 px-3 py-2 text-sm">{data.solution}</p>
      ) : null}
    </div>
  );
}

function GeneratedQuizCard({ content }: { content: string }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  let quiz: { questions: { question: string; options: string[]; correct: number; explication: string }[] } | null =
    null;
  try {
    quiz = JSON.parse(content);
  } catch {
    quiz = null;
  }
  if (!quiz?.questions?.length) return <p className="whitespace-pre-wrap">{content}</p>;
  const score = quiz.questions.filter((q, i) => answers[i] === q.correct).length;

  return (
    <div className="space-y-4">
      <p className="text-xs font-bold uppercase tracking-wide text-electric">Mini-quiz</p>
      {quiz.questions.map((q, i) => (
        <fieldset key={i} className="space-y-2">
          <legend className="text-sm font-semibold text-navy">
            {i + 1}. {q.question}
          </legend>
          {q.options.map((opt, j) => {
            const selected = answers[i] === j;
            const isRight = checked && j === q.correct;
            const isWrong = checked && selected && j !== q.correct;
            return (
              <label
                key={j}
                className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
                  isRight
                    ? "border-success bg-success/10"
                    : isWrong
                      ? "border-red-300 bg-red-50"
                      : selected
                        ? "border-electric bg-electric/5"
                        : "border-border-soft"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${i}-${content.length}`}
                  className="mt-0.5"
                  checked={selected}
                  disabled={checked}
                  onChange={() => setAnswers((a) => ({ ...a, [i]: j }))}
                />
                <span>{opt}</span>
              </label>
            );
          })}
          {checked && q.explication ? <p className="text-xs text-muted-text">{q.explication}</p> : null}
        </fieldset>
      ))}
      {checked ? (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold text-navy">
            Score : {score} / {quiz.questions.length}
          </p>
          <button
            type="button"
            className="btn-secondary !py-1.5 !text-xs"
            onClick={() => {
              setAnswers({});
              setChecked(false);
            }}
          >
            Recommencer
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn-primary !py-2 !text-sm"
          disabled={Object.keys(answers).length < quiz.questions.length}
          onClick={() => setChecked(true)}
        >
          Vérifier mes réponses
        </button>
      )}
    </div>
  );
}

function MessageBody({ m }: { m: Msg }) {
  if (m.role === "assistant" && m.action === "similar_exercise") return <SimilarExerciseCard content={m.content} />;
  if (m.role === "assistant" && m.action === "quiz") return <GeneratedQuizCard content={m.content} />;
  return <p className="whitespace-pre-wrap">{m.content}</p>;
}

export function CorrectionAssistant({
  correctionId,
  initialMessages,
  hasErrors,
  readOnly,
}: {
  correctionId: string;
  initialMessages: Msg[];
  hasErrors: boolean;
  readOnly: boolean;
}) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState("");

  async function send(action: string, q?: string) {
    if (pending) return;
    setPending(action);
    setError(null);
    try {
      const res = await fetch("/api/correcteur/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correctionId, action, question: q }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        userMessage?: Msg;
        message?: Msg;
      };
      if (!res.ok || !data.message || !data.userMessage) {
        setError(data.error || "L'assistant n'a pas pu répondre. Réessayez.");
        return;
      }
      setMessages((prev) => [...prev, data.userMessage!, data.message!]);
      if (action === "question") setQuestion("");
    } catch {
      setError("Connexion impossible. Réessayez.");
    } finally {
      setPending(null);
    }
  }

  const quick = QUICK_ACTIONS.filter((a) => a.action !== "why_wrong" || hasErrors);

  return (
    <section className="space-y-4" aria-labelledby="assistant-heading">
      {!readOnly ? (
        <>
          <div className="card-elevated space-y-4 p-5">
            <div>
              <h2 id="assistant-heading" className="text-lg font-bold text-navy">
                S&apos;entraîner
              </h2>
              <p className="text-sm text-muted-text">
                Ne t&apos;arrête pas à la réponse : refais un exercice du même type.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                className="btn-primary justify-center !py-2.5 !text-sm"
                disabled={!!pending}
                onClick={() => send("similar_exercise")}
              >
                {pending === "similar_exercise" ? "Création…" : "Créer un exercice similaire"}
              </button>
              <button
                type="button"
                className="btn-secondary justify-center !py-2.5 !text-sm"
                disabled={!!pending}
                onClick={() => send("quiz")}
              >
                {pending === "quiz" ? "Création…" : "Créer un quiz"}
              </button>
              <button
                type="button"
                className="btn-secondary justify-center !py-2.5 !text-sm"
                disabled={!!pending}
                onClick={() => send("detailed")}
              >
                {pending === "detailed" ? "Rédaction…" : "Explication plus détaillée"}
              </button>
            </div>
          </div>

          <div className="card-elevated space-y-3 p-5">
            <h3 className="text-sm font-semibold text-navy">Assistant de cette correction</h3>
            <div className="flex flex-wrap gap-2">
              {quick.map((a) => (
                <button
                  key={a.action}
                  type="button"
                  disabled={!!pending}
                  onClick={() => send(a.action)}
                  className="rounded-full border border-border-soft bg-white px-3 py-1.5 text-xs font-medium text-navy transition hover:border-electric disabled:opacity-50"
                >
                  {pending === a.action ? "…" : a.label}
                </button>
              ))}
            </div>
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                if (question.trim()) send("question", question.trim());
              }}
            >
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={500}
                placeholder="Pose une question sur cette correction…"
                className="input-field flex-1"
                disabled={!!pending}
              />
              <button type="submit" className="btn-primary !py-2.5" disabled={!!pending || !question.trim()}>
                {pending === "question" ? "…" : "Envoyer"}
              </button>
            </form>
            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </>
      ) : null}

      {messages.length ? (
        <ul className="space-y-3">
          {messages.map((m, i) => (
            <li
              key={m.id ?? `${i}-${m.role}`}
              className={
                m.role === "user"
                  ? "ms-auto max-w-[85%] rounded-2xl bg-electric/10 px-4 py-2 text-sm font-medium text-navy"
                  : "rounded-2xl border border-border-soft bg-white/80 px-4 py-3 text-sm leading-relaxed text-navy"
              }
            >
              <MessageBody m={m} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
