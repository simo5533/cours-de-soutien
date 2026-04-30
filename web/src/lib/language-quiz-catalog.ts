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

/** Niveaux langues (bandes CECRL simplifiées A / B / C). */
export const LANGUAGE_LEVEL_KEYS = ["A", "B", "C"] as const;

export type LanguageLevelKey = (typeof LANGUAGE_LEVEL_KEYS)[number];

/** Niveaux tronc commun (cycles). */
export const STEM_LEVEL_KEYS = ["Primaire", "Collège", "Lycée"] as const;

export type StemLevelKey = (typeof STEM_LEVEL_KEYS)[number];

/** Autres matières affichées après les langues (tronc commun). */
export const CATALOG_STEM_MATIERES = [
  "Mathématiques",
  "Physique-Chimie",
  "SVT",
  "Histoire-Géographie",
] as const;

export type CatalogStemMatiere = (typeof CATALOG_STEM_MATIERES)[number];

/** Clés `CatalogPage.matieres.{key}` — langues */
export const CATALOG_MATIERE_I18N_KEY: Record<CatalogLanguageMatiere, string> =
  {
    Français: "french",
    Espagnol: "spanish",
    Anglais: "english",
    "Anglais américain": "englishUS",
    Allemand: "german",
    "Chinois (mandarin)": "chinese",
  };

/** Clés `CatalogPage.matieres.{key}` — tronc commun */
export const CATALOG_STEM_MATIERE_I18N_KEY: Record<
  CatalogStemMatiere,
  string
> = {
  Mathématiques: "mathematics",
  "Physique-Chimie": "physics",
  SVT: "svt",
  "Histoire-Géographie": "historyGeo",
};

/** Suffixe i18n `matieres.*` pour une matière catalogue, ou null si inconnu. */
export function catalogMatiereI18nSuffix(matiere: string): string | null {
  if (matiere in CATALOG_MATIERE_I18N_KEY) {
    return CATALOG_MATIERE_I18N_KEY[matiere as CatalogLanguageMatiere];
  }
  if (matiere in CATALOG_STEM_MATIERE_I18N_KEY) {
    return CATALOG_STEM_MATIERE_I18N_KEY[matiere as CatalogStemMatiere];
  }
  return null;
}

export function isCatalogLanguageMatiere(matiere: string): boolean {
  return (CATALOG_LANGUAGE_MATIERES as readonly string[]).includes(matiere);
}

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

export const STEM_MATIERE_GRADIENT: Record<CatalogStemMatiere, string> = {
  Mathématiques: "from-violet-600 to-brandblue",
  "Physique-Chimie": "from-cyan-600 to-slate-800",
  SVT: "from-emerald-600 to-teal-900",
  "Histoire-Géographie": "from-amber-600 to-rose-900",
};

export type QuizCatalogRow = {
  id: string;
  title: string;
  matiere: string;
  niveau: string;
  chapitre: string;
};

export type QuizCatalogSubgroup = {
  /** Valeur stockée en base : A, B, C ou Primaire, Collège, Lycée */
  niveauBucket: string;
  items: QuizCatalogRow[];
};

export type QuizCatalogGroup = {
  label: string;
  gradient: string;
  subgroups: QuizCatalogSubgroup[];
};

function splitIntoLevelSubgroups(
  matiere: string,
  items: QuizCatalogRow[],
): QuizCatalogSubgroup[] {
  const isLang = isCatalogLanguageMatiere(matiere);
  const order: readonly string[] = isLang ? LANGUAGE_LEVEL_KEYS : STEM_LEVEL_KEYS;
  const map = new Map<string, QuizCatalogRow[]>();
  for (const row of items) {
    const list = map.get(row.niveau);
    if (list) list.push(row);
    else map.set(row.niveau, [row]);
  }
  const subgroups: QuizCatalogSubgroup[] = [];
  for (const key of order) {
    subgroups.push({ niveauBucket: key, items: map.get(key) ?? [] });
    map.delete(key);
  }
  for (const [k, rows] of map) {
    if (rows.length > 0) {
      subgroups.push({ niveauBucket: k, items: rows });
    }
  }
  return subgroups;
}

export function groupQuizzesForCatalog(rows: QuizCatalogRow[]): QuizCatalogGroup[] {
  const byMatiere = new Map<string, QuizCatalogRow[]>();
  for (const r of rows) {
    const list = byMatiere.get(r.matiere);
    if (list) list.push(r);
    else byMatiere.set(r.matiere, [r]);
  }

  const out: QuizCatalogGroup[] = [];
  for (const lang of CATALOG_LANGUAGE_MATIERES) {
    const items = byMatiere.get(lang) ?? [];
    out.push({
      label: lang,
      gradient: LANGUAGE_MATIERE_GRADIENT[lang],
      subgroups: splitIntoLevelSubgroups(lang, items),
    });
    byMatiere.delete(lang);
  }

  for (const m of CATALOG_STEM_MATIERES) {
    const items = byMatiere.get(m) ?? [];
    out.push({
      label: m,
      gradient: STEM_MATIERE_GRADIENT[m],
      subgroups: splitIntoLevelSubgroups(m, items),
    });
    byMatiere.delete(m);
  }

  const rest = Array.from(byMatiere.entries())
    .filter(([, items]) => items.length > 0)
    .sort((a, b) => a[0].localeCompare(b[0], "fr"));
  for (const [matiere, items] of rest) {
    out.push({
      label: matiere,
      gradient: "from-slate-600 to-brandblue",
      subgroups: splitIntoLevelSubgroups(matiere, items),
    });
  }
  return out;
}
