import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { AiQuotaMeter } from "@/components/ai-quota-meter";
import { DashboardActionCard, DashboardHero } from "@/components/dashboard-overview";
import { ensureSubscriptionPeriod } from "@/lib/ai/quota";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const icons = {
  camera: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  clipboard: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ),
  chart: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  star: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  ),
};

export default async function EleveDashboardPage() {
  const session = await auth();
  const userId = session!.user.id;
  const [quota, correctionCount, user] = await Promise.all([
    ensureSubscriptionPeriod(userId),
    prisma.correction.count({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ]);

  return (
    <div className="space-y-8">
      <DashboardHero accent="teal" eyebrow="Tableau de bord" title={`Bonjour ${user?.name ?? ""}`.trim()}>
        <p>
          {correctionCount === 0
            ? "Prenez en photo un exercice ou envoyez un PDF pour obtenir votre première correction."
            : `${correctionCount} correction${correctionCount > 1 ? "s" : ""} enregistrée${correctionCount > 1 ? "s" : ""}.`}
        </p>
        <Link href="/eleve/correcteur" className="btn-primary mt-4 inline-flex !py-2.5">
          Corriger un exercice
        </Link>
      </DashboardHero>

      <AiQuotaMeter quota={quota} />

      <section>
        <h3 className="brand-section-title mb-4">Accès rapides</h3>
        <ul className="grid gap-4 sm:grid-cols-2">
          <li>
            <DashboardActionCard
              accent="teal"
              href="/eleve/correcteur"
              title="Corriger un exercice"
              description="Photo ou PDF, toutes matières."
              icon={icons.camera}
            />
          </li>
          <li>
            <DashboardActionCard
              accent="teal"
              href="/eleve/historique"
              title="Historique"
              description="Retrouvez vos corrections, sans recalcul."
              icon={icons.clipboard}
            />
          </li>
          <li>
            <DashboardActionCard
              accent="teal"
              href="/eleve/points-a-ameliorer"
              title="Points à améliorer"
              description="Vos erreurs regroupées par matière et notion."
              icon={icons.chart}
            />
          </li>
          <li>
            <DashboardActionCard
              accent="teal"
              href="/quiz"
              title="Quiz & entraînement"
              description="Bibliothèque de quiz par matière et niveau."
              icon={icons.star}
            />
          </li>
        </ul>
      </section>
    </div>
  );
}
