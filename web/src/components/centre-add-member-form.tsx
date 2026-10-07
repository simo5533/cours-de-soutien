"use client";

import { useActionState } from "react";
import { addCentreMemberAction, type CentreFormState } from "@/actions/centre";

export function CentreAddMemberForm({ disabled }: { disabled: boolean }) {
  const [state, action, pending] = useActionState(addCentreMemberAction, undefined as CentreFormState);

  return (
    <form action={action} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <input name="name" required placeholder="Nom du professeur" className="input-field" disabled={disabled} />
        <input name="email" type="email" required placeholder="E-mail" className="input-field" disabled={disabled} />
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Mot de passe (8 caractères min.)"
          className="input-field"
          autoComplete="new-password"
          disabled={disabled}
        />
      </div>
      <p className="text-xs text-muted-text">
        Un compte est créé pour ce professeur ; ses analyses utilisent le quota partagé du centre.
      </p>
      <button type="submit" className="btn-primary !py-2.5" disabled={pending || disabled}>
        {pending ? "Ajout…" : "Ajouter au centre"}
      </button>
      {state?.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-navy" role="status">
          {state.ok}
        </p>
      ) : null}
    </form>
  );
}
