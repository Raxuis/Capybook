import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/utils/prisma";
import {auth} from "@/auth";
import {BookNoteType} from '@prisma/client';
import {z} from 'zod';
import {createZodRoute} from "next-zod-route";

const paramsSchema = z.object({
    bookId: z.string(),
})

export const GET = createZodRoute()
    .params(paramsSchema)
    .handler(async (_, context, request) => {
        try {
            const session = await auth();

            if (!session?.user?.id) {
                return NextResponse.json({error: 'Non autorisé'}, {status: 401});
            }

            const {bookId} = context.params;
            const {searchParams} = new URL(request.url);
            const search = searchParams.get('search') || '';
            const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
            const sortBy = searchParams.get('sortBy') || 'createdAt';

            const whereCondition: any = {
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
            if (tags.length > 0) {
                whereCondition.tags = {
                    hasSome: tags,
                };
            }

            // Tri
            const orderBy: any = {};
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

            return NextResponse.json(notes);
        } catch (error) {
            console.error('Erreur lors de la récupération des notes:', error);
            return NextResponse.json(
                {error: 'Erreur interne du serveur'},
                {status: 500}
            );
        }
    })


const putBodySchema = z.object({
    note: z.string().min(1, 'Le contenu de la note est requis'),
    page: z.string().optional(),
    chapter: z.string().optional(),
    tags: z.array(z.string()).optional(),
    type: z.nativeEnum(BookNoteType).optional(),
})

export const POST = createZodRoute()
    .body(putBodySchema)
    .params(paramsSchema)
    .handler(async (_, context) => {
        try {
            const session = await auth();

            if (!session?.user?.id) {
                return NextResponse.json({error: 'Non autorisé'}, {status: 401});
            }

            const {bookId} = context.params;
            const {note, page, chapter, tags, type} = context.body;

            // Vérifier que le livre existe
            const book = await prisma.book.findUnique({
                where: {id: bookId},
            });

            if (!book) {
                return NextResponse.json(
                    {error: 'Livre non trouvé'},
                    {status: 404}
                );
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

            return NextResponse.json(newNote, {status: 201});
        } catch (error) {
            console.error('Erreur lors de la création de la note:', error);
            return NextResponse.json(
                {error: 'Erreur interne du serveur'},
                {status: 500}
            );
        }
    })