/*
  Warnings:

  - You are about to drop the column `bookId` on the `DailyBookView` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DailyBookView" DROP CONSTRAINT "DailyBookView_bookId_fkey";

-- AlterTable
ALTER TABLE "DailyBookView" DROP COLUMN "bookId";
