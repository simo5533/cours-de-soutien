-- AlterTable
ALTER TABLE "User" ADD COLUMN "enrollmentLanguageCount" INTEGER;
ALTER TABLE "User" ADD COLUMN "enrollmentSubjectsJson" TEXT;
ALTER TABLE "User" ADD COLUMN "enrollmentTotal" REAL;
ALTER TABLE "User" ADD COLUMN "enrolledAt" DATETIME;
