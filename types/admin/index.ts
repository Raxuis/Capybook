import {User, Book, BookReview, Genre} from "@prisma/client";

export type StatsPeriod = "week" | "month" | "year";

export interface StatsOverview {
    totalUsers: number;
    newUsersInPeriod: number;
    totalBooks: number;
    newBooksInPeriod: number;
    totalReviews: number;
    newReviewsInPeriod: number;
    totalReadingGoals: number;
    completedGoals: number;
    badgesAwarded: number;
    totalReadingDays: number;
    avgPagesPerDay: number;
    goalCompletionRate: number;
    avgMinutesPerDay: number;
    period: StatsPeriod;
}

export interface MonthlyGrowthItem {
    name: string;
    users: number;
    books: number;
    reviews: number;
}

export interface GenreStats {
    name: string;
    count: number;
}

// Reading activity
export interface ReadingActivityItem {
    name: string;
    pages: number;
    minutes: number;
    count?: number;
}

export interface PeriodDateRange {
    startDate: Date;
    endDate: Date;
    previousStartDate: Date;
    previousEndDate: Date;
}

export interface AdminDashboardStats {
    overview: StatsOverview;
    monthlyGrowth: MonthlyGrowthItem[];
    topGenres: GenreStats[];
    readingActivity: ReadingActivityItem[];
    users?: User[];
    books?: Book[];
    reviews?: BookReview[];
    genres?: Genre[];
}