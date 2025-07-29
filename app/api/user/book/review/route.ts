import {NextRequest, NextResponse} from 'next/server';
import {z} from "zod";
import prisma from "@/utils/prisma";
import {checkAndAssignBadges} from "@/utils/badges";
import {validateBody, withErrorHandling, createResponse, createErrorResponse} from "@/utils/api-validation";

const bodySchema = z.object({
    bookKey: z.string().min(1, "La clé du livre est requise"),
    userId: z.string().uuid("L'ID utilisateur doit être un UUID valide"),
    rating: z.number()
        .min(1, "La note doit être au minimum de 1")
        .max(5, "La note doit être au maximum de 5")
        .int("La note doit être un nombre entier"),
    feedback: z.string().min(1, "Le commentaire est requis"),
    privacy: z.enum(['PUBLIC', 'PRIVATE', 'FRIENDS', 'SPECIFIC_FRIEND'], {
        errorMap: () => ({message: "Le niveau de confidentialité doit être PUBLIC, PRIVATE, FRIENDS ou SPECIFIC_FRIEND"})
    }),
    specificFriendId: z.string().uuid("L'ID de l'ami spécifique doit être un UUID valide").optional(),
});

async function handlePost(
    request: NextRequest
): Promise<NextResponse> {
    const {bookKey, userId, rating, feedback, privacy, specificFriendId} = await validateBody(request, bodySchema);

    const book = await prisma.book.findUnique({
        where: {key: bookKey}
    });

    if (!book) {
        return createErrorResponse("Aucun livre trouvé avec cette clé", 404);
    }

    const userBook = await prisma.userBook.findFirst({
        where: {
            bookId: book.id,
            userId: userId,
        }
    });

    if (!userBook) {
        return createErrorResponse("L'utilisateur ne possède pas encore ce livre", 400);
    }

    // Valider la sélection d'ami spécifique
    if (privacy === 'SPECIFIC_FRIEND' && !specificFriendId) {
        return createErrorResponse("Un ami spécifique doit être sélectionné pour ce niveau de confidentialité", 400);
    }

    // Vérifier que l'amitié existe si un ami spécifique est sélectionné
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
            return createErrorResponse("Vous n'êtes pas ami avec l'utilisateur sélectionné", 400);
        }
    }

    const newBookReview = await prisma.bookReview.upsert({
        where: {
            userId_bookId: {userId, bookId: book.id},
        },
        update: {
            rating,
            feedback,
            privacy,
            specificFriendId,
        },
        create: {
            userId,
            bookId: book.id,
            rating,
            feedback,
            privacy,
            specificFriendId,
        },
    });

    if (!newBookReview) {
        return createErrorResponse("Une erreur s'est produite lors de la sauvegarde de la review", 500);
    }

    // Vérifier et assigner de nouveaux badges
    const newBadges = await checkAndAssignBadges(userId);

    // Générer le lien privé si nécessaire
    const privateLink = (newBookReview.id && newBookReview.privacy === "PRIVATE")
        ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/private-review/${newBookReview.id}`
        : null;

    return createResponse({
        data: newBookReview,
        badges: {
            newBadgesCount: newBadges.length,
            newBadges: newBadges,
        },
        privateLink
    }, 201);
}

export const POST = withErrorHandling(handlePost);