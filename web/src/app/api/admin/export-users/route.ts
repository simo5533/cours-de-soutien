import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function csvEscape(s: string | number | null | undefined): string {
  if (s === null || s === undefined) return "";
  const str = String(s);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "id",
    "name",
    "email",
    "role",
    "groupe",
    "anneeScolaire",
    "enrollmentLanguageCount",
    "enrollmentTotal",
    "enrolledAt",
    "createdAt",
  ];

  const lines = [
    headers.join(","),
    ...users.map((u) =>
      [
        csvEscape(u.id),
        csvEscape(u.name),
        csvEscape(u.email),
        csvEscape(u.role),
        csvEscape(u.groupe),
        csvEscape(u.anneeScolaire),
        u.enrollmentLanguageCount ?? "",
        u.enrollmentTotal ?? "",
        u.enrolledAt ? u.enrolledAt.toISOString() : "",
        u.createdAt.toISOString(),
      ].join(","),
    ),
  ];

  const body = lines.join("\r\n");
  const filename = `utilisateurs-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
