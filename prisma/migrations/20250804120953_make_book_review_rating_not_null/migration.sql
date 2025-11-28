/*
  Warnings:

  - Made the column `rating` on table `BookReview` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BookReview" ALTER COLUMN "rating" SET NOT NULL;
