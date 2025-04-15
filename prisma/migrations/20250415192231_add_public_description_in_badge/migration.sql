/*
  Warnings:

  - You are about to drop the column `description` on the `Badge` table. All the data in the column will be lost.
  - Added the required column `ownerDescription` to the `Badge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicDescription` to the `Badge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Badge" DROP COLUMN "description",
ADD COLUMN     "ownerDescription" TEXT NOT NULL,
ADD COLUMN     "publicDescription" TEXT NOT NULL;
