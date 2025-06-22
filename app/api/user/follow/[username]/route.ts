import {auth} from "@/auth";
import prisma from "@/utils/prisma";
import {NextResponse} from "next/server";
import {createZodRoute} from "next-zod-route";
import {z} from "zod";
import {formatUsername} from "@/utils/format";

const paramsSchema = z.object({
    username: z.string(),
});

export const POST = createZodRoute()
    .body(paramsSchema)
    .handler(async (_, context) => {
        const {username} = context.body;
        const formattedUsername = formatUsername(username);
        try {
            const session = await auth()
            if (!session?.user) {
                return new NextResponse("Unauthorized", {status: 401});
            }

            const targetUser = await prisma.user.findUnique({
                where: {username: formattedUsername},
            });


            if (!targetUser) {
                return new NextResponse("User not found", {status: 404});
            }

            if (targetUser.id === session.user.id) {
                return new NextResponse("Cannot follow yourself", {status: 400});
            }

            await prisma.follow.create({
                data: {
                    followerId: session.user.id,
                    followingId: targetUser.id,
                },
            });

            return new NextResponse("Followed successfully", {status: 200});
        } catch (error) {
            console.error("Error following user:", error);
            return new NextResponse("Internal Server Error", {status: 500});
        }
    })

export const DELETE = createZodRoute()
    .params(paramsSchema)
    .handler(async (_, context) => {
        const {username} = context.params;
        const formattedUsername = formatUsername(username);
        try {
            const session = await auth();
            if (!session?.user) {
                return new NextResponse("Unauthorized", {status: 401});
            }

            const targetUser = await prisma.user.findUnique({
                where: {username: formattedUsername},
            });

            if (!targetUser) {
                return new NextResponse("User not found", {status: 404});
            }

            // Utilisation d'une transaction pour s'assurer que toutes les opérations sont atomiques
            await prisma.$transaction(async (tx) => {
                // Supprimession de la relation de suivi
                await tx.follow.delete({
                    where: {
                        followerId_followingId: {
                            followerId: session.user.id,
                            followingId: targetUser.id,
                        },
                    },
                });

                // Supprimer tous les bookReviews où :
                // 1. L'utilisateur qu'on unfollow avait partagé des avis spécifiquement avec nous
                // 2. Nous avions partagé des avis spécifiquement avec l'utilisateur qu'on unfollow
                await tx.bookReview.deleteMany({
                    where: {
                        OR: [
                            // Cas 1: L'utilisateur qu'on unfollow avait des avis partagés spécifiquement avec nous
                            {
                                userId: targetUser.id,
                                privacy: "SPECIFIC_FRIEND",
                                specificFriendId: session.user.id,
                            },
                            // Cas 2: Nous avions des avis partagés spécifiquement avec l'utilisateur qu'on unfollow
                            {
                                userId: session.user.id,
                                privacy: "SPECIFIC_FRIEND",
                                specificFriendId: targetUser.id,
                            }
                        ]
                    },
                });
            });

            return new NextResponse("Unfollowed successfully", {status: 200});
        } catch (error) {
            console.error("Error unfollowing user:", error);
            return new NextResponse("Internal Server Error", {status: 500});
        }
    })
