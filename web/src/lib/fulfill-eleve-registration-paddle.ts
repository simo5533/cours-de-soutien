import {
  getPaddle,
  getPaddleEleveUnitAmountMinor,
} from "@/lib/paddle-server";
import { fulfillEleveRegistrationCore } from "@/lib/fulfill-eleve-registration-core";

function parsePendingId(customData: unknown): string | null {
  if (!customData || typeof customData !== "object") return null;
  const o = customData as Record<string, unknown>;
  const id = o.pending_id ?? o.pendingId;
  return typeof id === "string" && id.length > 0 ? id : null;
}

export async function fulfillEleveRegistrationFromPaddleTransaction(
  transactionId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const paddle = getPaddle();
  if (!paddle) {
    return { ok: false, error: "Paiement Paddle non configuré sur le serveur." };
  }

  let txn: Awaited<ReturnType<typeof paddle.transactions.get>>;
  try {
    txn = await paddle.transactions.get(transactionId);
  } catch {
    return { ok: false, error: "Impossible de vérifier la transaction Paddle." };
  }

  const okStatus =
    txn.status === "paid" ||
    txn.status === "completed" ||
    txn.status === "billed";
  if (!okStatus) {
    return { ok: false, error: "Paiement non confirmé." };
  }

  const pendingId = parsePendingId(txn.customData);
  if (!pendingId) {
    return { ok: false, error: "Transaction invalide (pending_id manquant)." };
  }

  const grand = txn.details?.totals?.grandTotal;
  let amountMajor = grand ? parseFloat(grand) : 0;
  if (!Number.isFinite(amountMajor) || amountMajor <= 0) {
    const minor = getPaddleEleveUnitAmountMinor();
    amountMajor = minor / 100;
  }

  return fulfillEleveRegistrationCore({
    pendingId,
    amountMajor,
    paymentLabel: "Inscription élève (Paddle)",
    paymentMethod: "PADDLE",
    paymentNote: `paddle_txn:${transactionId}`,
  });
}
