/*
  Warnings:

  - You are about to drop the column `favouriteColor` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "favouriteColor",
ADD COLUMN     "favoriteColor" TEXT NOT NULL DEFAULT '#3b82f6';
