"use server";

import { revalidatePathAllLocales } from "@/lib/revalidate-i18n";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const profileSchema = z.object({
  groupe: z.string().min(1, "Groupe requis"),
  anneeScolaire: z.string().min(1, "Année scolaire requise"),
});

export async function updateEleveProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ELEVE") {
    return;
  }

  const parsed = profileSchema.safeParse({
    groupe: formData.get("groupe"),
    anneeScolaire: formData.get("anneeScolaire"),
  });
  if (!parsed.success) {
    return;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      groupe: parsed.data.groupe.trim(),
      anneeScolaire: parsed.data.anneeScolaire.trim(),
    },
  });

  revalidatePathAllLocales("/eleve");
  revalidatePathAllLocales("/eleve/profil");
  revalidatePathAllLocales("/eleve/cours");
  revalidatePathAllLocales("/eleve/exercices");
}
