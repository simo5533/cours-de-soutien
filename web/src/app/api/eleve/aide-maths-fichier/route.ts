// Réponse JSON uniquement ; export PDF = navigateur (maths-help-print côté client).
import { auth } from "@/auth";
import { sanitizeMathsHelpPlainText } from "@/lib/maths-help-print";
import { extractTextFromStudentUpload } from "@/lib/extract-student-document";
import {
  generateSubjectHelpFromExtractedText,
  OPENAI_KEY_MANQUANTE,
} from "@/lib/maths-ai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ELEVE") {
      return NextResponse.json({ error: "Réservé aux élèves connectés." }, { status: 401 });
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Aucun fichier valide (champ « file » attendu)." },
        { status: 400 },
      );
    }

    const buf = new Uint8Array(await file.arrayBuffer());

    let extracted: string;
    try {
      const out = await extractTextFromStudentUpload(buf, file.name, file.type || "");
      extracted = out.text;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Extraction impossible.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    try {
      const raw = await generateSubjectHelpFromExtractedText(extracted);
      const reply = sanitizeMathsHelpPlainText(raw);
      return NextResponse.json({ reply });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue.";
      if (msg === OPENAI_KEY_MANQUANTE) {
        return NextResponse.json(
          {
            error:
              "OPENAI_API_KEY manquante : dans web/.env ajoutez OPENAI_API_KEY=sk-… (https://platform.openai.com/api-keys ), enregistrez et redémarrez npm run dev. Pour utiliser Ollama à la place : MATHS_AI_PROVIDER=ollama.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json({ error: msg }, { status: 502 });
    }
  } catch (e) {
    console.error("[api/eleve/aide-maths-fichier]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur serveur inattendue." },
      { status: 500 },
    );
  }
}
