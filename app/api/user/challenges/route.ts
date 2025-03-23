import {createZodRoute} from "next-zod-route";
import {NextResponse} from 'next/server';
import prisma from "@/utils/prisma";
import {ChallengeFormSchema} from "@/utils/zod";
import z from "zod";

// A union of challenge types + user id
const bodySchema = z.object({
    ...ChallengeFormSchema.shape,
    userId: z.string(),
    deadline: z.preprocess((val) => new Date(val as string), z.date()),
});

export const POST = createZodRoute().body(bodySchema).handler(async (_, context) => {
    const {
        type,
        userId,
        target,
        deadline
    } = context.body;

    if (!type) {
        return NextResponse.json({error: 'Type is required'}, {status: 400});
    }

    if (!target) {
        return NextResponse.json({error: 'Target is required'}, {status: 400});
    }

    if (!deadline) {
        return NextResponse.json({error: 'Deadline is required'}, {status: 400});
    }

    if (!userId) {
        return NextResponse.json({error: 'User id is required'}, {status: 400});
    }

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
    const { id, ...challengeWithoutId } = newChallenge;

    return NextResponse.json({challenge: challengeWithoutId}, {status: 201});
});