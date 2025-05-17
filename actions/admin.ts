import {
    endOfMonth,
    endOfWeek,
    endOfYear,
    format,
    startOfMonth,
    startOfWeek,
    startOfYear,
    subMonths,
    subWeeks,
    subYears
} from "date-fns";
import {
    AdminDashboardStats,
    GenreStats,
    MonthlyGrowthItem,
    PeriodDateRange,
    ReadingActivityItem,
    StatsPeriod
} from "@/types/admin";
import {User, Book, BookReview, Genre, ReadingGoal, Badge, ReadingDay} from "@prisma/client";
import {currentUser} from "./auth/current-user";
import prisma from "@/utils/prisma";

/**
 * Get period date range based on the selected period
 */
function getPeriodDateRange(period: StatsPeriod): PeriodDateRange {
    const now = new Date();
    let startDate: Date, endDate: Date, previousStartDate: Date, previousEndDate: Date;

    switch (period) {
        case "week":
            startDate = startOfWeek(now, {weekStartsOn: 1}); // Week starts on Monday
            endDate = endOfWeek(now, {weekStartsOn: 1});
            previousStartDate = startOfWeek(subWeeks(now, 1), {weekStartsOn: 1});
            previousEndDate = endOfWeek(subWeeks(now, 1), {weekStartsOn: 1});
            break;
        case "year":
            startDate = startOfYear(now);
            endDate = endOfYear(now);
            previousStartDate = startOfYear(subYears(now, 1));
            previousEndDate = endOfYear(subYears(now, 1));
            break;
        case "month":
        default:
            startDate = startOfMonth(now);
            endDate = endOfMonth(now);
            previousStartDate = startOfMonth(subMonths(now, 1));
            previousEndDate = endOfMonth(subMonths(now, 1));
    }

    return {startDate, endDate, previousStartDate, previousEndDate};
}

/**
 * Get all admin dashboard statistics
 */
export async function getAll(period: StatsPeriod = "month"): Promise<AdminDashboardStats | null> {
    try {
        // Authorization check
        const user = await currentUser();
        if (!user || user.role !== "ADMIN") return null;

        // Get date ranges for the selected period
        const {startDate, endDate} = getPeriodDateRange(period);

        // Fetch data in parallel for better performance
        const [
            users,
            books,
            reviews,
            genres,
            goals,
            badges,
            readingActivity,
            newUsersInPeriod,
            newBooksInPeriod,
            newReviewsInPeriod,
            completedGoals,
            badgesAwarded,
            monthlyGrowthData,
            topGenres,
            readingDays,
            avgPagesPerDay
        ] = await Promise.all([
            getUsers(),
            getBooks(),
            getReviews(),
            getGenres(),
            getReadingGoals(),
            getBadges(),
            getReadingActivity(startDate, endDate),
            getNewItemsInPeriod("user", startDate, endDate),
            getNewItemsInPeriod("book", startDate, endDate),
            getNewItemsInPeriod("review", startDate, endDate),
            getCompletedGoals(),
            getBadgesAwardedCount(),
            getMonthlyGrowth(),
            getTopGenres(),
            getReadingDaysStats(),
            calculateAvgPagesPerDay()
        ]);

        const readingActivityData = formatReadingActivityData(readingActivity);

        return {
            overview: {
                totalUsers: users.length,
                newUsersInPeriod,
                totalBooks: books.length,
                newBooksInPeriod,
                totalReviews: reviews.length,
                newReviewsInPeriod,
                totalReadingGoals: goals.length,
                completedGoals,
                badgesAwarded,
                totalReadingDays: readingDays.total,
                avgPagesPerDay,
            },
            monthlyGrowth: monthlyGrowthData,
            topGenres,
            readingActivity: readingActivityData,
            users,
            books,
            reviews,
            genres,
        };
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return null;
    }
}

/**
 * Get users with related data
 */
async function getUsers() {
    return await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            username: true,
            name: true,
            password: true,
            emailVerified: true,
            image: true,
            favoriteColor: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });
}

/**
 * Get books with related data
 */
async function getBooks() {
    return await prisma.book.findMany({
        select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            key: true,
            title: true,
            authors: true,
            cover: true,
            numberOfPages: true
        }
    });
}

/**
 * Get reviews with related data
 */
async function getReviews() {
    return await prisma.bookReview.findMany({
        include: {
            Book: {
                select: {
                    id: true,
                    title: true,
                    authors: true,
                    cover: true
                }
            },
            User: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    image: true
                }
            }
        }
    });
}

/**
 * Get genres with related books
 */
async function getGenres() {
    return await prisma.genre.findMany({
        include: {
            books: {
                include: {
                    book: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                }
            }
        }
    });
}

/**
 * Get reading goals
 */
async function getReadingGoals() {
    return await prisma.readingGoal.findMany({
        include: {
            User: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    image: true
                }
            }
        }
    });
}

/**
 * Get all badges with their users
 */
async function getBadges() {
    return await prisma.badge.findMany({
        include: {
            UserBadge: {
                include: {
                    User: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            image: true
                        }
                    }
                }
            }
        }
    });
}

