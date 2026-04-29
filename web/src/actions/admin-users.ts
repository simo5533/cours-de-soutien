"use server";

import { revalidatePathAllLocales } from "@/lib/revalidate-i18n";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/auth";
import { parseEnrollmentSubjectsJson } from "@/lib/format-student-enrollment";
import { prisma } from "@/lib/prisma";

const subjectLineSchema = z.object({
  name: z.string().min(1).max(200),
  priceDh: z.number().min(0).max(1_000_000),
});

const baseUserSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["ELEVE", "PROFESSEUR", "ADMIN"]),
    groupe: z.string().optional(),
    anneeScolaire: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "ELEVE") {
      if (!data.groupe?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Groupe requis pour un élève.",
          path: ["groupe"],
        });
      }
      if (!data.anneeScolaire?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Année scolaire requise pour un élève.",
          path: ["anneeScolaire"],
        });
      }
    }
  });

const eleveEnrollmentSchema = z.object({
  enrollmentLanguageCount: z.coerce.number().int().min(0).max(50),
  enrolledAt: z.string().min(1),
  enrollmentSubjectsJson: z.string().min(2),
});

function parseEnrollmentSubjects(jsonStr: string):
  | { ok: true; subjects: z.infer<typeof subjectLineSchema>[] }
  | { ok: false } {
  const normalized = parseEnrollmentSubjectsJson(jsonStr);
  const parsed = z.array(subjectLineSchema).safeParse(normalized);
  if (!parsed.success || parsed.data.length === 0) {
    return { ok: false };
  }
  return { ok: true, subjects: parsed.data };
}

export async function adminCreateUserAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return;
  }

  const baseParsed = baseUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    groupe: formData.get("groupe") ?? undefined,
    anneeScolaire: formData.get("anneeScolaire") ?? undefined,
  });
  if (!baseParsed.success) {
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email: baseParsed.data.email },
  });
  if (existing) {
    return;
  }

  let enrollmentSubjectsJson: string | null = null;
  let enrollmentTotal: number | null = null;
  let enrolledAt: Date | null = null;
  let enrollmentLanguageCount: number | null = null;

  if (baseParsed.data.role === "ELEVE") {
    const enr = eleveEnrollmentSchema.safeParse({
      enrollmentLanguageCount: formData.get("enrollmentLanguageCount"),
      enrolledAt: formData.get("enrolledAt"),
      enrollmentSubjectsJson: formData.get("enrollmentSubjectsJson"),
    });
    if (!enr.success) {
      return;
    }
    const subj = parseEnrollmentSubjects(enr.data.enrollmentSubjectsJson);
    if (!subj.ok) {
      return;
    }
    enrollmentSubjectsJson = JSON.stringify(subj.subjects);
    enrollmentTotal = subj.subjects.reduce((s, l) => s + l.priceDh, 0);
    enrollmentLanguageCount = enr.data.enrollmentLanguageCount;
    enrolledAt = new Date(`${enr.data.enrolledAt.trim()}T12:00:00`);
  }

  await prisma.user.create({
    data: {
      name: baseParsed.data.name,
      email: baseParsed.data.email,
      passwordHash: await bcrypt.hash(baseParsed.data.password, 10),
      role: baseParsed.data.role,
      groupe:
        baseParsed.data.role === "ELEVE"
          ? baseParsed.data.groupe!.trim()
          : null,
      anneeScolaire:
        baseParsed.data.role === "ELEVE"
          ? baseParsed.data.anneeScolaire!.trim()
          : null,
      enrollmentLanguageCount,
      enrollmentSubjectsJson,
      enrollmentTotal,
      enrolledAt,
    },
  });

  revalidatePathAllLocales("/admin/utilisateurs");
}

export async function adminDeleteUserAction(userId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return;
  }
  if (userId === session.user.id) {
    return;
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePathAllLocales("/admin/utilisateurs");
}
