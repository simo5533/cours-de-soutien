-- AlterTable
ALTER TABLE "EleveRegistrationPending" ADD COLUMN "paddleTransactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "EleveRegistrationPending_paddleTransactionId_key" ON "EleveRegistrationPending"("paddleTransactionId");
