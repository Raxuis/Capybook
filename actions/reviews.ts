"use server";

import prisma from "@/utils/prisma";

export async function getReviews(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        prisma.bookReview.findMany({
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
        prisma.bookReview.count()
    ]);

    if (!reviews) {
        return {
            reviews: [],
            total: 0,
            totalPages: 0,
            currentPage: page
        };
    }

    // Format the reviews
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
