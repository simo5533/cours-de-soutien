import { Link } from "@/i18n/navigation";
import { Suspense } from "react";
import { ConnexionForm } from "@/components/connexion-form";
import { PublicPageShell } from "@/components/public-page-shell";

export default function ConnexionPage() {
  return (
    <PublicPageShell>
      <div className="mx-auto flex max-w-md flex-col justify-center py-4 sm:py-8">
        <div className="card-elevated p-5 shadow-xl shadow-electric/[0.06] sm:p-8">
          <h1 className="font-display text-xl font-bold tracking-tight text-navy sm:text-2xl">
            Connexion
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-text">
            Accédez à votre espace (élève, professeur ou administrateur).
          </p>
          <Suspense fallback={<p className="mt-8 text-sm text-slate-500">Chargement…</p>}>
            <ConnexionForm />
          </Suspense>
        </div>
        <p className="mt-8 text-center text-sm">
          <Link
            href="/"
            className="font-medium text-electric underline-offset-4 transition hover:text-premium"
          >
            ← Retour à l’accueil
          </Link>
        </p>
      </div>
    </PublicPageShell>
  );
}
