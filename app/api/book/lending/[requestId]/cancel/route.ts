import {z} from "zod";
import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/lib/db/prisma";
import {
    validateParams,
    withErrorHandling,
    createResponse,
    createErrorResponse
} from "@/utils/api-validation";

const paramsSchema = z.object({
    requestId: z.string().min(1, "L'ID de la demande est requis"),
});

async function handlePut(
    _: NextRequest,
    context: { params: Promise<{ [key: string]: string | string[] }> }
): Promise<NextResponse> {
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

    if (lendingRequest.status !== 'PENDING') {
        return createErrorResponse("Cette demande n'est plus en attente.", 400);
    }

    await prisma.bookLending.delete({
        where: {id: requestId}
    })

    return createResponse({
        message: "Demande supprimée avec succès"
    });
}

export const PUT = withErrorHandling(handlePut);