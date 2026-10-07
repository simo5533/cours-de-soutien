import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardTopBar } from "@/components/dashboard-top-bar";
import { prisma } from "@/lib/prisma";

const baseNav = [
  { href: "/eleve", label: "Tableau de bord" },
  { href: "/eleve/correcteur", label: "Corriger un exercice" },
  { href: "/eleve/historique", label: "Historique" },
  { href: "/eleve/points-a-ameliorer", label: "Points à améliorer" },
  { href: "/quiz", label: "Quiz & entraînement" },
  { href: "/eleve/exercices", label: "Exercices assignés" },
];

export default async function EleveLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const inCentre = session?.user?.id
    ? !!(await prisma.centreMember.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      }))
    : false;

  const nav = inCentre ? [...baseNav, { href: "/eleve/centre", label: "Mon centre" }] : baseNav;

  return (
    <div className="flex min-h-full flex-col">
      <DashboardTopBar label="Mon espace" accent="teal" />
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <DashboardShell
          title="Mon espace"
          subtitle="Corriger, comprendre, s'entraîner."
          nav={nav}
          accent="teal"
        >
          {children}
        </DashboardShell>
      </div>
    </div>
  );
}
