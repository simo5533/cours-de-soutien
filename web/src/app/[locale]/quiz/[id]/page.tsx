import { SiteHeader } from "@/components/site-header";
import { PublicQcmRunner } from "@/components/public-qcm-runner";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { ExerciseType } from "@prisma/client";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ locale: string; id: string }> };

export default async function PublicQuizPage({ params }: PageProps) {
  const { id } = await params;

  const exercise = await prisma.exercise.findUnique({
    where: { id },
  });

  if (!exercise || !exercise.published || exercise.type !== ExerciseType.QCM) {
    notFound();
  }

  let parsed: { questions: Array<{ id: string; prompt: string; options: string[]; correct?: number }> };
  try {
    parsed = JSON.parse(exercise.contentJson) as typeof parsed;
  } catch {
    notFound();
  }

  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    notFound();
  }

  const safe = {
    questions: parsed.questions.map(({ id: qid, prompt, options }) => ({
      id: qid,
      prompt,
      options,
    })),
  };

  return (
    <>
      <SiteHeader />
      <main className="page-bg mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <nav className="mb-6 text-sm">
          <Link
            href="/cours"
            className="font-medium text-brandblue hover:underline dark:text-brandblue"
          >
            ← Retour aux quiz
          </Link>
        </nav>

        <div className="rounded-2xl border border-navy/10 bg-white/90 p-6 shadow-md dark:border-slate-700 dark:bg-slate-900/60 sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Quiz gratuit — sans connexion
          </p>
          <h1 className="mt-2 text-xl font-bold text-navy dark:text-white sm:text-2xl">
            {exercise.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {exercise.matiere} · {exercise.niveau} · {exercise.chapitre}
          </p>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
            Votre score s’affiche ici ; il n’est pas enregistré sur votre compte.
            Connectez-vous en tant qu’élève pour que les tentatives comptent dans
            l’espace pédagogique.
          </p>

          <div className="mt-8">
            <PublicQcmRunner
              exerciseId={exercise.id}
              contentJson={JSON.stringify(safe)}
            />
          </div>
        </div>
      </main>
    </>
  );
}
