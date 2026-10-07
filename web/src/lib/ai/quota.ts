import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  getPlanById,
  PLAN_IDS,
  PLANS,
  type PlanDefinition,
  type SubscriptionPlanId,
} from "@/lib/plans";
import type { AiTask } from "@/lib/ai/config";
import type { OpenaiUsageMetrics } from "@/lib/ai/pricing";
import { estimateCostUsd } from "@/lib/ai/pricing";

type Tx = Prisma.TransactionClient;

export type QuotaScope = "user" | "centre";

export type QuotaSnapshot = {
  scope: QuotaScope;
  centreId: string | null;
  centreName: string | null;
  planId: SubscriptionPlanId;
  planName: string;
  limit: number;
  used: number;
  remaining: number;
  dailyCap: number;
  dailyUsed: number;
  periodStart: Date | null;
  periodEnd: Date | null;
  status: string;
  /** Lien d'évolution proposé quand le quota est bas (null si déjà au maximum). */
  upgradeHref: string | null;
};

function addOneMonth(from: Date): Date {
  const d = new Date(from);
  d.setMonth(d.getMonth() + 1);
  return d;
}

function startOfDay(d = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function upgradeHrefFor(planId: SubscriptionPlanId, scope: QuotaScope): string | null {
  if (scope === "centre") return null;
  if (planId === PLAN_IDS.FREE || planId === PLAN_IDS.ESSENTIAL_AI) return "/tarifs";
  if (planId === PLAN_IDS.PARTICULIER) return "/tarifs";
  return null;
}

/** Fait avancer un cycle mensuel jusqu'au cycle courant. */
function rollPeriod(
  start: Date | null,
  end: Date | null,
  now: Date,
): { start: Date; end: Date; reset: boolean } {
  if (start && end && now < end) return { start, end, reset: false };
  let s = end && start ? end : now;
  let e = addOneMonth(s);
  while (e <= now) {
    s = e;
    e = addOneMonth(s);
  }
  return { start: s, end: e, reset: true };
}

async function dailyCreditsUsed(tx: Tx, where: { userId?: string; centreId?: string }) {
  const agg = await tx.aiUsage.aggregate({
    where: {
      ...where,
      createdAt: { gte: startOfDay() },
      status: { in: ["PENDING", "SUCCESS"] },
    },
    _sum: { creditsConsumed: true },
  });
  return agg._sum.creditsConsumed ?? 0;
}

async function snapshotInTx(tx: Tx, userId: string): Promise<QuotaSnapshot> {
  const now = new Date();
  const membership = await tx.centreMember.findUnique({
    where: { userId },
    include: { centre: true },
  });

  if (membership && membership.centre.subscriptionStatus === "active") {
    const centre = membership.centre;
    const plan = PLANS.CENTRE;
    const p = rollPeriod(centre.currentPeriodStart, centre.currentPeriodEnd, now);
    let used = centre.creditsUsedInPeriod;
    if (p.reset) {
      used = 0;
      await tx.centre.update({
        where: { id: centre.id },
        data: {
          currentPeriodStart: p.start,
          currentPeriodEnd: p.end,
          creditsUsedInPeriod: 0,
        },
      });
    }
    const dailyUsed = await dailyCreditsUsed(tx, { centreId: centre.id });
    return {
      scope: "centre",
      centreId: centre.id,
      centreName: centre.name,
      planId: plan.id,
      planName: plan.name,
      limit: plan.monthlyCredits,
      used,
      remaining: Math.max(0, plan.monthlyCredits - used),
      dailyCap: plan.dailyCreditCap,
      dailyUsed,
      periodStart: p.start,
      periodEnd: p.end,
      status: centre.subscriptionStatus,
      upgradeHref: null,
    };
  }

  const user = await tx.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      subscriptionPlan: true,
      subscriptionStatus: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
      aiCorrectionsUsedInPeriod: true,
    },
  });

  let plan: PlanDefinition = getPlanById(user.subscriptionPlan);
  // Un propriétaire de centre dont le centre n'est plus actif retombe sur l'offre gratuite.
  if (plan.id === PLAN_IDS.CENTRE) plan = PLANS.FREE;

  let periodStart = user.currentPeriodStart;
  let periodEnd = user.currentPeriodEnd;
  let used = user.aiCorrectionsUsedInPeriod;
  const status = user.subscriptionStatus ?? (plan.id === PLAN_IDS.FREE ? "free" : "active");

  if (plan.quotaMode === "monthly") {
    const p = rollPeriod(periodStart, periodEnd, now);
    if (p.reset) {
      periodStart = p.start;
      periodEnd = p.end;
      used = 0;
      await tx.user.update({
        where: { id: userId },
        data: {
          subscriptionPlan: plan.id,
          subscriptionStatus: status === "cancelled" ? "cancelled" : "active",
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
          aiCorrectionsUsedInPeriod: 0,
        },
      });
    }
  } else if (!user.subscriptionPlan) {
    await tx.user.update({
      where: { id: userId },
      data: { subscriptionPlan: PLAN_IDS.FREE, subscriptionStatus: "free" },
    });
  }

  const dailyUsed = await dailyCreditsUsed(tx, { userId });
  return {
    scope: "user",
    centreId: null,
    centreName: null,
    planId: plan.id,
    planName: plan.name,
    limit: plan.monthlyCredits,
    used,
    remaining: Math.max(0, plan.monthlyCredits - used),
    dailyCap: plan.dailyCreditCap,
    dailyUsed,
    periodStart,
    periodEnd,
    status,
    upgradeHref: upgradeHrefFor(plan.id, "user"),
  };
}

