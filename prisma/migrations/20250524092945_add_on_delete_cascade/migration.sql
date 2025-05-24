-- DropForeignKey
ALTER TABLE "BookGenre" DROP CONSTRAINT "BookGenre_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookGenre" DROP CONSTRAINT "BookGenre_genreId_fkey";

-- DropForeignKey
ALTER TABLE "BookReview" DROP CONSTRAINT "BookReview_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookReview" DROP CONSTRAINT "BookReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingDay" DROP CONSTRAINT "ReadingDay_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingGoal" DROP CONSTRAINT "ReadingGoal_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingProgress" DROP CONSTRAINT "ReadingProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserBook" DROP CONSTRAINT "UserBook_bookId_fkey";

-- DropForeignKey
ALTER TABLE "UserBookWishlist" DROP CONSTRAINT "UserBookWishlist_bookId_fkey";

-- DropForeignKey
ALTER TABLE "UserBookWishlist" DROP CONSTRAINT "UserBookWishlist_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserBook" ADD CONSTRAINT "UserBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookWishlist" ADD CONSTRAINT "UserBookWishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookWishlist" ADD CONSTRAINT "UserBookWishlist_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookReview" ADD CONSTRAINT "BookReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookReview" ADD CONSTRAINT "BookReview_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingGoal" ADD CONSTRAINT "ReadingGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingProgress" ADD CONSTRAINT "ReadingProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingDay" ADD CONSTRAINT "ReadingDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGenre" ADD CONSTRAINT "BookGenre_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGenre" ADD CONSTRAINT "BookGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
