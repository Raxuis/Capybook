import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/utils/prisma";
import {auth} from "@/auth";
import {BookNoteType} from '@prisma/client';
import {z} from 'zod';
import {
    validateParams,
    validateBody,
    withErrorHandling,
    createResponse,
    createErrorResponse
} from "@/utils/api-validation";

const paramsSchema = z.object({
    bookId: z.string().min(1, "L'ID du livre est requis"),
    noteId: z.string().min(1, "L'ID de la note est requis"),
});

const putBodySchema = z.object({
    note: z.string().min(1, 'Le contenu de la note est requis'),
    page: z.string().optional(),
    chapter: z.string().optional(),
    tags: z.array(z.string()).optional(),
    type: z.nativeEnum(BookNoteType).optional().default('NOTE'),
});

const deleteBodySchema = z.object({
    bookId: z.string().min(1, "L'ID du livre est requis"),
});

async function handleGet(
    request: NextRequest,
    {params}: { params: Record<string, string> }
): Promise<NextResponse> {
    const session = await auth();

    if (!session?.user?.id) {
        return createErrorResponse('Non autorisé', 401);
    }

    const {bookId, noteId} = await validateParams(params, paramsSchema);

    const note = await prisma.userBookNotes.findFirst({
        where: {
            id: noteId,
            userId: session.user.id,
            bookId: bookId,
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

    if (!note) {
        return createErrorResponse('Note non trouvée', 404);
    }

    return createResponse(note);
}

async function handlePut(
    request: NextRequest,
    {params}: { params: Record<string, string> }
): Promise<NextResponse> {
    const session = await auth();

    if (!session?.user?.id) {
        return createErrorResponse('Non autorisé', 401);
    }

    const {bookId, noteId} = validateParams(params, paramsSchema);
    const {note, page, chapter, tags, type} = await validateBody(request, putBodySchema);

    const existingNote = await prisma.userBookNotes.findFirst({
        where: {
            id: noteId,
            userId: session.user.id,
            bookId: bookId,
        },
    });

    if (!existingNote) {
        return createErrorResponse('Note non trouvée ou non autorisée', 404);
    }

    const updatedNote = await prisma.userBookNotes.update({
        where: {id: noteId},
        data: {
            note: note.trim(),
            page: page ? parseInt(page) : null,
            chapter: chapter ? parseInt(chapter) : null,
            tags: tags || [],
            type: type as BookNoteType || 'NOTE',
            updatedAt: new Date(),
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

    return createResponse(updatedNote);
}

async function handleDelete(
    request: NextRequest,
    {params}: { params: Record<string, string> }
): Promise<NextResponse> {
    const session = await auth();

    if (!session?.user?.id) {
        return createErrorResponse('Non autorisé', 401);
    }

    const {noteId} = await validateParams(params, z.object({noteId: z.string()}));
    const {bookId} = await validateBody(request, deleteBodySchema);

    const existingNote = await prisma.userBookNotes.findFirst({
        where: {
            id: noteId,
            userId: session.user.id,
            bookId: bookId,
        },
    });

    if (!existingNote) {
        return createErrorResponse('Note non trouvée ou non autorisée', 404);
    }

    await prisma.userBookNotes.delete({
        where: {id: noteId},
    });

    return createResponse({message: 'Note supprimée avec succès'});
}

export const GET = withErrorHandling(handleGet);
export const PUT = withErrorHandling(handlePut);
export const DELETE = withErrorHandling(handleDelete);