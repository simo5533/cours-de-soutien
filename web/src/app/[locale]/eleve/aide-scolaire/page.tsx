import type { Metadata } from "next";
import { auth } from "@/auth";
import { AiQuotaMeter } from "@/components/ai-quota-meter";
import { EleveAideScolaireUpload } from "@/components/eleve-aide-scolaire-upload";
import { ensureSubscriptionPeriod } from "@/lib/ai/quota";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Aide IA — toutes les matières",
  description:
    "Envoyez un devoir ou un exercice (PDF, Word) : l’assistant IA vous aide pour toutes les matières du programme scolaire marocain.",
};

export default async function EleveAideScolairePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ELEVE") {
    redirect("/connexion");
  }

  const quota = await ensureSubscriptionPeriod(session.user.id);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-navy dark:text-white">
        Aide IA — toutes les matières scolaires
      </h1>
      <AiQuotaMeter quota={quota} />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Déposez un <strong className="font-medium">devoir ou exercice</strong> au format{" "}
        <strong className="font-medium">PDF</strong> ou <strong className="font-medium">Word (.docx)</strong>{" "}
        — <strong className="font-medium">toutes les matières</strong> du programme scolaire marocain. Le texte
        est extrait du fichier puis analysé par l’assistant (1 correction = 1 analyse). Les PDF entièrement
        scannés (image sans texte) ne peuvent pas être lus correctement.
      </p>
      <EleveAideScolaireUpload initialQuotaExhausted={quota.remaining <= 0} planId={quota.planId} />
    </div>
  );
}
