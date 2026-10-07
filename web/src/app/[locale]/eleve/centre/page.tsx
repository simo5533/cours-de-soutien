import type { Metadata } from "next";
import { auth } from "@/auth";
import { removeCentreMemberAction, renameCentreAction } from "@/actions/centre";
import { AiQuotaMeter } from "@/components/ai-quota-meter";
import { CentreAddMemberForm } from "@/components/centre-add-member-form";
import { Link } from "@/i18n/navigation";
import { ensureSubscriptionPeriod } from "@/lib/ai/quota";
import { PLANS } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Mon centre" };
export const dynamic = "force-dynamic";

export default async function CentrePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ELEVE") redirect("/connexion");
  const userId = session.user.id;

  const membership = await prisma.centreMember.findUnique({
    where: { userId },
    include: { centre: true },
  });

  if (!membership) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-navy">Mode Centre</h1>
        <div className="card-elevated space-y-3 p-6 text-sm text-muted-text">
          <p>
            Votre compte ne fait partie d&apos;aucun centre. L&apos;offre Centre permet à plusieurs professeurs
            d&apos;utiliser un quota d&apos;analyses partagé, avec gestion des membres et suivi de la consommation.
          </p>
          <Link href="/tarifs" className="btn-primary inline-flex !py-2.5">
            Découvrir l&apos;offre Centre
          </Link>
        </div>
      </div>
    );
  }

  const centre = membership.centre;
  const isOwner = membership.role === "OWNER";
  const quota = await ensureSubscriptionPeriod(userId);
  const seats = centre.seatLimit ?? PLANS.CENTRE.seats;

  const [members, usageByUser, recent] = await Promise.all([
    prisma.centreMember.findMany({
      where: { centreId: centre.id },
      orderBy: [{ role: "desc" }, { createdAt: "asc" }],
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    isOwner
      ? prisma.aiUsage.groupBy({
          by: ["userId"],
          where: {
            centreId: centre.id,
            status: "SUCCESS",
            ...(quota.periodStart ? { createdAt: { gte: quota.periodStart } } : {}),
          },
          _sum: { creditsConsumed: true },
        })
      : Promise.resolve([]),
    isOwner
      ? prisma.correction.findMany({
          where: { centreId: centre.id },
          orderBy: { createdAt: "desc" },
          take: 30,
          select: {
            id: true,
            title: true,
            subject: true,
            createdAt: true,
            user: { select: { name: true } },
          },
        })
      : Promise.resolve([]),
  ]);

  const creditsByUser = new Map(usageByUser.map((u) => [u.userId, u._sum.creditsConsumed ?? 0]));

  return (
    <div className="space-y-6">
      <div>
        <p className="brand-section-title">Mode Centre</p>
        <h1 className="font-display text-2xl font-bold text-navy">{centre.name}</h1>
        <p className="mt-1 text-sm text-muted-text">
          {members.length} / {seats} comptes · {isOwner ? "Vous êtes responsable du centre" : "Membre"}
        </p>
      </div>

      <AiQuotaMeter quota={quota} />

      {isOwner ? (
        <>
          <section className="card-elevated space-y-4 p-5">
            <h2 className="text-lg font-bold text-navy">Membres</h2>
            <ul className="divide-y divide-border-soft">
              {members.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-semibold text-navy">
                      {m.user.name}
                      {m.role === "OWNER" ? (
                        <span className="ms-2 rounded-full bg-electric/10 px-2 py-0.5 text-xs text-electric">
                          Responsable
                        </span>
                      ) : null}
                    </p>
                    <p className="truncate text-xs text-muted-text">{m.user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-text">
                      {creditsByUser.get(m.user.id) ?? 0} crédits ce cycle
                    </span>
                    {m.role !== "OWNER" ? (
                      <form action={removeCentreMemberAction}>
                        <input type="hidden" name="memberId" value={m.id} />
                        <button type="submit" className="text-xs font-semibold text-red-700 hover:underline">
                          Retirer
                        </button>
                      </form>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="card-elevated space-y-3 p-5">
            <h2 className="text-lg font-bold text-navy">Ajouter un professeur</h2>
            {members.length >= seats ? (
              <p className="text-sm text-muted-text">
                Tous les comptes du centre sont utilisés. Retirez un membre pour en ajouter un autre.
              </p>
            ) : null}
            <CentreAddMemberForm disabled={members.length >= seats} />
          </section>

          <section className="card-elevated space-y-3 p-5">
            <h2 className="text-lg font-bold text-navy">Dernières corrections de l&apos;équipe</h2>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-text">Aucune correction pour le moment.</p>
            ) : (
              <ul className="space-y-2">
                {recent.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/eleve/historique/${c.id}`}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border-soft bg-white/70 px-4 py-2.5 text-sm transition hover:border-electric"
                    >
                      <span className="truncate font-medium text-navy">{c.title || "Correction"}</span>
                      <span className="text-xs text-muted-text">
                        {c.user.name}
                        {c.subject ? ` · ${c.subject}` : ""} · {c.createdAt.toLocaleDateString("fr-FR")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card-elevated space-y-3 p-5">
            <h2 className="text-sm font-semibold text-navy">Nom du centre</h2>
            <form action={renameCentreAction} className="flex flex-col gap-2 sm:flex-row">
              <input name="name" defaultValue={centre.name} minLength={2} maxLength={120} className="input-field flex-1" />
              <button type="submit" className="btn-secondary !py-2.5">
                Renommer
              </button>
            </form>
          </section>
        </>
      ) : (
        <p className="text-sm text-muted-text">
          Vos analyses utilisent le quota partagé du centre. Le responsable du centre peut consulter les
          corrections réalisées avec ce quota.
        </p>
      )}
    </div>
  );
}
