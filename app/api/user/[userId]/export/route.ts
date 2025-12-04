import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db/prisma";
import { auth } from "@/auth";
import {
  validateParams,
  withErrorHandling,
  createResponse,
  createErrorResponse,
  NextJSContext,
} from "@/utils/api-validation";

const paramsSchema = z.object({
  userId: z.string().cuid("L'ID utilisateur doit être un CUID valide"),
});

async function handleGet(
  _: NextRequest,
  context: NextJSContext
): Promise<NextResponse> {
  const { userId } = await validateParams(context.params, paramsSchema);

  // Vérifier l'authentification
  const session = await auth();
  if (!session?.user?.id) {
    return createErrorResponse("Non authentifié", 401);
  }

  // Vérifier que l'utilisateur demande ses propres données
  if (session.user.id !== userId) {
    return createErrorResponse("Accès non autorisé", 403);
  }

  try {
    // Récupérer toutes les données de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        UserBook: {
          include: {
            Book: true,
          },
        },
        UserBookWishlist: {
          include: {
            Book: true,
          },
        },
        UserBookNotes: {
          include: {
            Book: true,
          },
        },
        BookReview: {
          include: {
            Book: true,
          },
        },
        ReadingGoal: true,
        UserBadge: {
          include: {
            Badge: true,
          },
        },
        ReadingProgress: {
          include: {
            readingDay: true,
          },
        },
        ReadingDay: true,
        followers: {
          include: {
            follower: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        following: {
          include: {
            following: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        lentBooks: {
          include: {
            book: true,
            borrower: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        borrowedBooks: {
          include: {
            book: true,
            lender: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        dailyBookViews: true,
      },
    });

    if (!user) {
      return createErrorResponse("Utilisateur non trouvé", 404);
    }

    // Exclure le mot de passe
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user;

    // Formater les données pour l'export
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        name: userData.name,
        image: userData.image,
        favoriteColor: userData.favoriteColor,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
      books: userData.UserBook.map((ub) => ({
        book: {
          key: ub.Book.key,
          title: ub.Book.title,
          authors: ub.Book.authors,
          cover: ub.Book.cover,
          numberOfPages: ub.Book.numberOfPages,
        },
        progress: ub.progress,
        progressType: ub.progressType,
        isCurrentBook: ub.isCurrentBook,
        finishedAt: ub.finishedAt,
        createdAt: ub.createdAt,
        updatedAt: ub.updatedAt,
      })),
      wishlist: userData.UserBookWishlist.map((w) => ({
        book: {
          key: w.Book.key,
          title: w.Book.title,
          authors: w.Book.authors,
          cover: w.Book.cover,
        },
        createdAt: w.createdAt,
      })),
      notes: userData.UserBookNotes.map((note) => ({
        book: {
          key: note.Book.key,
          title: note.Book.title,
        },
        note: note.note,
        page: note.page,
        chapter: note.chapter,
        tags: note.tags,
        type: note.type,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      })),
      reviews: userData.BookReview.map((review) => ({
        book: {
          key: review.Book.key,
          title: review.Book.title,
          authors: review.Book.authors,
        },
        rating: review.rating,
        feedback: review.feedback,
        privacy: review.privacy,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      })),
      goals: userData.ReadingGoal.map((goal) => ({
        target: goal.target,
        type: goal.type,
        deadline: goal.deadline,
        progress: goal.progress,
        completedAt: goal.completedAt,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
      })),
      badges: userData.UserBadge.map((ub) => ({
        badge: {
          name: ub.Badge.name,
          ownerDescription: ub.Badge.ownerDescription,
          publicDescription: ub.Badge.publicDescription,
          category: ub.Badge.category,
        },
        earnedAt: ub.earnedAt,
      })),
      readingStats: {
        progress: userData.ReadingProgress.map((rp) => ({
          date: rp.date,
          pagesRead: rp.pagesRead,
          booksCompleted: rp.booksCompleted,
        })),
        days: userData.ReadingDay.map((rd) => ({
          date: rd.date,
          minutesRead: rd.minutesRead,
          pagesRead: rd.pagesRead,
        })),
      },
      social: {
        followers: userData.followers.map((f) => ({
          username: f.follower.username,
          followedAt: f.createdAt,
        })),
        following: userData.following.map((f) => ({
          username: f.following.username,
          followedAt: f.createdAt,
        })),
      },
      lending: {
        lentBooks: userData.lentBooks.map((lb) => ({
          book: {
            key: lb.book.key,
            title: lb.book.title,
          },
          borrower: lb.borrower.username,
          status: lb.status,
          message: lb.message,
          requestedAt: lb.requestedAt,
          acceptedAt: lb.acceptedAt,
          returnedAt: lb.returnedAt,
          dueDate: lb.dueDate,
        })),
        borrowedBooks: userData.borrowedBooks.map((bb) => ({
          book: {
            key: bb.book.key,
            title: bb.book.title,
          },
          lender: bb.lender.username,
          status: bb.status,
          message: bb.message,
          requestedAt: bb.requestedAt,
          acceptedAt: bb.acceptedAt,
          returnedAt: bb.returnedAt,
          dueDate: bb.dueDate,
        })),
      },
      dailyBookViews: userData.dailyBookViews.map((dbv) => ({
        bookKey: dbv.bookKey,
        date: dbv.date,
        viewedAt: dbv.viewedAt,
      })),
    };

    return createResponse(exportData);
  } catch (error) {
    console.error("Erreur lors de l'export des données:", error);
    return createErrorResponse(
      "Erreur lors de l'export des données",
      500
    );
  }
}

export const GET = withErrorHandling(handleGet);
