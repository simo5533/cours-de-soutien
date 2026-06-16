import { Link } from "@/i18n/navigation";

export default function EleveCoursEnLignePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Cours en ligne</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Pour demander un cours à distance, utilisez la page publique (sans être
        obligé de vous connecter d&apos;abord). L&apos;administration valide votre
        créneau, puis votre professeur reçoit le rendez-vous.
      </p>
      <Link
        href="/cours-en-ligne"
        className="inline-flex rounded-full bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700"
      >
        Demander un cours en ligne
      </Link>
      <p className="text-sm">
        <Link
          href="/eleve/cours-en-ligne/mes-rdv"
          className="font-medium text-brandblue hover:underline"
        >
          Voir mes rendez-vous confirmés →
        </Link>
      </p>
    </div>
  );
}
