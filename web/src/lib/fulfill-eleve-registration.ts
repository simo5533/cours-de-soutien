import {
  getEleveInscriptionUnitAmount,
  getStripe,
} from "@/lib/stripe-server";
import { fulfillEleveRegistrationCore } from "@/lib/fulfill-eleve-registration-core";

/**
 * Crée le compte élève + enregistre le paiement après Checkout Stripe réussi.
 * Idempotent (webhook + page succès peuvent l’appeler).
 */
export async function fulfillEleveRegistrationFromStripeSession(
  checkoutSessionId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const stripe = getStripe();
  if (!stripe) {
    return { ok: false, error: "Paiement non configuré sur le serveur." };
  }

  let session: Awaited<
    ReturnType<typeof stripe.checkout.sessions.retrieve>
  >;
  try {
    session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
  } catch {
    return { ok: false, error: "Impossible de vérifier la session de paiement." };
  }

  if (session.payment_status !== "paid") {
    return { ok: false, error: "Paiement non confirmé." };
  }

  const pendingId = session.metadata?.pendingId;
  if (!pendingId) {
    return { ok: false, error: "Session invalide (métadonnées manquantes)." };
  }

  const amountMinor = session.amount_total ?? 0;
  const amountMajor =
    amountMinor > 0
      ? amountMinor / 100
      : getEleveInscriptionUnitAmount() / 100;

  return fulfillEleveRegistrationCore({
    pendingId,
    amountMajor,
    paymentLabel: "Inscription élève (Stripe)",
    paymentMethod: "STRIPE",
    paymentNote: `stripe_session:${checkoutSessionId}`,
  });
}
