import { prisma } from "@/lib/prisma";
import { PLAN_IDS } from "@/lib/plans";

function startOfDay(d = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfMonth(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

async function aggregateUsage(from: Date) {
  const rows = await prisma.aiUsage.findMany({
    where: { status: "SUCCESS", createdAt: { gte: from } },
    select: {
      inputTokens: true,
      outputTokens: true,
      totalTokens: true,
      estimatedCostUsd: true,
      planAtTime: true,
    },
  });

  let corrections = 0;
  let inputTokens = 0;
  let outputTokens = 0;
  let totalTokens = 0;
  let costUsd = 0;
  let costKnown = 0;

  for (const r of rows) {
    corrections += 1;
    inputTokens += r.inputTokens ?? 0;
    outputTokens += r.outputTokens ?? 0;
    totalTokens += r.totalTokens ?? 0;
    if (r.estimatedCostUsd != null) {
      costUsd += r.estimatedCostUsd;
      costKnown += 1;
    }
  }

  return {
    corrections,
    inputTokens,
    outputTokens,
    totalTokens,
    estimatedCostUsd: costUsd,
    costKnownCount: costKnown,
    avgCostPerCorrection: corrections > 0 && costKnown > 0 ? costUsd / corrections : null,
  };
}

export async function getAiConsumptionDashboard() {
  const todayFrom = startOfDay();
  const monthFrom = startOfMonth();

  const [today, month, essentialCount, aiPlusCount, monthByPlan] = await Promise.all([
    aggregateUsage(todayFrom),
    aggregateUsage(monthFrom),
    prisma.user.count({
      where: { role: "ELEVE", subscriptionPlan: PLAN_IDS.ESSENTIAL_AI, subscriptionStatus: "active" },
    }),
    prisma.user.count({
      where: { role: "ELEVE", subscriptionPlan: PLAN_IDS.AI_PLUS, subscriptionStatus: "active" },
    }),
    prisma.aiUsage.groupBy({
      by: ["planAtTime"],
      where: { status: "SUCCESS", createdAt: { gte: monthFrom } },
      _count: { _all: true },
      _sum: { estimatedCostUsd: true, totalTokens: true },
    }),
  ]);

  const revenueEstimateMad =
    essentialCount * 39 + aiPlusCount * 69;
  const margeAvantAutresCouts =
    month.estimatedCostUsd != null
      ? {
          revenueMad: revenueEstimateMad,
          costUsd: month.estimatedCostUsd,
          note: "Revenu abonnement estimé (MAD) vs coût OpenAI estimé (USD) — pas un bénéfice net.",
        }
      : null;

  return {
    today,
    month,
    subscribers: {
      essential: essentialCount,
      aiPlus: aiPlusCount,
    },
    monthByPlan,
    margeAvantAutresCouts,
  };
}

/** Analytics applicatives (pas d’outil externe). */
export async function getAiQuotaAnalytics() {
  const users = await prisma.user.findMany({
    where: {
      role: "ELEVE",
      subscriptionPlan: { in: [PLAN_IDS.ESSENTIAL_AI, PLAN_IDS.AI_PLUS] },
    },
    select: {
      subscriptionPlan: true,
      aiCorrectionsUsedInPeriod: true,
    },
  });

  let reach80 = 0;
  let reach100 = 0;
  let totalQuotaShare = 0;

  for (const u of users) {
    const limit = u.subscriptionPlan === PLAN_IDS.AI_PLUS ? 250 : 100;
    const used = u.aiCorrectionsUsedInPeriod;
    const share = limit > 0 ? used / limit : 0;
    totalQuotaShare += share;
    if (share >= 0.8) reach80 += 1;
    if (share >= 1) reach100 += 1;
  }

  const n = users.length || 1;
  return {
    subscribers: users.length,
    avgQuotaUtilization: totalQuotaShare / n,
    pctReach80: (reach80 / n) * 100,
    pctReach100: (reach100 / n) * 100,
  };
}
