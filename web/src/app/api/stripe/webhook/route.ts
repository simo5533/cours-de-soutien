import { fulfillEleveRegistrationFromStripeSession } from "@/lib/fulfill-eleve-registration";
import { getStripe } from "@/lib/stripe-server";
import { headers } from "next/headers";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!stripe || !whSecret) {
    return new Response("Stripe webhook non configuré.", { status: 500 });
  }

  const body = await request.text();
  const headerList = await headers();
  const sig = headerList.get("stripe-signature");
  if (!sig) {
    return new Response("Signature manquante.", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
  } catch (e) {
    console.error("[stripe/webhook] signature", e);
    return new Response("Signature invalide.", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await fulfillEleveRegistrationFromStripeSession(session.id);
  }

  return Response.json({ received: true });
}
