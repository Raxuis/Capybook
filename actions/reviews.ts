"use server";

import prisma from "@/utils/prisma";
import { auth } from "@/auth";

export async function getReviews(page: number = 1, limit: number = 10, type: "public" | "friends" = "public") {
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

export async function getReviewsCounts() {
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

export async function getReview(reviewId: string) {
  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!reviewId) {
    return null;
  }

  const review = await prisma.bookReview.findUnique({
    where: { id: reviewId },
    include: {
      User: {
        select: {
          username: true,
          image: true,
          favoriteColor: true,
        },
      },
      Book: {
        select: {
          title: true,
          cover: true,
        },
      },
    },
  });

  if (!review) {
    return null;
  }

  let isAuthorized = false;

  if (review.privacy === "PUBLIC") {
    isAuthorized = true;
  } else if (currentUserId) {
    if (review.userId === currentUserId) {
      isAuthorized = true;
    } else if (review.privacy === "SPECIFIC_FRIEND" && review.specificFriendId === currentUserId) {
      isAuthorized = true;
    } else if (review.privacy === "FRIENDS") {
      const isFollowing = await prisma.follow.count({
        where: {
          followerId: currentUserId,
          followingId: review.userId,
        },
      });

      const isFollowedBy = await prisma.follow.count({
        where: {
          followerId: review.userId,
          followingId: currentUserId,
        },
      });

      if (isFollowing > 0 && isFollowedBy > 0) {
        isAuthorized = true;
      }
    }
  }

  if (!isAuthorized) {
    return null;
  }

  return {
    ...review,
    User: {
      ...review.User,
      username: review.User.username || "Unknown User",
    },
    Book: {
      ...review.Book,
      title: review.Book.title || "Unknown Book",
      cover: review.Book.cover || "https://via.placeholder.com/150",
    },
  };
}
