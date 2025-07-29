import {NextRequest, NextResponse} from 'next/server';
import {z} from "zod";
import prisma from "@/utils/prisma";
import {validateBody, withErrorHandling, createResponse, createErrorResponse} from "@/utils/api-validation";

const bodySchema = z.object({
    bookId: z.string().uuid("L'ID du livre doit être un UUID valide"),
    userId: z.string().uuid("L'ID utilisateur doit être un UUID valide"),
    progressType: z.enum(['percentage', 'numberOfPages'], {
        errorMap: () => ({message: "Le type de progrès doit être 'percentage' ou 'numberOfPages'"})
    }),
});

async function handlePut(
    request: NextRequest
): Promise<NextResponse> {
    const {bookId, userId, progressType} = await validateBody(request, bodySchema);

    const book = await prisma.book.findUnique({
        where: {id: bookId}
    });

    if (!book) {
        return createErrorResponse("Aucun livre trouvé avec cet ID", 404);
    }

    const userBook = await prisma.userBook.findFirst({
        where: {
            bookId: bookId,
            userId: userId,
        }
    });

    if (!userBook) {
        return createErrorResponse("L'utilisateur ne possède pas encore ce livre", 400);
    }

    if (progressType === 'numberOfPages' && !book.numberOfPages) {
        return createErrorResponse(
            "Impossible de passer au suivi par pages : le nombre de pages du livre n'est pas défini",
            400
        );
    }

    let newProgress = userBook.progress;

    if (userBook.progressType !== progressType) {
        if (progressType === 'percentage' && userBook.progressType === 'numberOfPages' && book.numberOfPages) {
            newProgress = Math.round((userBook.progress / book.numberOfPages) * 100);
        } else if (progressType === 'numberOfPages' && userBook.progressType === 'percentage' && book.numberOfPages) {
            newProgress = Math.round((userBook.progress / 100) * book.numberOfPages);
        } else {
            newProgress = 0;
        }
    }

    const updatedUserBook = await prisma.userBook.update({
        where: {
            userId_bookId: {userId, bookId}
        },
        data: {
            progressType,
            progress: newProgress,
            isCurrentBook: newProgress > 0 && newProgress < (progressType === 'percentage' ? 100 : book.numberOfPages || 0),
            finishedAt: (
                (progressType === 'percentage' && newProgress === 100) ||
                (progressType === 'numberOfPages' && newProgress === book.numberOfPages)
            ) ? userBook.finishedAt || new Date() : null
        }
    });

    if (!updatedUserBook) {
        return createErrorResponse("Une erreur s'est produite lors de la mise à jour du livre", 500);
    }

    return createResponse({
        data: updatedUserBook,
        message: `Type de progrès changé vers ${progressType === 'percentage' ? 'pourcentage' : 'nombre de pages'}`,
        conversionApplied: userBook.progressType !== progressType,
        previousProgress: userBook.progress,
        newProgress: newProgress
    });
}

export const PUT = withErrorHandling(handlePut);