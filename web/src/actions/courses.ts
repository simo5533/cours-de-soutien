"use server";

import { redirectTo } from "@/lib/redirect-locale";
import { revalidatePathAllLocales } from "@/lib/revalidate-i18n";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { saveCoursePdf } from "@/lib/storage";

const baseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  matiere: z.string().min(1),
  niveau: z.string().min(1),
  chapitre: z.string().min(1),
  contentText: z.string().optional(),
  groupeCible: z.string().optional(),
  anneeScolaireCible: z.string().optional(),
});

export async function createCourseAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PROFESSEUR") {
    return;
  }

  const published =
    formData.get("published") === "on" ||
    formData.get("published") === "true";
  const parsed = baseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    matiere: formData.get("matiere"),
    niveau: formData.get("niveau"),
    chapitre: formData.get("chapitre"),
    contentText: formData.get("contentText") || undefined,
    groupeCible: (formData.get("groupeCible") as string) || undefined,
    anneeScolaireCible: (formData.get("anneeScolaireCible") as string) || undefined,
  });

  if (!parsed.success) {
    return;
  }

  const g =
    parsed.data.groupeCible?.trim() || null;
  const a =
    parsed.data.anneeScolaireCible?.trim() || null;

  const course = await prisma.course.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      matiere: parsed.data.matiere,
      niveau: parsed.data.niveau,
      chapitre: parsed.data.chapitre,
      groupeCible: g,
      anneeScolaireCible: a,
      contentText: parsed.data.contentText || null,
      published,
      authorId: session.user.id,
    },
  });

  const pdf = formData.get("pdf");
  if (pdf instanceof File && pdf.size > 0) {
    if (pdf.type !== "application/pdf" && !pdf.name.toLowerCase().endsWith(".pdf")) {
      await prisma.course.delete({ where: { id: course.id } });
      return;
    }
    if (pdf.size > 12 * 1024 * 1024) {
      await prisma.course.delete({ where: { id: course.id } });
      return;
    }
    const buf = Buffer.from(await pdf.arrayBuffer());
    const fileName = await saveCoursePdf(course.id, buf);
    await prisma.course.update({
      where: { id: course.id },
      data: { pdfFileName: fileName },
    });
  }

  revalidatePathAllLocales("/professeur/cours");
  revalidatePathAllLocales("/eleve/cours");
  await redirectTo("/professeur/cours");
}

export async function toggleCoursePublished(courseId: string, published: boolean) {
  const session = await auth();
  if (!session?.user) return;
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return;
  if (session.user.role === "PROFESSEUR" && course.authorId !== session.user.id) {
    return;
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "PROFESSEUR") {
    return;
  }

  await prisma.course.update({
    where: { id: courseId },
    data: { published },
  });
  revalidatePathAllLocales("/professeur/cours");
  revalidatePathAllLocales("/eleve/cours");
  revalidatePathAllLocales("/admin/cours");
}

export async function deleteCourseAction(courseId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return;
  }
  await prisma.course.delete({ where: { id: courseId } });
  revalidatePathAllLocales("/admin/cours");
  revalidatePathAllLocales("/eleve/cours");
}

/** Duplique un cours (brouillon, sans PDF — à re-télécharger). */
export async function duplicateCourseAction(courseId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PROFESSEUR") {
    return;
  }
  const src = await prisma.course.findUnique({ where: { id: courseId } });
  if (!src || src.authorId !== session.user.id) {
    return;
  }

  await prisma.course.create({
    data: {
      title: `Copie — ${src.title}`,
      description: src.description,
      matiere: src.matiere,
      niveau: src.niveau,
      chapitre: src.chapitre,
      groupeCible: src.groupeCible,
      anneeScolaireCible: src.anneeScolaireCible,
      contentText: src.contentText,
      pdfFileName: null,
      published: false,
      authorId: session.user.id,
    },
  });

  revalidatePathAllLocales("/professeur/cours");
  revalidatePathAllLocales("/eleve/cours");
  revalidatePathAllLocales("/cours");
}
