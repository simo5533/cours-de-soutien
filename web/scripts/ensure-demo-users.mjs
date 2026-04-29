/**
 * Si la table User est vide (Neon après migrate), crée les comptes démo.
 * Version .mjs pour Vercel — pas besoin de tsx pendant `npm run build`.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function hash(password) {
  return bcrypt.hashSync(password, 10);
}

async function main() {
  const count = await prisma.user.count();
  if (count > 0) {
    console.log("[ensure-demo-users] Base déjà peuplée — aucun compte ajouté.");
    return;
  }

  console.log("[ensure-demo-users] Aucun utilisateur — création des comptes démo…");

  await prisma.user.upsert({
    where: { email: "admin@demo.fr" },
    update: {},
    create: {
      email: "admin@demo.fr",
      name: "Administrateur",
      passwordHash: hash("admin123"),
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "prof@demo.fr" },
    update: {},
    create: {
      email: "prof@demo.fr",
      name: "Marie Dupont",
      passwordHash: hash("prof123"),
      role: "PROFESSEUR",
    },
  });

  const demoSubjects = [
    { name: "Mathématiques", priceDh: 50 },
    { name: "Français", priceDh: 30 },
  ];
  const demoTotal = demoSubjects.reduce((s, l) => s + l.priceDh, 0);

  await prisma.user.upsert({
    where: { email: "eleve@demo.fr" },
    update: {
      groupe: "4ème A",
      anneeScolaire: "2025-2026",
      enrollmentLanguageCount: 2,
      enrollmentSubjectsJson: JSON.stringify(demoSubjects),
      enrollmentTotal: demoTotal,
      enrolledAt: new Date("2025-09-01T12:00:00"),
    },
    create: {
      email: "eleve@demo.fr",
      name: "Luc Martin",
      passwordHash: hash("eleve123"),
      role: "ELEVE",
      groupe: "4ème A",
      anneeScolaire: "2025-2026",
      enrollmentLanguageCount: 2,
      enrollmentSubjectsJson: JSON.stringify(demoSubjects),
      enrollmentTotal: demoTotal,
      enrolledAt: new Date("2025-09-01T12:00:00"),
    },
  });

  console.log("[ensure-demo-users] OK : admin@demo.fr, prof@demo.fr, eleve@demo.fr.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
