import prisma from "@/lib/db/prisma";
import { auth } from "@/auth";

/**
 * Review service - handles review-related business logic
 */

export interface ReviewFilters {
  page?: number;
  limit?: number;
  type?: "public" | "friends";
}

export interface ReviewResult {
  reviews: Array<{
    id: string;
    rating: number;
    feedback: string | null;
    privacy: string;
    createdAt: Date;
    User: {
      username: string;
      image: string | null;
      favoriteColor: string | null;
    };
    Book: {
      title: string;
      cover: string | null;
    };
  }>;
  total: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Get reviews with pagination and filtering
 */
export async function getReviews(filters: ReviewFilters = {}): Promise<ReviewResult> {
  const { page = 1, limit = 10, type = "public" } = filters;
  const skip = (page - 1) * limit;
  const session = await auth();
  const currentUserId = session?.user?.id;

  let whereCondition = {};

  if (type === "public") {
    whereCondition = {
      privacy: "PUBLIC"
    };
  } else if (type === "friends") {
    if (!currentUserId) {
      return {
        reviews: [],
        total: 0,
        totalPages: 0,
        currentPage: page
      };
    }

    const userFollows = await prisma.follow.findMany({
      where: {
        followerId: currentUserId
      },
      select: {
        followingId: true
      }
    });

    const userFollowers = await prisma.follow.findMany({
      where: {
        followingId: currentUserId
      },
      select: {
        followerId: true
      }
    });

    const followingIds = userFollows.map(f => f.followingId);
    const followerIds = userFollowers.map(f => f.followerId);
    const friendIds = followingIds.filter(id => followerIds.includes(id));

    whereCondition = {
      OR: [
        {
          userId: { in: friendIds },
          privacy: "PUBLIC"
        },
        {
          privacy: "FRIENDS",
          userId: { in: friendIds }
        },
        {
          privacy: "SPECIFIC_FRIEND",
          specificFriendId: currentUserId
        }
      ]
    };
  }

  const [reviews, total] = await Promise.all([
    prisma.bookReview.findMany({
      where: whereCondition,
      include: {
        User: {
          select: {
            username: true,
            image: true,
            favoriteColor: true
          },
        },
        Book: {
          select: {
            title: true,
            cover: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit,
    }),
    prisma.bookReview.count({
      where: whereCondition
    })
  ]);

  if (!reviews) {
    return {
      reviews: [],
      total: 0,
      totalPages: 0,
      currentPage: page
    };
  }

  const formattedReviews = reviews.map(review => ({
    ...review,
    User: {
      ...review.User,
      username: review.User.username || "Unknown User"
    },
    Book: {
      ...review.Book,
      title: review.Book.title || "Unknown Book",
      cover: review.Book.cover || "https://via.placeholder.com/150"
    }
  }));

  return {
    reviews: formattedReviews,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  };
}

/**
 * Get review counts by type
 */
export async function getReviewsCounts(): Promise<{ publicCount: number; friendsCount: number }> {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const publicCount = await prisma.bookReview.count({
    where: {
      privacy: "PUBLIC"
    }
  });

  let friendsCount = 0;

  if (currentUserId) {
    const userFollows = await prisma.follow.findMany({
      where: {
        followerId: currentUserId
      },
      select: {
        followingId: true
      }
    });

    const userFollowers = await prisma.follow.findMany({
      where: {
        followingId: currentUserId
      },
      select: {
        followerId: true
      }
    });

    const followingIds = userFollows.map(f => f.followingId);
    const followerIds = userFollowers.map(f => f.followerId);
    const friendIds = followingIds.filter(id => followerIds.includes(id));

    friendsCount = await prisma.bookReview.count({
      where: {
        OR: [
          {
            userId: { in: friendIds },
            privacy: "PUBLIC"
          },
          {
            privacy: "FRIENDS",
            userId: { in: friendIds }
          },
          {
            privacy: "SPECIFIC_FRIEND",
            specificFriendId: currentUserId
          }
        ]
      }
    });
  }

  return {
    publicCount,
    friendsCount
  };
}
