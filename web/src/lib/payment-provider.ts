export type PaymentProvider = "paddle" | "stripe";

/** Prestataire de paiement inscription élève (défaut : Paddle). */
export function getPaymentProvider(): PaymentProvider {
  const raw = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();
  if (raw === "stripe") return "stripe";
  return "paddle";
}

export function getPaymentProviderLabel(provider?: PaymentProvider): string {
  const p = provider ?? getPaymentProvider();
  return p === "stripe" ? "Stripe" : "Paddle";
}

export function isStripePayment(): boolean {
  return getPaymentProvider() === "stripe";
}

export function isPaddlePayment(): boolean {
  return getPaymentProvider() === "paddle";
}
