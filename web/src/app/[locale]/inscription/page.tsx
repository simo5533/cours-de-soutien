import { Link } from "@/i18n/navigation";
import { getPaymentProvider } from "@/lib/payment-provider";
import { InscriptionForm } from "./inscription-form";
import { PublicPageShell } from "@/components/public-page-shell";
import { Suspense } from "react";

export default function InscriptionPage() {
  const paymentProvider = getPaymentProvider();

  return (
    <PublicPageShell>
      <Suspense
        fallback={
          <div className="mx-auto max-w-md py-12 text-center text-sm text-slate-600 dark:text-slate-400">
            Chargement…
          </div>
        }
      >
        <InscriptionForm paymentProvider={paymentProvider} />
      </Suspense>
      <p className="mt-6 text-center text-sm">
        <Link
          href="/"
          className="font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          ← Retour à l’accueil
        </Link>
      </p>
    </PublicPageShell>
  );
}
