"use client";

import {
  cancelBookingAction,
  completeBookingAction,
} from "@/actions/online-lessons";
import { Link } from "@/i18n/navigation";
import { canJoinLessonRoom } from "@/lib/online-lessons";
import { useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

type BookingRow = {
  id: string;
  matiere: string;
  startsAt: Date;
  endsAt: Date;
  durationMinutes: number;
  status: string;
  paymentStatus: string;
  meetingRoomId: string;
  studentComment: string | null;
  teacherNotes: string | null;
  student: { name: string; email: string };
  teacher: { name: string };
};

export function ProfBookingActions({ booking }: { booking: BookingRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const canJoin = canJoinLessonRoom({
    startsAt: booking.startsAt,
    endsAt: booking.endsAt,
    status: booking.status as "CONFIRME",
  });

  function run(fn: () => Promise<void>) {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {canJoin && (booking.status === "CONFIRME" || booking.status === "TERMINE") ? (
        <Link
          href={`/professeur/cours-en-ligne/salle/${booking.id}`}
          className="rounded-full bg-navy px-3 py-1 text-xs font-medium text-white"
        >
          Rejoindre le cours
        </Link>
      ) : null}
      {booking.status === "CONFIRME" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            const notes = window.prompt("Notes de fin de cours (optionnel) :") ?? "";
            run(() => completeBookingAction(booking.id, notes));
          }}
          className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-600"
        >
          Terminer le cours
        </button>
      ) : null}
      {["EN_ATTENTE", "CONFIRME"].includes(booking.status) ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => cancelBookingAction(booking.id))}
          className="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-600 dark:border-zinc-600"
        >
          Annuler
        </button>
      ) : null}
    </div>
  );
}

export function StudentBookingActions({ booking }: { booking: BookingRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const canJoin = canJoinLessonRoom({
    startsAt: booking.startsAt,
    endsAt: booking.endsAt,
    status: booking.status as "CONFIRME",
  });

  return (
    <div className="flex flex-wrap gap-2">
      {canJoin && booking.status === "CONFIRME" ? (
        <Link
          href={`/eleve/cours-en-ligne/salle/${booking.id}`}
          className="rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Rejoindre le cours
        </Link>
      ) : null}
      {["EN_ATTENTE", "CONFIRME"].includes(booking.status) ? (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await cancelBookingAction(booking.id);
              router.refresh();
            })
          }
          className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-600"
        >
          Annuler
        </button>
      ) : null}
    </div>
  );
}
