-- CreateEnum
CREATE TYPE "OnlineLessonStatus" AS ENUM ('EN_ATTENTE', 'CONFIRME', 'REFUSE', 'ANNULE', 'TERMINE', 'ABSENT');

-- CreateEnum
CREATE TYPE "OnlineLessonPaymentStatus" AS ENUM ('NON_REQUIS', 'EN_ATTENTE', 'PAYE', 'REMBOURSE');

-- CreateTable
CREATE TABLE "ProfOnlineAvailability" (
    "id" TEXT NOT NULL,
    "professeurId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "matiere" TEXT,
    "slotMinutes" INTEGER NOT NULL DEFAULT 60,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfOnlineAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfBlockedDate" (
    "id" TEXT NOT NULL,
    "professeurId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfBlockedDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnlineLessonBooking" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "matiere" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "status" "OnlineLessonStatus" NOT NULL DEFAULT 'EN_ATTENTE',
    "paymentStatus" "OnlineLessonPaymentStatus" NOT NULL DEFAULT 'EN_ATTENTE',
    "meetingRoomId" TEXT NOT NULL,
    "studentComment" TEXT,
    "teacherNotes" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnlineLessonBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfOnlineAvailability_professeurId_weekday_idx" ON "ProfOnlineAvailability"("professeurId", "weekday");

-- CreateIndex
CREATE UNIQUE INDEX "ProfBlockedDate_professeurId_date_key" ON "ProfBlockedDate"("professeurId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "OnlineLessonBooking_meetingRoomId_key" ON "OnlineLessonBooking"("meetingRoomId");

-- CreateIndex
CREATE INDEX "OnlineLessonBooking_studentId_startsAt_idx" ON "OnlineLessonBooking"("studentId", "startsAt");

-- CreateIndex
CREATE INDEX "OnlineLessonBooking_teacherId_startsAt_idx" ON "OnlineLessonBooking"("teacherId", "startsAt");

-- AddForeignKey
ALTER TABLE "ProfOnlineAvailability" ADD CONSTRAINT "ProfOnlineAvailability_professeurId_fkey" FOREIGN KEY ("professeurId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfBlockedDate" ADD CONSTRAINT "ProfBlockedDate_professeurId_fkey" FOREIGN KEY ("professeurId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlineLessonBooking" ADD CONSTRAINT "OnlineLessonBooking_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlineLessonBooking" ADD CONSTRAINT "OnlineLessonBooking_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
