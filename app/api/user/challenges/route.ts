import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/utils/prisma";
import {CreateChallengeSchema, BaseUpdateChallengeSchema} from "@/utils/zod";
import {z} from "zod";
import {checkAndAssignBadges} from "@/utils/badges";
import {updateReadingStats} from "@/utils/readingStats";
import {Badge} from "@prisma/client";
import {validateBody, withErrorHandling, createResponse, createErrorResponse} from "@/utils/api-validation";

// A union of challenge types + user id
const PostSchema = z.object({
    ...CreateChallengeSchema.shape,
    userId: z.string(),
    deadline: z.preprocess((val) => new Date(val as string), z.date()),
});

async function handlePost(request: NextRequest): Promise<NextResponse> {
    const {
        type,
        userId,
        target,
        deadline
    } = await validateBody(request, PostSchema);

    const user = await prisma.user.findUnique({
        where: {id: userId}
    });

    if (!user) {
        return createErrorResponse('User does not exist', 400);
    }

    const existingGoal = await prisma.readingGoal.findFirst({
        where: {
            userId,
            type,
            deadline,
            completedAt: null,
        },
    });

    if (existingGoal) {
        return createErrorResponse(
            "You already have an active goal of this type for this deadline.",
            409
        );
    }

    const newChallenge = await prisma.readingGoal.create({
        data: {
            userId: user.id,
            type,
            target,
            deadline,
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id, ...challengeWithoutId} = newChallenge;

    return createResponse({challenge: challengeWithoutId}, 201);
}

const PutBody = BaseUpdateChallengeSchema.extend({
    challengeId: z.string(),
    userId: z.string(),
    deadline: z.preprocess((val) => new Date(val as string), z.date())
}).refine((data) => data.progress <= data.target, {
    message: "La progression ne peut pas dépasser la cible",
    path: ["progress"],
});

async function handlePut(request: NextRequest): Promise<NextResponse> {
    const {
        challengeId,
        type,
        target,
        progress,
        deadline,
        userId
    } = await validateBody(request, PutBody);

    const challenge = await prisma.readingGoal.findUnique({
        where: {id: challengeId},
    });

    if (!challenge) {
        return createErrorResponse('Challenge not found', 404);
    }

    if (challenge.userId !== userId) {
        return createErrorResponse('User does not own this challenge', 403);
    }

    const wasCompleted = challenge.completedAt !== null;
    const willBeCompleted = progress >= target;

    // Calculer le progrès ajouté lors de cette mise à jour
    const progressAdded = progress - challenge.progress;

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
        return createErrorResponse('Error while updating challenge', 500);
    }

    // Mise à jour des statistiques de lecture si le progrès a augmenté
    if (progressAdded > 0) {
        await updateReadingStats(userId, type, progressAdded);
    }

    // Si le challenge vient d'être complété, vérifier les badges
    let newBadges: Badge[] = [];
    if (willBeCompleted && !wasCompleted) {
        newBadges = await checkAndAssignBadges(userId);
    }

    return createResponse({
        challenge: updatedChallenge,
        badgesAwarded: newBadges.length > 0,
        newBadges
    });
}

const DeleteSchema = z.object({
    challengeId: z.string(),
    userId: z.string()
});

async function handleDelete(request: NextRequest): Promise<NextResponse> {
    const {challengeId, userId} = await validateBody(request, DeleteSchema);

    const challenge = await prisma.readingGoal.findUnique({
        where: {id: challengeId},
    });

    if (!challenge) {
        return createErrorResponse('Challenge not found', 404);
    }

    if (challenge.userId !== userId) {
        return createErrorResponse('User does not own this challenge', 403);
    }

    await prisma.readingGoal.delete({
        where: {
            id: challengeId,
        },
    });

    return createResponse({success: true});
}

export const POST = withErrorHandling(handlePost);
export const PUT = withErrorHandling(handlePut);
export const DELETE = withErrorHandling(handleDelete);