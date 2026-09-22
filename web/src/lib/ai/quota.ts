import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  getPlanById,
  PLAN_IDS,
  type SubscriptionPlanId,
} from "@/lib/plans";
import type { OpenaiUsageMetrics } from "@/lib/ai/pricing";
import { estimateCostUsd } from "@/lib/ai/pricing";

type Tx = Prisma.TransactionClient;

export type QuotaSnapshot = {
  planId: SubscriptionPlanId;
  planName: string;
  limit: number;
  used: number;
  remaining: number;
  periodStart: Date | null;
  periodEnd: Date | null;
  status: string;
  canUpgradeToAiPlus: boolean;
};

function addOneMonth(from: Date): Date {
  const d = new Date(from);
  d.setMonth(d.getMonth() + 1);
  return d;
}

/** Initialise / renouvelle le cycle mensuel si nécessaire. */
export async function ensureSubscriptionPeriod(userId: string): Promise<QuotaSnapshot> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
      aiCorrectionsUsedInPeriod: true,
    },
  });

  const planId = (user.subscriptionPlan as SubscriptionPlanId | null) ?? PLAN_IDS.FREE;
  const plan = getPlanById(planId);
  const now = new Date();

  let periodStart = user.currentPeriodStart;
  let periodEnd = user.currentPeriodEnd;
  let used = user.aiCorrectionsUsedInPeriod;
  let status = user.subscriptionStatus ?? (planId === "FREE" ? "free" : "active");

  if (plan.quotaMode === "monthly") {
    const needsInit = !periodStart || !periodEnd;
    const expired = periodEnd != null && now >= periodEnd;

    if (needsInit || expired) {
      const start = expired && periodEnd ? periodEnd : now;
      // Si plusieurs mois ont passé, avancer jusqu’au cycle courant
      let s = start;
      let e = addOneMonth(s);
      while (e <= now) {
        s = e;
        e = addOneMonth(s);
      }
      periodStart = s;
      periodEnd = e;
      used = 0;
      status = status === "cancelled" ? "cancelled" : "active";

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionPlan: planId,
          subscriptionStatus: status,
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
          aiCorrectionsUsedInPeriod: 0,
        },
      });
    }
  } else {
    // FREE lifetime
    if (!user.subscriptionPlan) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionPlan: PLAN_IDS.FREE,
          subscriptionStatus: "free",
        },
      });
    }
  }

  const limit = plan.monthlyCorrections;
  const remaining = Math.max(0, limit - used);

  return {
    planId,
    planName: plan.name,
    limit,
    used,
    remaining,
    periodStart,
    periodEnd,
    status,
    canUpgradeToAiPlus: planId === PLAN_IDS.ESSENTIAL_AI,
  };
}

export function getQuotaSnapshotFromUser(user: {
  subscriptionPlan: string | null;
  subscriptionStatus: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  aiCorrectionsUsedInPeriod: number;
}): QuotaSnapshot {
  const planId = (user.subscriptionPlan as SubscriptionPlanId | null) ?? PLAN_IDS.FREE;
  const plan = getPlanById(planId);
  const used = user.aiCorrectionsUsedInPeriod;
  const limit = plan.monthlyCorrections;
  return {
    planId,
    planName: plan.name,
    limit,
    used,
    remaining: Math.max(0, limit - used),
    periodStart: user.currentPeriodStart,
    periodEnd: user.currentPeriodEnd,
    status: user.subscriptionStatus ?? "free",
    canUpgradeToAiPlus: planId === PLAN_IDS.ESSENTIAL_AI,
  };
}

export class QuotaExhaustedError extends Error {
  readonly code = "QUOTA_EXHAUSTED";
  constructor(
    public readonly snapshot: QuotaSnapshot,
    message?: string,
  ) {
    super(message ?? "Quota IA épuisé pour ce cycle.");
    this.name = "QuotaExhaustedError";
  }
}

export class IdempotentReplayError extends Error {
  readonly code = "IDEMPOTENT_REPLAY";
  constructor(public readonly existingReply: string | null) {
    super("Requête déjà traitée.");
    this.name = "IdempotentReplayError";
  }
}

/**
 * Réserve 1 correction (incrémente le compteur) avant l’appel OpenAI.
 * Idempotent si la même clé a déjà abouti.
 */
