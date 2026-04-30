import { SiteHeader } from "@/components/site-header";
import { PublicQcmRunner } from "@/components/public-qcm-runner";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { ExerciseType } from "@prisma/client";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import {
  CATALOG_MATIERE_I18N_KEY,
  type CatalogLanguageMatiere,
} from "@/lib/language-quiz-catalog";
import { NIVEAU_CATALOG_I18N_KEY, type Niveau } from "@/lib/course-taxonomy";

type PageProps = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "QuizPublicPage" });
  const exercise = await prisma.exercise.findUnique({
    where: { id },
    select: { title: true, published: true, type: true },
  });
  const ok =
    exercise?.published === true && exercise.type === ExerciseType.QCM;
  return {
    title: ok ? exercise.title : t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PublicQuizPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("QuizPublicPage");
  const tCat = await getTranslations("CatalogPage");

  const exercise = await prisma.exercise.findUnique({
    where: { id },
  });

  if (!exercise || !exercise.published || exercise.type !== ExerciseType.QCM) {
    notFound();
  }

  let parsed: {
    questions: Array<{
      id: string;
      prompt: string;
      options: string[];
      correct?: number;
    }>;
  };
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

  const matKey =
    exercise.matiere in CATALOG_MATIERE_I18N_KEY
      ? CATALOG_MATIERE_I18N_KEY[exercise.matiere as CatalogLanguageMatiere]
      : null;
  const matiereLabel = matKey
    ? tCat(`matieres.${matKey}` as Parameters<typeof tCat>[0])
    : exercise.matiere;

  const nivKey =
    exercise.niveau in NIVEAU_CATALOG_I18N_KEY
      ? NIVEAU_CATALOG_I18N_KEY[exercise.niveau as Niveau]
      : null;
  const niveauLabel = nivKey
    ? tCat(`niveaux.${nivKey}` as Parameters<typeof tCat>[0])
    : exercise.niveau;

  return (
    <>
      <SiteHeader />
      <main className="page-bg mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <nav className="mb-6 text-sm">
          <Link
            href="/cours"
            className="font-medium text-brandblue hover:underline dark:text-brandblue"
          >
            {t("backToQuizzes")}
          </Link>
        </nav>

        <div className="rounded-2xl border border-navy/10 bg-white/90 p-6 shadow-md dark:border-slate-700 dark:bg-slate-900/60 sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {t("badge")}
          </p>
          <h1 className="mt-2 text-xl font-bold text-navy dark:text-white sm:text-2xl">
            {exercise.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {matiereLabel} · {niveauLabel} · {exercise.chapitre}
          </p>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
            {t("noteBody")}
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
