/*
  Warnings:

  - You are about to drop the column `review` on the `BookReview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookReview" DROP COLUMN "review",
ADD COLUMN     "feedback" TEXT;
