import {z} from 'zod';
import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/lib/db/prisma";
import {
    validateBody,
    withErrorHandling,
    createResponse,
    createErrorResponse
} from "@/utils/api-validation";

const createLendingSchema = z.object({
    lenderId: z.string().min(1, "L'ID du prêteur est requis"),
    borrowerId: z.string().min(1, "L'ID de l'emprunteur est requis"),
    bookId: z.string().min(1, "L'ID du livre est requis"),
    message: z.string().optional()
});

async function handlePost(request: NextRequest): Promise<NextResponse> {
    const {lenderId, borrowerId, bookId, message} = await validateBody(request, createLendingSchema);

    // Vérifier que l'utilisateur prêteur possède bien le livre
    const userBook = await prisma.userBook.findFirst({
        where: {
            userId: lenderId,
            bookId: bookId
        },
        include: {
            Book: true
        }
    });

    if (!userBook) {
        return createErrorResponse('Vous ne possédez pas ce livre dans votre bibliothèque', 400);
    }

    // Vérifier que l'emprunteur existe
    const borrower = await prisma.user.findUnique({
        where: {
            id: borrowerId
        }
    });

    if (!borrower) {
        return createErrorResponse('Utilisateur emprunteur introuvable', 404);
    }

    // Vérifier qu'il n'y a pas déjà un prêt actif pour ce livre
    const existingLending = await prisma.bookLending.findFirst({
        where: {
            bookId: bookId,
            lenderId: lenderId,
            status: {
                in: ['PENDING', 'ACCEPTED']
            },
            returnedAt: null
        }
    });

    if (existingLending) {
        return createErrorResponse('Ce livre est déjà en cours de prêt', 400);
    }

    // Créer le prêt
    const lending = await prisma.bookLending.create({
        data: {
            lenderId,
            borrowerId,
            bookId,
            message,
            status: 'PENDING' // En attente d'acceptation
        },
        include: {
            lender: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    email: true
                }
            },
            borrower: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    email: true
                }
            },
            book: {
                select: {
                    id: true,
                    title: true,
                    key: true,
                    cover: true,
                    authors: true
                }
            }
        }
    });

    return createResponse({
        lending,
        message: 'Demande de prêt créée avec succès'
    });
}

export const POST = withErrorHandling(handlePost);