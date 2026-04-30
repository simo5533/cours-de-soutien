import { toggleExercisePublished } from "@/actions/exercises";

export function ExercisePublishToggle({
  exerciseId,
  published,
}: {
  exerciseId: string;
  published: boolean;
}) {
  async function action() {
    "use server";
    await toggleExercisePublished(exerciseId, !published);
  }

  return (
    <form action={action}>
      <button
        type="submit"
        className="rounded-lg border border-zinc-300 px-3 py-1 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-900"
      >
        {published ? "Dépublier" : "Publier"}
      </button>
    </form>
  );
}
