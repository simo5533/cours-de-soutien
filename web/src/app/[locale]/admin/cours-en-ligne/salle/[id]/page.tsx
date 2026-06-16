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

export default async function AdminSalleCoursPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    notFound();
  }

  const booking = await prisma.onlineLessonBooking.findUnique({
    where: { id },
    include: {
      teacher: { select: { name: true } },
      student: { select: { name: true } },
    },
  });

  if (!booking || !userCanAccessLessonRoom(booking, session.user)) {
    notFound();
  }

  const eleveLabel =
    booking.student?.name ?? booking.guestName ?? "Élève";
  const allowed = canJoinLessonRoom(booking);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/cours-en-ligne"
        className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
      >
        ← Cours en ligne (admin)
      </Link>
      <div>
        <h2 className="text-lg font-semibold">
          {booking.matiere} — {eleveLabel} / Prof. {booking.teacher.name}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {booking.startsAt.toLocaleString("fr-FR", {
            dateStyle: "full",
            timeStyle: "short",
          })}
          {booking.guestPhone ? ` · ${booking.guestPhone}` : ""}
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
            displayName={session.user.name ?? "Administration"}
            domain={getJitsiDomain()}
          />
          <p className="text-xs text-zinc-500">
            Accès administrateur — supervision du cours en direct.
          </p>
        </>
      )}
    </div>
  );
}
