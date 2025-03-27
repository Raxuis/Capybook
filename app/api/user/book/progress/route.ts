import {z} from "zod";
import {createZodRoute} from "next-zod-route";
import {NextResponse} from 'next/server';
import prisma from "@/utils/prisma";

const bodySchema = z.object({
    bookId: z.string(),
    userId: z.string(),
    progress: z.number(),
});

export const PUT = createZodRoute().body(bodySchema).handler(async (_, context) => {
    const {bookId, userId, progress} = context.body;

    if (!bookId) {
        return NextResponse.json({error: 'Book id is required'}, {status: 400});
    }

    if (!userId) {
        return NextResponse.json({error: "User id is required"}, {status: 400});
    }

    if (progress === undefined || progress === null) {
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

    const isCurrentBookVerification = userBook.progressType === 'percentage' && progress !== 100 && progress !== 0
        || userBook.progressType === "page" && progress !== book.numberOfPages && progress !== 0;

    const isBookFinishedVerification = userBook.progressType === "page" && progress === book.numberOfPages || userBook.progressType === "percentage" && progress === 100;

    const newBook = await prisma.userBook.update({
        where: {
            userId_bookId: {userId, bookId}
        },
        data: {
            progress,
            isCurrentBook: isCurrentBookVerification,
            finishedAt: isBookFinishedVerification ? new Date() : null,
        }
    });


    if (!newBook) {
        return NextResponse.json({error: 'An error occurred while retrieving book.'}, {status: 500})
    }

    if (progress === 100) {
        const userReadingGoals = await prisma.readingGoal.findMany({
            where: {userId: userId}
        });

        await Promise.all(userReadingGoals.map(async (goal) => {
            if (goal.type === 'BOOKS') {
                await prisma.readingGoal.update({
                    where: {id: goal.id},
                    data: {
                        progress: goal.target === goal.progress + 1 ? goal.target : goal.progress + 1,
                    }
                });
            }
        }));
    }


    return NextResponse.json({data: newBook}, {status: 200})
});