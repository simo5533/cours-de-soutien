"use client";

import { buildMathsHelpHtmlDocument } from "@/lib/maths-help-print";

export function CorrectionExportButtons({ text }: { text: string }) {
  function print() {
    const w = window.open("", "_blank");
    if (!w) {
      window.alert("Autorisez les fenêtres popup pour imprimer ou enregistrer en PDF.");
      return;
    }
    w.document.write(buildMathsHelpHtmlDocument(text));
    w.document.close();
    w.onload = () => {
      w.focus();
      w.print();
    };
  }

  return (
    <button type="button" onClick={print} className="btn-secondary !py-1.5 !text-xs">
      Imprimer / PDF
    </button>
  );
}
