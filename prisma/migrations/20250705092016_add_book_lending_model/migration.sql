-- CreateEnum
CREATE TYPE "LendingStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'RETURNED', 'OVERDUE', 'CANCELLED');

-- AlterEnum
ALTER TYPE "BadgeCategory" ADD VALUE 'LENDING';

-- CreateTable
CREATE TABLE "BookLending" (
    "id" TEXT NOT NULL,
    "lenderId" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "status" "LendingStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "returnedAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookLending_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookLending_lenderId_status_idx" ON "BookLending"("lenderId", "status");

-- CreateIndex
CREATE INDEX "BookLending_borrowerId_status_idx" ON "BookLending"("borrowerId", "status");

-- CreateIndex
CREATE INDEX "BookLending_bookId_status_idx" ON "BookLending"("bookId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "BookLending_borrowerId_bookId_status_key" ON "BookLending"("borrowerId", "bookId", "status");

-- AddForeignKey
ALTER TABLE "BookLending" ADD CONSTRAINT "BookLending_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLending" ADD CONSTRAINT "BookLending_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLending" ADD CONSTRAINT "BookLending_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
