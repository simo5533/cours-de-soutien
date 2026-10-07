import { auth } from "@/auth";
import { ABUSE_LIMITS, AI_MODELS } from "@/lib/ai/config";
import { AiServiceError, callChat } from "@/lib/ai/client";
import {
  ASSISTANT_ACTIONS,
  buildAssistantMessages,
  isAssistantAction,
  parseQuiz,
  parseSimilarExercise,
} from "@/lib/ai/assistant";
import { parseCorrection } from "@/lib/ai/correction";
import { routeModel } from "@/lib/ai/model-router";
import {
  assistantCallsToday,
  ensureSubscriptionPeriod,
  planForSnapshot,
  premiumCallsToday,
  recordAiCall,
} from "@/lib/ai/quota";
import { prisma } from "@/lib/prisma";
import { isSameOriginRequest } from "@/lib/request-guard";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ELEVE") {
    return json({ error: "Connectez-vous pour utiliser l'assistant." }, 401);
  }
  if (!isSameOriginRequest(request)) return json({ error: "Requête refusée." }, 403);
  const userId = session.user.id;

  let body: { correctionId?: unknown; action?: unknown; question?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Requête invalide." }, 400);
  }
  if (typeof body.correctionId !== "string" || !isAssistantAction(body.action)) {
    return json({ error: "Requête invalide." }, 400);
  }
  const action = body.action;
  const question =
    action === "question" && typeof body.question === "string" ? body.question.trim().slice(0, 500) : null;
  if (action === "question" && !question) {
    return json({ error: "Écrivez votre question." }, 400);
  }

  try {
    const correction = await prisma.correction.findUnique({
      where: { id: body.correctionId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!correction || correction.userId !== userId) {
      return json({ error: "Correction introuvable." }, 404);
    }

    const userMessages = correction.messages.filter((m) => m.role === "user").length;
    if (userMessages >= ABUSE_LIMITS.assistantPerCorrection) {
      return json(
        { error: "Nombre maximal de questions atteint pour cette correction. Lancez une nouvelle analyse." },
        429,
      );
    }

    const recent = await prisma.aiUsage.count({
      where: {
        userId,
        actionType: { in: ["assistant", "similar_exercise", "quiz", "detailed_explanation"] },
        createdAt: { gte: new Date(Date.now() - 60_000) },
      },
    });
    if (recent >= ABUSE_LIMITS.assistantPerMinute) {
      return json({ error: "Beaucoup de demandes en peu de temps. Patientez une minute." }, 429);
    }

    const snapshot = await ensureSubscriptionPeriod(userId);
    const plan = planForSnapshot(snapshot);
    if ((await assistantCallsToday(userId)) >= plan.assistantDailyLimit) {
      return json(
        { error: "Limite quotidienne de l'assistant atteinte. Vous pourrez continuer demain.", code: "DAILY_CAP" },
        429,
      );
    }

    const task = ASSISTANT_ACTIONS[action].task;
    const decision = routeModel({
      task,
      plan,
      premiumCallsToday:
        task === "detailed_explanation"
          ? await premiumCallsToday(userId, AI_MODELS.premium, AI_MODELS.economy)
          : 0,
    });

    const messages = buildAssistantMessages({
      action,
      question,
      correction: parseCorrection(correction.resultJson),
      sourceText: correction.sourceText,
      history: correction.messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    });

    const structured = action === "similar_exercise" || action === "quiz";
    let content: string;
    try {
      const out = await callChat({
        model: decision.model,
        messages,
        maxTokens: decision.maxTokens,
        json: structured,
        temperature: structured ? 0.5 : 0.3,
        timeoutMs: 55_000,
      });
      await recordAiCall({
        userId,
        centreId: snapshot.centreId,
        planId: snapshot.planId,
        actionType: task,
        correctionId: correction.id,
        usage: out.usage,
        durationMs: out.durationMs,
        status: "SUCCESS",
      });
      content = out.content;
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      console.error("[correcteur/assistant]", detail);
      await recordAiCall({
        userId,
        centreId: snapshot.centreId,
        planId: snapshot.planId,
        actionType: task,
        correctionId: correction.id,
        usage: null,
        durationMs: 0,
        status: "FAILED",
        errorMessage: detail,
      });
      return json(
        {
          error:
            e instanceof AiServiceError && e.status === 504
              ? "L'assistant a mis trop de temps à répondre. Réessayez."
              : "L'assistant est momentanément indisponible. Réessayez dans quelques instants.",
        },
        502,
      );
    }

    if (action === "similar_exercise") {
      const parsed = parseSimilarExercise(content);
      if (!parsed) return json({ error: "L'exercice n'a pas pu être généré. Réessayez." }, 502);
      content = JSON.stringify(parsed);
    } else if (action === "quiz") {
      const parsed = parseQuiz(content);
      if (!parsed) return json({ error: "Le quiz n'a pas pu être généré. Réessayez." }, 502);
      content = JSON.stringify(parsed);
    }

    const userLabel = action === "question" && question ? question : ASSISTANT_ACTIONS[action].label;
    const [, assistantMessage] = await prisma.$transaction([
      prisma.correctionMessage.create({
        data: { correctionId: correction.id, role: "user", action, content: userLabel },
      }),
      prisma.correctionMessage.create({
        data: { correctionId: correction.id, role: "assistant", action, content: content.slice(0, 8000) },
      }),
    ]);

    return json({
      userMessage: { role: "user", action, content: userLabel },
      message: {
        id: assistantMessage.id,
        role: "assistant",
        action,
        content: assistantMessage.content,
      },
    });
  } catch (e) {
    console.error("[correcteur/assistant]", e);
    return json({ error: "Une erreur inattendue est survenue. Réessayez." }, 500);
  }
}
