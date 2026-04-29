import { deleteProfAffectationAction } from "@/actions/prof-affectations";

export function AffectationRowDelete({ id }: { id: string }) {
  return (
    <form action={deleteProfAffectationAction.bind(null, id)}>
      <button
        type="submit"
        className="rounded-lg border border-red-200/90 bg-red-50/80 px-2.5 py-1 text-xs font-medium text-red-800 transition hover:bg-red-100/90 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
      >
        Supprimer
      </button>
    </form>
  );
}
