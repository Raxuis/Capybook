import { createZodRoute } from 'next-zod-route';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from "@/utils/prisma";

const UserBookSchema = z.object({
    userId: z.string(),
    bookKey: z.string(),
});

export const POST = createZodRoute()
    .body(UserBookSchema)
    .handler(async (request, context) => {
        try {
            const {userId, bookKey} = context.body;

            const user = await prisma.user.findUnique({
                where: {id: userId}
            });

            if (!user) {
                return NextResponse.json({error: 'User does not exist'}, {status: 400});
            }

            let book = await prisma.book.findUnique({
                where: {key: bookKey}
            });

            if (!book) {
                book = await prisma.book.create({
                    data: {key: bookKey}
                });
            }

            const existingUserBook = await prisma.userBook.findFirst({
                where: {userId, bookId: book.id}
            });

            if (existingUserBook) {
                return NextResponse.json({error: 'User already added this book'}, {status: 400});
            }
            console.log(book)

            await prisma.userBook.create({
                data: {
                    userId,
                    bookId: book.id
                }
            });

            return NextResponse.json({message: `User with id: ${userId} added book with key: ${bookKey}`}, {status: 201});
        } catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ error: error.issues }, { status: 400 });
            }
            console.error("Unexpected error:", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    });
