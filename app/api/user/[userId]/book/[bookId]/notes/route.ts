import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/utils/prisma";
import {auth} from "@/auth";
import {BookNoteType} from '@prisma/client';
import {z} from 'zod';
import type {Prisma} from '@prisma/client';
import {
    validateParams,
    validateBody,
    validateSearchParams,
    withErrorHandling,
    createResponse,
    createErrorResponse, NextJSContext
} from "@/utils/api-validation";

const paramsSchema = z.object({
    bookId: z.string().min(1, "L'ID du livre est requis"),
});

const postBodySchema = z.object({
    note: z.string().min(1, 'Le contenu de la note est requis'),
    page: z.string().optional(),
    chapter: z.string().optional(),
    tags: z.array(z.string()).optional(),
    type: z.nativeEnum(BookNoteType).optional(),
});

const getSearchParamsSchema = z.object({
    search: z.string().optional().default(''),
    tags: z.string().optional().default(''),
    sortBy: z.string().optional().default('createdAt'),
});

async function handleGet(
    request: NextRequest,
    context: NextJSContext
): Promise<NextResponse> {
    const session = await auth();

    if (!session?.user?.id) {
        return createErrorResponse('Non autorisé', 401);
    }

    const {bookId} = await validateParams(context.params, paramsSchema);

    const {search, tags: tagsParam, sortBy} = validateSearchParams(
        new URL(request.url).searchParams,
        getSearchParamsSchema
    );

    const tags = tagsParam?.split(',').filter(Boolean);

    // Typage explicite pour Prisma
    const whereCondition: Prisma.UserBookNotesWhereInput = {
        userId: session.user.id,
        bookId: bookId,
    };

    // Filtrage par recherche
    if (search) {
        whereCondition.OR = [
            {note: {contains: search, mode: 'insensitive'}},
        ];
    }

    // Filtrage par tags
    if (tags && tags.length > 0) {
        whereCondition.tags = {
            hasSome: tags,
        };
    }

    // Tri
    const orderBy: Prisma.UserBookNotesOrderByWithRelationInput = {};
    switch (sortBy) {
        case 'page':
            orderBy.page = 'asc';
            break;
        case 'createdAt':
            orderBy.createdAt = 'desc';
            break;
        default:
            orderBy.createdAt = 'desc';
    }

    const notes = await prisma.userBookNotes.findMany({
        where: whereCondition,
        orderBy,
        include: {
            User: {
                select: {
                    name: true,
                    username: true,
                },
            },
            Book: {
                select: {
                    title: true,
                },
            },
        },
    });

    return createResponse(notes);
}

async function handlePost(
    request: NextRequest,
    context: NextJSContext
): Promise<NextResponse> {
    const session = await auth();

    if (!session?.user?.id) {
        return createErrorResponse('Non autorisé', 401);
    }

    const {bookId} = await validateParams(context.params, paramsSchema);
    const {note, page, chapter, tags, type} = await validateBody(request, postBodySchema);

    // Vérifier que le livre existe
    const book = await prisma.book.findUnique({
        where: {id: bookId},
    });

    if (!book) {
        return createErrorResponse('Livre non trouvé', 404);
    }

    const newNote = await prisma.userBookNotes.create({
        data: {
            userId: session.user.id,
            bookId: bookId,
            note: note.trim(),
            page: page ? parseInt(page) : null,
            chapter: chapter ? parseInt(chapter) : null,
            tags: tags || [],
            type: type as BookNoteType || 'NOTE',
        },
        include: {
            User: {
                select: {
                    name: true,
                    username: true,
                },
            },
            Book: {
                select: {
                    title: true,
                },
            },
        },
    });

    return createResponse(newNote, 201);
}

export const GET = withErrorHandling(handleGet);
export const POST = withErrorHandling(handlePost);