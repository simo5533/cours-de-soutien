import { auth } from "@/auth";
import { ProfNouvelExerciceForm } from "@/components/prof-nouvel-exercice-form";
import { prisma } from "@/lib/prisma";

export default async function NouvelExercicePage() {
  const session = await auth();
  const affectations =
    session?.user?.id && session.user.role === "PROFESSEUR"
      ? await prisma.professeurAffectation.findMany({
          where: { professeurId: session.user.id },
          orderBy: [
            { anneeScolaire: "desc" },
            { groupe: "asc" },
            { matiere: "asc" },
          ],
        })
      : [];

  const seen = new Set<string>();
  const ciblesUniques = affectations.filter((a) => {
    const k = `${a.groupe}\0${a.anneeScolaire}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).map((a) => ({ groupe: a.groupe, anneeScolaire: a.anneeScolaire }));

  return <ProfNouvelExerciceForm ciblesUniques={ciblesUniques} />;
}
