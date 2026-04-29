import { Link } from "@/i18n/navigation";
import { MATIERES, NIVEAUX } from "@/lib/course-taxonomy";
import { ANNEES_SCOLAIRES } from "@/lib/school-years";
import { createCourseAction } from "@/actions/courses";

export default function NouveauCoursPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link
        href="/professeur/cours"
        className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
      >
        ← Retour aux cours
      </Link>
      <h2 className="text-lg font-semibold">Nouveau cours</h2>
      <form action={createCourseAction} encType="multipart/form-data" className="space-y-4">
        <label className="flex flex-col gap-1 text-sm">
          <span>Titre</span>
          <input
            name="title"
            required
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Description (optionnel)</span>
          <textarea
            name="description"
            rows={2}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Matière</span>
          <select
            name="matiere"
            required
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {MATIERES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Niveau</span>
          <select
            name="niveau"
            required
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {NIVEAUX.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Chapitre</span>
          <input
            name="chapitre"
            required
            placeholder="ex. Équations"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <p className="text-xs text-zinc-500">
          Ciblage (optionnel) : laissez vide pour toutes les classes du niveau
          choisi. Sinon, seuls les élèves avec le même groupe et la même année
          verront le cours.
        </p>
        <label className="flex flex-col gap-1 text-sm">
          <span>Groupe / classe cible</span>
          <input
            name="groupeCible"
            placeholder="ex. 4ème A (vide = tous)"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Année scolaire cible</span>
          <select
            name="anneeScolaireCible"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            defaultValue=""
          >
            <option value="">Toutes les années</option>
            {ANNEES_SCOLAIRES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Contenu texte (Markdown simple)</span>
          <textarea
            name="contentText"
            rows={8}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>PDF (optionnel, max 12 Mo)</span>
          <input name="pdf" type="file" accept="application/pdf" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" />
          Publier tout de suite
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
