"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTranslations } from "next-intl";

type LanguageSwitcherProps = {
  /** Sélecteur sur fond sombre (ex. barre de navigation marine) */
  variant?: "default" | "onDark" | "icon";
};

export function LanguageSwitcher({
  variant = "default",
}: LanguageSwitcherProps) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
  }

  const selectClass =
    variant === "onDark"
      ? "rounded-lg border border-white/25 bg-white/10 px-2 py-1.5 text-sm font-medium text-white shadow-sm backdrop-blur-sm"
      : "rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium text-slate-800 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";

  if (variant === "icon") {
    const btn =
      "min-h-[2rem] min-w-[2rem] rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wide transition";
    const active =
      "border border-gold/60 bg-white/15 text-white shadow-inner";
    const inactive =
      "border border-transparent text-white/75 hover:bg-white/10 hover:text-white";

    return (
      <div
        className="inline-flex shrink-0 items-center rounded-lg border border-white/25 bg-black/15 p-0.5 shadow-sm backdrop-blur-sm"
        role="group"
        aria-label={t("label")}
      >
        <button
          type="button"
          className={`${btn} ${locale === "fr" ? active : inactive}`}
          onClick={() => onChange("fr")}
          aria-pressed={locale === "fr"}
        >
          FR
        </button>
        <button
          type="button"
          className={`${btn} ${locale === "ar" ? active : inactive}`}
          onClick={() => onChange("ar")}
          aria-pressed={locale === "ar"}
        >
          عربي
        </button>
      </div>
    );
  }

  return (
    <label
      className={
        variant === "onDark"
          ? "flex items-center gap-2 text-sm text-white/90"
          : "flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
      }
    >
      <span className="sr-only">{t("label")}</span>
      <select
        value={locale}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
        aria-label={t("label")}
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc === "fr" ? t("fr") : t("ar")}
          </option>
        ))}
      </select>
    </label>
  );
}
