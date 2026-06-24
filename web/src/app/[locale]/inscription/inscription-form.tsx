"use client";

import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { registerAction, type RegisterState } from "@/actions/auth";
import { LemonSqueezyCheckoutOverlay } from "@/components/lemon-squeezy-checkout-overlay";
import { ANNEES_SCOLAIRES } from "@/lib/school-years";
import {
  PRICING_PLANS,
  legacyPlanFromPricingId,
  type PricingPlanId,
} from "@/config/methodix-pricing";

const roles = [
  { value: "ELEVE", label: "Élève" },
  { value: "PROFESSEUR", label: "Professeur" },
] as const;

export function InscriptionForm({
  paymentProvider = "lemonsqueezy",
}: {
  paymentProvider?: string;
}) {
  const locale = useLocale();
  const t = useTranslations("InscriptionPage");
  const payCancel = useSearchParams().get("pay") === "cancel";
  const planParam = useSearchParams().get("plan");
  const defaultPricingId = useMemo((): PricingPlanId => {
    const ids = PRICING_PLANS.map((p) => p.id);
    if (planParam && ids.includes(planParam as PricingPlanId)) {
      return planParam as PricingPlanId;
    }
    return "free";
  }, [planParam]);
  const [selectedPlanId, setSelectedPlanId] = useState<PricingPlanId>(defaultPricingId);
  const isFreePlan = selectedPlanId === "free";
  const [role, setRole] = useState<string>("ELEVE");
  const [lemonCheckoutUrl, setLemonCheckoutUrl] = useState<string | null>(null);
  const useLemonOverlay = paymentProvider === "lemonsqueezy";
  const successPath = `/${locale === "ar" ? "ar" : "fr"}/inscription/succes`;
  const [state, formAction, pending] = useActionState(
    registerAction,
    undefined as RegisterState,
  );

  useEffect(() => {
    if (!state || !("checkoutUrl" in state) || !state.checkoutUrl) return;
    if (useLemonOverlay) {
      setLemonCheckoutUrl(state.checkoutUrl);
    } else {
      window.location.href = state.checkoutUrl;
    }
  }, [state, useLemonOverlay]);

  /** Paddle / Stripe : redirection vers leur page de paiement. */
  if (
    !useLemonOverlay &&
    state &&
    "checkoutUrl" in state &&
    state.checkoutUrl
  ) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16 text-center sm:py-20">
        <div className="card-elevated p-10 shadow-xl shadow-slate-900/5 dark:shadow-black/40">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Redirection vers le paiement sécurisé…
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            {t("studentPaymentNote")}
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
                est activé alors qu’aucune clé Paddle / Stripe n’est configurée.
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
                  LEMONSQUEEZY_API_KEY
                </code>{" "}
                (défaut),{" "}
                <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                  PADDLE_API_KEY
                </code>{" "}
                avec{" "}
                <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                  PAYMENT_PROVIDER=paddle
                </code>
                , ou{" "}
                <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                  STRIPE_SECRET_KEY
                </code>{" "}
                avec{" "}
                <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                  PAYMENT_PROVIDER=stripe
                </code>
                , puis réinscrivez-vous.
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
    <div className="mx-auto w-full max-w-lg px-4 py-16 sm:py-20">
      {lemonCheckoutUrl ? (
        <LemonSqueezyCheckoutOverlay
          checkoutUrl={lemonCheckoutUrl}
          successPath={successPath}
        />
      ) : null}
      {lemonCheckoutUrl ? (
        <p
          role="status"
          className="mb-6 rounded-xl border border-brandblue/30 bg-brandblue/5 px-4 py-3 text-sm text-navy dark:border-brandblue/25 dark:bg-brandblue/10 dark:text-brandblue/90"
        >
          {t("overlayPaymentHint")}
        </p>
      ) : null}
      <div className="card-elevated p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/40">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {t("subtitle")}
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {(["trust1", "trust2", "trust3", "trust4", "trust5", "trust6", "trust7"] as const).map(
            (key) => (
              <li
                key={key}
                className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brandblue" />
                {t(key)}
              </li>
            ),
          )}
        </ul>
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
            {isFreePlan ? t("freePlanNote") : t("studentPaymentNote")}
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
                  {t("planLabel")}
                </span>
                <select
                  name="pricingPlanId"
                  required
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value as PricingPlanId)}
                  className="input-field"
                >
                  {PRICING_PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} — {plan.price === 0 ? "0 MAD" : `${plan.price} MAD/mois`}
                    </option>
                  ))}
                </select>
                <input
                  type="hidden"
                  name="elevePlan"
                  value={legacyPlanFromPricingId(selectedPlanId)}
                />
              </label>
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
                ? isFreePlan
                  ? "Création…"
                  : "Préparation du paiement…"
                : "Création…"
              : role === "ELEVE"
                ? isFreePlan
                  ? t("createFree")
                  : t("continuePayment")
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
