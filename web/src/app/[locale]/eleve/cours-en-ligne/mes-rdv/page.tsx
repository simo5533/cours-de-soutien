import { Link } from "@/i18n/navigation";
import { StudentBookingActions } from "@/components/lesson-booking-actions";
import {
  LESSON_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
} from "@/lib/online-lessons";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function EleveMesRdvPage() {
  const session = await auth();
  const now = new Date();

  const bookings = await prisma.onlineLessonBooking.findMany({
    where: { studentId: session!.user.id },
    orderBy: { startsAt: "desc" },
    include: {
      teacher: { select: { name: true } },
      student: { select: { name: true, email: true } },
    },
  });

  const upcoming = bookings.filter(
    (b) => b.startsAt >= now && !["ANNULE", "REFUSE", "TERMINE"].includes(b.status),
  );
  const past = bookings.filter(
    (b) => b.startsAt < now || ["TERMINE", "ANNULE", "REFUSE"].includes(b.status),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Mes rendez-vous</h2>
        <Link
          href="/cours-en-ligne"
          className="text-sm font-medium text-teal-700 hover:underline dark:text-teal-400"
        >
          + Nouvelle demande
        </Link>
      </div>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          À venir
        </h3>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">
            Aucun rendez-vous confirmé. Faites une demande sur la page publique ;
            après validation admin, connectez-vous avec votre e-mail et mot de passe
            pour rejoindre le live.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {upcoming.map((b) => (
              <li
                key={b.id}
                className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{b.matiere}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Prof. {b.teacher.name} —{" "}
                      {b.startsAt.toLocaleString("fr-FR", {
                        dateStyle: "full",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {LESSON_STATUS_LABEL[b.status]} · Paiement :{" "}
                      {PAYMENT_STATUS_LABEL[b.paymentStatus]}
                    </p>
                  </div>
                  <StudentBookingActions booking={b} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Historique
        </h3>
        {past.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">Aucun cours passé.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {past.map((b) => (
              <li
                key={b.id}
                className="rounded-lg border border-zinc-100 px-4 py-3 text-sm dark:border-zinc-800"
              >
                <span className="font-medium">{b.matiere}</span>
                <span className="text-zinc-500">
                  {" "}
                  — {b.startsAt.toLocaleDateString("fr-FR")} — Prof.{" "}
                  {b.teacher.name} — {LESSON_STATUS_LABEL[b.status]}
                </span>
                {b.teacherNotes ? (
                  <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                    {b.teacherNotes}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
