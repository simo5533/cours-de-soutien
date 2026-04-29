"use client";

import { signIn } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { useSearchParams, useParams } from "next/navigation";
import { useState } from "react";

/** next-intl impose /fr/… ou /ar/… — un chemin sans locale renvoie 404 en prod. */
function resolveCallbackUrl(raw: string | null, locale: string): string {
  const fallback = `/${locale}/apres-connexion`;
  if (!raw?.trim()) return fallback;
  const t = raw.trim();
  if (t.startsWith("http://") || t.startsWith("https://")) {
    try {
      const u = new URL(t);
      if (typeof window !== "undefined" && u.origin !== window.location.origin) {
        return fallback;
      }
      return resolveCallbackUrl(u.pathname + u.search, locale);
    } catch {
      return fallback;
    }
  }
  if (/^\/(fr|ar)(\/|$)/.test(t)) return t;
  if (t.startsWith("/")) return `/${locale}${t}`;
  return fallback;
}

/** Utilise la réponse Next Auth (`res.url`) qui peut être `/apres-connexion` sans locale → 404 Vercel. */
function finalizeLoginHref(
  rawFromAuth: string | null | undefined,
  fallbackResolved: string,
  locale: string,
): string {
  const merged = rawFromAuth?.trim() || fallbackResolved;
  if (!merged) return fallbackResolved;
  if (merged.startsWith("http://") || merged.startsWith("https://")) {
    try {
      const u = new URL(merged);
      if (typeof window !== "undefined" && u.origin !== window.location.origin) {
        return fallbackResolved;
      }
      return resolveCallbackUrl(u.pathname + u.search, locale);
    } catch {
      return fallbackResolved;
    }
  }
  return resolveCallbackUrl(merged, locale);
}

export function ConnexionForm() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = typeof params.locale === "string" ? params.locale : "fr";
  const callbackUrl = resolveCallbackUrl(searchParams.get("callbackUrl"), locale);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setPending(false);

    if (res?.error) {
      setError("E-mail ou mot de passe incorrect.");
      return;
    }

    window.location.href = finalizeLoginHref(res?.url, callbackUrl, locale);
  }

  return (
    <>
      <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-100"
          >
            {error}
          </p>
        ) : null}
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
            placeholder="vous@exemple.fr"
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
            autoComplete="current-password"
            className="input-field"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        Pas encore de compte ?{" "}
        <Link
          href="/inscription"
          className="font-semibold text-navy underline-offset-4 hover:underline dark:text-brandblue"
        >
          Inscription
        </Link>
      </p>
      <p className="mt-8 border-t border-slate-200 pt-6 text-center text-xs leading-relaxed text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Comptes de démonstration :{" "}
        <span className="rounded bg-slate-100 px-1 font-mono text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          eleve@demo.fr
        </span>{" "}
        / eleve123 —{" "}
        <span className="rounded bg-slate-100 px-1 font-mono dark:bg-slate-800">
          prof@demo.fr
        </span>{" "}
        / prof123 —{" "}
        <span className="rounded bg-slate-100 px-1 font-mono dark:bg-slate-800">
          admin@demo.fr
        </span>{" "}
        / admin123
      </p>
    </>
  );
}
