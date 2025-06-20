import {z} from "zod";
import {createZodRoute} from "next-zod-route";
import {NextResponse} from 'next/server';
import prisma from "@/utils/prisma";
import {checkAndAssignBadges} from "@/utils/badges";
import {nanoid} from 'nanoid';

const bodySchema = z.object({
    bookKey: z.string(),
    userId: z.string(),
    rating: z.number(),
    feedback: z.string(),
    privacy: z.enum(['PUBLIC', 'PRIVATE', 'FRIENDS', 'SPECIFIC_FRIEND']),
    specificFriendId: z.string().optional(),
});

export const POST = createZodRoute().body(bodySchema).handler(async (_, context) => {
    const {bookKey, userId, rating, feedback, privacy, specificFriendId} = context.body;

    const book = await prisma.book.findUnique({
        where: {key: bookKey}
    });

    if (!book) {
        return NextResponse.json({error: "No book with the corresponding key."}, {status: 404});
    }

    const userBook = await prisma.userBook.findFirst({
        where: {
            bookId: book.id,
            userId: userId,
        }
    });

    if (!userBook) {
        return NextResponse.json({error: 'User doesn\'t have this book yet.'}, {status: 400});
    }

    // Validate specific friend selection
    if (privacy === 'SPECIFIC_FRIEND' && !specificFriendId) {
        return NextResponse.json({error: 'Specific friend must be selected for this privacy setting.'}, {status: 400});
    }

    // Verify friendship exists if specific friend is selected
    if (specificFriendId) {
        const friendship = await prisma.follow.findFirst({
            where: {
                OR: [
                    {followerId: userId, followingId: specificFriendId},
                    {followerId: specificFriendId, followingId: userId}
                ]
            }
        });

        if (!friendship) {
            return NextResponse.json({error: 'You are not friends with the selected user.'}, {status: 400});
        }
    }

    // Generate private link if privacy is PRIVATE
    const privateLink = privacy === 'PRIVATE' ? nanoid(12) : null;

    const newBookReview = await prisma.bookReview.upsert({
        where: {
            userId_bookId: {userId, bookId: book.id},
        },
        update: {
            rating,
            feedback,
            privacy,
            privateLink,
            specificFriendId,
        },
        create: {
            userId,
            bookId: book.id,
            rating,
            feedback,
            privacy,
            privateLink,
            specificFriendId,
        },
    });

    if (!newBookReview) {
        return NextResponse.json({error: 'An error occurred while saving review.'}, {status: 500});
    }

    const newBadges = await checkAndAssignBadges(userId);

    return NextResponse.json({
        data: newBookReview,
        badges: {
            newBadgesCount: newBadges.length,
            newBadges: newBadges,
        },
        privateLink: privateLink ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/review/${privateLink}` : null
    }, {status: 200});
});