export type UserRole = "eleve" | "professeur" | "admin";

export const ROLE_LABELS: Record<UserRole, string> = {
  eleve: "Élève",
  professeur: "Professeur",
  admin: "Administrateur",
};
