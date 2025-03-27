import {z} from "zod";
import {createZodRoute} from "next-zod-route";
import {NextResponse} from 'next/server';
import prisma from "@/utils/prisma";

const bodySchema = z.object({
    bookId: z.string(),
    userId: z.string(),
    isCurrentBook: z.boolean(),
});

export const PUT = createZodRoute().body(bodySchema).handler(async (_, context) => {
    const {bookId, userId, isCurrentBook} = context.body;

    const book = await prisma.book.findUnique({
        where: {id: bookId},
    });

    if (!book) {
        return NextResponse.json({error: "No book with the corresponding id."}, {status: 404});
    }

    const userBook = await prisma.userBook.findFirst({
        where: {bookId, userId},
    });

    if (!userBook) {
        return NextResponse.json({error: "User doesn't have this book yet."}, {status: 400});
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

    return NextResponse.json({data: updatedBook}, {status: 200});
});
