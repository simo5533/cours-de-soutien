"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

/** Met à jour lang et dir sur <html> selon la locale (RTL pour l'arabe). */
export function DocumentLang() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
