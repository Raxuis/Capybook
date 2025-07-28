import {z} from "zod";
import {createZodRoute} from "next-zod-route";
import {NextResponse} from 'next/server';
import prisma from "@/utils/prisma";
import {checkAndAssignBadges} from "@/utils/badges";
import {Badge} from "@prisma/client";

const bodySchema = z.object({
    bookId: z.string(),
    userId: z.string(),
    progress: z.number(),
});

export const PUT = createZodRoute().body(bodySchema).handler(async (_, context) => {
    const {bookId, userId, progress} = context.body;

    const book = await prisma.book.findUnique({
        where: {id: bookId}
    });

    if (!book) {
        return NextResponse.json({error: "No book with the corresponding id."}, {status: 404});
    }

    const userBook = await prisma.userBook.findFirst({
        where: {
            bookId: bookId,
            userId: userId,
        }
    });

    if (!userBook) {
        return NextResponse.json({error: 'User doesn\'t have this book yet.'}, {status: 400});
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

    // Vérifier si le livre était déjà terminé avant cette mise à jour
    const wasAlreadyFinished = userBook.finishedAt !== null;
    // Ne comptabiliser comme "nouveau livre terminé" que si le livre vient d'être terminé
    const newlyFinishedBook = isBookFinishedVerification && !wasAlreadyFinished;

    const newBook = await prisma.userBook.update({
        where: {userId_bookId: {userId, bookId}},
        data: {
            progress,
            isCurrentBook: isCurrentBookVerification,
            finishedAt: isBookFinishedVerification ? new Date() : null,
        }
    });

    if (!newBook) {
        return NextResponse.json({error: 'An error occurred while retrieving book.'}, {status: 500});
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

    return NextResponse.json({
        data: newBook,
        badges: {
            newBadgesCount: newBadges.length,
            newBadges
        }
    }, {status: 200});
});