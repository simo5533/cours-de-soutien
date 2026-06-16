"use client";

import {
  createProfAvailabilityAction,
  deleteProfAvailabilityAction,
  addProfBlockedDateAction,
  deleteProfBlockedDateAction,
} from "@/actions/online-lessons";
import { MATIERES } from "@/lib/course-taxonomy";
import { weekdayLabel } from "@/lib/online-lessons";
import { useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7] as const;

type Avail = {
  id: string;
  weekday: number;
  startTime: string;
  endTime: string;
  matiere: string | null;
  slotMinutes: number;
};

type Blocked = { id: string; date: Date; reason: string | null };

export function ProfAvailabilityManager({
  availabilities,
  blockedDates,
}: {
  availabilities: Avail[];
  blockedDates: Blocked[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-4">
        <h3 className="font-semibold">Horaires disponibles (récurrents)</h3>
        <form
          action={(fd) =>
            startTransition(async () => {
              await createProfAvailabilityAction(fd);
              router.refresh();
            })
          }
          className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span>Jour</span>
            <select
              name="weekday"
              required
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            >
              {WEEKDAYS.map((d) => (
                <option key={d} value={d}>
                  {weekdayLabel(d)}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span>Début</span>
              <input
                name="startTime"
                type="time"
                required
                defaultValue="18:00"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Fin</span>
              <input
                name="endTime"
                type="time"
                required
                defaultValue="20:00"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            <span>Matière (optionnel)</span>
            <select
              name="matiere"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              defaultValue=""
            >
              <option value="">Toutes</option>
              {MATIERES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span>Durée d&apos;un créneau (minutes)</span>
            <select
              name="slotMinutes"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              defaultValue={60}
            >
              <option value={30}>30 min</option>
              <option value={60}>1 h</option>
              <option value={90}>1 h 30</option>
              <option value={120}>2 h</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            Ajouter la plage
          </button>
        </form>
        <ul className="space-y-2">
          {availabilities.length === 0 ? (
            <p className="text-sm text-zinc-500">Aucune plage définie.</p>
          ) : (
            availabilities.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2 text-sm dark:border-zinc-800"
              >
                <span>
                  {weekdayLabel(a.weekday)} {a.startTime}–{a.endTime}
                  {a.matiere ? ` · ${a.matiere}` : ""} ({a.slotMinutes} min)
                </span>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await deleteProfAvailabilityAction(a.id);
                      router.refresh();
                    })
                  }
                  className="text-xs text-red-600"
                >
                  Supprimer
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold">Dates bloquées</h3>
        <form
          action={(fd) =>
            startTransition(async () => {
              await addProfBlockedDateAction(fd);
              router.refresh();
            })
          }
          className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span>Date</span>
            <input
              name="date"
              type="date"
              required
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span>Motif (optionnel)</span>
            <input
              name="reason"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-600"
          >
            Bloquer cette date
          </button>
        </form>
        <ul className="space-y-2">
          {blockedDates.map((b) => (
            <li
              key={b.id}
              className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2 text-sm dark:border-zinc-800"
            >
              <span>
                {b.date.toLocaleDateString("fr-FR")}
                {b.reason ? ` — ${b.reason}` : ""}
              </span>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await deleteProfBlockedDateAction(b.id);
                    router.refresh();
                  })
                }
                className="text-xs text-red-600"
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
