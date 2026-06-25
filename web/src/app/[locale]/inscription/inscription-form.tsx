"use client";

import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { registerAction, type RegisterState } from "@/actions/auth";
import { LemonSqueezyCheckoutOverlay } from "@/components/lemon-squeezy-checkout-overlay";
import {
  PRICING_PLANS,
  legacyPlanFromPricingId,
  type PricingPlanId,
} from "@/config/methodix-pricing";

const roleOptions = [
  { value: "ELEVE", labelKey: "roleStudent" as const },
  { value: "ELEVE", labelKey: "roleParent" as const, parent: true },
  { value: "PROFESSEUR", labelKey: "roleTeacher" as const },
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
  const isPaidPlan = selectedPlanId !== "free";
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
    const loginHref = state.redirectTo
      ? `/connexion?callbackUrl=${encodeURIComponent(state.redirectTo)}`
      : "/connexion";

    return (
      <div className="mx-auto w-full max-w-md px-4 py-16 text-center">
        <div className="card-elevated p-10 shadow-xl shadow-slate-900/5 dark:shadow-black/40">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brandblue/15 text-navy dark:bg-brandblue/20 dark:text-brandblue">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-6 text-lg font-bold text-slate-900 dark:text-white">
            {t("successTitle")}
          </p>
          {skippedPayment ? (
            <p className="mt-4 text-sm text-amber-800 dark:text-amber-200">
              Mode développement — aucun paiement encaissé.
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {t("successRedirect")}
            </p>
          )}
          <Link href={loginHref} className="btn-primary mt-8 inline-flex w-full sm:w-auto">
            {t("goLogin")}
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
            {isPaidPlan ? t("studentPaymentNote") : t("freePlanNote")}
          </p>
        ) : null}
        <form className="mt-8 flex flex-col gap-5" action={formAction}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="elevePlan" value={legacyPlanFromPricingId(selectedPlanId)} />
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
              {t("nameLabel")}
            </span>
            <input name="name" required autoComplete="name" className="input-field" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {t("emailLabel")}
            </span>
            <input name="email" type="email" required autoComplete="email" className="input-field" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {t("passwordLabel")}
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
              {t("roleLabel")}
            </span>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-field"
            >
              {roleOptions.map((r, i) => (
                <option key={`${r.value}-${i}`} value={r.value}>
                  {t(r.labelKey)}
                </option>
              ))}
            </select>
          </label>
          {role === "ELEVE" && isPaidPlan ? (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
              Pack : {PRICING_PLANS.find((p) => p.id === selectedPlanId)?.name}
              {" — "}
              <Link href="/tarifs" className="font-semibold text-brandblue underline-offset-2 hover:underline">
                Changer
              </Link>
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending
              ? "Création…"
              : role === "ELEVE" && isPaidPlan
                ? t("continuePayment")
                : t("submitFree")}
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
