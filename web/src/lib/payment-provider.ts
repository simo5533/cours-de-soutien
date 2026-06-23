export type PaymentProvider = "lemonsqueezy" | "paddle" | "stripe";

/** Prestataire de paiement inscription élève (défaut : Lemon Squeezy). */
export function getPaymentProvider(): PaymentProvider {
  const raw = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();
  if (raw === "stripe") return "stripe";
  if (raw === "paddle") return "paddle";
  return "lemonsqueezy";
}

export function getPaymentProviderLabel(provider?: PaymentProvider): string {
  const p = provider ?? getPaymentProvider();
  if (p === "stripe") return "Stripe";
  if (p === "paddle") return "Paddle";
  return "Lemon Squeezy";
}

export function isStripePayment(): boolean {
  return getPaymentProvider() === "stripe";
}

export function isPaddlePayment(): boolean {
  return getPaymentProvider() === "paddle";
}

export function isLemonSqueezyPayment(): boolean {
  return getPaymentProvider() === "lemonsqueezy";
}
