-- DropForeignKey
ALTER TABLE "UserBook" DROP CONSTRAINT "UserBook_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserBook" ADD CONSTRAINT "UserBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
