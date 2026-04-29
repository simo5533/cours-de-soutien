"use client";

import { useState } from "react";
import { buildMathsHelpHtmlDocument } from "@/lib/maths-help-print";

function downloadHtmlFile(html: string, filename: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function openPrintToSaveAsPdf(html: string) {
  const w = window.open("", "_blank");
  if (!w) {
    window.alert("Autorisez les fenêtres popup pour utiliser l’impression vers PDF.");
    return;
  }
  w.document.write(html);
  w.document.close();
  w.onload = () => {
    w.focus();
    w.print();
  };
}

export function EleveAideMathsUpload() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const [autoPrint, setAutoPrint] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setReply(null);
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setError("Choisissez un fichier PDF ou Word (.docx).");
      return;
    }

    const upload = new FormData();
    upload.set("file", file);

    setPending(true);
    try {
      const res = await fetch("/api/eleve/aide-maths-fichier", {
        method: "POST",
        body: upload,
      });

      const data = (await res.json()) as { error?: string; reply?: string };
      if (!res.ok) {
        setError(data.error || `Erreur ${res.status}`);
        return;
      }
      if (!data.reply) {
        setError("Réponse inattendue du serveur.");
        return;
      }

      if (autoPrint) {
        openPrintToSaveAsPdf(buildMathsHelpHtmlDocument(data.reply));
      }
      setReply(data.reply);
    } catch {
      setError("Impossible de contacter le serveur. Réessayez plus tard.");
    } finally {
      setPending(false);
    }
  }

  const exportHtml = reply ? buildMathsHelpHtmlDocument(reply) : null;

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="devoir-file" className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Fichier (PDF ou .docx)
          </label>
          <input
            id="devoir-file"
            name="file"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="block w-full max-w-md text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-teal-700 dark:text-zinc-400"
            disabled={pending}
            required
          />
        </div>
        <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            className="mt-1 rounded border-zinc-300"
            checked={autoPrint}
            onChange={(ev) => setAutoPrint(ev.target.checked)}
            disabled={pending}
          />
          <span>
            Après l’analyse, ouvrir directement l’<strong className="font-medium">impression</strong>{" "}
            (pour enregistrer en <strong className="font-medium">PDF</strong> via votre navigateur)
          </span>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-60"
        >
          {pending ? "Analyse en cours…" : "Obtenir l’aide sur ce devoir"}
        </button>
      </form>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {reply ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Proposition d’aide (toutes matières)
            </h2>
            {exportHtml ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    downloadHtmlFile(
                      exportHtml,
                      `aide-scolaire-ia-${new Date().toISOString().slice(0, 10)}.html`,
                    )
                  }
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Télécharger (page HTML)
                </button>
                <button
                  type="button"
                  onClick={() => openPrintToSaveAsPdf(exportHtml)}
                  className="rounded-lg border border-teal-600 bg-white px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-50 dark:border-teal-500 dark:bg-zinc-900 dark:text-teal-300 dark:hover:bg-teal-950/50"
                >
                  Imprimer / PDF
                </button>
              </>
            ) : null}
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
            {reply}
          </div>
        </div>
      ) : null}
    </div>
  );
}
