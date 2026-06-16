import type { OnlineLessonBooking, ProfOnlineAvailability } from "@prisma/client";
import { randomBytes } from "crypto";

const WEEKDAY_LABELS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
] as const;

/** 1 = lundi … 7 = dimanche (ISO) */
export function isoWeekdayFromDate(d: Date): number {
  const js = d.getDay();
  return js === 0 ? 7 : js;
}

export function weekdayLabel(iso: number): string {
  if (iso === 7) return "Dimanche";
  return WEEKDAY_LABELS[iso] ?? `Jour ${iso}`;
}

export function parseTimeToMinutes(t: string): number {
  const [h, m] = t.split(":").map((x) => Number.parseInt(x, 10));
  return (h || 0) * 60 + (m || 0);
}

export function minutesToTimeString(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateMeetingRoomId(): string {
  return `mx-${randomBytes(16).toString("hex")}`;
}

export function getJitsiDomain(): string {
  return process.env.NEXT_PUBLIC_JITSI_DOMAIN?.trim() || "meet.jit.si";
}

/** Accès salle : réservation confirmée, 15 min avant → 30 min après la fin */
export function canJoinLessonRoom(booking: Pick<OnlineLessonBooking, "startsAt" | "endsAt" | "status">, now = new Date()): boolean {
  if (booking.status !== "CONFIRME" && booking.status !== "TERMINE") {
    return false;
  }
  const open = new Date(booking.startsAt.getTime() - 15 * 60_000);
  const close = new Date(booking.endsAt.getTime() + 30 * 60_000);
  return now >= open && now <= close;
}

/** Accès salle : admin, professeur assigné, ou élève lié au RDV (compte créé à la validation). */
export function userCanAccessLessonRoom(
  booking: { teacherId: string; studentId: string | null },
  user: { id: string; role: string },
): boolean {
  if (user.role === "ADMIN") return true;
  if (user.role === "PROFESSEUR" && booking.teacherId === user.id) return true;
  if (user.role === "ELEVE" && booking.studentId === user.id) return true;
  return false;
}

export type BookableSlot = {
  startsAt: Date;
  endsAt: Date;
  durationMinutes: number;
  matiere: string;
  label: string;
};

export function buildBookableSlots(params: {
  availabilities: ProfOnlineAvailability[];
  existingBookings: Pick<OnlineLessonBooking, "startsAt" | "endsAt" | "status">[];
  blockedDates: Date[];
  matiereFilter?: string;
  fromDate: Date;
  daysAhead?: number;
}): BookableSlot[] {
  const {
    availabilities,
    existingBookings,
    blockedDates,
    matiereFilter,
    fromDate,
    daysAhead = 21,
  } = params;

  const blockedSet = new Set(
    blockedDates.map((d) => d.toISOString().slice(0, 10)),
  );
  const activeBookings = existingBookings.filter(
    (b) => b.status !== "ANNULE" && b.status !== "REFUSE",
  );

  const slots: BookableSlot[] = [];
  const startDay = new Date(fromDate);
  startDay.setHours(0, 0, 0, 0);

  for (let offset = 0; offset < daysAhead; offset++) {
    const day = new Date(startDay);
    day.setDate(startDay.getDate() + offset);
    const dayKey = day.toISOString().slice(0, 10);
    if (blockedSet.has(dayKey)) continue;

    const iso = isoWeekdayFromDate(day);
    const dayAvails = availabilities.filter(
      (a) => a.active && a.weekday === iso && (!matiereFilter || !a.matiere || a.matiere === matiereFilter),
    );

    for (const av of dayAvails) {
      const matiere = av.matiere || matiereFilter || "Cours";
      const startMin = parseTimeToMinutes(av.startTime);
      const endMin = parseTimeToMinutes(av.endTime);
      const step = av.slotMinutes > 0 ? av.slotMinutes : 60;

      for (let t = startMin; t + step <= endMin; t += step) {
        const startsAt = new Date(day);
        startsAt.setHours(Math.floor(t / 60), t % 60, 0, 0);
        const endsAt = new Date(startsAt.getTime() + step * 60_000);

        if (startsAt <= fromDate) continue;

        const overlaps = activeBookings.some((b) => {
          return startsAt < b.endsAt && endsAt > b.startsAt;
        });
        if (overlaps) continue;

        const dateStr = startsAt.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        });
        const timeStr = minutesToTimeString(t);
        slots.push({
          startsAt,
          endsAt,
          durationMinutes: step,
          matiere,
          label: `${dateStr} — ${timeStr}`,
        });
      }
    }
  }

  return slots.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

export const LESSON_STATUS_LABEL: Record<string, string> = {
  EN_ATTENTE: "En attente",
  CONFIRME: "Confirmé",
  REFUSE: "Refusé",
  ANNULE: "Annulé",
  TERMINE: "Terminé",
  ABSENT: "Absent",
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  NON_REQUIS: "Non requis",
  EN_ATTENTE: "En attente",
  PAYE: "Payé",
  REMBOURSE: "Remboursé",
};
