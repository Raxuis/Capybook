import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import prisma from "@/utils/prisma";
import {NextJSContext, validateBody, validateParams, withErrorHandling} from "@/utils/api-validation";

const UserBookSchema = z.object({
    userId: z.string(),
    book: z.object({
        key: z.string(),
        title: z.string(),
        author_name: z.array(z.string()).optional(),
        cover_i: z.number().optional(),
        number_of_pages: z.number().nullable().optional(),
        genres: z.array(z.string()).optional(),
    }),
});

async function handlePost(
    request: NextRequest
): Promise<NextResponse> {
    const {userId, book} = await validateBody(request, UserBookSchema);
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
            data: {
                key: book.key,
                title: book.title,
                authors: book.author_name,
                cover: book.cover_i ? "https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg" : undefined,
                numberOfPages: book.number_of_pages ?? null,
            }
        });

        if (book.genres && book.genres.length > 0) {
            for (const genreName of book.genres) {
                const genre = await prisma.genre.upsert({
                    where: {name: genreName},
                    update: {},
                    create: {name: genreName}
                });

                await prisma.bookGenre.create({
                    data: {
                        bookId: newBook.id,
                        genreId: genre.id
                    }
                });
            }
        }
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
            bookId: newBook.id,
            progressType: book.number_of_pages ? 'numberOfPages' : 'percentage',
        }
    });

    return NextResponse.json(
        {message: `User with id: ${userId} added book with title: ${book.title}`}, {status: 201});
}

async function handleDelete(
    _: NextRequest,
    context: NextJSContext
): Promise<NextResponse> {
    const {userId, bookKey} = await validateParams(
        context.params,
        z.object({
            userId: z.string(),
            bookKey: z.string()
        })
    );

    if (!userId || !bookKey) {
        return NextResponse.json({error: 'User ID and Book Key are required'}, {status: 400});
    }

    const user = await prisma.user.findUnique({
        where: {id: userId}
    });

    if (!user) {
        return NextResponse.json({error: 'User does not exist'}, {status: 400});
    }

    const book = await prisma.book.findUnique({
        where: {key: bookKey}
    });

    if (!book) {
        return NextResponse.json({error: 'Book does not exist'}, {status: 400});
    }

    const userBookEntry = await prisma.userBook.findFirst({
        where: {userId, bookId: book.id}
    });

    if (!userBookEntry) {
        return NextResponse.json({error: 'User does not have this book'}, {status: 400});
    }

    await prisma.userBook.delete({
        where: {id: userBookEntry.id}
    });

    return NextResponse.json(
        {
            message: `User with id: ${userId} removed book with key: ${bookKey} and title: ${book.title}`
        }, {status: 201});
}

export const POST = withErrorHandling(handlePost);
export const DELETE = withErrorHandling(handleDelete);