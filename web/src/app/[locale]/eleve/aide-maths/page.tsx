import { EleveAideMathsUpload } from "@/components/eleve-aide-maths-upload";

export default function EleveAideMathsPage() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Déposez un <strong className="font-medium">devoir ou exercice</strong> au format{" "}
        <strong className="font-medium">PDF</strong> ou <strong className="font-medium">Word (.docx)</strong>{" "}
        — <strong className="font-medium">toutes les matières</strong> du programme scolaire marocain
        (maths, sciences, français, philo, histoire-géo, langues, etc.). Le texte est extrait du
        fichier puis analysé par l’assistant. Les PDF entièrement scannés (image sans texte
        sélectionnable) ne peuvent pas être lus correctement. Vous pouvez{" "}
        <strong className="font-medium">télécharger une page HTML</strong> ou utiliser{" "}
        <strong className="font-medium">Imprimer / PDF</strong> (enregistrement PDF via le navigateur,
        sans module serveur).
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        Côté serveur, l’assistant utilise en priorité{" "}
        <strong className="font-medium text-zinc-600 dark:text-zinc-400">OpenAI</strong> si{" "}
        <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">OPENAI_API_KEY</code> est
        définie dans la configuration ; sinon{" "}
        <a
          href="https://ollama.com"
          className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ollama
        </a>{" "}
        en local. Cette aide ne remplace pas le cours — vérifiez les méthodes attendues dans votre
        classe.
      </p>
      <EleveAideMathsUpload />
    </div>
  );
}
