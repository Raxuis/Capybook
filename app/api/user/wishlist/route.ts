import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import prisma from "@/lib/db/prisma";
import {
    validateBody,
    withErrorHandling,
    createResponse,
    createErrorResponse
} from "@/utils/api-validation";

const UserWishlistSchema = z.object({
    userId: z.string().min(1, "L'ID utilisateur est requis"),
    book: z.object({
        key: z.string().min(1, "La clé du livre est requise"),
        title: z.string().min(1, "Le titre du livre est requis"),
        author_name: z.array(z.string()).optional(),
        cover_i: z.number().optional(),
    })
});

async function handlePost(request: NextRequest): Promise<NextResponse> {
    const {userId, book} = await validateBody(request, UserWishlistSchema);

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
        where: {id: userId}
    });

    if (!user) {
        return createErrorResponse('Utilisateur introuvable', 404);
    }

    // Chercher ou créer le livre
    let newBook = await prisma.book.findUnique({
        where: {key: book.key}
    });

    if (!newBook) {
        const coverUrl = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : null;

        newBook = await prisma.book.create({
            data: {
                key: book.key,
                title: book.title,
                authors: book.author_name || [],
                cover: coverUrl
            }
        });
    }

    // Vérifier si le livre est déjà dans la wishlist
    const existingWishlistEntry = await prisma.userBookWishlist.findUnique({
        where: {
            userId_bookId: {
                userId,
                bookId: newBook.id
            }
        }
    });

    if (existingWishlistEntry) {
        return createErrorResponse('Ce livre est déjà dans votre liste de souhaits', 409);
    }

    // Ajouter le livre à la wishlist
    await prisma.userBookWishlist.create({
        data: {
            userId,
            bookId: newBook.id
        }
    });

    return createResponse({
        message: 'Livre ajouté à la liste de souhaits avec succès',
        bookId: newBook.id,
        userId: userId
    }, 201);
}

async function handleDelete(request: NextRequest): Promise<NextResponse> {
    const {userId, book} = await validateBody(request, UserWishlistSchema);

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
        where: {id: userId}
    });

    if (!user) {
        return createErrorResponse('Utilisateur introuvable', 404);
    }

    // Chercher le livre
    const existingBook = await prisma.book.findUnique({
        where: {key: book.key}
    });

    if (!existingBook) {
        return createErrorResponse('Livre introuvable', 404);
    }

    // Vérifier si le livre est dans la wishlist
    const existingWishlistEntry = await prisma.userBookWishlist.findUnique({
        where: {
            userId_bookId: {
                userId,
                bookId: existingBook.id
            }
        }
    });

    if (!existingWishlistEntry) {
        return createErrorResponse('Ce livre n\'est pas dans votre liste de souhaits', 404);
    }

    // Supprimer de la wishlist
    await prisma.userBookWishlist.delete({
        where: {
            userId_bookId: {
                userId,
                bookId: existingBook.id
            }
        }
    });

    return createResponse({
        message: 'Livre retiré de la liste de souhaits avec succès',
        bookId: existingBook.id,
        userId: userId
    });
}

export const POST = withErrorHandling(handlePost);
export const DELETE = withErrorHandling(handleDelete);
