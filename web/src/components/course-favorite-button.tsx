"use client";

import { toggleCourseFavoriteAction } from "@/actions/course-favorites";
import { useRouter } from "@/i18n/navigation";
import { useTransition, useState } from "react";

export function CourseFavoriteButton({
  courseId,
  initialFavorited,
}: {
  courseId: string;
  initialFavorited: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [favorited, setFavorited] = useState(initialFavorited);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const res = await toggleCourseFavoriteAction(courseId);
          if (res.ok && "favorited" in res) {
            setFavorited(res.favorited);
          }
          router.refresh();
        });
      }}
      className="inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-semibold text-navy transition hover:bg-gold/20 disabled:opacity-50 dark:border-gold/35 dark:bg-gold/15 dark:text-gold dark:hover:bg-gold/25"
      aria-pressed={favorited}
    >
      <span className="text-lg leading-none" aria-hidden>
        {favorited ? "★" : "☆"}
      </span>
      {favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
    </button>
  );
}
