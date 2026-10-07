import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import type { CurrencyCode } from "@paddle/paddle-node-sdk";
import { getPlanByCheckout, resolvePriceEnv, type CheckoutElevePlan } from "@/lib/plans";

let paddle: Paddle | null | undefined;

/**
 * Paddle attend uniquement la valeur du jeton (`pdl_sdbx_apikey_…` / `pdl_live_apikey_…`).
 * Copier « Bearer … », des guillemets ou une ligne complète casse le header Authorization.
 * @see https://developer.paddle.com/errors/shared/authentication_malformed
 */
function sanitizePaddleApiKey(raw: string): string {
  let k = raw.trim();
  if (/^bearer\s+/i.test(k)) {
    k = k.replace(/^bearer\s+/i, "").trim();
  }
  if (
    (k.startsWith('"') && k.endsWith('"')) ||
    (k.startsWith("'") && k.endsWith("'"))
  ) {
    k = k.slice(1, -1).trim();
  }
  return k.trim();
}

export function getPaddle(): Paddle | null {
  const raw = process.env.PADDLE_API_KEY?.trim();
  if (!raw) {
    paddle = null;
    return null;
  }
  const key = sanitizePaddleApiKey(raw);
  if (!key) {
    paddle = null;
    return null;
  }
  if (!key.startsWith("pdl_")) {
    console.warn(
      "[paddle] PADDLE_API_KEY doit commencer par pdl_ (clé API Billing — pas le secret webhook ni une client-side token).",
    );
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

export type ElevePaddlePlan = CheckoutElevePlan;

/** `pri_…` de la formule (clés d'environnement définies dans `lib/plans.ts`). */
export function getPaddlePriceIdForElevePlan(plan: ElevePaddlePlan): string | null {
  return resolvePriceEnv(getPlanByCheckout(plan).paddlePriceEnvKeys);
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
