import {createZodRoute} from 'next-zod-route';
import {NextResponse} from 'next/server';
import {z} from "zod";
import prisma from "@/utils/prisma";

const paramsSchema = z.object({
    userId: z.string(),
});

export const GET = createZodRoute()
    .params(paramsSchema)
    .handler(async (_, context) => {
        const {userId} = context.params;

        const user = await prisma.user.findUnique({
            where: {id: userId},
            include: {
                ReadingGoal: true,
                UserBook: {
                    include: {
                        Book: true
                    }
                },
                UserBookWishlist: {
                    include: {
                        Book: true
                    }
                },
                BookReview: {
                    include: {
                        Book: true
                    }
                },
                UserBookNotes: {
                    include: {
                        Book: true
                    }
                },
                UserBadge: {
                    include: {
                        Badge: true
                    }
                },
                lentBooks: {
                    include: {
                        book: true,
                        borrower: true
                    }
                },
                borrowedBooks: {
                    include: {
                        book: true,
                        lender: true
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json({error: 'User not found'}, {status: 404});
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {password, ...userWithoutPassword} = user;

        return NextResponse.json(userWithoutPassword, {status: 200});
    });

const putSchema = z.object({
    username: z.string(),
    favoriteColor: z.string(),
})

export const PUT = createZodRoute().body(putSchema).params(paramsSchema).handler(async (_, context) => {
    const {username, favoriteColor} = context.body;
    const {userId} = context.params;

    const user = await prisma.user.findUnique({
        where: {id: userId},
    });

    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    const existingUsername = await prisma.user.findFirst({
        where: {username},
    });

    if (existingUsername && existingUsername.id !== userId) { // Correction: userId au lieu de id
        return NextResponse.json({error: 'Username already taken'}, {status: 400});
    }

    const updatedUser = await prisma.user.update({
        where: {id: userId},
        data: {
            username,
            favoriteColor,
        },
    });

    if (!updatedUser) {
        return NextResponse.json({error: 'Failed to update user'}, {status: 500});
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...userWithoutPassword} = updatedUser;

    return NextResponse.json(userWithoutPassword, {status: 200});
})