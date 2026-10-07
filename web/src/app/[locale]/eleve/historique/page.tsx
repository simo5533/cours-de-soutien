import type { Metadata } from "next";
import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Historique des corrections" };
export const dynamic = "force-dynamic";

const SOURCE_LABEL: Record<string, string> = { image: "Photo", pdf: "PDF", docx: "Word" };

export default async function HistoriquePage({
  searchParams,
}: {
  searchParams: Promise<{ matiere?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ELEVE") redirect("/connexion");
  const { matiere } = await searchParams;

  const [corrections, subjects] = await Promise.all([
    prisma.correction.findMany({
      where: { userId: session.user.id, ...(matiere ? { subject: matiere } : {}) },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        title: true,
        subject: true,
        notion: true,
        sourceType: true,
        pages: true,
        errorsJson: true,
        createdAt: true,
      },
    }),
    prisma.correction.groupBy({
      by: ["subject"],
      where: { userId: session.user.id, subject: { not: null } },
      _count: { _all: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Historique</h1>
          <p className="mt-1 text-sm text-muted-text">
            Vos corrections sont enregistrées : les rouvrir ne consomme aucun crédit.
          </p>
        </div>
        <Link href="/eleve/correcteur" className="btn-primary !py-2.5">
          Nouvelle correction
        </Link>
      </div>

      {subjects.length > 1 ? (
        <nav className="flex flex-wrap gap-2" aria-label="Filtrer par matière">
          <Link
            href="/eleve/historique"
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${!matiere ? "border-electric bg-electric/10 text-electric" : "border-border-soft text-navy"}`}
          >
            Toutes
          </Link>
          {subjects.map((s) => (
            <Link
              key={s.subject}
              href={`/eleve/historique?matiere=${encodeURIComponent(s.subject ?? "")}`}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${matiere === s.subject ? "border-electric bg-electric/10 text-electric" : "border-border-soft text-navy"}`}
            >
              {s.subject} ({s._count._all})
            </Link>
          ))}
        </nav>
      ) : null}

      {corrections.length === 0 ? (
        <div className="card-elevated p-6 text-center text-sm text-muted-text">
          Aucune correction pour le moment.{" "}
          <Link href="/eleve/correcteur" className="font-semibold text-electric underline">
            Corriger un premier exercice
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {corrections.map((c) => {
            let errorCount = 0;
            try {
              errorCount = c.errorsJson ? (JSON.parse(c.errorsJson) as unknown[]).length : 0;
            } catch {
              errorCount = 0;
            }
            return (
              <li key={c.id}>
                <Link
                  href={`/eleve/historique/${c.id}`}
                  className="flex flex-col gap-1 rounded-xl border border-border-soft bg-white/70 px-4 py-3 transition hover:border-electric sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy">{c.title || "Correction"}</p>
                    <p className="truncate text-xs text-muted-text">
                      {[c.subject, c.notion].filter(Boolean).join(" · ") || "Matière non détectée"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 text-xs text-muted-text">
                    {errorCount > 0 ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-900">
                        {errorCount} erreur{errorCount > 1 ? "s" : ""}
                      </span>
                    ) : null}
                    <span>
                      {SOURCE_LABEL[c.sourceType] ?? c.sourceType}
                      {c.sourceType !== "image" ? ` · ${c.pages} p.` : ""}
                    </span>
                    <span>{c.createdAt.toLocaleDateString("fr-FR")}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
