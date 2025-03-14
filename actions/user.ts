"use server";

import prisma from "@/utils/prisma";


export async function getUniqueUser(id: string) {
    return await prisma.user.findUnique({
        where: {id},
        select: {
            id: true,
            email: true,
            username: true,
            name: true,
            image: true,
            UserBook: {
                include: {
                    Book: true
                }
            },
            UserBookWishlist: {
                include: {
                    Book: true
                }
            },
            BookReview: {
                include: {
                    Book: true
                }
            }
        }
    })
}

