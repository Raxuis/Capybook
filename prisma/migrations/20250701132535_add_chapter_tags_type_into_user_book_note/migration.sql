-- CreateEnum
CREATE TYPE "BookNoteType" AS ENUM ('NOTE', 'QUOTE', 'SUMMARY', 'THOUGHT');

-- AlterTable
ALTER TABLE "UserBookNotes" ADD COLUMN     "chapter" INTEGER,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "type" "BookNoteType" NOT NULL DEFAULT 'NOTE';
