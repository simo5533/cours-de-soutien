/** Affichage des montants en dirhams marocains (dh), sans symbole ISO. */
export function formatDh(amount: number): string {
  return `${amount.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} dh`;
}
