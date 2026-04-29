"use client";

import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { registerAction, type RegisterState } from "@/actions/auth";
import { ANNEES_SCOLAIRES } from "@/lib/school-years";

const roles = [
  { value: "ELEVE", label: "Élève" },
  { value: "PROFESSEUR", label: "Professeur" },
] as const;

export function InscriptionForm() {
  const locale = useLocale();
  const payCancel = useSearchParams().get("pay") === "cancel";
  const [role, setRole] = useState<string>("ELEVE");
  const [state, formAction, pending] = useActionState(
    registerAction,
    undefined as RegisterState,
  );

  useEffect(() => {
    if (state && "checkoutUrl" in state && state.checkoutUrl) {
      window.location.href = state.checkoutUrl;
    }
  }, [state]);

  /** Toujours avant `ok` : l’élève doit passer par la page de paiement (Stripe ou Paddle). */
  if (state && "checkoutUrl" in state && state.checkoutUrl) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16 text-center sm:py-20">
        <div className="card-elevated p-10 shadow-xl shadow-slate-900/5 dark:shadow-black/40">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Redirection vers le paiement sécurisé…
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Vous allez être redirigé vers notre prestataire de paiement (Stripe ou
            Paddle selon la configuration). Complétez le paiement pour activer
            votre compte élève.
          </p>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
            Si rien ne se passe, vérifiez que les pop-ups ou redirections ne sont
            pas bloquées.
          </p>
        </div>
      </div>
    );
  }

  if (state && "ok" in state && state.ok) {
    const skippedPayment = Boolean(state.paymentSkippedInDev);

    return (
      <div className="mx-auto w-full max-w-md px-4 py-16 text-center">
        <div className="card-elevated p-10 shadow-xl shadow-slate-900/5 dark:shadow-black/40">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brandblue/15 text-navy dark:bg-brandblue/20 dark:text-brandblue">
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
          </div>
          <p className="mt-6 text-lg font-bold text-slate-900 dark:text-white">
            Compte créé
          </p>
          {skippedPayment ? (
            <>
              <p
                role="status"
                className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-left text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100"
              >
                <strong className="font-semibold">Mode développement :</strong>{" "}
                aucun paiement n’a été encaissé. Ce compte est créé uniquement parce
                que{" "}
                <code className="rounded bg-amber-100/80 px-1 py-0.5 font-mono text-xs dark:bg-amber-900/80">
                  STRIPE_BYPASS_IN_DEV=true
                </code>{" "}
                est activé alors qu’aucune clé Stripe/Paddle n’est configurée.
              </p>
              <p className="mt-3 text-sm font-medium text-navy dark:text-brandblue">
                Pour un vrai paiement : dans{" "}
                <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                  web/.env
                </code>
                , mettez{" "}
                <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                  STRIPE_BYPASS_IN_DEV=false
                </code>
                , ajoutez{" "}
                <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                  STRIPE_SECRET_KEY
                </code>{" "}
                (ou Paddle :{" "}
                <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                  PADDLE_API_KEY
                </code>{" "}
                +{" "}
                <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                  PAYMENT_PROVIDER=paddle
                </code>
                ), puis réinscrivez-vous.
              </p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Vous pouvez tout de même vous connecter pour tester sans paiement.
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Vous pouvez maintenant vous connecter.
            </p>
          )}
          <Link href="/connexion" className="btn-primary mt-8 inline-flex w-full sm:w-auto">
            Aller à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:py-20">
      <div className="card-elevated p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/40">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Inscription
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Compte élève ou professeur. Les élèves renseignent la classe et
          l’année scolaire pour afficher les bons cours.
        </p>
        {payCancel ? (
          <p
            role="status"
            className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
          >
            Paiement annulé. Vous pouvez réessayer quand vous voulez.
          </p>
        ) : null}
        {role === "ELEVE" ? (
          <p className="mt-4 rounded-xl border border-brandblue/25 bg-brandblue/5 px-4 py-3 text-sm text-navy dark:border-brandblue/20 dark:bg-brandblue/10 dark:text-brandblue/90">
            <strong className="font-semibold">Élève :</strong> après validation du
            formulaire, vous allez être{" "}
            <strong className="font-semibold">redirigé vers le paiement sécurisé</strong>{" "}
            (Stripe ou Paddle). Le compte élève n’est activé qu’après paiement réussi ;
            vous pourrez alors vous connecter.
          </p>
        ) : null}
        <form className="mt-8 flex flex-col gap-5" action={formAction}>
          <input type="hidden" name="locale" value={locale} />
          {state && "error" in state && state.error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-100"
            >
              {state.error}
            </p>
          ) : null}
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Nom affiché
            </span>
            <input
              name="name"
              required
              autoComplete="name"
              className="input-field"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              E-mail
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="input-field"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Mot de passe
            </span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="input-field"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Je suis
            </span>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-field"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          {role === "ELEVE" ? (
            <>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Groupe / classe
                </span>
                <input
                  name="groupe"
                  required
                  placeholder="ex. 3ème 2, Terminale S1"
                  className="input-field"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Année scolaire
                </span>
                <select
                  name="anneeScolaire"
                  required
                  defaultValue={ANNEES_SCOLAIRES[1]}
                  className="input-field"
                >
                  {ANNEES_SCOLAIRES.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending
              ? role === "ELEVE"
                ? "Préparation du paiement…"
                : "Création…"
              : role === "ELEVE"
                ? "Continuer vers le paiement"
                : "Créer mon compte"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Déjà inscrit ?{" "}
          <Link
            href="/connexion"
            className="font-semibold text-navy underline-offset-4 hover:underline dark:text-brandblue"
          >
            Connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
