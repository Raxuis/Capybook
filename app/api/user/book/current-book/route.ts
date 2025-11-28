import {z} from "zod";
import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/utils/prisma";
import {validateBody, withErrorHandling, createResponse, createErrorResponse} from "@/utils/api-validation";

const bodySchema = z.object({
    bookId: z.string(),
    userId: z.string(),
    isCurrentBook: z.boolean(),
});

async function handlePut(request: NextRequest): Promise<NextResponse> {
    const {bookId, userId, isCurrentBook} = await validateBody(request, bodySchema);

    const book = await prisma.book.findUnique({
        where: {id: bookId},
    });

    if (!book) {
        return createErrorResponse("No book with the corresponding id.", 404);
    }

    const userBook = await prisma.userBook.findFirst({
        where: {bookId, userId},
    });

    if (!userBook) {
        return createErrorResponse("User doesn't have this book yet.", 400);
    }

    // Vérifie si l'utilisateur a déjà un `currentBook`
    const existingCurrentBook = await prisma.userBook.findFirst({
        where: {userId, isCurrentBook: true},
    });

    // Si l'utilisateur veut activer `isCurrentBook', on désactive l'ancien livre en tant que "currentBook".
    if (isCurrentBook && existingCurrentBook) {
        await prisma.userBook.update({
            where: {id: existingCurrentBook.id},
            data: {isCurrentBook: false},
        });
    }

    const updatedBook = await prisma.userBook.update({
        where: {id: userBook.id},
        data: {isCurrentBook},
    });

    return createResponse({data: updatedBook});
}

export const PUT = withErrorHandling(handlePut);