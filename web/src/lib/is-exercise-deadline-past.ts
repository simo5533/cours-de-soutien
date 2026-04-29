/**
 * Hors modules « composants » pour éviter react-hooks/purity sur Date.now().
 */
export function isExerciseDeadlinePast(deadlineAt: Date | null): boolean {
  if (deadlineAt == null) return false;
  return deadlineAt.getTime() < Date.now();
}
