import type { MetadataRoute } from "next";
import { ExerciseType } from "@prisma/client";
import { routing } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { getAppBaseUrl } from "@/lib/stripe-server";

export const revalidate = 3600;

const PUBLIC_PATHS = ["", "/tarifs", "/quiz", "/cours-gratuits-langues", "/blog", "/inscription"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getAppBaseUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    PUBLIC_PATHS.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === "" || path === "/quiz" ? "weekly" : "monthly",
      priority: path === "" ? 1 : path === "/tarifs" || path === "/quiz" ? 0.8 : 0.5,
    })),
  );

  try {
    const quizzes = await prisma.exercise.findMany({
      where: { published: true, type: ExerciseType.QCM },
      select: { id: true, updatedAt: true },
      take: 2000,
    });
    for (const q of quizzes) {
      for (const locale of routing.locales) {
        entries.push({
          url: `${base}/${locale}/quiz/${q.id}`,
          lastModified: q.updatedAt,
          changeFrequency: "monthly",
          priority: 0.4,
        });
      }
    }
  } catch (e) {
    console.error("[sitemap] quiz list unavailable", e);
  }

  return entries;
}
