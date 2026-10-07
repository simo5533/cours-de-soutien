"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { PLANS } from "@/lib/plans";
import { prisma } from "@/lib/prisma";

export type CentreFormState = { error?: string; ok?: string } | undefined;

async function requireOwner() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ELEVE") return null;
  const membership = await prisma.centreMember.findUnique({
    where: { userId: session.user.id },
    include: { centre: true },
  });
  if (!membership || membership.role !== "OWNER") return null;
  return membership.centre;
}

const addSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court."),
  email: z.string().trim().toLowerCase().email("E-mail invalide."),
  password: z.string().min(8, "Choisissez un mot de passe d'au moins 8 caractères."),
});

export async function addCentreMemberAction(
  _prev: CentreFormState,
  formData: FormData,
): Promise<CentreFormState> {
  const centre = await requireOwner();
  if (!centre) return { error: "Action réservée au responsable du centre." };

  const parsed = addSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  const { name, email, password } = parsed.data;

  const seats = centre.seatLimit ?? PLANS.CENTRE.seats;
  const count = await prisma.centreMember.count({ where: { centreId: centre.id } });
  if (count >= seats) {
    return { error: `Le centre utilise déjà ses ${seats} comptes.` };
  }

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return { error: "Cet e-mail est déjà utilisé par un compte CorrecteurPlus. Utilisez une autre adresse." };
  }

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        passwordHash: await bcrypt.hash(password, 10),
        role: "ELEVE",
        accountType: "PROF",
        subscriptionPlan: "FREE",
        subscriptionStatus: "free",
      },
    });
    await tx.centreMember.create({ data: { centreId: centre.id, userId: user.id, role: "MEMBER" } });
  });
  revalidatePath("/[locale]/eleve/centre", "page");
  return { ok: `Compte créé pour ${name}. Communiquez-lui son e-mail et son mot de passe.` };
}

export async function removeCentreMemberAction(formData: FormData): Promise<void> {
  const centre = await requireOwner();
  if (!centre) return;
  const memberId = String(formData.get("memberId") || "");
  if (!memberId) return;
  await prisma.centreMember.deleteMany({
    where: { id: memberId, centreId: centre.id, role: "MEMBER" },
  });
  revalidatePath("/[locale]/eleve/centre", "page");
}

export async function renameCentreAction(formData: FormData): Promise<void> {
  const centre = await requireOwner();
  if (!centre) return;
  const name = String(formData.get("name") || "").trim().slice(0, 120);
  if (name.length < 2) return;
  await prisma.centre.update({ where: { id: centre.id }, data: { name } });
  revalidatePath("/[locale]/eleve/centre", "page");
}
