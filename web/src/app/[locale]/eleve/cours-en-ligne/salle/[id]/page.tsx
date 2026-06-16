import { Link } from "@/i18n/navigation";
import { JitsiMeetRoom } from "@/components/jitsi-meet-room";
import {
  canJoinLessonRoom,
  getJitsiDomain,
  userCanAccessLessonRoom,
} from "@/lib/online-lessons";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function EleveSalleCoursPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const locale = await getLocale();
  const user = session?.user;

  if (!user) {
    return redirect({
      href: `/connexion?callbackUrl=${encodeURIComponent(`/eleve/cours-en-ligne/salle/${id}`)}`,
      locale,
    });
  }

  if (user.role !== "ELEVE") {
    notFound();
  }

  const booking = await prisma.onlineLessonBooking.findUnique({
    where: { id },
    include: {
      teacher: { select: { name: true } },
      student: { select: { name: true } },
    },
  });

  if (!booking || !userCanAccessLessonRoom(booking, user)) {
    notFound();
  }

  const allowed = canJoinLessonRoom(booking);
  const displayName = user.name ?? booking.student?.name ?? "Élève";

  return (
    <div className="space-y-6">
      <Link
        href="/eleve/cours-en-ligne/mes-rdv"
        className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
      >
        ← Mes rendez-vous
      </Link>
      <div>
        <h2 className="text-lg font-semibold">
          {booking.matiere} avec {booking.teacher.name}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {booking.startsAt.toLocaleString("fr-FR", {
            dateStyle: "full",
            timeStyle: "short",
          })}{" "}
          · {booking.durationMinutes} min
        </p>
      </div>

      {!allowed ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
          La salle ouvre 15 minutes avant le cours et reste accessible 30 minutes
          après la fin.
        </div>
      ) : (
        <>
          <JitsiMeetRoom
            roomName={booking.meetingRoomId}
            displayName={displayName}
            domain={getJitsiDomain()}
          />
          <p className="text-xs text-zinc-500">
            Connecté en tant que {user.email}. Visioconférence sécurisée.
          </p>
        </>
      )}
    </div>
  );
}
