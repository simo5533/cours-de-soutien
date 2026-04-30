/** Matières « langues » attendues dans `Exercise.matiere` pour le catalogue public quiz. */

export const CATALOG_LANGUAGE_MATIERES = [
  "Français",
  "Espagnol",
  "Anglais",
  "Anglais américain",
  "Allemand",
  "Chinois (mandarin)",
] as const;

export type CatalogLanguageMatiere =
  (typeof CATALOG_LANGUAGE_MATIERES)[number];

export const LANGUAGE_MATIERE_GRADIENT: Record<
  CatalogLanguageMatiere,
  string
> = {
  Français: "from-navy to-brandblue",
  Espagnol: "from-brandblue to-navy",
  Anglais: "from-gold/90 to-navy",
  "Anglais américain": "from-brandblue via-navy to-brandblue",
  Allemand: "from-navy via-gold/70 to-navy",
  "Chinois (mandarin)": "from-red-700/90 via-gold to-navy",
};

export type QuizCatalogRow = {
  id: string;
  title: string;
  matiere: string;
  niveau: string;
  chapitre: string;
};

export type QuizCatalogGroup = {
  label: string;
  gradient: string;
  items: QuizCatalogRow[];
};

export function groupQuizzesForCatalog(rows: QuizCatalogRow[]): QuizCatalogGroup[] {
  const byMatiere = new Map<string, QuizCatalogRow[]>();
  for (const r of rows) {
    const list = byMatiere.get(r.matiere);
    if (list) list.push(r);
    else byMatiere.set(r.matiere, [r]);
  }

  const out: QuizCatalogGroup[] = [];
  for (const lang of CATALOG_LANGUAGE_MATIERES) {
    out.push({
      label: lang,
      gradient: LANGUAGE_MATIERE_GRADIENT[lang],
      items: byMatiere.get(lang) ?? [],
    });
    byMatiere.delete(lang);
  }

  const rest = Array.from(byMatiere.entries())
    .filter(([, items]) => items.length > 0)
    .sort((a, b) => a[0].localeCompare(b[0], "fr"));
  for (const [matiere, items] of rest) {
    out.push({
      label: matiere,
      gradient: "from-slate-600 to-brandblue",
      items,
    });
  }
  return out;
}
