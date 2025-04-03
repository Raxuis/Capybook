import {createZodRoute} from 'next-zod-route';
import {NextResponse} from 'next/server';
import {z} from "zod";
import prisma from "@/utils/prisma";
import {formatUsername} from "@/utils/format";
import {auth} from "@/auth";
import {BadgeCategory} from "@prisma/client";


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
        id: string;
        username: string;
        name: string | null;
        image: string | null;
        createdAt: Date;
    };
    isOwner: boolean;
    stats: {
        totalBooksRead: number;
        totalReviews: number;
    };
    badges: Array<{
        id: string;
        name: string;
        description: string;
        icon: string | null;
        category: BadgeCategory;
        earnedAt: Date;
    }>;
    detailedData?: {
        books: BookData[];
        reviews: ReviewData[];
    };
}

export const GET = createZodRoute()
    .params(paramsSchema)
    .handler(async (_, context) => {
        const {username} = context.params;
        // Format username to remove any @ symbol
        const formattedUsername = formatUsername(username);

        try {
            const session = await auth();

            const user = await prisma.user.findUnique({
                where: {username: formattedUsername},
                select: {
                    id: true,
                    username: true,
                    name: true,
                    image: true,
                    createdAt: true,
                    UserBook: {
                        select: {
                            id: true,
                            finishedAt: true,
                            Book: {
                                select: {
                                    id: true,
                                    title: true,
                                    authors: true,
                                    numberOfPages: true
                                }
                            }
                        }
                    },
                    BookReview: {
                        select: {
                            id: true,
                            rating: true,
                            feedback: true,
                            createdAt: true,
                            Book: {
                                select: {
                                    id: true,
                                    title: true,
                                    authors: true
                                }
                            }
                        }
                    },
                    UserBadge: {
                        select: {
                            earnedAt: true,
                            Badge: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                    icon: true,
                                    category: true
                                }
                            }
                        }
                    }
                }
            });

            if (!user) {
                return NextResponse.json({error: 'User not found'}, {status: 404});
            }

            const isOwner = session?.user?.email ?
                await prisma.user.findFirst({
                    where: {
                        email: session.user.email,
                        id: user.id
                    }
                }) !== null : false;

            const totalBooksRead = user.UserBook.filter(book => book.finishedAt).length;
            const totalReviews = user.BookReview.length;

            const badges = user.UserBadge.map(userBadge => ({
                id: userBadge.Badge.id,
                name: userBadge.Badge.name,
                description: userBadge.Badge.description,
                icon: userBadge.Badge.icon,
                category: userBadge.Badge.category,
                earnedAt: userBadge.earnedAt
            }));

            const responseData: ResponseData = {
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    image: user.image,
                    createdAt: user.createdAt
                },
                isOwner,
                stats: {
                    totalBooksRead,
                    totalReviews
                },
                badges
            };

            if (isOwner) {
                responseData['detailedData'] = {
                    books: user.UserBook,
                    reviews: user.BookReview
                };
            }

            return NextResponse.json(responseData);
        } catch (error) {
            console.error('Error fetching profile:', error);
            return NextResponse.json({error: 'Failed to fetch profile'}, {status: 500});
        }
    });
