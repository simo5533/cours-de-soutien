"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePathAllLocales } from "@/lib/revalidate-i18n";
import { z } from "zod";

const createGroupSchema = z.object({
  name: z.string().min(1),
  anneeScolaire: z.string().min(1),
  titulaireId: z.string().cuid(),
});

export async function createGroupAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return;

  const parsed = createGroupSchema.safeParse({
    name: formData.get("name"),
    anneeScolaire: formData.get("anneeScolaire"),
    titulaireId: formData.get("titulaireId"),
  });
  if (!parsed.success) return;

  const prof = await prisma.user.findFirst({
    where: { id: parsed.data.titulaireId, role: "PROFESSEUR" },
    select: { id: true },
  });
  if (!prof) return;

  await prisma.group.create({
    data: {
      name: parsed.data.name.trim(),
      anneeScolaire: parsed.data.anneeScolaire.trim(),
      matiere: "",
      titulaireId: prof.id,
    },
  });
  revalidatePathAllLocales("/admin/groupes");
  revalidatePathAllLocales("/admin/affectations");
  revalidatePathAllLocales("/admin/emploi-du-temps");
}

export async function assignStudentToGroupAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return;

  const studentId = String(formData.get("studentId") || "");
  const groupId = String(formData.get("groupId") || "");
  if (!studentId) return;

  const student = await prisma.user.findUnique({ where: { id: studentId } });
  if (!student || student.role !== "ELEVE") return;

  if (!groupId) {
    await prisma.user.update({
      where: { id: studentId },
      data: { groupId: null, groupe: null, anneeScolaire: null },
    });
  } else {
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) return;
    await prisma.user.update({
      where: { id: studentId },
      data: {
        groupId,
        groupe: group.name,
        anneeScolaire: group.anneeScolaire,
      },
    });
  }

  revalidatePathAllLocales("/admin/groupes");
  revalidatePathAllLocales("/admin/utilisateurs");
  revalidatePathAllLocales("/admin/affectations");
  revalidatePathAllLocales("/professeur/emploi-du-temps");
}

export async function deleteGroupAction(groupId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return;
  await prisma.group.delete({ where: { id: groupId } });
  revalidatePathAllLocales("/admin/groupes");
  revalidatePathAllLocales("/admin/utilisateurs");
  revalidatePathAllLocales("/admin/affectations");
  revalidatePathAllLocales("/admin/emploi-du-temps");
  revalidatePathAllLocales("/eleve/emploi-du-temps");
  revalidatePathAllLocales("/professeur/emploi-du-temps");
}

