-- Lemon Squeezy : lien commande ↔ inscription en attente

ALTER TABLE "EleveRegistrationPending" ADD COLUMN "lemonSqueezyOrderId" TEXT;

CREATE UNIQUE INDEX "EleveRegistrationPending_lemonSqueezyOrderId_key" ON "EleveRegistrationPending"("lemonSqueezyOrderId");
