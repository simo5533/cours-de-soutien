-- CreateTable
CREATE TABLE "ProfesseurAffectation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "professeurId" TEXT NOT NULL,
    "matiere" TEXT NOT NULL,
    "groupe" TEXT NOT NULL,
    "anneeScolaire" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProfesseurAffectation_professeurId_fkey" FOREIGN KEY ("professeurId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ScheduleEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "niveau" TEXT,
    "matiere" TEXT,
    "room" TEXT,
    "professeurId" TEXT,
    "groupe" TEXT,
    "anneeScolaire" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScheduleEntry_professeurId_fkey" FOREIGN KEY ("professeurId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ScheduleEntry" ("createdAt", "endTime", "id", "matiere", "niveau", "room", "startTime", "title", "weekday") SELECT "createdAt", "endTime", "id", "matiere", "niveau", "room", "startTime", "title", "weekday" FROM "ScheduleEntry";
DROP TABLE "ScheduleEntry";
ALTER TABLE "new_ScheduleEntry" RENAME TO "ScheduleEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ProfesseurAffectation_professeurId_matiere_groupe_anneeScolaire_key" ON "ProfesseurAffectation"("professeurId", "matiere", "groupe", "anneeScolaire");
