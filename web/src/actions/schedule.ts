"use server";

import { revalidatePathAllLocales } from "@/lib/revalidate-i18n";
import { redirectTo } from "@/lib/redirect-locale";
import { GROUP_SCHEDULE_MAX_SLOTS } from "@/lib/group-schedule";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const optionalStr = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().optional(),
);

const entrySchema = z.object({
  title: z.string().min(1),
  weekday: z.coerce.number().int().min(0).max(6),
  startTime: z
    .string()
    .transform((s) => s.slice(0, 5))
    .pipe(z.string().regex(/^\d{1,2}:\d{2}$/)),
  endTime: z
    .string()
    .transform((s) => s.slice(0, 5))
    .pipe(z.string().regex(/^\d{1,2}:\d{2}$/)),
  niveau: optionalStr,
  matiere: optionalStr,
  room: optionalStr,
  professeurId: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().cuid().optional(),
  ),
  groupe: optionalStr,
  anneeScolaire: optionalStr,
  groupId: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().cuid().optional(),
  ),
});

export async function createScheduleEntryAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return;
  }

  const parsed = entrySchema.safeParse({
    title: formData.get("title"),
    weekday: formData.get("weekday"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    niveau: formData.get("niveau"),
    matiere: formData.get("matiere"),
    room: formData.get("room"),
    professeurId: formData.get("professeurId"),
    groupe: formData.get("groupe"),
    anneeScolaire: formData.get("anneeScolaire"),
    groupId: formData.get("groupId"),
  });

  if (!parsed.success) {
    return;
  }

  const { groupId, ...rest } = parsed.data;

  if (groupId) {
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) {
      return;
    }
    const n = await prisma.scheduleEntry.count({ where: { groupId } });
    if (n >= GROUP_SCHEDULE_MAX_SLOTS) {
      await redirectTo("/admin/groupes?scheduleLimit=1");
    }
    const matiere =
      rest.matiere && rest.matiere.length > 0
        ? rest.matiere
        : group.matiere || null;
    await prisma.scheduleEntry.create({
      data: {
        title: rest.title,
        weekday: rest.weekday,
        startTime: rest.startTime,
        endTime: rest.endTime,
        niveau: rest.niveau ?? null,
        matiere,
        room: rest.room ?? null,
        professeurId: rest.professeurId ?? null,
        groupe: group.name,
        anneeScolaire: group.anneeScolaire,
        groupId: group.id,
      },
    });
    revalidatePathAllLocales("/admin/groupes");
  } else {
    await prisma.scheduleEntry.create({ data: rest });
  }

  revalidatePathAllLocales("/eleve/emploi-du-temps");
  revalidatePathAllLocales("/admin");
  revalidatePathAllLocales("/admin/emploi-du-temps");
  revalidatePathAllLocales("/professeur/emploi-du-temps");
}

export async function deleteScheduleEntryAction(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return;
  }
  await prisma.scheduleEntry.delete({ where: { id } });
  revalidatePathAllLocales("/eleve/emploi-du-temps");
  revalidatePathAllLocales("/admin");
  revalidatePathAllLocales("/admin/emploi-du-temps");
  revalidatePathAllLocales("/admin/groupes");
  revalidatePathAllLocales("/professeur/emploi-du-temps");
}
