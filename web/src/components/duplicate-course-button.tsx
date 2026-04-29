import { duplicateCourseAction } from "@/actions/courses";

export function DuplicateCourseButton({ courseId }: { courseId: string }) {
  return (
    <form action={duplicateCourseAction.bind(null, courseId)} className="inline">
      <button
        type="submit"
        className="rounded-lg border border-navy/20 bg-white px-3 py-1.5 text-xs font-medium text-navy transition hover:bg-navy/5 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        Dupliquer
      </button>
    </form>
  );
}
