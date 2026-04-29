"use server";

import bcrypt from "bcryptjs";
import type { Transaction } from "@paddle/paddle-node-sdk";
import { prisma } from "@/lib/prisma";
import {
  getPaddle,
  getPaddleCheckoutCurrency,
  getPaddleEleveUnitAmountMinor,
  getPaddlePriceIdForElevePlan,
  type ElevePaddlePlan,
} from "@/lib/paddle-server";
import { getAppBaseUrl } from "@/lib/stripe-server";

/** Détail Paddle + pistes correctives (voir erreurs officielles transactions). */
function paddleTransactionErrorHint(error: unknown): string {
  let raw = "";
  let paddleCode = "";

  if (typeof error === "object" && error !== null) {
    const o = error as Record<string, unknown>;
    if (typeof o.detail === "string" && o.detail.trim()) {
      raw = o.detail.trim();
    }
    if (typeof o.code === "string") paddleCode = o.code;
  }
  if (!raw && error instanceof Error) {
    raw = error.message;
  }

  const lower = raw.toLowerCase();

  const lines: string[] = [];

  if (paddleCode === "forbidden" || lower.includes("not permitted")) {
    lines.push(
      "Erreur Paddle 403 (forbidden) : la clé API est acceptée mais ne peut pas créer de transaction/checkout — vérifiez les permissions de la clé (droits Transaction / écriture), ou créez une nouvelle clé « Standard » avec accès transactions ; sinon contactez sellers@paddle.com avec le request_id du log.",
    );
    lines.push(
      "Référence : developer.paddle.com/errors/shared/forbidden",
    );
  }

  if (
    paddleCode === "transaction_checkout_not_enabled" ||
    lower.includes("checkout has not yet been enabled") ||
    lower.includes("onboarding process has completed")
  ) {
    lines.push(
      "Le Paddle Checkout n’est pas encore activé pour votre compte vendeur : terminez tout l’onboarding Paddle (infos légales, vérifications demandées) jusqu’à validation ; tant que ce n’est pas fait, aucune transaction/checkout API ne peut être créée.",
    );
    lines.push(
      "Sinon écrivez à sellers@paddle.com pour confirmer que le checkout est bien activé pour votre compte.",
    );
    lines.push(
      "Référence : developer.paddle.com/errors/transactions/transaction_checkout_not_enabled",
    );
  }

  if (
    lower.includes("default payment link") ||
    lower.includes("transaction_default_checkout_url_not_set")
  ) {
    lines.push(
      "Dans Paddle : Checkout settings → définir un lien / URL de paiement par défaut (sandbox : sandbox-vendors.paddle.com/checkout-settings ; prod : vendors.paddle.com/checkout-settings).",
    );
  }

  if (
    lower.includes("domain") &&
    (lower.includes("approved") || lower.includes("transaction_checkout_url_domain"))
  ) {
    lines.push(
      "Ajoutez le domaine de votre site (ex. cours-de-soutien-mu.vercel.app) dans les domaines approuvés Paddle pour les URLs de checkout.",
    );
  }

  if (
    lower.includes("price") &&
    (lower.includes("not found") || lower.includes("transaction_price_not_found"))
  ) {
    lines.push(
      "Les prix pri_ dans Vercel doivent exister dans le même environnement Paddle que la clé API (sandbox vs production selon PADDLE_ENVIRONMENT).",
    );
  }

  if (
    lower.includes("incorrectly formatted") ||
    lower.includes("authentication_malformed") ||
    lower.includes("authentication header")
  ) {
    lines.push(
      "Collez uniquement la clé API serveur Paddle Billing (elle commence par pdl_), sans le mot Bearer ni de guillemets. Sandbox : clé avec sdbx + PADDLE_ENVIRONMENT différent de production ; prod : clé live + PADDLE_ENVIRONMENT=production.",
    );
  }

  const tail =
    lines.length > 0
      ? lines.join(" ")
      : "Vérifiez PADDLE_API_KEY, PADDLE_ENVIRONMENT, les pri_ et la devise ; consultez les logs Vercel pour le message Paddle exact.";

  const prefix =
    raw.length > 0 && raw.length < 500
      ? `${raw.trim()} — `
      : "";

  return `${prefix}${tail}`;
}

