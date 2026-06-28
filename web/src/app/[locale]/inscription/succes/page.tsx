import { PublicPageFrame } from "@/components/public-page-frame";
import { fulfillEleveRegistrationFromLemonSqueezyOrder } from "@/lib/fulfill-eleve-registration-lemon-squeezy";
import { fulfillEleveRegistrationFromPaddleTransaction } from "@/lib/fulfill-eleve-registration-paddle";
import { fulfillEleveRegistrationFromStripeSession } from "@/lib/fulfill-eleve-registration";
import { Link } from "@/i18n/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    session_id?: string;
    /** Paddle — identifiant transaction après paiement */
    _ptxn?: string;
    /** Lemon Squeezy — identifiant commande après paiement */
    order_id?: string;
  }>;
};

export default async function InscriptionSuccesPage({
  params: _localeParams,
  searchParams,
}: PageProps) {
  await _localeParams;
  const sp = await searchParams;
  const session_id = sp.session_id;
  const paddleTxn = sp._ptxn?.trim();
  const lemonOrderId = sp.order_id?.trim();

  let title = "Paiement confirmé";
  let message =
    "Votre compte élève est activé. Vous pouvez vous connecter avec l’e-mail et le mot de passe choisis à l’inscription.";
  let ok = true;

  if (!session_id && !paddleTxn && !lemonOrderId) {
    ok = false;
    title = "Lien incomplet";
    message =
      "Retournez à l’inscription ou ouvrez le lien reçu après le paiement.";
  } else if (lemonOrderId) {
    const result =
      await fulfillEleveRegistrationFromLemonSqueezyOrder(lemonOrderId);
    if (!result.ok) {
      ok = false;
      title = "Finalisation en cours";
      message =
        result.error === "Paiement non confirmé."
          ? "Le paiement n’est pas encore confirmé. Patientez quelques instants puis réessayez, ou contactez le support."
          : result.error;
    }
  } else if (paddleTxn) {
    const result =
      await fulfillEleveRegistrationFromPaddleTransaction(paddleTxn);
    if (!result.ok) {
      ok = false;
      title = "Finalisation en cours";
      message =
        result.error === "Paiement non confirmé."
          ? "Le paiement n’est pas encore confirmé. Patientez quelques instants puis réessayez, ou contactez le support."
          : result.error;
    }
  } else if (session_id) {
    const result = await fulfillEleveRegistrationFromStripeSession(session_id);
    if (!result.ok) {
      ok = false;
      title = "Finalisation en cours";
      message =
        result.error === "Paiement non confirmé."
          ? "Le paiement n’est pas encore confirmé. Patientez quelques instants puis réessayez, ou contactez le support."
          : result.error;
    }
  }

  return (
    <PublicPageFrame mainClassName="page-bg page-x mx-auto flex w-full max-w-md flex-1 flex-col pb-12 pb-safe pt-6 sm:pb-16 sm:pt-12">
      <div className="py-8 text-center sm:py-12">
        <div className="card-elevated p-10 shadow-xl shadow-electric/[0.06]">
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
              ok
                ? "bg-success/15 text-success"
                : "bg-amber-500/15 text-amber-800"
            }`}
          >
            {ok ? (
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z"
                />
              </svg>
            )}
          </div>
          <p className="mt-6 text-lg font-bold text-navy">
            {title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-text">
            {message}
          </p>
          {ok ? (
            <Link
              href="/connexion"
              className="btn-primary mt-8 inline-flex w-full sm:w-auto"
            >
              Aller à la connexion
            </Link>
          ) : (
            <Link
              href="/inscription"
              className="btn-secondary mt-8 inline-flex w-full sm:w-auto"
            >
              Retour à l’inscription
            </Link>
          )}
        </div>
      </div>
      <p className="pb-4 text-center text-sm">
        <Link
          href="/"
          className="font-medium text-electric underline-offset-4 transition hover:text-premium"
        >
          ← Retour à l’accueil
        </Link>
      </p>
    </PublicPageFrame>
  );
}
