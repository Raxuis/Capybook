/*
  Warnings:

  - A unique constraint covering the columns `[readingDayId]` on the table `ReadingProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `readingDayId` to the `ReadingProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReadingProgress" ADD COLUMN     "readingDayId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ReadingProgress_readingDayId_key" ON "ReadingProgress"("readingDayId");

-- AddForeignKey
ALTER TABLE "ReadingProgress" ADD CONSTRAINT "ReadingProgress_readingDayId_fkey" FOREIGN KEY ("readingDayId") REFERENCES "ReadingDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
