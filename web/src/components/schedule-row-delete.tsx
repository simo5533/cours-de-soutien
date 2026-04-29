import { deleteScheduleEntryAction } from "@/actions/schedule";

export function ScheduleRowDelete({ id }: { id: string }) {
  return (
    <form action={deleteScheduleEntryAction.bind(null, id)}>
      <button
        type="submit"
        className="text-xs text-red-700 hover:underline dark:text-red-400"
      >
        Supprimer
      </button>
    </form>
  );
}
