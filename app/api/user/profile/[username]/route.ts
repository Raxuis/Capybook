import {NextResponse} from 'next/server';
import {z} from "zod";
import prisma from "@/utils/prisma";
import {formatUsername} from "@/utils/format";
import {auth} from "@/auth";
import {BadgeCategory} from "@prisma/client";
import {validateParams, withErrorHandlingContextOnly} from "@/utils/api-validation";


const paramsSchema = z.object({
    username: z.string(),
});

interface BookData {
    id: string;
    finishedAt: Date | null;
    Book: {
        id: string;
        title: string;
        authors: string[];
        numberOfPages: number | null;
    };
}

interface ReviewData {
    id: string;
    rating: number | null;
    feedback: string | null;
    createdAt: Date;
    Book: {
        id: string;
        title: string;
        authors: string[];
    };
}

interface ResponseData {
    user: {
        username: string;
        name: string | null;
        createdAt: Date;
        favoriteColor: string;
    };
    isOwner: boolean;
    stats: {
        totalBooksRead: number;
        totalReviews: number;
    };
    badges: Array<{
        id: string;
        name: string;
        publicDescription: string;
        ownerDescription: string;
        icon: string | null;
        category: BadgeCategory;
        earnedAt: Date;
    }>;
    detailedData?: {
        books: BookData[];
        reviews: ReviewData[];
        userId: string;
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
    isFollowing: boolean;
}

async function handleGet(
    {params}: { params: { username: string } }
): Promise<NextResponse> {
    const {username} = await validateParams(params, paramsSchema);
    const formattedUsername = formatUsername(username);
    const session = await auth();

    const user = await prisma.user.findUnique({
        where: {username: formattedUsername},
        select: {
            id: true,
            username: true,
            name: true,
            image: true,
            createdAt: true,
            favoriteColor: true,
            UserBook: {
                select: {
                    id: true,
                    finishedAt: true,
                    Book: {
                        select: {
                            id: true,
                            title: true,
                            authors: true,
                            numberOfPages: true,
                        },
                    },
                },
            },
            BookReview: {
                select: {
                    id: true,
                    rating: true,
                    feedback: true,
                    createdAt: true,
                    privacy: true,
                    SpecificFriend: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            image: true,
                        },
                    },
                    Book: {
                        select: {
                            id: true,
                            title: true,
                            authors: true,
                        },
                    },
                },
            },
            UserBadge: {
                select: {
                    earnedAt: true,
                    Badge: {
                        select: {
                            id: true,
                            name: true,
                            ownerDescription: true,
                            publicDescription: true,
                            icon: true,
                            category: true,
                        },
                    },
                },
            },
            followers: {
                select: {
                    follower: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            },
            following: {
                select: {
                    following: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
    });

    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    const isOwner = session?.user?.email
        ? await prisma.user.findFirst({
        where: {
            email: session.user.email,
            id: user.id,
        },
    }) !== null
        : false;

    const isFollowing = session?.user?.id
        ? (await prisma.follow.findFirst({
        where: {
            followingId: user.id,
            followerId: session.user.id,
        },
    })) !== null
        : false;

    const totalBooksRead = user.UserBook.filter(book => book.finishedAt).length;
    const totalReviews = user.BookReview.length;

    const badges = user.UserBadge.map(userBadge => ({
        id: userBadge.Badge.id,
        name: userBadge.Badge.name,
        ownerDescription: userBadge.Badge.ownerDescription,
        publicDescription: userBadge.Badge.publicDescription,
        icon: userBadge.Badge.icon,
        category: userBadge.Badge.category,
        earnedAt: userBadge.earnedAt,
    }));

    const followers = (user.followers ?? []).map(f => f.follower);
    const following = (user.following ?? []).map(f => f.following);

    const responseData: ResponseData = {
        user: {
            username: user.username,
            favoriteColor: user.favoriteColor,
            name: user.name,
            createdAt: user.createdAt,
        },
        isOwner,
        stats: {
            totalBooksRead,
            totalReviews,
        },
        badges,
        followers,
        following,
        isFollowing,
    };

    if (isOwner) {
        responseData.detailedData = {
            books: user.UserBook,
            reviews: user.BookReview,
            userId: user.id,
        };
    }

    return NextResponse.json(responseData);
}

export const GET = withErrorHandlingContextOnly(handleGet);