/** Initialise / renouvelle le cycle si nécessaire et retourne l'état du quota. */
export async function ensureSubscriptionPeriod(userId: string): Promise<QuotaSnapshot> {
  return prisma.$transaction((tx) => snapshotInTx(tx, userId));
}

export function planForSnapshot(snapshot: QuotaSnapshot): PlanDefinition {
  return getPlanById(snapshot.planId);
}

export class QuotaExhaustedError extends Error {
  readonly code = "QUOTA_EXHAUSTED";
  constructor(
    public readonly snapshot: QuotaSnapshot,
    public readonly needed: number,
  ) {
    super("Quota d'analyses insuffisant pour ce cycle.");
    this.name = "QuotaExhaustedError";
  }
}

export class DailyCapReachedError extends Error {
  readonly code = "DAILY_CAP";
  constructor(public readonly snapshot: QuotaSnapshot) {
    super("Limite journalière atteinte.");
    this.name = "DailyCapReachedError";
  }
}

export class IdempotentReplayError extends Error {
  readonly code = "IDEMPOTENT_REPLAY";
  constructor(public readonly correctionId: string | null) {
    super("Requête déjà traitée.");
    this.name = "IdempotentReplayError";
  }
}

/**
 * Réserve `credits` crédits avant l'appel IA (décrément atomique conditionnel).
 * Idempotent : une même clé ne peut consommer qu'une fois.
 */
export async function reserveCredits(params: {
  userId: string;
  idempotencyKey: string;
  credits: number;
  actionType: AiTask;
}): Promise<{ usageId: string; snapshot: QuotaSnapshot }> {
  const { userId, idempotencyKey, credits, actionType } = params;

  const existing = await prisma.aiUsage.findUnique({ where: { idempotencyKey } });
  if (existing && existing.status !== "FAILED") {
    throw new IdempotentReplayError(existing.correctionId);
  }

  return prisma.$transaction(async (tx) => {
    const snapshot = await snapshotInTx(tx, userId);
    if (snapshot.remaining < credits) {
      throw new QuotaExhaustedError(snapshot, credits);
    }
    if (snapshot.dailyUsed + credits > snapshot.dailyCap) {
      throw new DailyCapReachedError(snapshot);
    }

    const maxUsedBefore = snapshot.limit - credits;
    const updated =
      snapshot.scope === "centre" && snapshot.centreId
        ? await tx.centre.updateMany({
            where: { id: snapshot.centreId, creditsUsedInPeriod: { lte: maxUsedBefore } },
            data: { creditsUsedInPeriod: { increment: credits } },
          })
        : await tx.user.updateMany({
            where: { id: userId, aiCorrectionsUsedInPeriod: { lte: maxUsedBefore } },
            data: { aiCorrectionsUsedInPeriod: { increment: credits } },
          });
    if (updated.count === 0) {
      throw new QuotaExhaustedError(snapshot, credits);
    }

    try {
      const usage = await tx.aiUsage.create({
        data: {
          userId,
          idempotencyKey,
          status: "PENDING",
          planAtTime: snapshot.planId,
          centreId: snapshot.centreId,
          actionType,
          creditsConsumed: credits,
        },
      });
      return {
        usageId: usage.id,
        snapshot: {
          ...snapshot,
          used: snapshot.used + credits,
          remaining: snapshot.remaining - credits,
          dailyUsed: snapshot.dailyUsed + credits,
        },
      };
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === "P2002") {
        const again = await tx.aiUsage.findUnique({ where: { idempotencyKey } });
        throw new IdempotentReplayError(again?.correctionId ?? null);
      }
      throw e;
    }
  });
}

