import { auth } from "@/auth";
import { gradeOpenAttemptAction } from "@/actions/attempts";
import { prisma } from "@/lib/prisma";

function parseOpenQuestions(contentJson: string): { id: string; prompt: string }[] {
  try {
    const c = JSON.parse(contentJson) as {
      questions?: { id: string; prompt: string }[];
    };
    return Array.isArray(c.questions) ? c.questions : [];
  } catch {
    return [];
  }
}

export default async function ProfesseurCorrectionsPage() {
  const session = await auth();
  const attempts = await prisma.exerciseAttempt.findMany({
    where: {
      status: "EN_ATTENTE",
      exercise: { authorId: session!.user.id, type: "OUVERT" },
    },
    include: { exercise: true, student: true },
    orderBy: { submittedAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Réponses ouvertes en attente de note et de commentaire.
      </p>
      {attempts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          Aucune copie à corriger.
        </div>
      ) : (
        <ul className="space-y-8">
          {attempts.map((a) => {
            let answers: Record<string, string> = {};
            try {
              answers = JSON.parse(a.answersJson) as Record<string, string>;
            } catch {
              answers = {};
            }
            const questions = parseOpenQuestions(a.exercise.contentJson);
            return (
              <li
                key={a.id}
                className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <p className="font-medium">{a.exercise.title}</p>
                <p className="text-xs text-zinc-500">
                  Élève : {a.student.name} —{" "}
                  {new Date(a.submittedAt).toLocaleString("fr-FR")}
                </p>
                <div className="mt-3 space-y-4 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/60">
                  {questions.length === 0 ? (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Réponses de l’élève :
                    </p>
                  ) : null}
                  {questions.length > 0
                    ? questions.map((q, idx) => (
                        <div key={q.id}>
                          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {idx + 1}. {q.prompt}
                          </p>
                          <p className="mt-1.5 whitespace-pre-wrap rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-300">
                            {answers[q.id]?.trim() || "— (aucune réponse)"}
                          </p>
                        </div>
                      ))
                    : Object.entries(answers).map(([id, text]) => (
                        <div key={id}>
                          <p className="text-xs font-medium text-zinc-500">
                            Réponse {id}
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                            {text?.trim() || "—"}
                          </p>
                        </div>
                      ))}
                </div>
                <form
                  action={gradeOpenAttemptAction}
                  className="mt-4 flex flex-wrap items-end gap-3"
                >
                  <input type="hidden" name="attemptId" value={a.id} />
                  <label className="flex flex-col gap-1 text-xs">
                    Note
                    <input
                      name="score"
                      type="number"
                      step="0.5"
                      min="0"
                      required
                      className="w-24 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    Sur
                    <input
                      name="maxScore"
                      type="number"
                      step="0.5"
                      min="0"
                      defaultValue={20}
                      required
                      className="w-24 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700"
                    />
                  </label>
                  <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-xs">
                    Commentaire
                    <input
                      name="feedback"
                      type="text"
                      className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700"
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-full bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90"
                  >
                    Enregistrer
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
