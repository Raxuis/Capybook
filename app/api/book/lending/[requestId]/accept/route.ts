import {z} from "zod";
import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/utils/prisma";
import {
    validateParams,
    validateBody,
    withErrorHandling,
    createResponse,
    createErrorResponse,
    RouteContext
} from "@/utils/api-validation";

const bodySchema = z.object({
    borrowerId: z.string().min(1, "L'ID de l'emprunteur est requis"),
});

const paramsSchema = z.object({
    requestId: z.string().min(1, "L'ID de la demande est requis"),
});

async function handlePut(
    request: NextRequest,
    context: RouteContext
): Promise<NextResponse> {
    const {borrowerId} = await validateBody(request, bodySchema);
    const {requestId} = await validateParams(context.params, paramsSchema);

    const lendingRequest = await prisma.bookLending.findUnique({
        where: {id: requestId},
        include: {
            lender: true,
            borrower: true,
            book: true
        }
    });

    if (!lendingRequest) {
        return createErrorResponse("Demande de prêt non trouvée.", 404);
    }

    if (lendingRequest.borrowerId !== borrowerId) {
        return createErrorResponse("Vous n'êtes pas autorisé à accepter cette demande.", 403);
    }

    if (lendingRequest.status !== 'PENDING') {
        return createErrorResponse("Cette demande n'est plus en attente.", 400);
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const updatedLendingRequest = await prisma.bookLending.update({
        where: {id: requestId},
        data: {
            status: 'ACCEPTED',
            acceptedAt: new Date(),
            dueDate: dueDate,
        },
        include: {
            lender: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                }
            },
            borrower: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                }
            },
            book: {
                select: {
                    id: true,
                    key: true,
                    title: true,
                    authors: true,
                    cover: true,
                    numberOfPages: true
                }
            }
        }
    });

    return createResponse({
        message: "Demande acceptée avec succès",
        data: updatedLendingRequest
    });
}

export const PUT = withErrorHandling(handlePut);