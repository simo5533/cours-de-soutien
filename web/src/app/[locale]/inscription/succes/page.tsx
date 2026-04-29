import { SiteHeader } from "@/components/site-header";
import { fulfillEleveRegistrationFromPaddleTransaction } from "@/lib/fulfill-eleve-registration-paddle";
import { fulfillEleveRegistrationFromStripeSession } from "@/lib/fulfill-eleve-registration";
import { Link } from "@/i18n/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    session_id?: string;
    /** Paddle — identifiant transaction après paiement */
    _ptxn?: string;
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

  let title = "Paiement confirmé";
  let message =
    "Votre compte élève est activé. Vous pouvez vous connecter avec l’e-mail et le mot de passe choisis à l’inscription.";
  let ok = true;

  if (!session_id && !paddleTxn) {
    ok = false;
    title = "Lien incomplet";
    message =
      "Retournez à l’inscription ou ouvrez le lien reçu après le paiement.";
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
    <>
      <SiteHeader />
      <div className="mx-auto w-full max-w-md px-4 py-16 text-center sm:py-20">
        <div className="card-elevated p-10 shadow-xl shadow-slate-900/5 dark:shadow-black/40">
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
              ok
                ? "bg-brandblue/15 text-navy dark:bg-brandblue/20 dark:text-brandblue"
                : "bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200"
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
          <p className="mt-6 text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
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
      <p className="pb-10 text-center text-sm">
        <Link
          href="/"
          className="font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          ← Retour à l’accueil
        </Link>
      </p>
    </>
  );
}
