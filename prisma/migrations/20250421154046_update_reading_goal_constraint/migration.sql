/*
  Warnings:

  - A unique constraint covering the columns `[userId,deadline,type]` on the table `ReadingGoal` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ReadingGoal_userId_deadline_key";

-- CreateIndex
CREATE UNIQUE INDEX "ReadingGoal_userId_deadline_type_key" ON "ReadingGoal"("userId", "deadline", "type");
