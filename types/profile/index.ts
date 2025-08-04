export type ProfileData = {
    user: {
        username: string;
        name: string | null;
        createdAt: string;
        favoriteColor: string;
    };
    isOwner: boolean;
    stats?: {
        totalBooksRead: number;
        totalReviews: number;
    };
    badges?: Array<{
        id: string;
        name: string;
        publicDescription: string;
        ownerDescription: string;
        icon: string;
        category: string;
        earnedAt: string;
    }>;
    detailedData?: {
        userId: string;
        books: Array<{
            id: string;
            finishedAt: string | null;
            Book: {
                id: string;
                title: string;
                authors: string[];
                numberOfPages: number | null;
            };
        }>;
        reviews: Array<{
            id: string;
            rating: number | null;
            feedback: string | null;
            createdAt: Date;
            privacy: "PUBLIC" | "PRIVATE" | "FRIENDS" | "SPECIFIC_FRIEND";
            privateLink: string;
            SpecificFriend: {
                id: string;
                username: string;
                name: string | null;
                image: string | null;
            } | null;
            Book: {
                id: string;
                title: string;
                authors: string[];
            };
        }>;
    };
    followers?: Array<{
        id: string;
        username: string;
        name: string | null;
        image: string | null;
    }>;
    following?: Array<{
        id: string;
        username: string;
        name: string | null;
        image: string | null;
    }>;
    isFollowing?: boolean;
};

export type User = ProfileData['user'];
export type Badge = NonNullable<ProfileData['badges']>[0];
export type Book = NonNullable<ProfileData['detailedData']>['books'][0];
export type Review = NonNullable<ProfileData['detailedData']>['reviews'][0];
export type UserProfile = NonNullable<ProfileData['followers']>[0];