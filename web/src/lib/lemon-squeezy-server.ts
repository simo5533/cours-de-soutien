const API_BASE = "https://api.lemonsqueezy.com/v1";

export type EleveLemonPlan = "essential" | "bacplus" | "family";

function getApiKey(): string | null {
  const key = process.env.LEMONSQUEEZY_API_KEY?.trim();
  return key || null;
}

/** Extrait un ID numérique Lemon (accepte aussi une URL collée par erreur). */
export function sanitizeLemonNumericId(
  raw: string | undefined | null,
  kind: "stores" | "variants" | "products",
): string | null {
  const t = raw?.trim();
  if (!t) return null;
  const fromPath = t.match(new RegExp(`/${kind}/(\\d+)`));
  if (fromPath?.[1]) return fromPath[1];
  if (/^\d+$/.test(t)) return t;
  return null;
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
  return sanitizeLemonNumericId(process.env.LEMONSQUEEZY_STORE_ID, "stores");
}

export function getLemonVariantIdForElevePlan(plan: EleveLemonPlan): string | null {
  const raw =
    plan === "essential"
      ? process.env.LEMONSQUEEZY_VARIANT_ID_ELEVE_ESSENTIAL
      : plan === "bacplus"
        ? process.env.LEMONSQUEEZY_VARIANT_ID_ELEVE_BAC_PLUS
        : process.env.LEMONSQUEEZY_VARIANT_ID_ELEVE_FAMILY;
  const specific = sanitizeLemonNumericId(raw, "variants");
  if (specific) return specific;
  return sanitizeLemonNumericId(
    process.env.LEMONSQUEEZY_VARIANT_ID_ELEVE_INSCRIPTION,
    "variants",
  );
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
    relationships?: Record<
      string,
      { data?: { type?: string; id?: string } | null }
    >;
  };
  errors?: {
    detail?: string;
    title?: string;
    source?: { pointer?: string };
  }[];
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
    const parts =
      json.errors?.map((e) => {
        const ptr = e.source?.pointer ?? "";
        let hint = "";
        if (ptr.includes("variant")) {
          hint =
            " → vérifiez LEMONSQUEEZY_VARIANT_ID_* (ID après /variants/, pas /products/).";
        } else if (ptr.includes("store")) {
          hint = " → vérifiez LEMONSQUEEZY_STORE_ID (ID après /stores/).";
        }
        return `${e.detail || e.title || "Erreur"}${hint}`;
      }) ?? [];
    const detail = parts.filter(Boolean).join(" ") || res.statusText;
    throw new Error(detail || `Lemon Squeezy HTTP ${res.status}`);
  }
  return json;
}

/** Vérifie store + variant avant checkout (erreur API plus claire). */
export async function validateLemonSqueezyResources(
  storeId: string,
  variantId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await lemonFetch(`/stores/${storeId}`);
  } catch {
    return {
      ok: false,
      error: `Store ID invalide (${storeId}). Mettez seulement le nombre, ex. 123456 — pas une URL. Lemon → icône profil (en bas à gauche) → Stores → votre boutique → URL .../stores/123456`,
    };
  }

  let variantJson: LemonJson;
  try {
    variantJson = await lemonFetch(`/variants/${variantId}`);
  } catch {
    return {
      ok: false,
      error: `Variant ID invalide (${variantId}). Ouvrez le PRIX dans Lemon (pas la page produit seule) : .../products/1168063/variants/XXXXXX → mettez XXXXXX dans LEMONSQUEEZY_VARIANT_ID_*. Ne mettez pas 1168063 (c'est le product ID).`,
    };
  }

  const variantStoreId =
    variantJson.data?.relationships?.store?.data?.id?.trim();
  if (variantStoreId && variantStoreId !== storeId.trim()) {
    return {
      ok: false,
      error: `Le variant ${variantId} appartient au store ${variantStoreId}, mais LEMONSQUEEZY_STORE_ID=${storeId}. Utilisez le même store que le produit, ou corrigez le Store ID.`,
    };
  }

  return { ok: true };
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
