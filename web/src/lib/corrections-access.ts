import { prisma } from "@/lib/prisma";

/** Lecture autorisée : auteur de la correction, ou propriétaire du centre dont le quota a servi. */
export async function canReadCorrection(
  userId: string,
  correction: { userId: string; centreId: string | null },
): Promise<boolean> {
  if (correction.userId === userId) return true;
  if (!correction.centreId) return false;
  const owner = await prisma.centreMember.findFirst({
    where: { userId, centreId: correction.centreId, role: "OWNER" },
    select: { id: true },
  });
  return !!owner;
}
