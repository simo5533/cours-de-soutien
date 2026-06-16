"use server";

import { auth } from "@/auth";
import { generateMeetingRoomId } from "@/lib/online-lessons";
import { revalidatePathAllLocales } from "@/lib/revalidate-i18n";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const availabilitySchema = z.object({
  weekday: z.coerce.number().int().min(1).max(7),
  startTime: z.string().min(4),
  endTime: z.string().min(4),
  matiere: z.string().optional(),
  slotMinutes: z.coerce.number().int().min(30).max(180).default(60),
});

export async function createProfAvailabilityAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PROFESSEUR") return;

  const parsed = availabilitySchema.safeParse({
    weekday: formData.get("weekday"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    matiere: (formData.get("matiere") as string) || undefined,
    slotMinutes: formData.get("slotMinutes") || 60,
  });
  if (!parsed.success) return;

  const start = parsed.data.startTime.slice(0, 5);
  const end = parsed.data.endTime.slice(0, 5);
  if (start >= end) return;

  await prisma.profOnlineAvailability.create({
    data: {
      professeurId: session.user.id,
      weekday: parsed.data.weekday,
      startTime: start,
      endTime: end,
      matiere: parsed.data.matiere?.trim() || null,
      slotMinutes: parsed.data.slotMinutes,
    },
  });

  revalidatePathAllLocales("/professeur/cours-en-ligne");
}

export async function deleteProfAvailabilityAction(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PROFESSEUR") return;

  await prisma.profOnlineAvailability.deleteMany({
    where: { id, professeurId: session.user.id },
  });
  revalidatePathAllLocales("/professeur/cours-en-ligne");
}

export async function addProfBlockedDateAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PROFESSEUR") return;

  const dateStr = String(formData.get("date") || "").trim();
  if (!dateStr) return;
  const date = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(date.getTime())) return;

  await prisma.profBlockedDate.upsert({
    where: {
      professeurId_date: { professeurId: session.user.id, date },
    },
    create: {
      professeurId: session.user.id,
      date,
      reason: (formData.get("reason") as string)?.trim() || null,
    },
    update: {
      reason: (formData.get("reason") as string)?.trim() || null,
    },
  });
  revalidatePathAllLocales("/professeur/cours-en-ligne");
}

export async function deleteProfBlockedDateAction(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PROFESSEUR") return;

  await prisma.profBlockedDate.deleteMany({
    where: { id, professeurId: session.user.id },
  });
  revalidatePathAllLocales("/professeur/cours-en-ligne");
}

const bookSchema = z.object({
  teacherId: z.string().cuid(),
  matiere: z.string().min(1),
  startsAtIso: z.string().min(1),
  durationMinutes: z.coerce.number().int().min(30).max(180),
  studentComment: z.string().optional(),
});

export async function bookOnlineLessonAction(
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ELEVE") {
    return { error: "Réservé aux élèves." };
  }

  const parsed = bookSchema.safeParse({
    teacherId: formData.get("teacherId"),
    matiere: formData.get("matiere"),
    startsAtIso: formData.get("startsAtIso"),
    durationMinutes: formData.get("durationMinutes"),
    studentComment: (formData.get("studentComment") as string) || undefined,
  });
  if (!parsed.success) return { error: "Données invalides." };

  const startsAt = new Date(parsed.data.startsAtIso);
  if (Number.isNaN(startsAt.getTime()) || startsAt <= new Date()) {
    return { error: "Créneau invalide ou déjà passé." };
  }

  const endsAt = new Date(
    startsAt.getTime() + parsed.data.durationMinutes * 60_000,
  );

  const teacher = await prisma.user.findUnique({
    where: { id: parsed.data.teacherId, role: "PROFESSEUR" },
  });
  if (!teacher) return { error: "Professeur introuvable." };

  const conflict = await prisma.onlineLessonBooking.findFirst({
    where: {
      teacherId: parsed.data.teacherId,
      status: { notIn: ["ANNULE", "REFUSE"] },
      startsAt: { lt: endsAt },
      endsAt: { gt: startsAt },
    },
  });
  if (conflict) return { error: "Ce créneau n’est plus disponible." };

  await prisma.onlineLessonBooking.create({
    data: {
      studentId: session.user.id,
      teacherId: parsed.data.teacherId,
      matiere: parsed.data.matiere.trim(),
      startsAt,
      endsAt,
      durationMinutes: parsed.data.durationMinutes,
      meetingRoomId: generateMeetingRoomId(),
      studentComment: parsed.data.studentComment?.trim() || null,
      status: "EN_ATTENTE",
      paymentStatus: "EN_ATTENTE",
    },
  });

  revalidatePathAllLocales("/eleve/cours-en-ligne");
  revalidatePathAllLocales("/eleve/cours-en-ligne/mes-rdv");
  revalidatePathAllLocales("/professeur/cours-en-ligne");
  return { ok: true };
}

export async function respondToBookingAction(
  bookingId: string,
  decision: "accept" | "reject",
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PROFESSEUR") return;

  const booking = await prisma.onlineLessonBooking.findUnique({
    where: { id: bookingId },
  });
  if (!booking || booking.teacherId !== session.user.id) return;
  if (booking.status !== "EN_ATTENTE") return;

  await prisma.onlineLessonBooking.update({
    where: { id: bookingId },
    data:
      decision === "accept"
        ? { status: "CONFIRME", confirmedAt: new Date() }
        : { status: "REFUSE", cancelledAt: new Date() },
  });

  revalidatePathAllLocales("/professeur/cours-en-ligne");
  revalidatePathAllLocales("/eleve/cours-en-ligne/mes-rdv");
}

export async function cancelBookingAction(bookingId: string) {
  const session = await auth();
  if (!session?.user) return;

  const booking = await prisma.onlineLessonBooking.findUnique({
    where: { id: bookingId },
  });
  if (!booking) return;

  const isStudent =
    session.user.role === "ELEVE" && booking.studentId === session.user.id;
  const isTeacher =
    session.user.role === "PROFESSEUR" && booking.teacherId === session.user.id;
  if (!isStudent && !isTeacher) return;

  if (!["EN_ATTENTE", "CONFIRME"].includes(booking.status)) return;

  await prisma.onlineLessonBooking.update({
    where: { id: bookingId },
    data: { status: "ANNULE", cancelledAt: new Date() },
  });

  revalidatePathAllLocales("/eleve/cours-en-ligne/mes-rdv");
  revalidatePathAllLocales("/professeur/cours-en-ligne");
}

export async function completeBookingAction(bookingId: string, notes: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PROFESSEUR") return;

  const booking = await prisma.onlineLessonBooking.findUnique({
    where: { id: bookingId },
  });
  if (!booking || booking.teacherId !== session.user.id) return;
  if (booking.status !== "CONFIRME") return;

  await prisma.onlineLessonBooking.update({
    where: { id: bookingId },
    data: {
      status: "TERMINE",
      completedAt: new Date(),
      teacherNotes: notes.trim() || null,
    },
  });

  revalidatePathAllLocales("/professeur/cours-en-ligne");
  revalidatePathAllLocales("/eleve/cours-en-ligne/mes-rdv");
}

export async function markBookingPaidAction(bookingId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return;

  await prisma.onlineLessonBooking.update({
    where: { id: bookingId },
    data: { paymentStatus: "PAYE" },
  });
  revalidatePathAllLocales("/eleve/cours-en-ligne/mes-rdv");
}
