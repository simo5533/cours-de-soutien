-- AlterTable
ALTER TABLE "Course" ADD COLUMN "anneeScolaireCible" TEXT;
ALTER TABLE "Course" ADD COLUMN "groupeCible" TEXT;

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN "anneeScolaireCible" TEXT;
ALTER TABLE "Exercise" ADD COLUMN "groupeCible" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "anneeScolaire" TEXT;
ALTER TABLE "User" ADD COLUMN "groupe" TEXT;
