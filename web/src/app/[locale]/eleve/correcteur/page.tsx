import type { Metadata } from "next";
import { auth } from "@/auth";
import { AiQuotaMeter } from "@/components/ai-quota-meter";
import { CorrecteurUpload } from "@/components/correcteur-upload";
import { Link } from "@/i18n/navigation";
import { FILE_LIMITS } from "@/lib/ai/config";
import { ensureSubscriptionPeriod } from "@/lib/ai/quota";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Corriger un exercice",
  description: "Photo ou PDF : correction expliquée, erreurs identifiées et entraînement.",
};

export const dynamic = "force-dynamic";

export default async function CorrecteurPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ELEVE") redirect("/connexion");

  const [quota, recent] = await Promise.all([
    ensureSubscriptionPeriod(session.user.id),
    prisma.correction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, subject: true, createdAt: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy">Corriger un exercice</h1>
        <p className="mt-1 text-sm text-muted-text">
          Photo ou PDF, toutes matières : correction expliquée étape par étape, erreurs identifiées,
          puis entraînement sur les notions à améliorer.
        </p>
      </div>

      <AiQuotaMeter quota={quota} />

      <CorrecteurUpload
        remaining={quota.remaining}
        maxPdfPages={FILE_LIMITS.maxPdfPages}
        maxImages={FILE_LIMITS.maxImagesPerAnalysis}
        upgradeHref={quota.upgradeHref}
      />

      <ol className="grid gap-3 text-sm sm:grid-cols-3">
        {[
          ["1. Corriger", "Photo ou PDF dans toutes les matières."],
          ["2. Comprendre", "Correction expliquée et erreurs identifiées."],
          ["3. S'entraîner", "Exercice similaire et quiz sur la notion."],
        ].map(([title, desc]) => (
          <li key={title} className="rounded-xl border border-border-soft bg-white/60 px-4 py-3">
            <p className="font-semibold text-navy">{title}</p>
            <p className="mt-1 text-xs text-muted-text">{desc}</p>
          </li>
        ))}
      </ol>

      {recent.length ? (
        <section>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold text-navy">Dernières corrections</h2>
            <Link href="/eleve/historique" className="text-xs font-semibold text-electric hover:underline">
              Tout l&apos;historique →
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {recent.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/eleve/historique/${c.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border-soft bg-white/70 px-4 py-3 text-sm transition hover:border-electric"
                >
                  <span className="truncate font-medium text-navy">{c.title || "Correction"}</span>
                  <span className="shrink-0 text-xs text-muted-text">
                    {c.subject ? `${c.subject} · ` : ""}
                    {c.createdAt.toLocaleDateString("fr-FR")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
