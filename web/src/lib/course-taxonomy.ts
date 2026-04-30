/** Taxonomie des cours : matière → niveau → chapitre */

export const MATIERES = [
  "Mathématiques",
  "Physique-Chimie",
  "Français",
  "Anglais",
  "SVT",
  "Histoire-Géographie",
] as const;

export const NIVEAUX = ["Primaire", "Collège", "Lycée"] as const;

export type Matiere = (typeof MATIERES)[number];
export type Niveau = (typeof NIVEAUX)[number];

/** Clés `CatalogPage.niveaux.{key}` pour l’affichage catalogue / quiz public */
export const NIVEAU_CATALOG_I18N_KEY: Record<Niveau, string> = {
  Primaire: "primaire",
  Collège: "college",
  Lycée: "lycee",
};
