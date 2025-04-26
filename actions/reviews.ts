import prisma from "@/utils/prisma";

export async function getReviews() {
    const reviews = await prisma.bookReview.findMany({
        include: {
            User: {
                select: {id: true, username: true, image: true, favoriteColor: true},
            },
            Book: {
                select: {key: true, title: true, cover: true}
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 10,
    })
    if (!reviews) {
        return [];
    }
    // Format the reviews to include the username and book title
    reviews.forEach((review) => {
        review.User.username = review.User.username || "Unknown User";
        review.Book.title = review.Book.title || "Unknown Book";
        review.Book.cover = review.Book.cover || "https://via.placeholder.com/150";
    });
    return reviews;
}