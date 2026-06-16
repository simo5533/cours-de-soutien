import { Link } from "@/i18n/navigation";
import { JitsiMeetRoom } from "@/components/jitsi-meet-room";
import {
  canJoinLessonRoom,
  getJitsiDomain,
  userCanAccessLessonRoom,
} from "@/lib/online-lessons";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProfesseurSalleCoursPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const booking = await prisma.onlineLessonBooking.findUnique({
    where: { id },
    include: {
      teacher: { select: { name: true } },
      student: { select: { name: true } },
    },
  });

  if (!booking || !userCanAccessLessonRoom(booking, session!.user)) {
    notFound();
  }

  const eleveLabel =
    booking.student?.name ?? booking.guestName ?? "Élève";
  const allowed = canJoinLessonRoom(booking);

  return (
    <div className="space-y-6">
      <Link
        href="/professeur/cours-en-ligne"
        className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
      >
        ← Cours en ligne
      </Link>
      <div>
        <h2 className="text-lg font-semibold">
          {booking.matiere} avec {eleveLabel}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {booking.startsAt.toLocaleString("fr-FR", {
            dateStyle: "full",
            timeStyle: "short",
          })}
        </p>
      </div>

      {!allowed ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm dark:border-amber-900/50 dark:bg-amber-950/30">
          La salle n&apos;est pas encore ouverte ou le cours est terminé.
        </div>
      ) : (
        <>
          <JitsiMeetRoom
            roomName={booking.meetingRoomId}
            displayName={session!.user.name ?? booking.teacher.name}
            domain={getJitsiDomain()}
            isTeacher
          />
          <p className="text-xs text-zinc-500">
            Vous pouvez partager votre écran, utiliser le chat intégré et terminer
            le cours depuis la page des réservations.
          </p>
        </>
      )}
    </div>
  );
}
