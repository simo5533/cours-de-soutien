import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function EleveProfRedirectPage() {
  const locale = await getLocale();
  redirect({ href: "/cours-en-ligne", locale });
}
