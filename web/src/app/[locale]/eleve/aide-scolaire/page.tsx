import type { Metadata } from "next";
import { EleveAideScolaireUpload } from "@/components/eleve-aide-scolaire-upload";

export const metadata: Metadata = {
  title: "Aide IA — toutes les matières",
  description:
    "Envoyez un devoir ou un exercice (PDF, Word) : l’assistant IA vous aide pour toutes les matières du programme scolaire marocain.",
};

export default function EleveAideScolairePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-navy dark:text-white">
        Aide IA — toutes les matières scolaires
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Déposez un <strong className="font-medium">devoir ou exercice</strong> au format{" "}
        <strong className="font-medium">PDF</strong> ou <strong className="font-medium">Word (.docx)</strong>{" "}
        — <strong className="font-medium">toutes les matières</strong> du programme scolaire marocain (maths,
        sciences, français, philosophie, histoire-géographie, langues, SVT, économie, etc.). Le texte est
        extrait du fichier puis analysé par l’assistant. Les PDF entièrement scannés (image sans texte
        sélectionnable) ne peuvent pas être lus correctement. Vous pouvez{" "}
        <strong className="font-medium">télécharger une page HTML</strong> ou utiliser{" "}
        <strong className="font-medium">Imprimer / PDF</strong> (enregistrement PDF via le navigateur, sans module
        serveur).
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        Côté serveur, l’assistant utilise en priorité{" "}
        <strong className="font-medium text-zinc-600 dark:text-zinc-400">OpenAI</strong> si{" "}
        <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">OPENAI_API_KEY</code> est définie dans la
        configuration ; sinon{" "}
        <a
          href="https://ollama.com"
          className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ollama
        </a>{" "}
        en local. Cette aide ne remplace pas le cours — vérifiez les méthodes attendues dans votre classe.
      </p>
      <EleveAideScolaireUpload />
    </div>
  );
}
