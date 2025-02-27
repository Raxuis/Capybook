import {createZodRoute} from 'next-zod-route';
import {NextResponse} from 'next/server';
import {z} from 'zod';
import prisma from "@/utils/prisma";

const UserBookSchema = z.object({
    userId: z.string(),
    book: z.object(
        {
            key: z.string(),
            title: z.string()
        }
    ),
});

export const POST = createZodRoute()
    .body(UserBookSchema)
    .handler(async (request, context) => {
        try {
            const {userId, book} = context.body;

            const user = await prisma.user.findUnique({
                where: {id: userId}
            });

            if (!user) {
                return NextResponse.json({error: 'User does not exist'}, {status: 400});
            }

            let newBook = await prisma.book.findUnique({
                where: {key: book.key}
            });

            if (!newBook) {
                newBook = await prisma.book.create({
                    data: {key: book.key, title: book.title}
                });
            }

            const existingUserBook = await prisma.userBook.findFirst({
                where: {userId, bookId: newBook.id}
            });

            if (existingUserBook) {
                return NextResponse.json({error: 'User already added this book'}, {status: 400});
            }

            await prisma.userBook.create({
                data: {
                    userId,
                    bookId: newBook.id
                }
            });

            return NextResponse.json(
                {
                    message: `User with id: ${userId} added book with key: ${book.key} and title: ${book.title}`
                }, {status: 201});
        } catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({error: error.issues}, {status: 400});
            }
            console.error("Unexpected error:", error);
            return NextResponse.json({error: "Internal Server Error"}, {status: 500});
        }
    });


export const DELETE = createZodRoute()
    .body(UserBookSchema)
    .handler(async (request, context) => {
        try {
            const {userId, book} = context.body;

            const user = await prisma.user.findUnique({
                where: {id: userId}
            });

            if (!user) {
                return NextResponse.json({error: 'User does not exist'}, {status: 400});
            }

            let newBook = await prisma.book.findUnique({
                where: {key: book.key}
            });

            if (!newBook) {
                newBook = await prisma.book.create({
                    data: {key: book.key, title: book.title}
                });
            }

            const existingUserBook = await prisma.userBook.findFirst({
                where: {userId, bookId: newBook.id}
            });

            if (!existingUserBook) {
                return NextResponse.json({error: 'User does not have this book'}, {status: 400});
            }

            const userBookEntry = await prisma.userBook.findFirst({
                where: {userId, bookId: newBook.id}
            });

            if (userBookEntry) {
                await prisma.userBook.delete({
                    where: {id: userBookEntry.id}
                });
            }

            return NextResponse.json(
                {
                    message: `User with id: ${userId} removed book with key: ${book.key} and title: ${book.title}`
                }, {status: 201});
        } catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({error: error.issues}, {status: 400});
            }
            console.error("Unexpected error:", error);
            return NextResponse.json({error: "Internal Server Error"}, {status: 500});
        }
    });
