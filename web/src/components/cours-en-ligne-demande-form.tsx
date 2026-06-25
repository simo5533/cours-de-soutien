"use client";

import {
  submitCoursEnLigneDemandeAction,
  type DemandeCoursEnLigneState,
} from "@/actions/cours-en-ligne-demande";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

const MATIERES = [
  "Mathématiques",
  "Physique-Chimie",
  "SVT",
  "Français",
  "Anglais",
  "Arabe",
  "Philosophie",
  "Histoire-Géographie",
] as const;

const NIVEAUX = [
  "Collège",
  "Tronc commun",
  "1ère bac",
  "2ème bac",
  "Autre",
] as const;

export function CoursEnLigneDemandeForm() {
  const t = useTranslations("CoursEnLigneForm");
  const [state, formAction, pending] = useActionState(
    submitCoursEnLigneDemandeAction,
    undefined as DemandeCoursEnLigneState,
  );

  if (state && "ok" in state && state.ok) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
          {t("successTitle")}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {t("successBody", { reference: state.reference })}
        </p>
      </div>
    );
  }

  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <form
      action={formAction}
      className="card-elevated space-y-5 p-6 sm:p-8"
    >
      <h2 className="text-lg font-bold text-navy dark:text-white">{t("title")}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">{t("intro")}</p>

      {state && "error" in state ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium">{t("name")} *</span>
          <input name="name" required className="input-field" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t("whatsapp")} *</span>
          <input
            name="phone"
            type="tel"
            required
            minLength={8}
            placeholder="06 12 34 56 78"
            className="input-field"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t("emailOptional")}</span>
          <input name="email" type="email" className="input-field" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t("matiere")} *</span>
          <select name="langue" required className="input-field" defaultValue="">
            <option value="" disabled>
              {t("choose")}
            </option>
            {MATIERES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t("niveau")} *</span>
          <select name="niveau" required className="input-field" defaultValue="">
            <option value="" disabled>
              {t("choose")}
            </option>
            {NIVEAUX.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium">{t("exercise")} *</span>
          <textarea
            name="message"
            required
            rows={4}
            className="input-field"
            placeholder={t("exercisePlaceholder")}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t("date")} *</span>
          <input name="preferredDate" type="date" required min={minDate} className="input-field" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t("time")} *</span>
          <input name="preferredTime" type="time" required className="input-field" />
        </label>
      </div>

      <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto disabled:opacity-60">
        {pending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