export type ElevePaddleCheckoutState =
  | { error: string }
  | { checkoutUrl: string };

type EleveRegisterInput = {
  name: string;
  email: string;
  password: string;
  groupe: string;
  anneeScolaire: string;
  /** Formule Paddle (trois `pri_` distincts dans l’env ou un seul `PADDLE_PRICE_ID_ELEVE_INSCRIPTION`). */
  paddlePlan?: ElevePaddlePlan;
};

function truncateTech(msg: string, max = 380): string {
  const t = msg.trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

export async function startElevePaddleCheckout(
  input: EleveRegisterInput,
  locale: string,
): Promise<ElevePaddleCheckoutState> {
  const paddle = getPaddle();
  if (!paddle) {
    return {
      error:
        "Paiement Paddle indisponible : configurez PADDLE_API_KEY sur le serveur.",
    };
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.trim() },
    });
    if (existing) {
      return { error: "Cet e-mail est déjà utilisé." };
    }

    await prisma.eleveRegistrationPending.deleteMany({
      where: { email: input.email.trim(), consumedAt: null },
    });

    const passwordHash = await bcrypt.hash(input.password, 10);

    const pending = await prisma.eleveRegistrationPending.create({
      data: {
        email: input.email.trim(),
        passwordHash,
        name: input.name.trim(),
        groupe: input.groupe.trim(),
        anneeScolaire: input.anneeScolaire.trim(),
      },
    });

    const base = getAppBaseUrl();
    const loc = locale === "ar" ? "ar" : "fr";
    const successUrl = `${base}/${loc}/inscription/succes`;

    const plan = input.paddlePlan ?? "essential";
    const priceId = getPaddlePriceIdForElevePlan(plan);
    const currencyCode = getPaddleCheckoutCurrency();

    let txn: Transaction;
    try {
      if (priceId) {
        txn = await paddle.transactions.create({
          items: [{ priceId, quantity: 1 }],
          collectionMode: "automatic",
          customData: { pending_id: pending.id },
          checkout: {
            url: successUrl,
          },
        });
      } else {
        const minor = getPaddleEleveUnitAmountMinor();
        txn = await paddle.transactions.create({
          items: [
            {
              quantity: 1,
              price: {
                description: "Frais d'inscription — accès plateforme Methodix",
                unitPrice: {
                  amount: String(minor),
                  currencyCode,
                },
                product: {
                  name: "Inscription élève Methodix",
                  taxCategory: "training-services",
                  description: "Inscription et accès élève",
                },
              },
            },
          ],
          collectionMode: "automatic",
          customData: { pending_id: pending.id },
          checkout: {
            url: successUrl,
          },
        });
      }
    } catch (e) {
      console.error("[startElevePaddleCheckout] Paddle API", e);
      await prisma.eleveRegistrationPending
        .delete({ where: { id: pending.id } })
        .catch(() => {});
      return {
        error: `Impossible d'ouvrir la page de paiement. ${paddleTransactionErrorHint(e)}`,
      };
    }

    const checkoutUrl = txn.checkout?.url;
    if (!checkoutUrl) {
      await prisma.eleveRegistrationPending
        .delete({ where: { id: pending.id } })
        .catch(() => {});
      return {
        error:
          "Réponse Paddle invalide (URL de paiement absente). Définissez un Default payment link dans Paddle > Checkout.",
      };
    }

    await prisma.eleveRegistrationPending.update({
      where: { id: pending.id },
      data: { paddleTransactionId: txn.id },
    });

    return { checkoutUrl };
  } catch (e) {
    console.error("[startElevePaddleCheckout] erreur interne", e);
    const raw = e instanceof Error ? e.message : String(e);
    let hint =
      " Cause probable : base de données inaccessible. Vérifiez DATABASE_URL sur Vercel, que Neon (Postgres) est actif et que les migrations ont été appliquées.";
    if (/paddle|Paddle|401|403|Unauthorized/i.test(raw)) {
      hint =
        " Cause probable : clé Paddle invalide ou mauvais environnement (sandbox vs production).";
    }
    return {
      error: `Erreur lors de la préparation du paiement.${hint} Détail technique : ${truncateTech(raw)}`,
    };
  }
}
