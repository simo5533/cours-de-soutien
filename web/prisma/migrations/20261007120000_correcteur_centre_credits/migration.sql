-- Migration additive uniquement : aucune suppression de table, colonne ou donnée.

-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "accountType" TEXT;

ALTER TABLE "EleveRegistrationPending" ADD COLUMN IF NOT EXISTS "accountType" TEXT;
ALTER TABLE "EleveRegistrationPending" ADD COLUMN IF NOT EXISTS "centreName" TEXT;

ALTER TABLE "AiUsage" ADD COLUMN IF NOT EXISTS "centreId" TEXT;
ALTER TABLE "AiUsage" ADD COLUMN IF NOT EXISTS "actionType" TEXT;
ALTER TABLE "AiUsage" ADD COLUMN IF NOT EXISTS "creditsConsumed" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "AiUsage" ADD COLUMN IF NOT EXISTS "correctionId" TEXT;
ALTER TABLE "AiUsage" ADD COLUMN IF NOT EXISTS "durationMs" INTEGER;

CREATE INDEX IF NOT EXISTS "AiUsage_centreId_createdAt_idx" ON "AiUsage"("centreId", "createdAt");

-- CreateTable
CREATE TABLE IF NOT EXISTS "Centre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "seatLimit" INTEGER,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'active',
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "creditsUsedInPeriod" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Centre_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Centre_ownerId_idx" ON "Centre"("ownerId");

CREATE TABLE IF NOT EXISTS "CentreMember" (
    "id" TEXT NOT NULL,
    "centreId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CentreMember_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CentreMember_userId_key" ON "CentreMember"("userId");
CREATE INDEX IF NOT EXISTS "CentreMember_centreId_idx" ON "CentreMember"("centreId");

CREATE TABLE IF NOT EXISTS "Correction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "centreId" TEXT,
    "sourceType" TEXT NOT NULL,
    "fileName" TEXT,
    "fileHash" TEXT NOT NULL,
    "pages" INTEGER NOT NULL,
    "creditsUsed" INTEGER NOT NULL,
    "subject" TEXT,
    "notion" TEXT,
    "title" TEXT,
    "sourceText" TEXT,
    "resultJson" TEXT NOT NULL,
    "errorsJson" TEXT,
    "model" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Correction_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Correction_userId_createdAt_idx" ON "Correction"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Correction_userId_fileHash_idx" ON "Correction"("userId", "fileHash");
CREATE INDEX IF NOT EXISTS "Correction_centreId_createdAt_idx" ON "Correction"("centreId", "createdAt");

CREATE TABLE IF NOT EXISTS "CorrectionMessage" (
    "id" TEXT NOT NULL,
    "correctionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "action" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CorrectionMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "CorrectionMessage_correctionId_createdAt_idx" ON "CorrectionMessage"("correctionId", "createdAt");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "Centre" ADD CONSTRAINT "Centre_ownerId_fkey"
    FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "CentreMember" ADD CONSTRAINT "CentreMember_centreId_fkey"
    FOREIGN KEY ("centreId") REFERENCES "Centre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "CentreMember" ADD CONSTRAINT "CentreMember_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Correction" ADD CONSTRAINT "Correction_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "CorrectionMessage" ADD CONSTRAINT "CorrectionMessage_correctionId_fkey"
    FOREIGN KEY ("correctionId") REFERENCES "Correction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
