import {createZodRoute} from "next-zod-route";
import {NextResponse} from 'next/server';
import prisma from "@/utils/prisma";
import {CreateChallengeSchema, BaseUpdateChallengeSchema} from "@/utils/zod";
import z from "zod";
import {checkAndAssignBadges} from "@/utils/badges";
import {Badge} from "@prisma/client";

// A union of challenge types + user id
const PostSchema = z.object({
    ...CreateChallengeSchema.shape,
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

const PutBody = BaseUpdateChallengeSchema.extend({
    challengeId: z.string(),
    userId: z.string(),
    deadline: z.preprocess((val) => new Date(val as string), z.date())
}).refine((data) => data.progress <= data.target, {
    message: "La progression ne peut pas dépasser la cible",
    path: ["progress"],
});

export const PUT = createZodRoute().body(PutBody).handler(async (_, context) => {
    const {
        challengeId,
        type,
        target,
        progress,
        deadline,
        userId
    } = context.body;

    const challenge = await prisma.readingGoal.findUnique({
        where: {id: challengeId},
    });

    if (!challenge) {
        return NextResponse.json({error: 'Challenge not found'}, {status: 404});
    }

    if (challenge.userId !== userId) {
        return NextResponse.json({error: 'User does not own this challenge'}, {status: 403});
    }

    const wasCompleted = challenge.completedAt !== null;
    const willBeCompleted = progress >= target;

    const updatedChallenge = await prisma.readingGoal.update({
        where: {id: challengeId},
        data: {
            type,
            target,
            deadline,
            progress,
            completedAt: willBeCompleted ? new Date() : null,
        }
    });

    if (!updatedChallenge) {
        return NextResponse.json({error: 'Error while updating challenge'}, {status: 500});
    }

    // Si le challenge vient d'être complété, vérifier les badges
    let newBadges: Badge[] = [];
    if (willBeCompleted && !wasCompleted) {
        newBadges = await checkAndAssignBadges(userId);
    }

    return NextResponse.json({
        challenge: updatedChallenge,
        badgesAwarded: newBadges.length > 0,
        newBadges
    }, {status: 200});
})

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
