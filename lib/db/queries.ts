import prisma from './prisma';

/**
 * Common database query helpers
 */

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Check if user has reviewed a book
 */
export async function checkUserHasReviewedBook(userId: string, bookId: string): Promise<boolean> {
  const review = await prisma.bookReview.findFirst({
    where: {
      userId,
      bookId,
    },
  });
  return Boolean(review);
}
