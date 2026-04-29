import { Link } from "@/i18n/navigation";
import { InscriptionForm } from "./inscription-form";
import { SiteHeader } from "@/components/site-header";
import { Suspense } from "react";

export default function InscriptionPage() {
  return (
    <>
      <SiteHeader />
      <Suspense
        fallback={
          <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-slate-600 dark:text-slate-400">
            Chargement…
          </div>
        }
      >
        <InscriptionForm />
      </Suspense>
      <p className="pb-10 text-center text-sm">
        <Link
          href="/"
          className="font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          ← Retour à l’accueil
        </Link>
      </p>
    </>
  );
}
