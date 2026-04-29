-- CreateTable
CREATE TABLE "EleveRegistrationPending" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "groupe" TEXT NOT NULL,
    "anneeScolaire" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consumedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "EleveRegistrationPending_stripeSessionId_key" ON "EleveRegistrationPending"("stripeSessionId");

-- CreateIndex
CREATE INDEX "EleveRegistrationPending_email_idx" ON "EleveRegistrationPending"("email");
