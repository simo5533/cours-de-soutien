import { ProfBookingActions } from "@/components/lesson-booking-actions";
import { LESSON_STATUS_LABEL } from "@/lib/online-lessons";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfesseurCoursEnLignePage() {
  const session = await auth();
  const userId = session!.user.id;

  const bookings = await prisma.onlineLessonBooking.findMany({
    where: { teacherId: userId },
    orderBy: { startsAt: "desc" },
    include: {
      student: { select: { name: true, email: true } },
    },
    take: 80,
  });

  const upcoming = bookings.filter(
    (b) =>
      b.startsAt >= new Date() &&
      !["ANNULE", "REFUSE"].includes(b.status),
  );

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-lg font-semibold">Mes cours en ligne</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Rendez-vous validés par l&apos;administration après la demande publique
          d&apos;un élève. Rejoignez la salle virtuelle à l&apos;heure prévue.
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="font-semibold">Prochains cours</h3>
        {upcoming.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Aucun rendez-vous assigné pour le moment.
          </p>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((b) => {
              const eleveLabel =
                b.student?.name ?? b.guestName ?? "Élève";
              const eleveContact =
                b.student?.email ?? b.guestEmail ?? "";
              return (
                <li
                  key={b.id}
                  className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <p className="font-medium">
                    {b.matiere}
                    {b.langue ? ` (${b.langue})` : ""}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {eleveLabel}
                    {eleveContact ? ` — ${eleveContact}` : ""}
                  </p>
                  <p className="mt-1 text-sm">
                    {b.startsAt.toLocaleString("fr-FR", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}{" "}
                    · {b.durationMinutes} min · {LESSON_STATUS_LABEL[b.status]}
                  </p>
                  {b.studentComment ? (
                    <p className="mt-2 text-sm italic text-zinc-500">
                      &laquo; {b.studentComment} &raquo;
                    </p>
                  ) : null}
                  <div className="mt-3">
                    <ProfBookingActions
                      booking={{
                        ...b,
                        student: {
                          name: eleveLabel,
                          email: eleveContact,
                        },
                        teacher: { name: session!.user.name ?? "Prof" },
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h3 className="font-semibold">Historique</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {bookings
            .filter((b) => b.startsAt < new Date() || b.status === "TERMINE")
            .map((b) => (
              <li key={b.id} className="text-zinc-600 dark:text-zinc-400">
                {b.matiere} —{" "}
                {b.startsAt.toLocaleDateString("fr-FR")} —{" "}
                {LESSON_STATUS_LABEL[b.status]}
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
