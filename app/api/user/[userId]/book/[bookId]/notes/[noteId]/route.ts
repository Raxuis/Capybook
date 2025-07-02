import { NextResponse } from 'next/server';
import prisma from "@/utils/prisma";
import { auth } from "@/auth";
import { BookNoteType } from '@prisma/client';
import { z } from 'zod';
import { createZodRoute } from "next-zod-route";

const paramsSchema = z.object({
  bookId: z.string(),
  noteId: z.string(),
})

const putBodySchema = z.object({
  note: z.string().min(1, 'Le contenu de la note est requis'),
  page: z.string().optional(),
  chapter: z.string().optional(),
  tags: z.array(z.string()).optional(),
  type: z.nativeEnum(BookNoteType).optional().default('NOTE'),
});

export const PUT = createZodRoute()
  .body(putBodySchema)
  .params(paramsSchema)
  .handler(async (_, context) => {
    try {
      const session = await auth();

      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      }

      const { bookId, noteId } = context.params;

      const { note, page, chapter, tags, type } = context.body;

      const existingNote = await prisma.userBookNotes.findFirst({
        where: {
          id: noteId,
          userId: session.user.id,
          bookId: bookId,
        },
      });

      if (!existingNote) {
        return NextResponse.json(
          { error: 'Note non trouvée ou non autorisée' },
          { status: 404 }
        );
      }

      const updatedNote = await prisma.userBookNotes.update({
        where: { id: noteId },
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

      return NextResponse.json(updatedNote);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la note:', error);
      return NextResponse.json(
        { error: 'Erreur interne du serveur' },
        { status: 500 }
      );
    }
  });

const DeleteBodySchema = z.object({
  bookId: z.string(),
})

const DeleteParamsSchema = z.object({
  noteId: z.string(),
})

export const DELETE = createZodRoute()
  .handler(async (request, context) => {
    try {
      const session = await auth();

      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      }

      const data = await request.json();
      const { noteId } = context.params;
      // Check if the noteId is valid
      const { error: paramsError } = DeleteParamsSchema.safeParse(data);
      const { error: bodyError } = DeleteBodySchema.safeParse(data);

      if (paramsError || bodyError) {
        return NextResponse.json({ error: paramsError || bodyError }, { status: 400 });
      }

      const { bookId } = data;

      // Vérifier que la note appartient à l'utilisateur
      const existingNote = await prisma.userBookNotes.findFirst({
        where: {
          id: noteId,
          userId: session.user.id,
          bookId: bookId,
        },
      });

      if (!existingNote) {
        return NextResponse.json(
          { error: 'Note non trouvée ou non autorisée' },
          { status: 404 }
        );
      }

      await prisma.userBookNotes.delete({
        where: { id: noteId },
      });

      return NextResponse.json({ message: 'Note supprimée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la note:', error);
      return NextResponse.json(
        { error: 'Erreur interne du serveur' },
        { status: 500 }
      );
    }
  })

const getBodySchema = z.object({
  bookId: z.string(),
  noteId: z.string(),
});

export const GET = createZodRoute().body().handler(async (request, _) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { bookId, noteId } = context.params;

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
      return NextResponse.json(
        { error: 'Note non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Erreur lors de la récupération de la note:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
})
