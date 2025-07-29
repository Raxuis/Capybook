import {NextRequest, NextResponse} from 'next/server';
import {auth} from "@/auth";
import prisma from "@/utils/prisma";
import {z} from "zod";
import {formatUsername} from "@/utils/format";
import {
    validateParams,
    validateBody,
    withErrorHandling,
    createResponse,
    createErrorResponse
} from "@/utils/api-validation";

const paramsSchema = z.object({
    username: z.string()
        .min(1, "Le nom d'utilisateur est requis")
        .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères"),
});

const bodySchema = z.object({
    username: z.string()
        .min(1, "Le nom d'utilisateur est requis")
        .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères"),
});

async function handlePost(
    request: NextRequest
): Promise<NextResponse> {
    const session = await auth();

    if (!session?.user?.id) {
        return createErrorResponse("Non autorisé", 401);
    }

    const {username} = await validateBody(request, bodySchema);
    const formattedUsername = formatUsername(username);

    const targetUser = await prisma.user.findUnique({
        where: {username: formattedUsername},
    });

    if (!targetUser) {
        return createErrorResponse("Utilisateur non trouvé", 404);
    }

    if (targetUser.id === session.user.id) {
        return createErrorResponse("Vous ne pouvez pas vous suivre vous-même", 400);
    }

    // Vérifier si l'utilisateur suit déjà cette personne
    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: session.user.id,
                followingId: targetUser.id,
            },
        },
    });

    if (existingFollow) {
        return createErrorResponse("Vous suivez déjà cet utilisateur", 400);
    }

    await prisma.follow.create({
        data: {
            followerId: session.user.id,
            followingId: targetUser.id,
        },
    });

    return createResponse({message: "Utilisateur suivi avec succès"});
}

async function handleDelete(
    context: { params: Record<string, string | string[]> }
): Promise<NextResponse> {
    const session = await auth();

    if (!session?.user?.id) {
        return createErrorResponse("Non autorisé", 401);
    }

    const {username} = validateParams(context.params, paramsSchema);
    const formattedUsername = formatUsername(username);

    const targetUser = await prisma.user.findUnique({
        where: {username: formattedUsername},
    });

    if (!targetUser) {
        return createErrorResponse("Utilisateur non trouvé", 404);
    }

    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: session.user.id,
                followingId: targetUser.id,
            },
        },
    });

    if (!existingFollow) {
        return createErrorResponse("Vous ne suivez pas cet utilisateur", 400);
    }

    // Utilisation d'une transaction pour s'assurer que toutes les opérations sont atomiques
    await prisma.$transaction(async (tx) => {
        // Suppression de la relation de suivi
        await tx.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: targetUser.id,
                },
            },
        });

        // Supprimer tous les bookReviews où :
        // 1. L'utilisateur qu'on unfollow avait partagé des avis spécifiquement avec nous
        // 2. Nous avions partagé des avis spécifiquement avec l'utilisateur qu'on unfollow
        await tx.bookReview.deleteMany({
            where: {
                OR: [
                    // Cas 1: L'utilisateur qu'on unfollow avait des avis partagés spécifiquement avec nous
                    {
                        userId: targetUser.id,
                        privacy: "SPECIFIC_FRIEND",
                        specificFriendId: session.user.id,
                    },
                    // Cas 2: Nous avions des avis partagés spécifiquement avec l'utilisateur qu'on unfollow
                    {
                        userId: session.user.id,
                        privacy: "SPECIFIC_FRIEND",
                        specificFriendId: targetUser.id,
                    }
                ]
            },
        });
    });

    return createResponse({message: "Utilisateur non suivi avec succès"});
}

export const POST = withErrorHandling(handlePost);
export const DELETE = withErrorHandling(handleDelete);