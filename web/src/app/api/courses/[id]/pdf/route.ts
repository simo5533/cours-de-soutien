import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { elevePeutVoirContenu } from "@/lib/eleve-visibility";
import { prisma } from "@/lib/prisma";
import { readCoursePdfFile } from "@/lib/storage";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course?.pdfFileName) {
    return new NextResponse("PDF introuvable", { status: 404 });
  }

  if (session.user.role === "ADMIN") {
    // ok
  } else if (
    session.user.role === "PROFESSEUR" &&
    course.authorId === session.user.id
  ) {
    // ok
  } else if (session.user.role === "ELEVE" && course.published) {
    const eleve = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (
      !eleve ||
      !elevePeutVoirContenu({
        eleveGroupe: eleve.groupe,
        eleveAnnee: eleve.anneeScolaire,
        groupeCible: course.groupeCible,
        anneeScolaireCible: course.anneeScolaireCible,
      })
    ) {
      return new NextResponse("Accès refusé", { status: 403 });
    }
  } else {
    return new NextResponse("Accès refusé", { status: 403 });
  }

  const buf = await readCoursePdfFile(course.pdfFileName);
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${encodeURIComponent(course.title)}.pdf"`,
    },
  });
}
