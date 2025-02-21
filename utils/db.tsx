"use server";
import prisma from './prisma';

export async function getUserFromDb(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) return null;

    return user;
}
