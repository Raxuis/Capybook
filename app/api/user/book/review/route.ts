import {z} from "zod";
import {createZodRoute} from "next-zod-route";
import {NextResponse} from 'next/server';
import prisma from "@/utils/prisma";

const bodySchema = z.object({
    bookKey: z.string(),
    userId: z.string(),
    rating: z.number(),
    feedback: z.string(),
});

export const POST = createZodRoute().body(bodySchema).handler(async (_, context) => {
    const {bookKey, userId, rating, feedback} = context.body;

    if (!bookKey) {
        return NextResponse.json({error: 'Book key is required'}, {status: 400});
    }

    if (!userId) {
        return NextResponse.json({error: "User id is required"}, {status: 400});
    }

    if (rating === undefined || rating === null || rating < 1 || rating > 5) {
        return NextResponse.json({error: 'Progress is required'}, {status: 400});
    }

    if (!feedback) {
        return NextResponse.json({error: 'Feedback is required'}, {status: 400});
    }

    const book = await prisma.book.findUnique({
        where: {
            key: bookKey,
        }
    })

    if (!book) {
        return NextResponse.json({error: "No book with the corresponding key."}, {status: 404})
    }


    const userBook = await prisma.userBook.findFirst({
        where: {
            bookId: book.id,
            userId: userId,
        }
    });

    if (!userBook) {
        return NextResponse.json({error: 'User doesn\'t have this book yet.'}, {status: 400})
    }

    const newBookReview = await prisma.bookReview.upsert({
        where: {
            userId_bookId: {userId, bookId: book.id},
        },
        update: {
            rating,
            feedback,
        },
        create: {
            userId,
            bookId: book.id,
            rating,
            feedback,
        },
    });


    if (!newBookReview) {
        return NextResponse.json({error: 'An error occurred while retrieving book.'}, {status: 500})
    }

    console.log(newBookReview);

    return NextResponse.json({data: newBookReview}, {status: 200})
});