import {z} from "zod";
import {createZodRoute} from "next-zod-route";
import {NextResponse} from 'next/server';
import prisma from "@/utils/prisma";

const bodySchema = z.object({
    bookId: z.string(),
    userId: z.string(),
    progressType: z.enum(['percentage', 'page']),
});

export const PUT = createZodRoute().body(bodySchema).handler(async (_, context) => {
    const {bookId, userId, progressType} = context.body;

    const book = await prisma.book.findUnique({
        where: {
            id: bookId,
        }
    })


    if (!book) {
        return NextResponse.json({error: "No book with the corresponding id."}, {status: 404})
    }


    const userBook = await prisma.userBook.findFirst({
        where: {
            bookId: bookId,
            userId: userId,
        }
    });


    if (!userBook) {
        return NextResponse.json({error: 'User doesn\'t have this book yet.'}, {status: 400})
    }

    const updatedUserBook = await prisma.userBook.update({
        where: {
            userId_bookId: {userId, bookId},
        },
        data: {
            progressType,
        }
    });

    if (!updatedUserBook) {
        return NextResponse.json({error: 'An error occurred while retrieving book.'}, {status: 500})
    }

    return NextResponse.json({data: updatedUserBook}, {status: 200})
});