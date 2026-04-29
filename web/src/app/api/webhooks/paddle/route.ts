import { fulfillEleveRegistrationFromPaddleTransaction } from "@/lib/fulfill-eleve-registration-paddle";
import { getPaddle } from "@/lib/paddle-server";
import { EventName } from "@paddle/paddle-node-sdk";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const paddle = getPaddle();
  const secret = process.env.PADDLE_WEBHOOK_SECRET_KEY?.trim();
  if (!paddle || !secret) {
    return new Response("Paddle webhook non configuré.", { status: 500 });
  }

  const rawBody = await request.text();
  const headerList = await headers();
  const signature = headerList.get("paddle-signature") ?? "";

  let event;
  try {
    event = await paddle.webhooks.unmarshal(rawBody, secret, signature);
  } catch (e) {
    console.error("[paddle/webhook] signature", e);
    return new Response("Signature invalide.", { status: 400 });
  }

  if (
    event.eventType === EventName.TransactionCompleted ||
    event.eventType === EventName.TransactionPaid
  ) {
    const data = event.data as { id?: string };
    if (data.id) {
      await fulfillEleveRegistrationFromPaddleTransaction(data.id);
    }
  }

  return Response.json({ received: true });
}
