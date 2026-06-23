const API_BASE = "https://api.lemonsqueezy.com/v1";

export type EleveLemonPlan = "essential" | "bacplus" | "family";

function getApiKey(): string | null {
  const key = process.env.LEMONSQUEEZY_API_KEY?.trim();
  return key || null;
}

export function isLemonSqueezyConfigured(): boolean {
  return !!(
    getApiKey() &&
    process.env.LEMONSQUEEZY_STORE_ID?.trim() &&
    (getLemonVariantIdForElevePlan("essential") ||
      process.env.LEMONSQUEEZY_VARIANT_ID_ELEVE_INSCRIPTION?.trim())
  );
}

export function getLemonSqueezyStoreId(): string | null {
  const id = process.env.LEMONSQUEEZY_STORE_ID?.trim();
  return id || null;
}

export function getLemonVariantIdForElevePlan(plan: EleveLemonPlan): string | null {
  const specific =
    plan === "essential"
      ? process.env.LEMONSQUEEZY_VARIANT_ID_ELEVE_ESSENTIAL?.trim()
      : plan === "bacplus"
        ? process.env.LEMONSQUEEZY_VARIANT_ID_ELEVE_BAC_PLUS?.trim()
        : process.env.LEMONSQUEEZY_VARIANT_ID_ELEVE_FAMILY?.trim();
  if (specific) return specific;
  const fallback = process.env.LEMONSQUEEZY_VARIANT_ID_ELEVE_INSCRIPTION?.trim();
  return fallback || null;
}

/** Montant affiché si l’API ne renvoie pas le total (plus petite unité → unité principale). */
export function getLemonEleveUnitAmountMajor(): number {
  const raw = process.env.LEMONSQUEEZY_ELEVE_INSCRIPTION_AMOUNT?.trim();
  const n = raw ? Number(raw) : NaN;
  if (!Number.isFinite(n) || n <= 0) return 99;
  return n >= 100 ? n / 100 : n;
}

type LemonJson = {
  data?: {
    id?: string;
    attributes?: Record<string, unknown>;
  };
  errors?: { detail?: string; title?: string }[];
};

async function lemonFetch(
  path: string,
  init?: RequestInit,
): Promise<LemonJson> {
  const key = getApiKey();
  if (!key) throw new Error("LEMONSQUEEZY_API_KEY manquante.");

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${key}`,
      ...init?.headers,
    },
  });

  const json = (await res.json()) as LemonJson;
  if (!res.ok) {
    const detail =
      json.errors?.map((e) => e.detail || e.title).filter(Boolean).join(" ") ||
      res.statusText;
    throw new Error(detail || `Lemon Squeezy HTTP ${res.status}`);
  }
  return json;
}

/** Crée un checkout hébergé et renvoie l’URL de paiement. */
export async function createLemonSqueezyCheckout(params: {
  variantId: string;
  storeId: string;
  email: string;
  pendingId: string;
  redirectUrl: string;
}): Promise<string> {
  const testMode =
    process.env.LEMONSQUEEZY_TEST_MODE?.trim().toLowerCase() === "true";

  const json = await lemonFetch("/checkouts", {
    method: "POST",
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          test_mode: testMode,
          product_options: {
            redirect_url: params.redirectUrl,
          },
          checkout_data: {
            email: params.email,
            custom: {
              pending_id: params.pendingId,
            },
          },
        },
        relationships: {
          store: {
            data: { type: "stores", id: params.storeId },
          },
          variant: {
            data: { type: "variants", id: params.variantId },
          },
        },
      },
    }),
  });

  const url = json.data?.attributes?.url;
  if (typeof url !== "string" || !url) {
    throw new Error("Réponse Lemon Squeezy invalide (URL checkout absente).");
  }
  return url;
}

export type LemonOrder = {
  id: string;
  status: string;
  totalMinor: number;
  currency: string;
  userEmail: string | null;
  pendingId: string | null;
};

export async function fetchLemonSqueezyOrder(
  orderId: string,
): Promise<LemonOrder | null> {
  const json = await lemonFetch(`/orders/${orderId}`);
  const attrs = json.data?.attributes;
  if (!attrs || !json.data?.id) return null;

  const status = String(attrs.status ?? "");
  const totalMinor = Number(attrs.total ?? 0);
  const currency = String(attrs.currency ?? "USD");
  const userEmail =
    typeof attrs.user_email === "string" ? attrs.user_email : null;

  let pendingId: string | null = null;
  const custom = attrs.custom as Record<string, unknown> | undefined;
  if (custom && typeof custom.pending_id === "string") {
    pendingId = custom.pending_id;
  }
  const firstItem = attrs.first_order_item as Record<string, unknown> | undefined;
  if (!pendingId && firstItem) {
    const meta = firstItem.meta as Record<string, unknown> | undefined;
    const cd = meta?.custom_data as Record<string, unknown> | undefined;
    if (cd && typeof cd.pending_id === "string") pendingId = cd.pending_id;
  }

  return {
    id: json.data.id,
    status,
    totalMinor: Number.isFinite(totalMinor) ? totalMinor : 0,
    currency,
    userEmail,
    pendingId,
  };
}
