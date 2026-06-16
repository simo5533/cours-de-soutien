"use client";

import {
  submitCoursEnLigneDemandeAction,
  type DemandeCoursEnLigneState,
} from "@/actions/cours-en-ligne-demande";
import { useActionState } from "react";

const LANGUES = [
  "Français",
  "Anglais",
  "Espagnol",
  "Allemand",
  "Chinois mandarin",
  "Arabe",
  "Mathématiques",
  "Physique-Chimie",
  "SVT",
  "Histoire-Géographie",
] as const;

export function CoursEnLigneDemandeForm() {
  const [state, formAction, pending] = useActionState(
    submitCoursEnLigneDemandeAction,
    undefined as DemandeCoursEnLigneState,
  );

  if (state && "ok" in state && state.ok) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
          Demande envoyée
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Référence : <strong>{state.reference}</strong>. L&apos;administration
          vérifie votre créneau. <strong>Votre compte sera créé uniquement après
          validation.</strong> Vous pourrez alors vous connecter avec votre e-mail
          et le mot de passe choisi pour rejoindre le cours en direct.
        </p>
      </div>
    );
  }

  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/50 sm:p-8">
      <h2 className="text-lg font-bold text-navy dark:text-white">
        Demander un cours en ligne
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Renseignez vos coordonnées, choisissez un mot de passe (pour le live après
        validation) et indiquez la langue, la date et l&apos;heure souhaitées.
      </p>

      {state && "error" in state ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium">Nom complet *</span>
          <input name="name" required className="input-field" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">E-mail *</span>
          <input name="email" type="email" required className="input-field" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Téléphone *</span>
          <input
            name="phone"
            type="tel"
            required
            minLength={8}
            placeholder="ex. 06 12 34 56 78"
            className="input-field"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Mot de passe (compte élève) *</span>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="input-field"
          />
          <span className="text-xs text-zinc-500">
            Créé après validation admin — pour vous connecter au live.
          </span>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Confirmer le mot de passe *</span>
          <input
            name="passwordConfirm"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="input-field"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium">Langue / matière du cours *</span>
          <select name="langue" required className="input-field" defaultValue="">
            <option value="" disabled>
              Choisir…
            </option>
            {LANGUES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium">Précision matière (optionnel)</span>
          <input
            name="matiere"
            placeholder="ex. Grammaire B1, équations…"
            className="input-field"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Date souhaitée *</span>
          <input
            name="preferredDate"
            type="date"
            required
            min={minDate}
            className="input-field"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Heure souhaitée *</span>
          <input
            name="preferredTime"
            type="time"
            required
            className="input-field"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium">Durée</span>
          <select name="durationMinutes" className="input-field" defaultValue={60}>
            <option value={30}>30 minutes</option>
            <option value={60}>1 heure</option>
            <option value={90}>1 h 30</option>
            <option value={120}>2 heures</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium">Message (objectif du cours)</span>
          <textarea
            name="message"
            rows={3}
            className="input-field"
            placeholder="Niveau, chapitre, exercice à préparer…"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full sm:w-auto disabled:opacity-60"
      >
        {pending ? "Envoi…" : "Envoyer ma demande"}
      </button>
    </form>
  );
}
