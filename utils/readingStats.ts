"use server";

import prisma from "@/lib/db/prisma";
import { GoalType } from "@prisma/client";

export async function updateReadingStats(userId: string, goalType: GoalType, progressAdded: number) {
    if (progressAdded <= 0) return null;

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

    // Mettre à jour les statistiques en fonction du type de goal
    switch (goalType) {
        case 'PAGES':
            await prisma.readingDay.update({
                where: { id: readingDay.id },
                data: { pagesRead: { increment: progressAdded } }
            });
            break;

        case 'TIME':
            await prisma.readingDay.update({
                where: { id: readingDay.id },
                data: { minutesRead: { increment: progressAdded } }
            });
            break;

        case 'BOOKS':
            // Pour les livres terminés, mettre à jour ReadingProgress
            const readingProgress = await prisma.readingProgress.findUnique({
                where: { readingDayId: readingDay.id }
            });

            if (readingProgress) {
                await prisma.readingProgress.update({
                    where: { id: readingProgress.id },
                    data: { booksCompleted: { increment: progressAdded } }
                });
            } else {
                await prisma.readingProgress.create({
                    data: {
                        userId,
                        readingDayId: readingDay.id,
                        date: today,
                        pagesRead: 0,
                        booksCompleted: progressAdded
                    }
                });
            }
            break;
    }

    return readingDay;
}
