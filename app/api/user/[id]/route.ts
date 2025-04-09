import {createZodRoute} from 'next-zod-route';
import {NextResponse} from 'next/server';
import {z} from "zod";
import prisma from "@/utils/prisma";

const paramsSchema = z.object({
    id: z.string(),
});

export const GET = createZodRoute()
    .params(paramsSchema)
    .handler(async (_, context) => {
        const {id} = context.params;

        const user = await prisma.user.findUnique({
            where: {id},
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                image: true,
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
                }
            }
        })

        if (!user) {
            return NextResponse.json({error: 'User not found'}, {status: 404});
        }

        return NextResponse.json(user, {status: 200});
    });

const putSchema = z.object({
    username: z.string(),
    favoriteColor: z.string(),
})

export const PUT = createZodRoute().body(putSchema).params(paramsSchema).handler(async (_, context) => {
    const {username, favoriteColor} = context.body;
    const {id} = context.params;

    const user = await prisma.user.findUnique({
        where: {id},
    });

    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    const existingUsername = await prisma.user.findFirst({
        where: {username},
    });

    if (existingUsername && existingUsername.id !== id) {
        return NextResponse.json({error: 'Username already taken'}, {status: 400});
    }

    const updatedUser = await prisma.user.update({
        where: {id},
        data: {
            username,
            favoriteColor,
        },
    });

    if (!updatedUser) {
        return NextResponse.json({error: 'Failed to update user'}, {status: 500});
    }

    // Remove the password from the response
    const {password, ...userWithoutPassword} = updatedUser;

    return NextResponse.json(userWithoutPassword, {status: 200});
})