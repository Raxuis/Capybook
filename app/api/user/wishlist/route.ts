import { createZodRoute } from 'next-zod-route';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from "@/utils/prisma";

const UserWishlistSchema = z.object({
  userId: z.string(),
  bookKey: z.string(),
});

export const POST = createZodRoute()
  .body(UserWishlistSchema)
  .handler(async (request, context) => {
    try {
      const { userId, bookKey } = context.body;

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return NextResponse.json({ error: 'User does not exist' }, { status: 400 });
      }

      if (!bookKey) {
        return NextResponse.json({ error: 'Book key is required' }, { status: 400 });
      }

      let book = await prisma.book.findUnique({
        where: { key: bookKey }
      });

      if (!book) {
        book = await prisma.book.create({
          data: { key: bookKey }
        });
      }

      const existingWishlistEntry = await prisma.userBookWishlist.findFirst({
        where: { userId, bookId: book.id }
      });

      if (existingWishlistEntry) {
        return NextResponse.json({ error: 'User already added this book to wishlist' }, { status: 400 });
      }

      console.log(book)

      await prisma.userBookWishlist.create({
        data: {
          userId,
          bookId: book.id
        }
      });

      return NextResponse.json(
        { message: `User with id: ${userId} added book with id: ${book.id} to wishlist` },
        { status: 201 }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      console.error("Unexpected error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  });

export const DELETE = createZodRoute()
  .body(UserWishlistSchema)
  .handler(async (request, context) => {
    try {
      const { userId, bookKey } = context.body;

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return NextResponse.json({ error: 'User does not exist' }, { status: 400 });
      }

      if (!bookKey) {
        return NextResponse.json({ error: 'Book key is required' }, { status: 400 });
      }

      let book = await prisma.book.findUnique({
        where: { key: bookKey }
      });

      if (!book) {
        book = await prisma.book.create({
          data: { key: bookKey }
        });
      }

      const existingWishlistEntry = await prisma.userBookWishlist.findFirst({
        where: { userId, bookId: book.id }
      });

      if (!existingWishlistEntry) {
        return NextResponse.json({ error: 'User does not have this book in wishlist' }, { status: 400 });
      }

      const userBookEntry = await prisma.userBookWishlist.findFirst({
        where: { userId, bookId: book.id }
      });

      if (userBookEntry) {
        await prisma.userBookWishlist.delete({
          where: { id: userBookEntry.id }
        });
      }

      return NextResponse.json(
        { message: `User with id: ${userId} removed book with id: ${book.id} from wishlist` },
        { status: 201 }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      console.error("Unexpected error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  });
