import { ExerciseType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Matière détectée par la correction → matière du catalogue de quiz. */
const SUBJECT_TO_CATALOG: Array<[RegExp, string]> = [
  [/math/, "Mathématiques"],
  [/physique|chimie/, "Physique-Chimie"],
  [/svt|sciences de la vie|biologie|geologie/, "SVT"],
  [/histoire|geographie/, "Histoire-Géographie"],
  [/anglais americain/, "Anglais américain"],
  [/anglais|english/, "Anglais"],
  [/francais/, "Français"],
  [/espagnol/, "Espagnol"],
  [/allemand/, "Allemand"],
  [/chinois|mandarin/, "Chinois (mandarin)"],
];

export function catalogMatiereForSubject(subject: string | null | undefined): string | null {
  if (!subject) return null;
  const s = norm(subject);
  for (const [re, matiere] of SUBJECT_TO_CATALOG) {
    if (re.test(s)) return matiere;
  }
  return null;
}

export type QuizSuggestion = { id: string; title: string; chapitre: string; niveau: string };

/** Quiz existants correspondant à la matière, classés par proximité avec la notion. */
export async function findQuizzesForNotion(
  subject: string | null | undefined,
  notion: string | null | undefined,
  take = 3,
): Promise<{ matiere: string | null; quizzes: QuizSuggestion[] }> {
  const matiere = catalogMatiereForSubject(subject);
  if (!matiere) return { matiere: null, quizzes: [] };

  const rows = await prisma.exercise.findMany({
    where: { published: true, type: ExerciseType.QCM, matiere },
    select: { id: true, title: true, chapitre: true, niveau: true },
    take: 60,
  });

  const words = norm(notion ?? "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 4);
  const scored = rows
    .map((r) => {
      const hay = norm(`${r.title} ${r.chapitre}`);
      const score = words.reduce((acc, w) => acc + (hay.includes(w) ? 1 : 0), 0);
      return { r, score };
    })
    .sort((a, b) => b.score - a.score);

  return { matiere, quizzes: scored.slice(0, take).map((x) => x.r) };
}
