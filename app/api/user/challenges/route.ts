import {createZodRoute} from "next-zod-route";
import {NextResponse} from 'next/server';
import prisma from "@/utils/prisma";
import {ChallengeFormSchema} from "@/utils/zod";
import z from "zod";

// A union of challenge types + user id
const PostSchema = z.object({
    ...ChallengeFormSchema.shape,
    userId: z.string(),
    deadline: z.preprocess((val) => new Date(val as string), z.date()),
});

export const POST = createZodRoute().body(PostSchema).handler(async (_, context) => {
    const {
        type,
        userId,
        target,
        deadline
    } = context.body;

    const user = await prisma.user.findUnique({
        where: {id: userId}
    })

    if (!user) {
        return NextResponse.json({error: 'User does not exist'}, {status: 400});
    }

    const newChallenge = await prisma.readingGoal.create({
        data: {
            userId: user.id,
            type,
            target,
            deadline,
        }
    })
    const {id, ...challengeWithoutId} = newChallenge;

    return NextResponse.json({challenge: challengeWithoutId}, {status: 201});
});

const DeleteSchema = z.object({
    challengeId: z.string(),
    userId: z.string(),
})


export const DELETE = createZodRoute().body(DeleteSchema).handler(async (_, context) => {
    const {challengeId, userId} = context.body;

    const challenge = await prisma.readingGoal.findUnique({
        where: {id: challengeId},
    });

    if (!challenge) {
        return NextResponse.json({error: 'Challenge not found'}, {status: 404});
    }

    if (challenge.userId !== userId) {
        return NextResponse.json({error: 'User does not own this challenge'}, {status: 403});
    }

    await prisma.readingGoal.delete({
        where: {
            id: challengeId,
        },
    });

    return NextResponse.json({success: true}, {status: 200});
});