/**
 * Get reading activity for a period
 */
async function getReadingActivity(startDate: Date, endDate: Date) {
    return await prisma.readingDay.findMany({
        where: {
            date: {
                gte: startDate,
                lte: endDate
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    name: true
                }
            },
            readingProgress: true
        },
        orderBy: {
            date: 'asc'
        }
    });
}

/**
 * Generic function to count new items in a period
 */
async function getNewItemsInPeriod(
    type: "user" | "book" | "review",
    startDate: Date,
    endDate: Date
): Promise<number> {
    try {
        const modelMap = {
            user: prisma.user,
            book: prisma.book,
            review: prisma.bookReview
        } as const;

        const model: {
            count: (args: { where: { createdAt: { gte: Date; lte: Date } } }) => Promise<number>
        } = modelMap[type];

        return await model.count({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
    } catch (error) {
        console.error(`Error counting new ${type}s:`, error);
        return 0;
    }
}

/**
 * Get count of completed goals
 */
async function getCompletedGoals(): Promise<number> {
    try {
        return await prisma.readingGoal.count({
            where: {
                completedAt: {
                    not: null
                }
            }
        });
    } catch (error) {
        console.error("Error counting completed goals:", error);
        return 0;
    }
}

/**
 * Get count of badges awarded to users
 */
async function getBadgesAwardedCount(): Promise<number> {
    try {
        return await prisma.userBadge.count();
    } catch (error) {
        console.error("Error counting badges awarded:", error);
        return 0;
    }
}

/**
 * Get monthly growth data for the past 5 months
 */
async function getMonthlyGrowth(): Promise<MonthlyGrowthItem[]> {
    const now = new Date();
    const months: MonthlyGrowthItem[] = [];

    try {
        // Get data for the past 5 months
        for (let i = 4; i >= 0; i--) {
            const month = subMonths(now, i);
            const startOfMonthDate = startOfMonth(month);
            const endOfMonthDate = endOfMonth(month);

            const [users, books, reviews] = await Promise.all([
                prisma.user.count({
                    where: {
                        createdAt: {
                            gte: startOfMonthDate,
                            lte: endOfMonthDate
                        }
                    }
                }),
                prisma.book.count({
                    where: {
                        createdAt: {
                            gte: startOfMonthDate,
                            lte: endOfMonthDate
                        }
                    }
                }),
                prisma.bookReview.count({
                    where: {
                        createdAt: {
                            gte: startOfMonthDate,
                            lte: endOfMonthDate
                        }
                    }
                })
            ]);

            months.push({
                name: format(month, 'MMM'),
                users,
                books,
                reviews
            });
        }

        return months;
    } catch (error) {
        console.error("Error fetching monthly growth:", error);
        return [];
    }
}

/**
 * Get top 5 genres by book count
 */
async function getTopGenres(): Promise<GenreStats[]> {
    try {
        const genres = await prisma.bookGenre.groupBy({
            by: ['genreId'],
            _count: {
                bookId: true
            }
        });

        const genreDetails = await prisma.genre.findMany({
            where: {
                id: {
                    in: genres.map(g => g.genreId)
                }
            }
        });

        // Map and sort genres, get top 5
        return genres
            .map(g => ({
                name: genreDetails.find(d => d.id === g.genreId)?.name || 'Unknown',
                count: g._count.bookId
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    } catch (error) {
        console.error("Error fetching top genres:", error);
        return [];
    }
}

/**
 * Get reading days statistics
 */
async function getReadingDaysStats() {
    try {
        const totalDays = await prisma.readingDay.count();

        // Could add more metrics here
        return {
            total: totalDays
        };
    } catch (error) {
        console.error("Error fetching reading days stats:", error);
        return {total: 0};
    }
}

/**
 * Calculate average pages read per day
 */
async function calculateAvgPagesPerDay(): Promise<number> {
    try {
        const result = await prisma.readingDay.aggregate({
            _avg: {
                pagesRead: true
            }
        });

        return Math.round(result._avg.pagesRead || 0);
    } catch (error) {
        console.error("Error calculating average pages per day:", error);
        return 0;
    }
}

/**
 * Format reading activity data by day of week
 */
function formatReadingActivityData(readingDays: ReadingDay[]): ReadingActivityItem[] {
    try {
        // Group by day of the week and calculate average
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const days: Record<string, { pages: number; minutes: number; count: number }> = {};

        // Initialize days
        dayNames.forEach(day => {
            days[day] = {
                pages: 0,
                minutes: 0,
                count: 0
            };
        });

        // Sum up data for each day
        readingDays.forEach(day => {
            const dayName = dayNames[new Date(day.date).getDay()];
            days[dayName].pages += day.pagesRead;
            days[dayName].minutes += day.minutesRead;
            days[dayName].count += 1;
        });

        // Calculate averages
        return dayNames.map(name => ({
            name,
            pages: days[name].count ? Math.round(days[name].pages / days[name].count) : 0,
            minutes: days[name].count ? Math.round(days[name].minutes / days[name].count) : 0
        }));
    } catch (error) {
        console.error("Error formatting reading activity data:", error);
        return [];
    }
}