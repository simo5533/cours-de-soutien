import type { SeedCatalogQcm } from "./seed-catalog-quizzes";

/** Nombre de QCM publics par matière dans le catalogue (/cours). */
export const CATALOG_QUIZZES_PER_MATIERE = 10;

/**
 * Conserve les N premiers QCM de chaque matière (ordre = priorité des fichiers seed).
 */
export function capCatalogQcmsAtPerMatiere(
  qcms: SeedCatalogQcm[],
  maxPerMatiere = CATALOG_QUIZZES_PER_MATIERE,
): SeedCatalogQcm[] {
  const counts = new Map<string, number>();
  const result: SeedCatalogQcm[] = [];
  for (const qcm of qcms) {
    const n = counts.get(qcm.matiere) ?? 0;
    if (n >= maxPerMatiere) continue;
    counts.set(qcm.matiere, n + 1);
    result.push(qcm);
  }
  return result;
}

export function countByMatiere(qcms: SeedCatalogQcm[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const q of qcms) {
    out[q.matiere] = (out[q.matiere] ?? 0) + 1;
  }
  return out;
}
