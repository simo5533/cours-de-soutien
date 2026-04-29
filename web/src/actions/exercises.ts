"use server";

import { redirectTo } from "@/lib/redirect-locale";
import { revalidatePathAllLocales } from "@/lib/revalidate-i18n";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  title: z.string().min(1),
  matiere: z.string().min(1),
  niveau: z.string().min(1),
  chapitre: z.string().min(1),
  type: z.enum(["QCM", "OUVERT"]),
  contentJson: z.string().min(2),
  /** Champ `datetime-local` (optionnel) */
  deadlineAt: z.string().optional(),
  /** Valeur `encodeURIComponent(groupe)###encodeURIComponent(année)` depuis le formulaire */
  groupeCiblePreset: z.string().optional(),
  groupeCible: z.string().optional(),
  anneeScolaireCible: z.string().optional(),
});

export async function createExerciseAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PROFESSEUR") {
    return;
  }

  const parsed = createSchema.safeParse({
    title: formData.get("title"),
    matiere: formData.get("matiere"),
    niveau: formData.get("niveau"),
    chapitre: formData.get("chapitre"),
    type: formData.get("type"),
    contentJson: formData.get("contentJson"),
    deadlineAt: (formData.get("deadlineAt") as string) || undefined,
    groupeCiblePreset: (formData.get("groupeCiblePreset") as string) || undefined,
    groupeCible: (formData.get("groupeCible") as string) || undefined,
    anneeScolaireCible: (formData.get("anneeScolaireCible") as string) || undefined,
  });

  if (!parsed.success) {
    return;
  }

  try {
    JSON.parse(parsed.data.contentJson);
  } catch {
    return;
  }

  const preset = parsed.data.groupeCiblePreset?.trim() ?? "";
  let g: string | null;
  let a: string | null;
  const sep = preset.indexOf("###");
  if (preset.length > 0 && sep !== -1) {
    try {
      const rawG = decodeURIComponent(preset.slice(0, sep));
      const rawA = decodeURIComponent(preset.slice(sep + 3));
      g = rawG.trim() || null;
      a = rawA.trim() || null;
    } catch {
      g = parsed.data.groupeCible?.trim() || null;
      a = parsed.data.anneeScolaireCible?.trim() || null;
    }
  } else {
    g = parsed.data.groupeCible?.trim() || null;
    a = parsed.data.anneeScolaireCible?.trim() || null;
  }

  let deadlineAt: Date | null = null;
  const rawDeadline = parsed.data.deadlineAt?.trim();
  if (rawDeadline) {
    const d = new Date(rawDeadline);
    if (!Number.isNaN(d.getTime())) {
      deadlineAt = d;
    }
  }

  await prisma.exercise.create({
    data: {
      title: parsed.data.title,
      matiere: parsed.data.matiere,
      niveau: parsed.data.niveau,
      chapitre: parsed.data.chapitre,
      groupeCible: g,
      anneeScolaireCible: a,
      deadlineAt,
      type: parsed.data.type,
      contentJson: parsed.data.contentJson,
      authorId: session.user.id,
      published: true,
    },
  });

  revalidatePathAllLocales("/professeur/exercices");
  revalidatePathAllLocales("/eleve/exercices");
  await redirectTo("/professeur/exercices");
}

export async function deleteExerciseAction(exerciseId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return;
  }
  await prisma.exercise.delete({ where: { id: exerciseId } });
  revalidatePathAllLocales("/admin/exercices");
  revalidatePathAllLocales("/eleve/exercices");
}
