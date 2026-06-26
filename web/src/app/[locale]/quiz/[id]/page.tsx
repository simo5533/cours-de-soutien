import { SiteHeader } from "@/components/site-header";
import { PublicQcmRunner } from "@/components/public-qcm-runner";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { ExerciseType } from "@prisma/client";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { catalogMatiereI18nSuffix, isCatalogLanguageMatiere } from "@/lib/language-quiz-catalog";
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

  const matSuffix = catalogMatiereI18nSuffix(exercise.matiere);
  const matiereLabel = matSuffix
    ? tCat(`matieres.${matSuffix}` as Parameters<typeof tCat>[0])
    : exercise.matiere;

  let niveauLabel: string;
  if (
    isCatalogLanguageMatiere(exercise.matiere) &&
    (exercise.niveau === "A" ||
      exercise.niveau === "B" ||
      exercise.niveau === "C")
  ) {
    niveauLabel = tCat(
      `langLevels.${exercise.niveau}` as Parameters<typeof tCat>[0],
    );
  } else if (exercise.niveau in NIVEAU_CATALOG_I18N_KEY) {
    const nivKey = NIVEAU_CATALOG_I18N_KEY[exercise.niveau as Niveau];
    niveauLabel = tCat(`niveaux.${nivKey}` as Parameters<typeof tCat>[0]);
  } else {
    niveauLabel = exercise.niveau;
  }

  return (
    <div className="site-bg flex min-h-full flex-col">
      <SiteHeader />
      <main className="page-bg mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <nav className="mb-6 text-sm">
          <Link
            href="/cours"
            className="font-medium text-electric hover:underline"
          >
            {t("backToQuizzes")}
          </Link>
        </nav>

        <div className="card-elevated p-6 sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-wider text-success">
            {t("badge")}
          </p>
          <h1 className="font-display mt-2 text-xl font-bold text-navy sm:text-2xl">
            {exercise.title}
          </h1>
          <p className="mt-1 text-sm text-muted-text">
            {matiereLabel} · {niveauLabel} · {exercise.chapitre}
          </p>
          <p className="mt-4 text-xs text-muted-text">
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
    </div>
  );
}
