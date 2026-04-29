"use server";

import { revalidatePathAllLocales } from "@/lib/revalidate-i18n";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const affectationSchema = z.object({
  professeurId: z.string().cuid(),
  matiere: z.string().min(1),
  groupId: z.string().cuid(),
});

export async function createProfAffectationAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return;
  }

  const parsed = affectationSchema.safeParse({
    professeurId: formData.get("professeurId"),
    matiere: formData.get("matiere"),
    groupId: formData.get("groupId"),
  });

  if (!parsed.success) {
    return;
  }

  const group = await prisma.group.findUnique({
    where: { id: parsed.data.groupId },
  });
  if (!group) {
    return;
  }

  await prisma.professeurAffectation.create({
    data: {
      professeurId: parsed.data.professeurId,
      matiere: parsed.data.matiere.trim(),
      groupe: group.name,
      anneeScolaire: group.anneeScolaire,
    },
  });
  revalidatePathAllLocales("/admin/affectations");
  revalidatePathAllLocales("/professeur/emploi-du-temps");
}

export async function deleteProfAffectationAction(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return;
  }
  await prisma.professeurAffectation.delete({ where: { id } });
  revalidatePathAllLocales("/admin/affectations");
  revalidatePathAllLocales("/professeur/emploi-du-temps");
}
