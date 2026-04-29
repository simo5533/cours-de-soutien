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
    console.error("[startElevePaddleCheckout]", e);
    await prisma.eleveRegistrationPending
      .delete({ where: { id: pending.id } })
      .catch(() => {});
    return {
      error:
        "Impossible d'ouvrir la page de paiement. Vérifiez la configuration Paddle (prix, devise, clé API).",
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
}
