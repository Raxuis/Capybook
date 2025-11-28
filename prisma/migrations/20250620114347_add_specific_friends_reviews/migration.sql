/*
  Warnings:

  - A unique constraint covering the columns `[privateLink]` on the table `BookReview` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "Privacy" ADD VALUE 'SPECIFIC_FRIEND';

-- AlterTable
ALTER TABLE "BookReview" ADD COLUMN     "privateLink" TEXT,
ADD COLUMN     "specificFriendId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BookReview_privateLink_key" ON "BookReview"("privateLink");

-- AddForeignKey
ALTER TABLE "BookReview" ADD CONSTRAINT "BookReview_specificFriendId_fkey" FOREIGN KEY ("specificFriendId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
