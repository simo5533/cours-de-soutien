import { Link } from "@/i18n/navigation";
import { Suspense } from "react";
import { ConnexionForm } from "@/components/connexion-form";
import { SiteHeader } from "@/components/site-header";
import { auth } from "@/auth";
import { redirectTo } from "@/lib/redirect-locale";

/** Évite une page connexion mise en cache sans cookie → formulaire alors que le header montre déjà la session. */
export const dynamic = "force-dynamic";

export default async function ConnexionPage() {
  const session = await auth();
  if (session?.user) {
    await redirectTo("/apres-connexion");
  }

  return (
    <>
      <SiteHeader />
      <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-16 sm:py-20">
        <div className="card-elevated p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/40">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Connexion
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Accédez à votre espace (élève, professeur ou administrateur).
          </p>
          <Suspense
            fallback={
              <p className="mt-8 text-sm text-slate-500">Chargement…</p>
            }
          >
            <ConnexionForm />
          </Suspense>
        </div>
        <p className="mt-8 text-center text-sm">
          <Link
            href="/"
            className="font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            ← Retour à l’accueil
          </Link>
        </p>
      </div>
    </>
  );
}
