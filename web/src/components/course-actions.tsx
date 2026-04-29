import { deleteCourseAction, toggleCoursePublished } from "@/actions/courses";

export function CoursePublishToggle({
  courseId,
  published,
}: {
  courseId: string;
  published: boolean;
}) {
  async function action() {
    "use server";
    await toggleCoursePublished(courseId, !published);
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

export function CourseDeleteButton({ courseId }: { courseId: string }) {
  async function action() {
    "use server";
    await deleteCourseAction(courseId);
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
