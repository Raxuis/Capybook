import {createZodRoute} from 'next-zod-route';
import {NextResponse} from 'next/server';
import {z} from "zod";
import prisma from "@/utils/prisma";

const paramsSchema = z.object({
    id: z.string(),
});

export const GET = createZodRoute()
    .params(paramsSchema)
    .handler(async (request, context) => {
        const {id} = context.params;

        if (!id) {
            return NextResponse.json({error: 'No id provided'}, {status: 400});
        }

        const user = await prisma.user.findUnique({
            where: {id},
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                image: true,
                UserBook: {
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