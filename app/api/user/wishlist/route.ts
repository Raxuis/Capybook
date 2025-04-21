import {createZodRoute} from 'next-zod-route';
import {NextResponse} from 'next/server';
import {z} from 'zod';
import prisma from "@/utils/prisma";

const UserWishlistSchema = z.object({
    userId: z.string(),
    book: z.object(
        {
            key: z.string(),
            title: z.string(),
            author_name: z.array(z.string()).optional(),
            cover_i: z.number().optional(),
        }
    ),
});

export const POST = createZodRoute()
    .body(UserWishlistSchema)
    .handler(async (_, context) => {
        try {
            const {userId, book} = context.body;

            const user = await prisma.user.findUnique({
                where: {id: userId}
            });

            if (!user) {
                return NextResponse.json({error: 'User does not exist'}, {status: 400});
            }

            if (!book) {
                return NextResponse.json({error: 'Book is required'}, {status: 400});
            }

            let newBook = await prisma.book.findUnique({
                where: {key: book.key}
            });

            if (!newBook) {
                newBook = await prisma.book.create({
                    data: {
                        key: book.key,
                        title: book.title,
                        authors: book.author_name,
                        cover: "https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg"
                    }
                });
            }

            const existingWishlistEntry = await prisma.userBookWishlist.findUnique({
                where: {
                    userId_bookId: {
                        userId,
                        bookId: newBook.id
                    }
                }
            });

            if (existingWishlistEntry) {
                return NextResponse.json({error: 'User already added this book to wishlist'}, {status: 400});
            }

            await prisma.userBookWishlist.create({
                data: {
                    userId,
                    bookId: newBook.id
                }
            });

            return NextResponse.json(
                {message: `User with id: ${userId} added book with id: ${newBook.id} to wishlist`},
                {status: 201}
            );
        } catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({error: error.issues}, {status: 400});
            }
            console.error("Unexpected error:", error);
            return NextResponse.json({error: "Internal Server Error"}, {status: 500});
        }
    });

export const DELETE = createZodRoute()
    .handler(async (request, context) => {
        try {
            const data = await request.json();
            const {error} = UserWishlistSchema.safeParse(data);
            if (error) {
                return NextResponse.json({error: error.errors}, {status: 400});
            }
            const {userId, book} = data;

            const user = await prisma.user.findUnique({
                where: {id: userId}
            });

            if (!user) {
                return NextResponse.json({error: 'User does not exist'}, {status: 400});
            }

            if (!book || !book.key || !book.title) {
                return NextResponse.json({error: 'Book is required'}, {status: 400});
            }

            let newBook = await prisma.book.findUnique({
                where: {key: book.key}
            });

            if (!newBook) {
                newBook = await prisma.book.create({
                    data: {
                        key: book.key,
                        title: book.title,
                        authors: book.author_name,
                        cover: "https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg"
                    }
                });
            }

            const existingWishlistEntry = await prisma.userBookWishlist.findFirst({
                where: {userId, bookId: newBook.id}
            });

            if (!existingWishlistEntry) {
                return NextResponse.json({error: 'User does not have this book in wishlist'}, {status: 400});
            }

            const userBookEntry = await prisma.userBookWishlist.findFirst({
                where: {userId, bookId: newBook.id}
            });

            if (userBookEntry) {
                await prisma.userBookWishlist.delete({
                    where: {id: userBookEntry.id}
                });
            }

            return NextResponse.json(
                {message: `User with id: ${userId} removed book with id: ${newBook.id} from wishlist`},
                {status: 201}
            );
        } catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({error: error.issues}, {status: 400});
            }
            console.error("Unexpected error:", error);
            return NextResponse.json({error: "Internal Server Error"}, {status: 500});
        }
    });
