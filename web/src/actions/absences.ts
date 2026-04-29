"use server";

import { revalidatePathAllLocales } from "@/lib/revalidate-i18n";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  studentId: z.string().cuid(),
  date: z.string().min(8),
  justified: z.coerce.boolean().optional(),
  note: z.string().optional(),
});

function parseDateOnly(s: string) {
  const d = new Date(s + "T12:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function createAbsenceAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return;

  const parsed = createSchema.safeParse({
    studentId: formData.get("studentId"),
    date: formData.get("date"),
    justified: formData.get("justified") === "on" || formData.get("justified") === "true",
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) return;

  const date = parseDateOnly(parsed.data.date);
  if (!date) return;

  const student = await prisma.user.findUnique({
    where: { id: parsed.data.studentId },
  });
  if (!student || student.role !== "ELEVE") return;

  await prisma.absence.create({
    data: {
      studentId: parsed.data.studentId,
      date,
      justified: parsed.data.justified ?? false,
      note: parsed.data.note?.trim() || null,
    },
  });
  revalidatePathAllLocales("/admin/absences");
}

export async function deleteAbsenceAction(absenceId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return;

  await prisma.absence.delete({ where: { id: absenceId } });
  revalidatePathAllLocales("/admin/absences");
}
