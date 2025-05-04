"use server";

import prisma from "@/utils/prisma";
import {currentUser} from "@/actions/auth/current-user";

export async function getReadingProgress() {
    const user = await currentUser();
    if (!user) return [];

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const progress = await prisma.readingProgress.findMany({
        where: {
            userId: user.id,
            date: {
                gte: last30Days
            }
        },
        orderBy: {
            date: 'asc'
        }
    });

    return progress.map(p => ({
        date: p.date.toISOString().split('T')[0],
        pages: p.pagesRead,
        books: p.booksCompleted
    }));
}

export async function getGenreAnalysis() {
    const user = await currentUser();
    if (!user) return [];

    const userBooks = await prisma.userBook.findMany({
        where: {
            userId: user.id,
            finishedAt: {not: null}
        },
        select: {
            bookId: true,
        }
    });

    const bookIds = userBooks.map(ub => ub.bookId);

    const bookGenres = await prisma.bookGenre.findMany({
        where: {
            bookId: {
                in: bookIds
            }
        },
        include: {
            genre: true
        }
    });

    const genreCount: Record<string, number> = {};
    bookGenres.forEach(bg => {
        const genreName = bg.genre.name;
        genreCount[genreName] = (genreCount[genreName] || 0) + 1;
    });

    return Object.entries(genreCount)
        .map(([name, count]) => ({name, count}))
        .sort((a, b) => b.count - a.count);
}

export async function getAuthorAnalysis() {
    const user = await currentUser();
    if (!user) return [];

    const userBooks = await prisma.userBook.findMany({
        where: {
            userId: user.id,
            finishedAt: {not: null}
        },
        include: {
            Book: true
        }
    });

    const authorCount: Record<string, number> = {};

    userBooks.forEach(userBook => {
        userBook.Book.authors.forEach(author => {
            authorCount[author] = (authorCount[author] || 0) + 1;
        });
    });

    return Object.entries(authorCount)
        .map(([name, count]) => ({name, count}))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
}

export async function getGoalsComparison() {
    const user = await currentUser();
    if (!user) return null;

    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    const goal = await prisma.readingGoal.findFirst({
        where: {
            userId: user.id,
            deadline: {
                gte: startOfYear,
                lte: endOfYear
            },
            type: 'BOOKS'
        }
    });

    if (!goal) return null;

    const completedBooksCount = await prisma.userBook.count({
        where: {
            userId: user.id,
            finishedAt: {
                gte: startOfYear,
                lte: new Date() // aujourd'hui
            }
        }
    });

    return {
        goal: goal.target,
        current: completedBooksCount,
        percentage: goal.target > 0
            ? Math.round((completedBooksCount / goal.target) * 100)
            : 0
    };
}

export async function getReadingDayStats() {
    const user = await currentUser();
    if (!user) return null;

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const readingDays = await prisma.readingDay.findMany({
        where: {
            userId: user.id,
            date: {
                gte: last30Days
            }
        },
        orderBy: {
            date: 'asc'
        }
    });

    return readingDays.map(day => ({
        date: day.date.toISOString().split('T')[0],
        minutes: day.minutesRead,
        pages: day.pagesRead
    }));
}

export async function getTotalReadStats() {
    const user = await currentUser();
    if (!user) return null;

    const [totalBooks, totalPages, totalMinutes] = await Promise.all([
        prisma.userBook.count({
            where: {
                userId: user.id,
                finishedAt: {not: null}
            }
        }),

        prisma.readingProgress.aggregate({
            where: {
                userId: user.id
            },
            _sum: {
                pagesRead: true
            }
        }),

        prisma.readingDay.aggregate({
            where: {
                userId: user.id
            },
            _sum: {
                minutesRead: true
            }
        })
    ]);

    return {
        booksRead: totalBooks,
        pagesRead: totalPages._sum.pagesRead || 0,
        minutesRead: totalMinutes._sum.minutesRead || 0,
        hoursRead: Math.round((totalMinutes._sum.minutesRead || 0) / 60)
    };
}

export async function getReadingStreakStats() {
    const user = await currentUser();
    if (!user) return null;

    const readingDays = await prisma.readingDay.findMany({
        where: {
            userId: user.id,
            // Filtrer les jours où l'utilisateur a réellement lu (minutes > 0 ou pages > 0)
            OR: [
                {minutesRead: {gt: 0}},
                {pagesRead: {gt: 0}}
            ]
        },
        orderBy: {
            date: 'desc'
        },
        select: {
            date: true
        }
    });

    if (readingDays.length === 0) {
        return {currentStreak: 0, longestStreak: 0};
    }

    // Calculer la série actuelle
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Vérifier si l'utilisateur a lu aujourd'hui
    const hasReadToday = readingDays.some(day => {
        const readingDate = new Date(day.date);
        readingDate.setHours(0, 0, 0, 0);
        return readingDate.getTime() === today.getTime();
    });

    if (hasReadToday) {
        currentStreak = 1;

        // Compter les jours consécutifs en arrière
        let checkDate = yesterday;
        let index = hasReadToday ? 1 : 0;

        while (index < readingDays.length) {
            const readingDate = new Date(readingDays[index].date);
            readingDate.setHours(0, 0, 0, 0);

            if (readingDate.getTime() === checkDate.getTime()) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
                index++;
            } else if (readingDate.getTime() < checkDate.getTime()) {
                // Si nous avons manqué des jours, arrêtez de compter
                break;
            } else {
                // Passez au prochain jour de lecture
                index++;
            }
        }
    } else {
        // Si l'utilisateur n'a pas lu aujourd'hui, vérifiez hier
        const hasReadYesterday = readingDays.some(day => {
            const readingDate = new Date(day.date);
            readingDate.setHours(0, 0, 0, 0);
            return readingDate.getTime() === yesterday.getTime();
        });

        if (hasReadYesterday) {
            currentStreak = 1;

            // Compter les jours consécutifs en arrière à partir d'hier
            let checkDate = new Date(yesterday);
            checkDate.setDate(checkDate.getDate() - 1);
            let index = hasReadYesterday ? 1 : 0;

            while (index < readingDays.length) {
                const readingDate = new Date(readingDays[index].date);
                readingDate.setHours(0, 0, 0, 0);

                if (readingDate.getTime() === checkDate.getTime()) {
                    currentStreak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                    index++;
                } else if (readingDate.getTime() < checkDate.getTime()) {
                    break;
                } else {
                    index++;
                }
            }
        } else {
            currentStreak = 0;
        }
    }

    // Calculer la série la plus longue
    let longestStreak = 0;
    let currentLongest = 0;
    let previousDate: Date | null = null;

    // Trier les dates dans l'ordre croissant pour ce calcul
    const sortedDates = readingDays
        .map(day => new Date(day.date))
        .sort((a, b) => a.getTime() - b.getTime());

    for (const date of sortedDates) {
        date.setHours(0, 0, 0, 0);

        if (!previousDate) {
            currentLongest = 1;
        } else {
            const diffTime = Math.abs(date.getTime() - previousDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                currentLongest++;
            } else {
                currentLongest = 1;
            }
        }

        if (currentLongest > longestStreak) {
            longestStreak = currentLongest;
        }

        previousDate = date;
    }

    return {
        currentStreak,
        longestStreak
    };
}