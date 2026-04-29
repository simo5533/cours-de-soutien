import { NextResponse } from "next/server";

/**
 * Webhook CMI (paiement Maroc) — à brancher quand le contrat CMI et la clé HMAC sont disponibles.
 *
 * Attendu : vérification de signature HMAC, idempotence, mise à jour du plan utilisateur
 * (Prisma : champ futur `subscriptionPlan` / `cmiOrderId`, etc.).
 *
 * @see `src/config/methodix-plans.v2.ts` — IMPORTANT_CMI_NOTE
 */
export async function POST(request: Request) {
  const secret = process.env.CMI_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "CMI_WEBHOOK_SECRET non configuré. Définissez la clé dans web/.env pour activer la vérification HMAC.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Corps JSON invalide." }, { status: 400 });
  }

  // TODO: implémenter la vérif signature selon la doc CMI du marchand, puis :
  // - valider le montant (centimes) vs plan
  // - marquer l'abonnement comme actif / enregistrer le paiement

  void body;
  return NextResponse.json(
    {
      ok: false,
      message:
        "Webhook CMI reçu : logique métier à finaliser (signature HMAC + mise à jour base).",
    },
    { status: 501 },
  );
}

/** Certains fournisseurs vérifient l’URL en GET. */
export async function GET() {
  return NextResponse.json({
    service: "Methodix CMI webhook",
    status: "configure POST + CMI_WEBHOOK_SECRET",
  });
}
