-- Compte élève différé : téléphone obligatoire + hash mot de passe en attente

ALTER TABLE "CoursEnLigneDemande" ADD COLUMN "pendingPasswordHash" TEXT;

UPDATE "CoursEnLigneDemande" SET "phone" = '' WHERE "phone" IS NULL;
ALTER TABLE "CoursEnLigneDemande" ALTER COLUMN "phone" SET NOT NULL;
