import {z} from "zod";
import {createZodRoute} from "next-zod-route";
import {NextResponse} from 'next/server';
import prisma from "@/utils/prisma";

const bodySchema = z.object({
    bookId: z.string(),
    userId: z.string(),
    isCurrentBook: z.boolean(),
});

export const PUT = createZodRoute().body(bodySchema).handler(async (request, context) => {
    const {bookId, userId, isCurrentBook} = context.body;
    console.log(context.body)

    if (!bookId) {
        return NextResponse.json({error: 'Book id is required'}, {status: 400});
    }

    if (!userId) {
        return NextResponse.json({error: "User id is required"}, {status: 400});
    }

    if (isCurrentBook === undefined || isCurrentBook === null) {
        return NextResponse.json({error: 'Progress is required'}, {status: 400});
    }

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

    const newBook = await prisma.userBook.updateMany({
        where: {
            userId: userId,
            bookId: bookId,
        },
        data: {
            isCurrentBook: isCurrentBook,
        }
    });

    if (!newBook) {
        return NextResponse.json({error: 'An error occurred while retrieving book.'}, {status: 500})
    }

    return NextResponse.json({data: newBook}, {status: 200})
});