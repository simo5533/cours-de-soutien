"use server";

import { revalidatePathAllLocales } from "@/lib/revalidate-i18n";
import { generateMeetingRoomId } from "@/lib/online-lessons";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { z } from "zod";

const demandeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(8),
  langue: z.string().min(1),
  niveau: z.string().min(1),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  durationMinutes: z.coerce.number().int().min(30).max(180).default(60),
  message: z.string().min(10),
});

export type DemandeCoursEnLigneState =
  | { error: string }
  | { ok: true; reference: string }
  | undefined;

export async function submitCoursEnLigneDemandeAction(
  _prev: DemandeCoursEnLigneState,
  formData: FormData,
): Promise<DemandeCoursEnLigneState> {
  const parsed = demandeSchema.safeParse({
    name: formData.get("name"),
    email: (formData.get("email") as string) || undefined,
    phone: formData.get("phone"),
    langue: formData.get("langue"),
    niveau: formData.get("niveau"),
    preferredDate: formData.get("preferredDate"),
    preferredTime: formData.get("preferredTime"),
    durationMinutes: formData.get("durationMinutes") || 60,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: "Vérifiez tous les champs obligatoires." };
  }

  const phoneDigits = parsed.data.phone.replace(/\D/g, "");
  const email =
    parsed.data.email?.trim().toLowerCase() ||
    `wa-${phoneDigits}@demande.CorrecteurPlus`;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser?.role === "ELEVE") {
    return {
      error:
        "Un compte élève existe déjà avec cet e-mail. Connectez-vous pour accéder au live après validation.",
    };
  }
  if (existingUser) {
    return { error: "Cet e-mail est déjà utilisé par un autre compte." };
  }

  const pendingPending = await prisma.coursEnLigneDemande.findFirst({
    where: { email, status: "EN_ATTENTE_ADMIN" },
  });
  if (pendingPending) {
    return {
      error:
        "Une demande est déjà en cours pour cet e-mail. Attendez la réponse de l’administration.",
    };
  }

  const preferredDate = new Date(`${parsed.data.preferredDate}T12:00:00`);
  if (Number.isNaN(preferredDate.getTime())) {
    return { error: "Date invalide." };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (preferredDate < today) {
    return { error: "Choisissez une date à partir d’aujourd’hui." };
  }

  const time = parsed.data.preferredTime.slice(0, 5);

  const demande = await prisma.coursEnLigneDemande.create({
    data: {
      name: parsed.data.name.trim(),
      email,
      phone: parsed.data.phone.trim(),
      pendingPasswordHash: null,
      langue: parsed.data.langue.trim(),
      matiere: `${parsed.data.niveau.trim()} — ${parsed.data.message.trim().slice(0, 200)}`,
      preferredDate,
      preferredTime: time,
      durationMinutes: parsed.data.durationMinutes,
      message: parsed.data.message.trim(),
      status: "EN_ATTENTE_ADMIN",
    },
  });

  revalidatePathAllLocales("/admin/cours-en-ligne");
  return { ok: true, reference: demande.id.slice(-8).toUpperCase() };
}

function combineDateAndTime(date: Date, timeStr: string): Date {
  const [h, m] = timeStr.slice(0, 5).split(":").map((x) => Number.parseInt(x, 10));
  const d = new Date(date);
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}

async function resolveStudentIdForDemande(demande: {
  email: string;
  name: string;
  pendingPasswordHash: string | null;
}): Promise<{ studentId: string } | { error: string }> {
  const existingUser = await prisma.user.findUnique({
    where: { email: demande.email },
  });

  if (existingUser) {
    if (existingUser.role !== "ELEVE") {
      return {
        error:
          "Impossible de valider : cet e-mail appartient à un compte professeur ou admin.",
      };
    }
    return { studentId: existingUser.id };
  }

  if (!demande.pendingPasswordHash) {
    const tempPassword = randomBytes(8).toString("base64url").slice(0, 12);
    const passwordHash = await bcrypt.hash(tempPassword, 10);
    const user = await prisma.user.create({
      data: {
        email: demande.email,
        name: demande.name,
        passwordHash,
        role: "ELEVE",
        groupe: "À compléter",
        anneeScolaire: "2025-2026",
      },
    });
    return { studentId: user.id };
  }

  const user = await prisma.user.create({
    data: {
      email: demande.email,
      name: demande.name,
      passwordHash: demande.pendingPasswordHash,
      role: "ELEVE",
    },
  });
  return { studentId: user.id };
}

export async function adminValidateCoursEnLigneDemandeAction(formData: FormData) {
  const { auth } = await import("@/auth");
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return;

  const demandeId = String(formData.get("demandeId") || "");
  const teacherId = String(formData.get("teacherId") || "");
  const adminNote = String(formData.get("adminNote") || "").trim() || null;
  if (!demandeId || !teacherId) return;

  const [demande, teacher] = await Promise.all([
    prisma.coursEnLigneDemande.findUnique({ where: { id: demandeId } }),
    prisma.user.findUnique({ where: { id: teacherId, role: "PROFESSEUR" } }),
  ]);
  if (!demande || demande.status !== "EN_ATTENTE_ADMIN" || !teacher) return;

  const resolved = await resolveStudentIdForDemande(demande);
  if ("error" in resolved) return;

  const startsAt = combineDateAndTime(demande.preferredDate, demande.preferredTime);
  const endsAt = new Date(
    startsAt.getTime() + demande.durationMinutes * 60_000,
  );

  const booking = await prisma.onlineLessonBooking.create({
    data: {
      studentId: resolved.studentId,
      guestName: demande.name,
      guestEmail: demande.email,
      guestPhone: demande.phone,
      langue: demande.langue,
      teacherId,
      matiere: demande.matiere || demande.langue,
      startsAt,
      endsAt,
      durationMinutes: demande.durationMinutes,
      meetingRoomId: generateMeetingRoomId(),
      studentComment: demande.message,
      status: "CONFIRME",
      confirmedAt: new Date(),
      paymentStatus: "EN_ATTENTE",
    },
  });

  await prisma.coursEnLigneDemande.update({
    where: { id: demandeId },
    data: {
      status: "VALIDEE",
      bookingId: booking.id,
      assignedTeacherId: teacherId,
      reviewedById: session.user.id,
      reviewedAt: new Date(),
      adminNote,
      pendingPasswordHash: null,
    },
  });

  revalidatePathAllLocales("/admin/cours-en-ligne");
  revalidatePathAllLocales("/professeur/cours-en-ligne");
  revalidatePathAllLocales("/eleve/cours-en-ligne/mes-rdv");
}

export async function adminRefuseCoursEnLigneDemandeAction(formData: FormData) {
  const { auth } = await import("@/auth");
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return;

  const demandeId = String(formData.get("demandeId") || "");
  const adminNote = String(formData.get("adminNote") || "").trim() || null;
  if (!demandeId) return;

  await prisma.coursEnLigneDemande.updateMany({
    where: { id: demandeId, status: "EN_ATTENTE_ADMIN" },
    data: {
      status: "REFUSEE",
      reviewedById: session.user.id,
      reviewedAt: new Date(),
      adminNote,
      pendingPasswordHash: null,
    },
  });

  revalidatePathAllLocales("/admin/cours-en-ligne");
}
