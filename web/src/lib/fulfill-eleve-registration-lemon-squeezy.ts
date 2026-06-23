import {
  fetchLemonSqueezyOrder,
  getLemonEleveUnitAmountMajor,
} from "@/lib/lemon-squeezy-server";
import { fulfillEleveRegistrationCore } from "@/lib/fulfill-eleve-registration-core";
import { prisma } from "@/lib/prisma";

function parsePendingIdFromWebhookMeta(meta: unknown): string | null {
  if (!meta || typeof meta !== "object") return null;
  const custom = (meta as Record<string, unknown>).custom_data;
  if (!custom || typeof custom !== "object") return null;
  const id = (custom as Record<string, unknown>).pending_id;
  return typeof id === "string" && id.length > 0 ? id : null;
}

export async function fulfillEleveRegistrationFromLemonSqueezyOrder(
  orderId: string,
  options?: { pendingIdFromWebhook?: string | null },
): Promise<{ ok: true } | { ok: false; error: string }> {
  let order;
  try {
    order = await fetchLemonSqueezyOrder(orderId);
  } catch {
    return { ok: false, error: "Impossible de vérifier la commande Lemon Squeezy." };
  }

  if (!order) {
    return { ok: false, error: "Commande Lemon Squeezy introuvable." };
  }

  const paid = order.status === "paid";
  if (!paid) {
    return { ok: false, error: "Paiement non confirmé." };
  }

  let pendingId =
    options?.pendingIdFromWebhook ||
    order.pendingId ||
    (await prisma.eleveRegistrationPending.findFirst({
      where: { lemonSqueezyOrderId: orderId, consumedAt: null },
      select: { id: true },
    }))?.id;

  if (!pendingId && order.userEmail) {
    pendingId = (
      await prisma.eleveRegistrationPending.findFirst({
        where: {
          email: order.userEmail.toLowerCase(),
          consumedAt: null,
        },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      })
    )?.id ?? null;
  }

  if (!pendingId) {
    return { ok: false, error: "Commande invalide (pending_id manquant)." };
  }

  const amountMajor =
    order.totalMinor > 0
      ? order.totalMinor / 100
      : getLemonEleveUnitAmountMajor();

  await prisma.eleveRegistrationPending.updateMany({
    where: { id: pendingId, consumedAt: null },
    data: { lemonSqueezyOrderId: orderId },
  });

  return fulfillEleveRegistrationCore({
    pendingId,
    amountMajor,
    paymentLabel: "Inscription élève (Lemon Squeezy)",
    paymentMethod: "LEMON_SQUEEZY",
    paymentNote: `lemon_order:${orderId}`,
  });
}

export function parseLemonWebhookPendingId(body: {
  meta?: unknown;
  data?: unknown;
}): string | null {
  const fromMeta = parsePendingIdFromWebhookMeta(body.meta);
  if (fromMeta) return fromMeta;

  const data = body.data;
  if (!data || typeof data !== "object") return null;
  const attrs = (data as Record<string, unknown>).attributes;
  if (!attrs || typeof attrs !== "object") return null;
  const custom = (attrs as Record<string, unknown>).custom;
  if (custom && typeof custom === "object") {
    const id = (custom as Record<string, unknown>).pending_id;
    if (typeof id === "string" && id) return id;
  }
  return null;
}
