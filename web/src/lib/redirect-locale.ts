import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

/** Redirection localisee (obligatoire pour next-intl en Server Actions / helpers serveur). */
export async function redirectTo(href: string): Promise<never> {
  const locale = await getLocale();
  return redirect({ href, locale });
}
