"use server";

import { revalidatePathAllLocales } from "@/lib/revalidate-i18n";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function toggleCourseFavoriteAction(courseId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ELEVE") {
    return { ok: false as const };
  }

  const existing = await prisma.courseFavorite.findUnique({
    where: {
      userId_courseId: { userId: session.user.id, courseId },
    },
  });

  if (existing) {
    await prisma.courseFavorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.courseFavorite.create({
      data: { userId: session.user.id, courseId },
    });
  }

  revalidatePathAllLocales("/eleve/cours");
  revalidatePathAllLocales("/eleve/favoris");
  revalidatePathAllLocales(`/eleve/cours/${courseId}`);
  revalidatePathAllLocales("/eleve");
  const favorited = !existing;
  return { ok: true as const, favorited };
}
