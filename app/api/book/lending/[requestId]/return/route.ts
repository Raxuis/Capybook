import {z} from "zod";
import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/utils/prisma";
import {
    validateParams,
    validateBody,
    withErrorHandling,
    createResponse,
    createErrorResponse,
    NextJSContext
} from "@/utils/api-validation";

const bodySchema = z.object({
    lenderId: z.string().min(1, "L'ID du prêteur est requis"),
});

const paramsSchema = z.object({
    requestId: z.string().min(1, "L'ID de la demande est requis"),
});

async function handlePut(
    request: NextRequest,
    context: NextJSContext
): Promise<NextResponse> {
    const {lenderId} = await validateBody(request, bodySchema);
    const {requestId} = await validateParams(context.params, paramsSchema);

    const bookLending = await prisma.bookLending.findUnique({
        where: {
            id: requestId
        },
        include: {
            book: true,
            lender: true,
            borrower: true
        }
    });

    if (!bookLending) {
        return createErrorResponse("Demande de prêt introuvable", 404);
    }

    if (bookLending.lenderId !== lenderId) {
        return createErrorResponse("Vous n'êtes pas autorisé à effectuer cette action", 403);
    }

    // Vérifier que le livre est actuellement prêté (status ACCEPTED et pas encore retourné)
    if (bookLending.status !== 'ACCEPTED' || bookLending.returnedAt) {
        return createErrorResponse("Ce livre n'est pas actuellement prêté ou a déjà été retourné", 400);
    }

    const updatedLending = await prisma.bookLending.update({
        where: {
            id: requestId
        },
        data: {
            status: 'RETURNED',
            returnedAt: new Date(),
            updatedAt: new Date()
        },
        include: {
            book: true,
            lender: {
                select: {
                    id: true,
                    username: true,
                    name: true
                }
            },
            borrower: {
                select: {
                    id: true,
                    username: true,
                    name: true
                }
            }
        }
    });

    return createResponse({
        message: "Livre marqué comme retourné avec succès",
        lending: updatedLending
    });
}

export const PUT = withErrorHandling(handlePut);