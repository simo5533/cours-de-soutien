"use client";

export function PrintButton({ label = "Imprimer" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white shadow hover:bg-navy/90 print:hidden"
    >
      {label}
    </button>
  );
}
