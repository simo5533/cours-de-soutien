-- Redefine Group: add matiere, unique (name, anneeScolaire, matiere)
PRAGMA foreign_keys=OFF;

CREATE TABLE "Group_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "anneeScolaire" TEXT NOT NULL,
    "matiere" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "Group_new" ("id", "name", "anneeScolaire", "matiere", "description", "createdAt", "updatedAt")
SELECT "id", "name", "anneeScolaire", '', "description", "createdAt", "updatedAt" FROM "Group";

DROP TABLE "Group";
ALTER TABLE "Group_new" RENAME TO "Group";

CREATE UNIQUE INDEX "Group_name_anneeScolaire_matiere_key" ON "Group"("name", "anneeScolaire", "matiere");

PRAGMA foreign_keys=ON;

-- ScheduleEntry.groupId
ALTER TABLE "ScheduleEntry" ADD COLUMN "groupId" TEXT;
CREATE INDEX "ScheduleEntry_groupId_idx" ON "ScheduleEntry"("groupId");
