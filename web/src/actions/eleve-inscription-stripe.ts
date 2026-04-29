"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  getAppBaseUrl,
  getEleveInscriptionUnitAmount,
  getStripe,
  getStripePriceIdEleve,
} from "@/lib/stripe-server";

export type EleveStripeCheckoutState =
  | { error: string }
  | { checkoutUrl: string };

type EleveRegisterInput = {
  name: string;
  email: string;
  password: string;
  groupe: string;
  anneeScolaire: string;
};

export async function startEleveStripeCheckout(
  input: EleveRegisterInput,
  locale: string,
): Promise<EleveStripeCheckoutState> {
  const stripe = getStripe();
  if (!stripe) {
    return {
      error:
        "Paiement en ligne indisponible : configurez STRIPE_SECRET_KEY sur le serveur.",
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

  const priceId = getStripePriceIdEleve();
  const lineItems = priceId
    ? [{ price: priceId, quantity: 1 as const }]
    : [
        {
          price_data: {
            currency: "mad",
            product_data: {
              name: "Inscription élève Methodix",
              description: "Frais d'inscription — accès plateforme",
            },
            unit_amount: getEleveInscriptionUnitAmount(),
          },
          quantity: 1 as const,
        },
      ];

  let session: Awaited<
    ReturnType<typeof stripe.checkout.sessions.create>
  >;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: pending.id,
      metadata: { pendingId: pending.id },
      success_url: `${base}/${loc}/inscription/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/${loc}/inscription?pay=cancel`,
      customer_email: input.email.trim(),
      line_items: lineItems,
    });
  } catch (e) {
    console.error("[startEleveStripeCheckout]", e);
    await prisma.eleveRegistrationPending
      .delete({ where: { id: pending.id } })
      .catch(() => {});
    return {
      error:
        "Impossible d'ouvrir la page de paiement. Vérifiez la configuration Stripe (prix, devise, clés).",
    };
  }

  if (!session.url) {
    await prisma.eleveRegistrationPending
      .delete({ where: { id: pending.id } })
      .catch(() => {});
    return { error: "Réponse Stripe invalide." };
  }

  await prisma.eleveRegistrationPending.update({
    where: { id: pending.id },
    data: { stripeSessionId: session.id },
  });

  return { checkoutUrl: session.url };
}