export async function reserveAiCorrection(params: {
  userId: string;
  idempotencyKey: string;
}): Promise<{ usageId: string; snapshot: QuotaSnapshot }> {
  const { userId, idempotencyKey } = params;

  const existing = await prisma.aiUsage.findUnique({
    where: { idempotencyKey },
  });
  if (existing) {
    if (existing.status === "SUCCESS" && existing.replyPreview) {
      throw new IdempotentReplayError(existing.replyPreview);
    }
    if (existing.status === "PENDING" || existing.status === "SUCCESS") {
      throw new IdempotentReplayError(existing.replyPreview);
    }
    // FAILED — permettre un nouvel essai avec une nouvelle clé uniquement
  }

  return prisma.$transaction(async (tx) => {
    const snapshot = await ensureSubscriptionPeriodInTx(tx, userId);
    if (snapshot.remaining <= 0) {
      throw new QuotaExhaustedError(snapshot);
    }

    try {
      const usage = await tx.aiUsage.create({
        data: {
          userId,
          idempotencyKey,
          status: "PENDING",
          planAtTime: snapshot.planId,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { aiCorrectionsUsedInPeriod: { increment: 1 } },
      });

      return {
        usageId: usage.id,
        snapshot: {
          ...snapshot,
          used: snapshot.used + 1,
          remaining: snapshot.remaining - 1,
        },
      };
    } catch (e: unknown) {
      // Conflit unique idempotencyKey
      const code = (e as { code?: string })?.code;
      if (code === "P2002") {
        const again = await tx.aiUsage.findUnique({ where: { idempotencyKey } });
        throw new IdempotentReplayError(again?.replyPreview ?? null);
      }
      throw e;
    }
  });
}

async function ensureSubscriptionPeriodInTx(
  tx: Tx,
  userId: string,
): Promise<QuotaSnapshot> {
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

  const planId = (user.subscriptionPlan as SubscriptionPlanId | null) ?? PLAN_IDS.FREE;
  const plan = getPlanById(planId);
  const now = new Date();

  let periodStart = user.currentPeriodStart;
  let periodEnd = user.currentPeriodEnd;
  let used = user.aiCorrectionsUsedInPeriod;
  let status = user.subscriptionStatus ?? (planId === "FREE" ? "free" : "active");

  if (plan.quotaMode === "monthly") {
    const needsInit = !periodStart || !periodEnd;
    const expired = periodEnd != null && now >= periodEnd;
    if (needsInit || expired) {
      let s = expired && periodEnd ? periodEnd : now;
      let e = addOneMonth(s);
      while (e <= now) {
        s = e;
        e = addOneMonth(s);
      }
      periodStart = s;
      periodEnd = e;
      used = 0;
      await tx.user.update({
        where: { id: userId },
        data: {
          subscriptionPlan: planId,
          subscriptionStatus: status === "cancelled" ? "cancelled" : "active",
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
          aiCorrectionsUsedInPeriod: 0,
        },
      });
    }
  }

  return {
    planId,
    planName: plan.name,
    limit: plan.monthlyCorrections,
    used,
    remaining: Math.max(0, plan.monthlyCorrections - used),
    periodStart,
    periodEnd,
    status,
    canUpgradeToAiPlus: planId === PLAN_IDS.ESSENTIAL_AI,
  };
}

/** Confirme une correction réussie + enregistre tokens / coût. */
export async function confirmAiCorrection(params: {
  usageId: string;
  usage: OpenaiUsageMetrics;
  replyPreview: string;
}): Promise<void> {
  const cost = estimateCostUsd(params.usage);
  await prisma.aiUsage.update({
    where: { id: params.usageId },
    data: {
      status: "SUCCESS",
      model: params.usage.model,
      inputTokens: params.usage.inputTokens,
      outputTokens: params.usage.outputTokens,
      totalTokens: params.usage.totalTokens,
      cachedInputTokens: params.usage.cachedInputTokens,
      estimatedCostUsd: cost,
      replyPreview: params.replyPreview.slice(0, 500),
      completedAt: new Date(),
    },
  });
}

/** Annule la réservation si OpenAI a échoué (ne consomme pas le quota). */
export async function releaseAiCorrection(params: {
  usageId: string;
  userId: string;
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

    await tx.user.update({
      where: { id: params.userId },
      data: {
        aiCorrectionsUsedInPeriod: { decrement: 1 },
      },
    });

    // Empêcher un compteur négatif
    const u = await tx.user.findUnique({
      where: { id: params.userId },
      select: { aiCorrectionsUsedInPeriod: true },
    });
    if (u && u.aiCorrectionsUsedInPeriod < 0) {
      await tx.user.update({
        where: { id: params.userId },
        data: { aiCorrectionsUsedInPeriod: 0 },
      });
    }
  });
}

export async function applySubscriptionPlan(params: {
  userId: string;
  planId: SubscriptionPlanId;
}): Promise<void> {
  const now = new Date();
  const periodEnd = addOneMonth(now);
  await prisma.user.update({
    where: { id: params.userId },
    data: {
      subscriptionPlan: params.planId,
      subscriptionStatus: params.planId === "FREE" ? "free" : "active",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      // Upgrade : on conserve l’usage déjà consommé dans le cycle si même période ;
      // nouvel abonnement : reset pour démarrer proprement.
      aiCorrectionsUsedInPeriod: 0,
    },
  });
}
