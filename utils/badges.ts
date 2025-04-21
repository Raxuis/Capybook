"use server";

import prisma from "@/utils/prisma";

// Fonction d'aide pour vérifier et attribuer les badges
export async function checkAndAssignBadges(userId: string) {
    const user = await prisma.user.findUnique({
        where: {id: userId},
        include: {
            UserBook: {
                include: {Book: true}
            },
            ReadingGoal: true,
            BookReview: true,
            UserBadge: true
        }
    });

    if (!user) return [];

    const allBadges = await prisma.badge.findMany();
    const userBadgeIds = user.UserBadge.map(ub => ub.badgeId);

    const booksReadCount = user.UserBook.filter(ub => ub.finishedAt !== null).length;
    const pagesReadCount = user.UserBook.filter(ub => ub.finishedAt !== null)
        .reduce((total, ub) => total + (ub.Book.numberOfPages || 0), 0);
    const goalsCompletedCount = user.ReadingGoal.filter(rg => rg.completedAt !== null).length;
    const reviewsWrittenCount = user.BookReview.length;

    const badgesToAssign: { userId: string, badgeId: string }[] = [];
    const newlyAwardedBadges: typeof allBadges = [];

    for (const badge of allBadges) {
        if (userBadgeIds.includes(badge.id)) continue;

        let qualifies = false;

        switch (badge.category) {
            case "BOOKS_READ":
                qualifies = booksReadCount >= badge.requirement;
                break;
            case "PAGES_READ":
                qualifies = pagesReadCount >= badge.requirement;
                break;
            case "GOALS_COMPLETED":
                qualifies = goalsCompletedCount >= badge.requirement;
                break;
            case "REVIEWS_WRITTEN":
                qualifies = reviewsWrittenCount >= badge.requirement;
                break;
        }

        if (qualifies) {
            badgesToAssign.push({userId, badgeId: badge.id});
            newlyAwardedBadges.push(badge);
        }
    }

    if (badgesToAssign.length > 0) {
        await prisma.userBadge.createMany({
            data: badgesToAssign,
            skipDuplicates: true,
        });
    }

    return newlyAwardedBadges;
}