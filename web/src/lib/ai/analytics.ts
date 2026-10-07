import { prisma } from "@/lib/prisma";
import { PLANS, PLAN_IDS, getPlanById, type SubscriptionPlanId } from "@/lib/plans";

function startOfDay(d = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfMonth(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** Taux de conversion optionnel (ADMIN_USD_TO_MAD_RATE) — sans lui, aucune marge n'est calculée. */
function usdToMadRate(): number | null {
  const n = Number(process.env.ADMIN_USD_TO_MAD_RATE?.trim());
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function aggregatePeriod(from: Date) {
  const [usage, correctionsBySource] = await Promise.all([
    prisma.aiUsage.aggregate({
      where: { status: "SUCCESS", createdAt: { gte: from } },
      _count: { _all: true },
      _sum: {
        inputTokens: true,
        outputTokens: true,
        cachedInputTokens: true,
        totalTokens: true,
        estimatedCostUsd: true,
        creditsConsumed: true,
      },
    }),
    prisma.correction.groupBy({
      by: ["sourceType"],
      where: { createdAt: { gte: from } },
      _count: { _all: true },
      _sum: { pages: true },
    }),
  ]);

  let corrections = 0;
  let photos = 0;
  let documentPages = 0;
  for (const row of correctionsBySource) {
    corrections += row._count._all;
    if (row.sourceType === "image") photos += row._sum.pages ?? 0;
    else documentPages += row._sum.pages ?? 0;
  }

  const costUsd = usage._sum.estimatedCostUsd ?? 0;
  return {
    aiCalls: usage._count._all,
    corrections,
    photos,
    documentPages,
    credits: usage._sum.creditsConsumed ?? 0,
    inputTokens: usage._sum.inputTokens ?? 0,
    outputTokens: usage._sum.outputTokens ?? 0,
    cachedInputTokens: usage._sum.cachedInputTokens ?? 0,
    totalTokens: usage._sum.totalTokens ?? 0,
    estimatedCostUsd: costUsd,
    avgCostPerCorrection: corrections > 0 ? costUsd / corrections : null,
  };
}

/** Revenu théorique : abonnés actifs × prix catalogue (les membres d'un centre ne sont pas comptés). */
async function theoreticalRevenue() {
  const [byPlan, activeCentres] = await Promise.all([
    prisma.user.groupBy({
      by: ["subscriptionPlan"],
      where: {
        role: "ELEVE",
        subscriptionStatus: "active",
        subscriptionPlan: { notIn: [PLAN_IDS.FREE, PLAN_IDS.CENTRE] },
      },
      _count: { _all: true },
    }),
    prisma.centre.count({ where: { subscriptionStatus: "active" } }),
  ]);

  const rows = byPlan.map((r) => {
    const plan = getPlanById(r.subscriptionPlan);
    return {
      planId: plan.id,
      planName: plan.name,
      subscribers: r._count._all,
      revenueMad: r._count._all * plan.priceMAD,
    };
  });
  rows.push({
    planId: PLAN_IDS.CENTRE,
    planName: PLANS.CENTRE.name,
    subscribers: activeCentres,
    revenueMad: activeCentres * PLANS.CENTRE.priceMAD,
  });

  return {
    rows,
    totalMad: rows.reduce((s, r) => s + r.revenueMad, 0),
  };
}

export async function getAiConsumptionDashboard() {
  const monthFrom = startOfMonth();

  const [today, month, revenue, byModel, byAction] = await Promise.all([
    aggregatePeriod(startOfDay()),
    aggregatePeriod(monthFrom),
    theoreticalRevenue(),
    prisma.aiUsage.groupBy({
      by: ["model"],
      where: { status: "SUCCESS", createdAt: { gte: monthFrom } },
      _count: { _all: true },
      _sum: { estimatedCostUsd: true, totalTokens: true },
    }),
    prisma.aiUsage.groupBy({
      by: ["actionType"],
      where: { status: "SUCCESS", createdAt: { gte: monthFrom } },
      _count: { _all: true },
      _sum: { estimatedCostUsd: true, totalTokens: true },
    }),
  ]);

  const rate = usdToMadRate();
  const margeAvantAutresCouts =
    rate != null
      ? {
          rate,
          costMad: month.estimatedCostUsd * rate,
          marginMad: revenue.totalMad - month.estimatedCostUsd * rate,
        }
      : null;

  return { today, month, revenue, byModel, byAction, margeAvantAutresCouts };
}

export async function getTopUsersThisMonth(take = 20) {
  const groups = await prisma.aiUsage.groupBy({
    by: ["userId"],
    where: { status: "SUCCESS", createdAt: { gte: startOfMonth() } },
    _count: { _all: true },
    _sum: { estimatedCostUsd: true, totalTokens: true, creditsConsumed: true },
    orderBy: { _sum: { estimatedCostUsd: "desc" } },
    take,
  });
  const users = await prisma.user.findMany({
    where: { id: { in: groups.map((g) => g.userId) } },
    select: { id: true, name: true, email: true, subscriptionPlan: true, accountType: true },
  });
  const byId = new Map(users.map((u) => [u.id, u]));
  return groups.map((g) => {
    const u = byId.get(g.userId);
    return {
      userId: g.userId,
      name: u?.name ?? "—",
      email: u?.email ?? "—",
      planName: getPlanById(u?.subscriptionPlan).name,
      accountType: u?.accountType ?? null,
      calls: g._count._all,
      credits: g._sum.creditsConsumed ?? 0,
      tokens: g._sum.totalTokens ?? 0,
      costUsd: g._sum.estimatedCostUsd ?? 0,
    };
  });
}

export async function getCentresUsage() {
  const [centres, costs] = await Promise.all([
    prisma.centre.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        subscriptionStatus: true,
        seatLimit: true,
        creditsUsedInPeriod: true,
        currentPeriodEnd: true,
        owner: { select: { email: true } },
        _count: { select: { members: true } },
      },
    }),
    prisma.aiUsage.groupBy({
      by: ["centreId"],
      where: { status: "SUCCESS", createdAt: { gte: startOfMonth() }, centreId: { not: null } },
      _sum: { estimatedCostUsd: true, totalTokens: true },
    }),
  ]);
  const costById = new Map(costs.map((c) => [c.centreId, c._sum]));
  const limit = PLANS.CENTRE.monthlyCredits;
  return centres.map((c) => ({
    id: c.id,
    name: c.name,
    ownerEmail: c.owner.email,
    status: c.subscriptionStatus,
    members: c._count.members,
    seats: c.seatLimit ?? PLANS.CENTRE.seats,
    creditsUsed: c.creditsUsedInPeriod,
    creditsLimit: limit,
    creditsRemaining: Math.max(0, limit - c.creditsUsedInPeriod),
    periodEnd: c.currentPeriodEnd,
    costUsd: costById.get(c.id)?.estimatedCostUsd ?? 0,
    tokens: costById.get(c.id)?.totalTokens ?? 0,
  }));
}

/** Taux d'utilisation du quota des abonnés individuels (limites lues dans la config des offres). */
export async function getAiQuotaAnalytics() {
  const paidPersonal = (Object.keys(PLANS) as SubscriptionPlanId[]).filter(
    (id) => id !== PLAN_IDS.FREE && id !== PLAN_IDS.CENTRE,
  );
  const users = await prisma.user.findMany({
    where: { role: "ELEVE", subscriptionStatus: "active", subscriptionPlan: { in: paidPersonal } },
    select: { subscriptionPlan: true, aiCorrectionsUsedInPeriod: true },
  });

  let reach80 = 0;
  let reach100 = 0;
  let totalShare = 0;
  for (const u of users) {
    const limit = getPlanById(u.subscriptionPlan).monthlyCredits;
    const share = limit > 0 ? u.aiCorrectionsUsedInPeriod / limit : 0;
    totalShare += share;
    if (share >= 0.8) reach80 += 1;
    if (share >= 1) reach100 += 1;
  }

  const n = users.length || 1;
  return {
    subscribers: users.length,
    avgQuotaUtilization: totalShare / n,
    pctReach80: (reach80 / n) * 100,
    pctReach100: (reach100 / n) * 100,
  };
}
