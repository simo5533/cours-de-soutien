// Réponse JSON ; export PDF = navigateur (maths-help-print côté client).
import { auth } from "@/auth";
import { sanitizeMathsHelpPlainText } from "@/lib/maths-help-print";
import { extractTextFromStudentUpload } from "@/lib/extract-student-document";
import {
  generateSubjectHelpFromExtractedText,
  OPENAI_KEY_MANQUANTE,
} from "@/lib/maths-ai";
import {
  confirmAiCorrection,
  IdempotentReplayError,
  QuotaExhaustedError,
  releaseAiCorrection,
  reserveAiCorrection,
} from "@/lib/ai/quota";
import { prisma } from "@/lib/prisma";
import { createHash, randomUUID } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

function buildIdempotencyKey(
  userId: string,
  request: Request,
  file: File,
  buf: Uint8Array,
): string {
  const header = request.headers.get("x-idempotency-key")?.trim();
  if (header && header.length >= 8 && header.length <= 128) {
    return `${userId}:${header}`;
  }
  const hash = createHash("sha256").update(buf).digest("hex").slice(0, 32);
  return `${userId}:${file.name}:${file.size}:${hash}:${randomUUID()}`;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ELEVE") {
      return NextResponse.json({ error: "Réservé aux élèves connectés." }, { status: 401 });
    }

    const userId = session.user.id;

    // Rate limit simple : max 8 corrections démarrées / minute / élève
    const oneMinAgo = new Date(Date.now() - 60_000);
    const recent = await prisma.aiUsage.count({
      where: {
        userId,
        createdAt: { gte: oneMinAgo },
        status: { in: ["PENDING", "SUCCESS"] },
      },
    });
    if (recent >= 8) {
      return NextResponse.json(
        { error: "Trop de demandes en peu de temps. Réessayez dans une minute." },
        { status: 429 },
      );
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

    const idempotencyKey = buildIdempotencyKey(userId, request, file, buf);

    let usageId: string | null = null;
    try {
      const reserved = await reserveAiCorrection({ userId, idempotencyKey });
      usageId = reserved.usageId;
    } catch (e) {
      if (e instanceof QuotaExhaustedError) {
        const upgrade =
          e.snapshot.planId === "ESSENTIAL_AI"
            ? {
                message: "Vous avez utilisé toutes vos corrections IA pour ce mois.",
                cta: "Passer à IA Plus",
                href: "/tarifs",
              }
            : e.snapshot.planId === "AI_PLUS"
              ? {
                  message:
                    "Votre quota mensuel est épuisé. Il sera renouvelé au prochain cycle.",
                  cta: null,
                  href: null,
                  renewsAt: e.snapshot.periodEnd?.toISOString() ?? null,
                }
              : {
                  message:
                    "Vous avez utilisé vos 3 corrections IA offertes. Choisissez un pack pour continuer.",
                  cta: "Voir les formules",
                  href: "/tarifs",
                };
        return NextResponse.json(
          {
            error: upgrade.message,
            code: "QUOTA_EXHAUSTED",
            quota: e.snapshot,
            ...upgrade,
          },
          { status: 402 },
        );
      }
      if (e instanceof IdempotentReplayError) {
        if (e.existingReply) {
          return NextResponse.json({ reply: e.existingReply, replayed: true });
        }
        return NextResponse.json(
          { error: "Cette correction est déjà en cours ou terminée. Réessayez dans un instant." },
          { status: 409 },
        );
      }
      throw e;
    }

    try {
      const result = await generateSubjectHelpFromExtractedText(extracted);
      const reply = sanitizeMathsHelpPlainText(result.content);
      await confirmAiCorrection({
        usageId: usageId!,
        usage: result.usage,
        replyPreview: reply,
      });
      return NextResponse.json({ reply });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue.";
      if (usageId) {
        await releaseAiCorrection({
          usageId,
          userId,
          errorMessage: msg,
        });
      }
      if (msg === OPENAI_KEY_MANQUANTE) {
        const onVercel = process.env.VERCEL === "1";
        return NextResponse.json(
          {
            error: onVercel
              ? "OPENAI_API_KEY manquante sur Vercel : Project → Settings → Environment Variables → ajoutez OPENAI_API_KEY avec votre clé (https://platform.openai.com/api-keys ). Cochez au minimum Production ; redeploy ensuite. Les fichiers .env du PC ne sont pas envoyés au déploiement."
              : "OPENAI_API_KEY manquante : dans web/.env.local ou web/.env ajoutez OPENAI_API_KEY=sk-… puis redémarrez npm run dev.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json({ error: msg }, { status: 502 });
    }
  } catch (e) {
    console.error("[api/eleve/aide-scolaire-fichier]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur serveur inattendue." },
      { status: 500 },
    );
  }
}
