import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import type { CurrencyCode } from "@paddle/paddle-node-sdk";

let paddle: Paddle | null | undefined;

export function getPaddle(): Paddle | null {
  const key = process.env.PADDLE_API_KEY?.trim();
  if (!key) {
    paddle = null;
    return null;
  }
  if (paddle === undefined) {
    const sandbox =
      process.env.PADDLE_ENVIRONMENT?.trim().toLowerCase() !== "production";
    paddle = new Paddle(key, {
      environment: sandbox ? Environment.sandbox : Environment.production,
    });
  }
  return paddle;
}

/** Prix catalogue Paddle (`pri_…`) ; recommandé en production (identique pour toutes les formules si utilisé seul). */
export function getPaddlePriceIdEleve(): string | null {
  const id = process.env.PADDLE_PRICE_ID_ELEVE_INSCRIPTION?.trim();
  return id || null;
}

export type ElevePaddlePlan = "essential" | "bacplus" | "family";

/** `pri_…` pour la formule choisie, sinon repli sur `PADDLE_PRICE_ID_ELEVE_INSCRIPTION`. */
export function getPaddlePriceIdForElevePlan(plan: ElevePaddlePlan): string | null {
  const specific =
    plan === "essential"
      ? process.env.PADDLE_PRICE_ID_ELEVE_ESSENTIAL?.trim()
      : plan === "bacplus"
        ? process.env.PADDLE_PRICE_ID_ELEVE_BAC_PLUS?.trim()
        : process.env.PADDLE_PRICE_ID_ELEVE_FAMILY?.trim();
  if (specific) return specific;
  return getPaddlePriceIdEleve();
}

/**
 * Montant unitaire pour prix hors catalogue — plus petite unité monétaire (ex. centimes pour EUR).
 * Aligné sur la logique Stripe `STRIPE_ELEVE_INSCRIPTION_AMOUNT`.
 */
export function getPaddleEleveUnitAmountMinor(): number {
  const raw = process.env.PADDLE_ELEVE_INSCRIPTION_AMOUNT?.trim();
  const n = raw ? Number(raw) : NaN;
  if (!Number.isFinite(n) || n <= 0) {
    return 9900;
  }
  return Math.round(n);
}

/** Devise checkout si création hors catalogue (créez plutôt un Price dans Paddle). */
export function getPaddleCheckoutCurrency(): CurrencyCode {
  const c = (process.env.PADDLE_CHECKOUT_CURRENCY?.trim() || "EUR") as CurrencyCode;
  return c;
}
