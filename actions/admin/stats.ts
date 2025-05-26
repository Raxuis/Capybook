"use server";

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
import {ReadingDay} from "@prisma/client";
import {currentUser} from "../auth/current-user";
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

        const [
            users,
            books,
            reviews,
            genres,
            goals,
            readingActivity,
            newUsersInPeriod,
            newBooksInPeriod,
            newReviewsInPeriod,
            completedGoals,
            badgesAwarded,
            monthlyGrowthData,
            topGenres,
            readingDays,
            avgPagesPerDay,
            avgMinutesPerDay
        ] = await Promise.all([
            getUsers(),
            getBooks(),
            getReviews(),
            getGenres(),
            getReadingGoals(),
            getReadingActivity(startDate, endDate),
            getNewItemsInPeriod("user", startDate, endDate),
            getNewItemsInPeriod("book", startDate, endDate),
            getNewItemsInPeriod("review", startDate, endDate),
            getCompletedGoalsInPeriod(startDate, endDate),
            getBadgesAwardedInPeriod(startDate, endDate),
            getGrowthDataForPeriod(period),
            getTopGenresInPeriod(startDate, endDate),
            getReadingDaysStats(startDate, endDate),
            calculateAvgPagesPerDay(startDate, endDate),
            calculateAvgMinutesPerDay(startDate, endDate)
        ]);

        // Format and add additional metadata per period
        const readingActivityData = formatReadingActivityData(readingActivity, period);

        // Get completion rate for goals based on the period
        const goalCompletionRate = goals.length > 0
            ? Math.round((completedGoals / goals.length) * 100)
            : 0;

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
                goalCompletionRate,
                badgesAwarded,
                totalReadingDays: readingDays.total,
                avgPagesPerDay,
                avgMinutesPerDay,
                period // Store the current period for frontend reference
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
    return prisma.user.findMany({
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
    return prisma.book.findMany({
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
    return prisma.bookReview.findMany({
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
    return prisma.genre.findMany({
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
    return prisma.readingGoal.findMany({
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
 * Get reading activity for a period
 */
async function getReadingActivity(startDate: Date, endDate: Date) {
    return prisma.readingDay.findMany({
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
 * Get count of completed goals in a period
 */
async function getCompletedGoalsInPeriod(startDate: Date, endDate: Date): Promise<number> {
    try {
        return await prisma.readingGoal.count({
            where: {
                completedAt: {
                    not: null,
                    gte: startDate,
                    lte: endDate
                }
            }
        });
    } catch (error) {
        console.error("Error counting completed goals:", error);
        return 0;
    }
}

/**
 * Get count of badges awarded to users in a period
 */
async function getBadgesAwardedInPeriod(startDate: Date, endDate: Date): Promise<number> {
    try {
        return await prisma.userBadge.count({
            where: {
                earnedAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
    } catch (error) {
        console.error("Error counting badges awarded:", error);
        return 0;
    }
}

/**
 * Get growth data based on the selected period
 */
async function getGrowthDataForPeriod(period: StatsPeriod): Promise<MonthlyGrowthItem[]> {
    const now = new Date();
    const result: MonthlyGrowthItem[] = [];

    try {
        let intervals: number;
        let getStartDate: (date: Date) => Date;
        let getEndDate: (date: Date) => Date;
        let subInterval: (date: Date, amount: number) => Date;
        let formatLabel: (date: Date) => string;

        switch (period) {
            case "week":
                intervals = 7;
                getStartDate = (date) => date;
                getEndDate = (date) => date;
                subInterval = (date, amount) => new Date(date.getTime() - amount * 24 * 60 * 60 * 1000);
                formatLabel = (date) => format(date, 'EEE'); // Day abbreviation
                break;
            case "year":
                intervals = 12;
                getStartDate = startOfMonth;
                getEndDate = endOfMonth;
                subInterval = subMonths;
                formatLabel = (date) => format(date, 'MMM');
                break;
            case "month":
            default:
                intervals = 30;
                getStartDate = (date) => date;
                getEndDate = (date) => date;
                subInterval = (date, amount) => new Date(date.getTime() - amount * 24 * 60 * 60 * 1000);
                formatLabel = (date) => format(date, 'd');
        }

        for (let i = intervals - 1; i >= 0; i--) {
            const currentDate = subInterval(now, i);
            const startOfInterval = getStartDate(currentDate);
            const endOfInterval = getEndDate(currentDate);

            const [users, books, reviews] = await Promise.all([
                prisma.user.count({
                    where: {
                        createdAt: {
                            gte: startOfInterval,
                            lte: endOfInterval
                        }
                    }
                }),
                prisma.book.count({
                    where: {
                        createdAt: {
                            gte: startOfInterval,
                            lte: endOfInterval
                        }
                    }
                }),
                prisma.bookReview.count({
                    where: {
                        createdAt: {
                            gte: startOfInterval,
                            lte: endOfInterval
                        }
                    }
                })
            ]);

            result.push({
                name: formatLabel(currentDate),
                users,
                books,
                reviews
            });
        }

        // Group data only for month view to avoid too many bars
        if (period === "month") {
            return groupDataByInterval(result, 5);
        } else {
            return result;
        }
    } catch (error) {
        console.error(`Error fetching growth data for ${period}:`, error);
        return [];
    }
}

/**
 * Helper function to group data items by interval
 */
function groupDataByInterval(data: MonthlyGrowthItem[], interval: number): MonthlyGrowthItem[] {
    const result: MonthlyGrowthItem[] = [];

    if (data.length <= interval) return data;

    const groupCount = Math.ceil(data.length / interval);

    for (let i = 0; i < groupCount; i++) {
        const start = i * interval;
        const end = Math.min(start + interval, data.length);
        const group = data.slice(start, end);

        if (group.length > 0) {
            const groupItem: MonthlyGrowthItem = {
                name: `${group[0].name}${group.length > 1 ? `-${group[group.length - 1].name}` : ''}`,
                users: group.reduce((sum, item) => sum + item.users, 0),
                books: group.reduce((sum, item) => sum + item.books, 0),
                reviews: group.reduce((sum, item) => sum + item.reviews, 0)
            };

            result.push(groupItem);
        }
    }

    return result;
}

/**
 * Get top 5 genres by book count for a period
 */
async function getTopGenresInPeriod(startDate: Date, endDate: Date): Promise<GenreStats[]> {
    try {
        const genreCounts = await prisma.bookGenre.groupBy({
            by: ['genreId'],
            where: {
                book: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            },
            _count: {
                bookId: true,
            },
            orderBy: {
                _count: {
                    bookId: 'desc',
                },
            },
            take: 5
        });

        const genres = await prisma.genre.findMany({
            where: {
                id: { in: genreCounts.map(g => g.genreId) },
            },
        });

        return genreCounts.map(g => ({
            name: genres.find(gen => gen.id === g.genreId)?.name || 'Unknown',
            count: g._count.bookId,
        }));
    } catch (error) {
        console.error("Error fetching top genres for period:", error);
        return [];
    }
}

/**
 * Get reading days statistics for a period
 */
async function getReadingDaysStats(startDate: Date, endDate: Date) {
    try {
        const totalDays = await prisma.readingDay.count({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        return {
            total: totalDays
        };
    } catch (error) {
        console.error("Error fetching reading days stats:", error);
        return {total: 0};
    }
}

/**
 * Calculate average pages read per day for a period
 */
async function calculateAvgPagesPerDay(startDate: Date, endDate: Date): Promise<number> {
    try {
        const result = await prisma.readingDay.aggregate({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
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
 * Calculate average minutes read per day for a period
 */
async function calculateAvgMinutesPerDay(startDate: Date, endDate: Date): Promise<number> {
    try {
        const result = await prisma.readingDay.aggregate({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _avg: {
                minutesRead: true
            }
        });

        return Math.round(result._avg.minutesRead || 0);
    } catch (error) {
        console.error("Error calculating average minutes per day:", error);
        return 0;
    }
}

/**
 * Format reading activity data by day of week or adapting to the period
 */
function formatReadingActivityData(readingDays: ReadingDay[], period: StatsPeriod): ReadingActivityItem[] {
    try {
        // For week view, we show daily data
        if (period === "week") {
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const days: Record<string, { pages: number; minutes: number; count: number }> = {};

            dayNames.forEach(day => {
                days[day] = {
                    pages: 0,
                    minutes: 0,
                    count: 0
                };
            });

            readingDays.forEach(day => {
                const dayName = dayNames[new Date(day.date).getDay()];
                days[dayName].pages += day.pagesRead;
                days[dayName].minutes += day.minutesRead;
                days[dayName].count += 1;
            });

            return dayNames.map(name => ({
                name,
                pages: days[name].count ? Math.round(days[name].pages / days[name].count) : 0,
                minutes: days[name].count ? Math.round(days[name].minutes / days[name].count) : 0
            }));
        }
        // For month view, we group by week
        else if (period === "month") {
            const weeks: Record<number, { name: string; pages: number; minutes: number; count: number }> = {};

            readingDays.forEach(day => {
                const date = new Date(day.date);
                const weekOfMonth = Math.ceil(date.getDate() / 7);

                if (!weeks[weekOfMonth]) {
                    weeks[weekOfMonth] = {
                        name: `Sem ${weekOfMonth}`,
                        pages: 0,
                        minutes: 0,
                        count: 0
                    };
                }

                weeks[weekOfMonth].pages += day.pagesRead;
                weeks[weekOfMonth].minutes += day.minutesRead;
                weeks[weekOfMonth].count += 1;
            });

            return Object.values(weeks).map(week => ({
                name: week.name,
                pages: week.count ? Math.round(week.pages / week.count) : 0,
                minutes: week.count ? Math.round(week.minutes / week.count) : 0
            }));
        }
        // For year view, we group by month
        else {
            const months: Record<number, { name: string; pages: number; minutes: number; count: number }> = {};
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            readingDays.forEach(day => {
                const date = new Date(day.date);
                const monthIndex = date.getMonth();

                if (!months[monthIndex]) {
                    months[monthIndex] = {
                        name: monthNames[monthIndex],
                        pages: 0,
                        minutes: 0,
                        count: 0
                    };
                }

                months[monthIndex].pages += day.pagesRead;
                months[monthIndex].minutes += day.minutesRead;
                months[monthIndex].count += 1;
            });

            return Object.entries(months)
                .sort(([a], [b]) => Number(a) - Number(b))
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .map(([_, month]) => ({
                    name: month.name,
                    pages: month.count ? Math.round(month.pages / month.count) : 0,
                    minutes: month.count ? Math.round(month.minutes / month.count) : 0
                }));
        }
    } catch (error) {
        console.error("Error formatting reading activity data:", error);
        return [];
    }
}