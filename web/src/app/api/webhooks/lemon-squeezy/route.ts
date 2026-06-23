import {
  fulfillEleveRegistrationFromLemonSqueezyOrder,
  parseLemonWebhookPendingId,
} from "@/lib/fulfill-eleve-registration-lemon-squeezy";
import crypto from "node:crypto";

function verifyLemonSignature(
  rawBody: string,
  signature: string,
  secret: string,
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(digest, "utf8"),
      Buffer.from(signature, "utf8"),
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return new Response("Webhook Lemon Squeezy non configuré.", { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-signature") ?? "";

  if (!signature || !verifyLemonSignature(rawBody, signature, secret)) {
    console.error("[lemon-squeezy/webhook] signature invalide");
    return new Response("Signature invalide.", { status: 400 });
  }

  let body: {
    meta?: { event_name?: string };
    data?: { id?: string; type?: string };
  };
  try {
    body = JSON.parse(rawBody) as typeof body;
  } catch {
    return new Response("JSON invalide.", { status: 400 });
  }

  const eventName = body.meta?.event_name;
  if (eventName === "order_created" && body.data?.type === "orders" && body.data.id) {
    const pendingId = parseLemonWebhookPendingId(body);
    await fulfillEleveRegistrationFromLemonSqueezyOrder(body.data.id, {
      pendingIdFromWebhook: pendingId,
    });
  }

  return Response.json({ received: true });
}
