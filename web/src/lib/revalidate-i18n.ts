import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";

/**
 * Revalide un chemin applicatif pour toutes les locales (ex. "/eleve/cours").
 */
export function revalidatePathAllLocales(pathWithoutLocale: string) {
  const p = pathWithoutLocale.startsWith("/")
    ? pathWithoutLocale
    : `/${pathWithoutLocale}`;
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}${p}`);
  }
}