/** Confirme une réservation après succès + enregistre tokens / coût. */
export async function confirmUsage(params: {
  usageId: string;
  usage: OpenaiUsageMetrics;
  durationMs: number;
  correctionId?: string | null;
  replyPreview?: string;
}): Promise<void> {
  await prisma.aiUsage.update({
    where: { id: params.usageId },
    data: {
      status: "SUCCESS",
      model: params.usage.model,
      inputTokens: params.usage.inputTokens,
      outputTokens: params.usage.outputTokens,
      totalTokens: params.usage.totalTokens,
      cachedInputTokens: params.usage.cachedInputTokens,
      estimatedCostUsd: estimateCostUsd(params.usage),
      durationMs: params.durationMs,
      correctionId: params.correctionId ?? null,
      replyPreview: params.replyPreview?.slice(0, 500) ?? null,
      completedAt: new Date(),
    },
  });
}

/** Annule une réservation (échec IA) : les crédits sont rendus. */
export async function releaseCredits(params: {
  usageId: string;
  errorMessage: string;
}): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const usage = await tx.aiUsage.findUnique({ where: { id: params.usageId } });
    if (!usage || usage.status !== "PENDING") return;

    await tx.aiUsage.update({
      where: { id: params.usageId },
      data: {
        status: "FAILED",
        errorMessage: params.errorMessage.slice(0, 500),
        completedAt: new Date(),
      },
    });

    const credits = usage.creditsConsumed;
    if (credits <= 0) return;

    if (usage.centreId) {
      await tx.centre.updateMany({
        where: { id: usage.centreId, creditsUsedInPeriod: { gte: credits } },
        data: { creditsUsedInPeriod: { decrement: credits } },
      });
    } else {
      await tx.user.updateMany({
        where: { id: usage.userId, aiCorrectionsUsedInPeriod: { gte: credits } },
        data: { aiCorrectionsUsedInPeriod: { decrement: credits } },
      });
    }
  });
}

/** Enregistre un appel IA sans crédit (assistant, escalade) — succès ou échec. */
export async function recordAiCall(params: {
  userId: string;
  centreId: string | null;
  planId: string;
  actionType: AiTask;
  correctionId: string | null;
  usage: OpenaiUsageMetrics | null;
  durationMs: number;
  status: "SUCCESS" | "FAILED";
  errorMessage?: string;
}): Promise<void> {
  const u = params.usage;
  await prisma.aiUsage.create({
    data: {
      userId: params.userId,
      idempotencyKey: `${params.actionType}:${params.userId}:${crypto.randomUUID()}`,
      status: params.status,
      planAtTime: params.planId,
      centreId: params.centreId,
      actionType: params.actionType,
      creditsConsumed: 0,
      correctionId: params.correctionId,
      model: u?.model ?? null,
      inputTokens: u?.inputTokens ?? null,
      outputTokens: u?.outputTokens ?? null,
      totalTokens: u?.totalTokens ?? null,
      cachedInputTokens: u?.cachedInputTokens ?? null,
      estimatedCostUsd: u ? estimateCostUsd(u) : null,
      durationMs: params.durationMs,
      errorMessage: params.errorMessage?.slice(0, 500) ?? null,
      completedAt: new Date(),
    },
  });
}

/** Appels au modèle supérieur aujourd'hui (plafond d'escalade). */
export async function premiumCallsToday(
  userId: string,
  premiumModel: string,
  economyModel: string,
): Promise<number> {
  return prisma.aiUsage.count({
    where: {
      userId,
      createdAt: { gte: startOfDay() },
      model: { startsWith: premiumModel },
      ...(economyModel.startsWith(premiumModel)
        ? { NOT: { model: { startsWith: economyModel } } }
        : {}),
    },
  });
}

/** Messages d'assistant envoyés aujourd'hui. */
export async function assistantCallsToday(userId: string): Promise<number> {
  return prisma.aiUsage.count({
    where: {
      userId,
      createdAt: { gte: startOfDay() },
      actionType: { in: ["assistant", "similar_exercise", "quiz", "detailed_explanation"] },
    },
  });
}

/** Attribue une offre à un compte (paiement confirmé) et démarre un cycle. */
export async function applySubscriptionPlan(params: {
  userId: string;
  planId: SubscriptionPlanId;
}): Promise<void> {
  const now = new Date();
  await prisma.user.update({
    where: { id: params.userId },
    data: {
      subscriptionPlan: params.planId,
      subscriptionStatus: params.planId === "FREE" ? "free" : "active",
      currentPeriodStart: now,
      currentPeriodEnd: addOneMonth(now),
      aiCorrectionsUsedInPeriod: 0,
    },
  });
}
