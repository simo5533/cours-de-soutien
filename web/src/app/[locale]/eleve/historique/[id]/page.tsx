import type { Metadata } from "next";
import { auth } from "@/auth";
import { CorrectionAssistant } from "@/components/correction-assistant";
import { CorrectionExportButtons } from "@/components/correction-export-buttons";
import { Link } from "@/i18n/navigation";
import { correctionToPlainText, parseCorrection } from "@/lib/ai/correction";
import { canReadCorrection } from "@/lib/corrections-access";
import { prisma } from "@/lib/prisma";
import { findQuizzesForNotion } from "@/lib/quiz-match";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = { title: "Correction" };
export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function CorrectionDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ELEVE") redirect("/connexion");
  const { id } = await params;

  const correction = await prisma.correction.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      user: { select: { name: true } },
    },
  });
  if (!correction || !(await canReadCorrection(session.user.id, correction))) notFound();

  const isOwner = correction.userId === session.user.id;
  const r = parseCorrection(correction.resultJson);
  const { matiere, quizzes } = await findQuizzesForNotion(r.matiere, r.notion);
  const sourceLabel =
    correction.sourceType === "image"
      ? `${correction.pages} photo${correction.pages > 1 ? "s" : ""}`
      : `${correction.sourceType.toUpperCase()} · ${correction.pages} page${correction.pages > 1 ? "s" : ""}`;

  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link href="/eleve/historique" className="font-medium text-electric hover:underline">
          ← Historique
        </Link>
      </nav>

      <header className="card-elevated space-y-2 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {r.matiere ? (
            <span className="rounded-full bg-electric/10 px-2.5 py-0.5 font-semibold text-electric">
              {r.matiere}
            </span>
          ) : null}
          {r.notion ? (
            <span className="rounded-full bg-cyan-ai/10 px-2.5 py-0.5 font-semibold text-navy">{r.notion}</span>
          ) : null}
          <span className="text-muted-text">
            {sourceLabel} · {correction.createdAt.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
          </span>
        </div>
        <h1 className="font-display text-xl font-bold text-navy sm:text-2xl">{r.titre}</h1>
        {!isOwner ? (
          <p className="text-xs text-muted-text">Correction de {correction.user.name} (lecture seule)</p>
        ) : null}
        {r.enonce ? <p className="text-sm text-muted-text">{r.enonce}</p> : null}
        {r.confiance === "faible" ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
            La lecture de cet exercice était incertaine : vérifiez l&apos;énoncé. Une photo plus nette donne un
            meilleur résultat.
          </p>
        ) : null}
        <div className="pt-1">
          <CorrectionExportButtons text={correctionToPlainText(r)} />
        </div>
      </header>

      <section className="card-elevated space-y-5 p-5 sm:p-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-electric">1. Résultat</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-navy">{r.resultat || "—"}</p>
        </div>
        {r.etapes.length ? (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-electric">2. Étapes importantes</h2>
            <ol className="mt-2 list-decimal space-y-1.5 ps-5 text-sm leading-relaxed text-navy">
              {r.etapes.map((e, i) => (
                <li key={i} className="whitespace-pre-wrap">
                  {e}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
        {r.erreurs.length ? (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-electric">3. Erreurs détectées</h2>
            <ul className="mt-2 space-y-2">
              {r.erreurs.map((e, i) => (
                <li key={i} className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm">
                  <p className="font-semibold text-amber-950">{e.erreur}</p>
                  {e.explication ? (
                    <p className="mt-1 whitespace-pre-wrap text-amber-950/80">{e.explication}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {r.conseil ? (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-electric">4. Conseil</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-navy">{r.conseil}</p>
          </div>
        ) : null}
      </section>

      {quizzes.length ? (
        <section className="card-elevated space-y-3 p-5">
          <h2 className="text-lg font-bold text-navy">S&apos;entraîner sur cette notion</h2>
          <p className="text-sm text-muted-text">Quiz {matiere} de la bibliothèque CorrecteurPlus :</p>
          <ul className="grid gap-2 sm:grid-cols-3">
            {quizzes.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/quiz/${q.id}`}
                  className="block h-full rounded-xl border border-border-soft bg-white/70 px-4 py-3 text-sm transition hover:border-electric"
                >
                  <span className="font-semibold text-navy">{q.title}</span>
                  <span className="mt-1 block text-xs text-muted-text">
                    {q.niveau} · {q.chapitre}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <CorrectionAssistant
        correctionId={correction.id}
        hasErrors={r.erreurs.length > 0}
        readOnly={!isOwner}
        initialMessages={correction.messages.map((m) => ({
          id: m.id,
          role: m.role === "assistant" ? "assistant" : "user",
          action: m.action,
          content: m.content,
        }))}
      />
    </div>
  );
}
