"use server";

import { revalidatePathAllLocales } from "@/lib/revalidate-i18n";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  studentId: z.string().cuid(),
  amount: z.coerce.number().positive(),
  paidAt: z.string().min(8),
  label: z.string().min(1),
  method: z.string().min(1),
  note: z.string().optional(),
});

export async function createPaymentAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return;

  const parsed = createSchema.safeParse({
    studentId: formData.get("studentId"),
    amount: formData.get("amount"),
    paidAt: formData.get("paidAt"),
    label: formData.get("label"),
    method: formData.get("method"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) return;

  const student = await prisma.user.findUnique({
    where: { id: parsed.data.studentId },
  });
  if (!student || student.role !== "ELEVE") return;

  const paidAt = new Date(parsed.data.paidAt);
  if (Number.isNaN(paidAt.getTime())) return;

  await prisma.$transaction(async (tx) => {
    const last = await tx.payment.findFirst({
      orderBy: { receiptNumber: "desc" },
      select: { receiptNumber: true },
    });
    const receiptNumber = (last?.receiptNumber ?? 0) + 1;
    await tx.payment.create({
      data: {
        studentId: parsed.data.studentId,
        amount: parsed.data.amount,
        paidAt,
        label: parsed.data.label.trim(),
        method: parsed.data.method.trim(),
        note: parsed.data.note?.trim() || null,
        receiptNumber,
      },
    });
  });

  revalidatePathAllLocales("/admin/finances");
}

export async function deletePaymentAction(paymentId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return;

  await prisma.payment.delete({ where: { id: paymentId } });
  revalidatePathAllLocales("/admin/finances");
}
