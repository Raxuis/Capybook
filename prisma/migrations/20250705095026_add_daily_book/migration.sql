-- CreateTable
CREATE TABLE "DailyBook" (
    "id" TEXT NOT NULL,
    "bookKey" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyBookView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookKey" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATE NOT NULL,
    "bookId" TEXT,

    CONSTRAINT "DailyBookView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyBook_date_isActive_idx" ON "DailyBook"("date", "isActive");

-- CreateIndex
CREATE INDEX "DailyBook_bookKey_idx" ON "DailyBook"("bookKey");

-- CreateIndex
CREATE UNIQUE INDEX "DailyBook_date_key" ON "DailyBook"("date");

-- CreateIndex
CREATE INDEX "DailyBookView_userId_viewedAt_idx" ON "DailyBookView"("userId", "viewedAt");

-- CreateIndex
CREATE INDEX "DailyBookView_date_idx" ON "DailyBookView"("date");

-- CreateIndex
CREATE INDEX "DailyBookView_bookKey_idx" ON "DailyBookView"("bookKey");

-- CreateIndex
CREATE UNIQUE INDEX "DailyBookView_userId_bookKey_date_key" ON "DailyBookView"("userId", "bookKey", "date");

-- AddForeignKey
ALTER TABLE "DailyBookView" ADD CONSTRAINT "DailyBookView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyBookView" ADD CONSTRAINT "DailyBookView_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;
