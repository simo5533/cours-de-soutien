import { auth } from "@/auth";
import { updateEleveProfileAction } from "@/actions/eleve-profile";
import { ANNEES_SCOLAIRES } from "@/lib/school-years";
import { prisma } from "@/lib/prisma";

export default async function EleveProfilPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
  });

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Classe et année scolaire</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Utilisés pour afficher les bons cours et exercices (avec le niveau
          pédagogique : collège, lycée…).
        </p>
      </div>
      <form action={updateEleveProfileAction} className="space-y-4">
        <label className="flex flex-col gap-1 text-sm">
          <span>Groupe / classe</span>
          <input
            name="groupe"
            required
            defaultValue={user?.groupe ?? ""}
            placeholder="ex. 4ème A, Terminale générale 2"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Année scolaire</span>
          <select
            name="anneeScolaire"
            required
            defaultValue={user?.anneeScolaire ?? ANNEES_SCOLAIRES[1]}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {ANNEES_SCOLAIRES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-full bg-navy px-5 py-2 text-sm font-medium text-white hover:bg-navy/90"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
