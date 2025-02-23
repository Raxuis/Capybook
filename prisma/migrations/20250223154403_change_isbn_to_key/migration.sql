/*
  Warnings:

  - You are about to drop the column `isbn` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Book_isbn_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "isbn",
DROP COLUMN "title",
ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Book_key_key" ON "Book"("key");
