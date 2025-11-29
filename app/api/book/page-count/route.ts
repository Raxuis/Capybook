import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db/prisma";
import {z} from "zod";
import {
    validateBody,
    withErrorHandling,
    createResponse,
    createErrorResponse
} from "@/utils/api-validation";

const bodySchema = z.object({
    bookId: z.string().min(1, "L'ID du livre est requis"),
    pageCount: z.number().int().min(1, "Le nombre de pages doit être un entier positif"),
});

async function handlePut(request: NextRequest): Promise<NextResponse> {
    const {bookId, pageCount} = await validateBody(request, bodySchema);

    // Vérifier que le livre existe
    const existingBook = await prisma.book.findUnique({
        where: {id: bookId}
    });

    if (!existingBook) {
        return createErrorResponse("Livre non trouvé", 404);
    }

    const updatedBook = await prisma.book.update({
        where: {id: bookId},
        data: {numberOfPages: pageCount}
    });

    return createResponse({
        success: true,
        book: updatedBook
    });
}

export const PUT = withErrorHandling(handlePut);