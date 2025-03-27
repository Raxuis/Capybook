/*
  Warnings:

  - A unique constraint covering the columns `[userId,bookId]` on the table `UserBook` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ReadingGoal" ADD COLUMN     "completedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "UserBook_userId_bookId_key" ON "UserBook"("userId", "bookId");
