import type { Metadata } from "next";
import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import type { CorrectionError } from "@/lib/ai/correction";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Points à améliorer" };
export const dynamic = "force-dynamic";

type NotionGroup = {
  notion: string;
  count: number;
  lastAt: Date;
  examples: { correctionId: string; erreur: string }[];
};

export default async function PointsAAmeliorerPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ELEVE") redirect("/connexion");

  const rows = await prisma.correction.findMany({
    where: { userId: session.user.id, errorsJson: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 300,
    select: { id: true, subject: true, notion: true, errorsJson: true, createdAt: true },
  });

  const bySubject = new Map<string, Map<string, NotionGroup>>();
  let totalErrors = 0;
  for (const row of rows) {
    let errors: CorrectionError[] = [];
    try {
      errors = JSON.parse(row.errorsJson ?? "[]") as CorrectionError[];
    } catch {
      errors = [];
    }
    const subject = row.subject?.trim() || "Autre";
    const notions = bySubject.get(subject) ?? new Map<string, NotionGroup>();
    for (const e of errors) {
      const notion = (e.notion || row.notion || "Notion non précisée").trim();
      const key = notion.toLowerCase();
      const g = notions.get(key) ?? { notion, count: 0, lastAt: row.createdAt, examples: [] };
      g.count += 1;
      if (row.createdAt > g.lastAt) g.lastAt = row.createdAt;
      if (g.examples.length < 3) g.examples.push({ correctionId: row.id, erreur: e.erreur });
      notions.set(key, g);
      totalErrors += 1;
    }
    bySubject.set(subject, notions);
  }

  const subjects = [...bySubject.entries()]
    .map(([subject, notions]) => ({
      subject,
      notions: [...notions.values()].sort((a, b) => b.count - a.count),
    }))
    .filter((s) => s.notions.length > 0)
    .sort((a, b) => b.notions.reduce((n, g) => n + g.count, 0) - a.notions.reduce((n, g) => n + g.count, 0));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy">Points à améliorer</h1>
        <p className="mt-1 text-sm text-muted-text">
          Les erreurs détectées dans vos corrections, regroupées par matière et par notion.
        </p>
      </div>

      {totalErrors === 0 ? (
        <div className="card-elevated p-6 text-sm text-muted-text">
          Pas encore d&apos;erreur enregistrée. Après quelques corrections, vos notions à retravailler
          apparaîtront ici.{" "}
          <Link href="/eleve/correcteur" className="font-semibold text-electric underline">
            Corriger un exercice
          </Link>
        </div>
      ) : (
        subjects.map((s) => (
          <section key={s.subject} className="card-elevated space-y-3 p-5">
            <h2 className="text-lg font-bold text-navy">{s.subject}</h2>
            <ul className="space-y-3">
              {s.notions.map((g) => (
                <li key={g.notion} className="rounded-xl border border-border-soft bg-white/70 px-4 py-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold text-navy">{g.notion}</p>
                    <p className="text-xs text-muted-text">
                      {g.count} erreur{g.count > 1 ? "s" : ""}
                      {g.count > 1 ? " — récurrente" : ""} · dernière le {g.lastAt.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {g.examples.map((ex, i) => (
                      <li key={`${ex.correctionId}-${i}`} className="text-sm text-muted-text">
                        <Link href={`/eleve/historique/${ex.correctionId}`} className="hover:text-electric hover:underline">
                          {ex.erreur}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
