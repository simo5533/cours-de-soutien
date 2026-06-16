"use client";

import { useRouter } from "@/i18n/navigation";
import { bookOnlineLessonAction } from "@/actions/online-lessons";
import { useState, useTransition } from "react";

export function BookLessonForm({
  teacherId,
  matiere,
  startsAtIso,
  durationMinutes,
  label,
}: {
  teacherId: string;
  matiere: string;
  startsAtIso: string;
  durationMinutes: number;
  label: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await bookOnlineLessonAction(fd);
      if (res?.error) {
        setError(res.error);
        return;
      }
      router.push("/eleve/cours-en-ligne/mes-rdv");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="text-sm font-medium">{label}</p>
      <input type="hidden" name="teacherId" value={teacherId} />
      <input type="hidden" name="matiere" value={matiere} />
      <input type="hidden" name="startsAtIso" value={startsAtIso} />
      <input type="hidden" name="durationMinutes" value={durationMinutes} />
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">Message au professeur (optionnel)</span>
        <textarea
          name="studentComment"
          rows={2}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Exercice à revoir, chapitre…"
        />
      </label>
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-navy px-5 py-2 text-sm font-medium text-white hover:bg-navy/90 disabled:opacity-60"
      >
        {pending ? "Réservation…" : "Réserver ce créneau"}
      </button>
    </form>
  );
}
