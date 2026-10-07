import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import ar from "../../messages/ar.json";
import fr from "../../messages/fr.json";

type Messages = { [key: string]: unknown };

function isPlainObject(v: unknown): v is Messages {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Clés absentes de la locale → texte français (évite l'affichage brut « Namespace.key »). */
function withFallback(primary: Messages, fallback: Messages): Messages {
  const out: Messages = { ...fallback };
  for (const [k, v] of Object.entries(primary)) {
    const f = fallback[k];
    out[k] =
      isPlainObject(v) && isPlainObject(f)
        ? withFallback(v, f)
        : v;
  }
  return out;
}

const messages = {
  fr,
  ar: withFallback(ar, fr) as typeof fr,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messages[locale],
  };
});
