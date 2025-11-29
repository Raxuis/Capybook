import {NextRequest, NextResponse} from 'next/server';
import {z} from "zod";
import prisma from "@/lib/db/prisma";
import {checkAndAssignBadges} from "@/utils/badges";
import {Badge} from "@prisma/client";
import {
    validateBody,
    withErrorHandling,
    createResponse,
    createErrorResponse,
    ValidationError
} from "@/utils/api-validation";
import {getBookById, getUserBookByUserIdBookId} from "@/utils/database";

const bodySchema = z.object({
    bookId: z.string().cuid("L'ID du livre doit être un CUID valide"),
    userId: z.string().cuid("L'ID utilisateur doit être un CUID valide"),
    progress: z.number()
        .min(0, "Le progrès ne peut pas être négatif")
        .finite("Le progrès doit être un nombre fini"),
});

async function handlePut(
    request: NextRequest
): Promise<NextResponse> {
    const {bookId, userId, progress} = await validateBody(request, bodySchema);

    const book = await getBookById(bookId);
    const userBook = await getUserBookByUserIdBookId(userId, bookId);

    if (userBook.progressType === "percentage" && (progress < 0 || progress > 100)) {
        throw new ValidationError("Le progrès en pourcentage doit être entre 0 et 100", 400);
    }

    if (userBook.progressType === "numberOfPages" && book.numberOfPages && progress > book.numberOfPages) {
        throw new ValidationError("Le progrès ne peut pas dépasser le nombre total de pages", 400);
    }

    const previousProgress = userBook.progress;
    let pagesRead = 0;

    if (userBook.progressType === "numberOfPages") {
        pagesRead = progress - previousProgress;
    } else if (userBook.progressType === "percentage" && book.numberOfPages) {
        const previousPages = Math.floor((previousProgress / 100) * book.numberOfPages);
        const currentPages = Math.floor((progress / 100) * book.numberOfPages);
        pagesRead = currentPages - previousPages;
    }

    const isCurrentBookVerification =
        (userBook.progressType === 'percentage' && progress !== 100 && progress !== 0) ||
        (userBook.progressType === "numberOfPages" && progress !== book.numberOfPages && progress !== 0);

    const isBookFinishedVerification =
        (userBook.progressType === "numberOfPages" && progress === book.numberOfPages) ||
        (userBook.progressType === "percentage" && progress === 100);

    const wasAlreadyFinished = userBook.finishedAt !== null;
    const newlyFinishedBook = isBookFinishedVerification && !wasAlreadyFinished;

    const updatedUserBook = await prisma.userBook.update({
        where: {userId_bookId: {userId, bookId}},
        data: {
            progress,
            isCurrentBook: isCurrentBookVerification,
            finishedAt: isBookFinishedVerification ? new Date() : null,
        }
    });

    if (!updatedUserBook) {
        return createErrorResponse("Une erreur s'est produite lors de la récupération du livre", 500);
    }

    // Mise à jour des statistiques journalières de lecture
    if (pagesRead > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let readingDay = await prisma.readingDay.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: today
                }
            }
        });

        if (!readingDay) {
            readingDay = await prisma.readingDay.create({
                data: {
                    userId,
                    date: today,
                    minutesRead: 0,
                    pagesRead: 0
                }
            });
        }

        await prisma.readingDay.update({
            where: {id: readingDay.id},
            data: {pagesRead: {increment: pagesRead}}
        });

        const readingProgress = await prisma.readingProgress.findUnique({
            where: {readingDayId: readingDay.id}
        });

        if (readingProgress) {
            await prisma.readingProgress.update({
                where: {id: readingProgress.id},
                data: {
                    pagesRead: {increment: pagesRead},
                    booksCompleted: newlyFinishedBook ? {increment: 1} : undefined
                }
            });
        } else {
            await prisma.readingProgress.create({
                data: {
                    userId,
                    readingDayId: readingDay.id,
                    date: today,
                    pagesRead: pagesRead,
                    booksCompleted: newlyFinishedBook ? 1 : 0
                }
            });
        }
    }

    let newBadges: Badge[] = [];

    // Mise à jour des objectifs de type BOOKS si le livre vient d'être terminé
    if (newlyFinishedBook) {
        const bookGoals = await prisma.readingGoal.findMany({
            where: {
                userId,
                type: 'BOOKS',
                completedAt: null // Ne met à jour que les objectifs non encore complétés
            }
        });

        await Promise.all(bookGoals.map(async (goal) => {
            const newProgress = goal.progress + 1;
            const willBeCompleted = newProgress >= goal.target;

            await prisma.readingGoal.update({
                where: {id: goal.id},
                data: {
                    progress: willBeCompleted ? goal.target : newProgress,
                    completedAt: willBeCompleted ? new Date() : null
                }
            });
        }));

        newBadges = await checkAndAssignBadges(userId) || [];
    }

    // Mise à jour des objectifs de type PAGES si des pages ont été lues
    if (pagesRead > 0) {
        const pageGoals = await prisma.readingGoal.findMany({
            where: {
                userId,
                type: 'PAGES',
                completedAt: null
            }
        });

        await Promise.all(pageGoals.map(async (goal) => {
            const newProgress = goal.progress + pagesRead;
            const willBeCompleted = newProgress >= goal.target;

            await prisma.readingGoal.update({
                where: {id: goal.id},
                data: {
                    progress: willBeCompleted ? goal.target : newProgress,
                    completedAt: willBeCompleted ? new Date() : null
                }
            });
        }));
    }

    return createResponse({
        data: updatedUserBook,
        badges: {
            newBadgesCount: newBadges.length,
            newBadges
        }
    });
}

export const PUT = withErrorHandling(handlePut);