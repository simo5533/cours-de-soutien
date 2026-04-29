import { deleteExerciseAction } from "@/actions/exercises";

export function ExerciseDeleteButton({ exerciseId }: { exerciseId: string }) {
  async function action() {
    "use server";
    await deleteExerciseAction(exerciseId);
  }

  return (
    <form action={action}>
      <button
        type="submit"
        className="text-xs text-red-700 hover:underline dark:text-red-400"
      >
        Supprimer
      </button>
    </form>
  );
}
