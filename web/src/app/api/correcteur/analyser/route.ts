import { auth } from "@/auth";
import { ABUSE_LIMITS, AI_MODELS } from "@/lib/ai/config";
import { AiServiceError, callChat } from "@/lib/ai/client";
import { buildCorrectionMessages, parseCorrection, type CorrectionResult } from "@/lib/ai/correction";
import { FileRejectedError, inspectUploads } from "@/lib/ai/documents";
import { canEscalateCorrection, routeModel } from "@/lib/ai/model-router";
import {
  confirmUsage,
  DailyCapReachedError,
  IdempotentReplayError,
  planForSnapshot,
  premiumCallsToday,
  QuotaExhaustedError,
  recordAiCall,
  releaseCredits,
  reserveCredits,
} from "@/lib/ai/quota";
import type { OpenaiUsageMetrics } from "@/lib/ai/pricing";
import { prisma } from "@/lib/prisma";
import { isSameOriginRequest } from "@/lib/request-guard";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

/** Au-delà, pas de second appel premium : la durée de la requête resterait trop longue. */
const MAX_PAGES_FOR_ESCALATION = 5;

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ELEVE") {
    return json({ error: "Connectez-vous pour corriger un exercice." }, 401);
  }
  if (!isSameOriginRequest(request)) {
    return json({ error: "Requête refusée." }, 403);
  }
  const userId = session.user.id;

  try {
    const recent = await prisma.aiUsage.count({
      where: {
        userId,
        actionType: "correction",
        createdAt: { gte: new Date(Date.now() - 60_000) },
      },
    });
    if (recent >= ABUSE_LIMITS.analysesPerMinute) {
      return json({ error: "Beaucoup d'analyses en peu de temps. Patientez une minute." }, 429);
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return json({ error: "Envoi invalide. Réessayez." }, 400);
    }
    const files = [...formData.getAll("files"), ...formData.getAll("file")].filter(
      (f): f is File => f instanceof File && f.size > 0,
    );

    const origin = formData.get("origin") === "pdf" ? "pdf" : "photo";
    const sourceName = formData.get("sourceName");

    let source;
    try {
      source = await inspectUploads(files, {
        origin,
        sourceName: typeof sourceName === "string" ? sourceName : undefined,
      });
    } catch (e) {
      if (e instanceof FileRejectedError) return json({ error: e.userMessage, code: e.code }, 400);
      console.error("[correcteur/analyser] inspection", e);
      return json({ error: "Ce fichier n'a pas pu être lu. Essayez un autre fichier." }, 400);
    }

    const cached = await prisma.correction.findFirst({
      where: {
        userId,
        fileHash: source.hash,
        createdAt: { gte: new Date(Date.now() - ABUSE_LIMITS.cacheDays * 86_400_000) },
      },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    if (cached) {
      return json({ correctionId: cached.id, cached: true });
    }

    const headerKey = request.headers.get("x-idempotency-key")?.trim();
    const idempotencyKey =
      headerKey && headerKey.length >= 8 && headerKey.length <= 128
        ? `correction:${userId}:${headerKey}`
        : `correction:${userId}:${source.hash}:${randomUUID()}`;

    let usageId: string;
    let snapshot;
    try {
      const reserved = await reserveCredits({
        userId,
        idempotencyKey,
        credits: source.credits,
        actionType: "correction",
      });
      usageId = reserved.usageId;
      snapshot = reserved.snapshot;
    } catch (e) {
      if (e instanceof QuotaExhaustedError) {
        const s = e.snapshot;
        const message =
          s.remaining > 0
            ? `Ce document demande ${e.needed} crédit${e.needed > 1 ? "s" : ""} d'analyse ; il vous en reste ${s.remaining}.`
            : s.scope === "centre"
              ? "Le quota d'analyses du centre est épuisé pour ce mois. Il sera renouvelé au prochain cycle."
              : s.planId === "FREE"
                ? "Vos analyses offertes sont utilisées. Choisissez une formule pour continuer."
                : "Votre quota d'analyses est épuisé pour ce mois. Il sera renouvelé au prochain cycle.";
        return json(
          {
            error: message,
            code: "QUOTA_EXHAUSTED",
            cta: s.upgradeHref ? "Voir les formules" : null,
            href: s.upgradeHref,
          },
          402,
        );
      }
      if (e instanceof DailyCapReachedError) {
        return json(
          {
            error: "Limite d'analyses atteinte pour aujourd'hui. Vous pourrez continuer demain.",
            code: "DAILY_CAP",
          },
          429,
        );
      }
      if (e instanceof IdempotentReplayError) {
        if (e.correctionId) return json({ correctionId: e.correctionId, cached: true });
        return json({ error: "Cette analyse est déjà en cours. Patientez quelques secondes." }, 409);
      }
      throw e;
    }

    const plan = planForSnapshot(snapshot);
    const extraPages = Math.max(0, source.pages - 1);
    const maxTokensFor = (base: number) => Math.min(base + extraPages * 250, 4000);
    const messages = buildCorrectionMessages(
      source.kind === "images"
        ? { kind: "images", dataUrls: source.dataUrls }
        : { kind: "text", text: source.text },
    );

    let result: CorrectionResult;
    let firstUsage: OpenaiUsageMetrics;
    let firstDuration: number;
    let finalModel: string | null;
    try {
      const decision = routeModel({ task: "correction", plan, premiumCallsToday: 0 });
      const first = await callChat({
        model: decision.model,
        messages,
        maxTokens: maxTokensFor(decision.maxTokens),
        json: true,
      });
      result = parseCorrection(first.content);
      firstUsage = first.usage;
      firstDuration = first.durationMs;
      finalModel = first.usage.model;
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      console.error("[correcteur/analyser] IA", detail);
      await releaseCredits({ usageId, errorMessage: detail });
      const userMessage =
        e instanceof AiServiceError
          ? e.userMessage
          : "La correction n'a pas pu aboutir. Réessayez — aucun crédit n'a été décompté.";
      return json({ error: userMessage }, e instanceof AiServiceError ? e.status : 502);
    }

    let escalation: { usage: OpenaiUsageMetrics; durationMs: number } | null = null;
    let escalationError: string | null = null;
    if (
      result.confiance === "faible" &&
      result.etapes.length + result.erreurs.length > 0 &&
      source.pages <= MAX_PAGES_FOR_ESCALATION
    ) {
      const premiumToday = await premiumCallsToday(userId, AI_MODELS.premium, AI_MODELS.economy);
      if (canEscalateCorrection({ plan, premiumCallsToday: premiumToday })) {
        const decision = routeModel({
          task: "correction_escalation",
          plan,
          premiumCallsToday: premiumToday,
        });
        try {
          const second = await callChat({
            model: decision.model,
            messages,
            maxTokens: maxTokensFor(decision.maxTokens),
            json: true,
          });
          result = parseCorrection(second.content);
          escalation = { usage: second.usage, durationMs: second.durationMs };
          finalModel = second.usage.model;
        } catch (e) {
          escalationError = e instanceof Error ? e.message : String(e);
          console.error("[correcteur/analyser] escalade", escalationError);
        }
      }
    }

    const correction = await prisma.correction.create({
      data: {
        userId,
        centreId: snapshot.centreId,
        sourceType: source.kind === "images" ? (source.origin === "pdf" ? "pdf" : "image") : source.kind,
        fileName: source.fileName.slice(0, 200),
        fileHash: source.hash,
        pages: source.pages,
        creditsUsed: source.credits,
        subject: result.matiere || null,
        notion: result.notion || null,
        title: result.titre || null,
        sourceText: source.kind === "images" ? null : source.text.slice(0, 6000),
        resultJson: JSON.stringify(result),
        errorsJson: result.erreurs.length ? JSON.stringify(result.erreurs) : null,
        model: finalModel,
      },
    });

    await confirmUsage({
      usageId,
      usage: firstUsage,
      durationMs: firstDuration,
      correctionId: correction.id,
      replyPreview: result.resultat,
    });
    if (escalation || escalationError) {
      await recordAiCall({
        userId,
        centreId: snapshot.centreId,
        planId: snapshot.planId,
        actionType: "correction_escalation",
        correctionId: correction.id,
        usage: escalation?.usage ?? null,
        durationMs: escalation?.durationMs ?? 0,
        status: escalation ? "SUCCESS" : "FAILED",
        errorMessage: escalationError ?? undefined,
      });
    }

    return json({ correctionId: correction.id, cached: false });
  } catch (e) {
    console.error("[correcteur/analyser]", e);
    return json({ error: "Une erreur inattendue est survenue. Réessayez dans un instant." }, 500);
  }
}
