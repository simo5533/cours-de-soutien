export type EnrollmentSubjectLine = {
  name: string;
  /** Prix de la ligne en dirhams (une matière = une ligne, sans quantité). */
  priceDh: number;
};

function normalizeLine(x: unknown): EnrollmentSubjectLine | null {
  if (typeof x !== "object" || x === null) return null;
  const o = x as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name.trim() : "";
  if (!name) return null;

  if (typeof o.priceDh === "number" && Number.isFinite(o.priceDh) && o.priceDh >= 0) {
    return { name, priceDh: o.priceDh };
  }

  const q = typeof o.quantity === "number" ? o.quantity : 0;
  const up = typeof o.unitPrice === "number" ? o.unitPrice : 0;
  if (q > 0 && up >= 0) {
    return { name, priceDh: q * up };
  }
  return null;
}

export function parseEnrollmentSubjectsJson(
  json: string | null | undefined,
): EnrollmentSubjectLine[] {
  if (!json?.trim()) return [];
  try {
    const raw = JSON.parse(json) as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.map(normalizeLine).filter((x): x is EnrollmentSubjectLine => x !== null);
  } catch {
    return [];
  }
}
