-- Demande publique cours en ligne + champs invité sur réservation

CREATE TYPE "CoursEnLigneDemandeStatus" AS ENUM ('EN_ATTENTE_ADMIN', 'VALIDEE', 'REFUSEE');

CREATE TABLE "CoursEnLigneDemande" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "langue" TEXT NOT NULL,
    "matiere" TEXT,
    "preferredDate" DATE NOT NULL,
    "preferredTime" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 60,
    "message" TEXT,
    "status" "CoursEnLigneDemandeStatus" NOT NULL DEFAULT 'EN_ATTENTE_ADMIN',
    "adminNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "assignedTeacherId" TEXT,
    "bookingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoursEnLigneDemande_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "OnlineLessonBooking" ALTER COLUMN "studentId" DROP NOT NULL;

ALTER TABLE "OnlineLessonBooking" ADD COLUMN "guestName" TEXT;
ALTER TABLE "OnlineLessonBooking" ADD COLUMN "guestEmail" TEXT;
ALTER TABLE "OnlineLessonBooking" ADD COLUMN "guestPhone" TEXT;
ALTER TABLE "OnlineLessonBooking" ADD COLUMN "langue" TEXT;

ALTER TABLE "OnlineLessonBooking" ALTER COLUMN "status" SET DEFAULT 'CONFIRME';

CREATE UNIQUE INDEX "CoursEnLigneDemande_bookingId_key" ON "CoursEnLigneDemande"("bookingId");
CREATE INDEX "CoursEnLigneDemande_status_createdAt_idx" ON "CoursEnLigneDemande"("status", "createdAt");
CREATE INDEX "CoursEnLigneDemande_email_idx" ON "CoursEnLigneDemande"("email");
CREATE INDEX "OnlineLessonBooking_guestEmail_idx" ON "OnlineLessonBooking"("guestEmail");

ALTER TABLE "CoursEnLigneDemande" ADD CONSTRAINT "CoursEnLigneDemande_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CoursEnLigneDemande" ADD CONSTRAINT "CoursEnLigneDemande_assignedTeacherId_fkey" FOREIGN KEY ("assignedTeacherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CoursEnLigneDemande" ADD CONSTRAINT "CoursEnLigneDemande_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "OnlineLessonBooking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
