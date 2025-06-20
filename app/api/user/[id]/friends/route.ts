import {createZodRoute} from 'next-zod-route';
import {NextResponse} from 'next/server';
import {z} from "zod";
import prisma from "@/utils/prisma";

const paramsSchema = z.object({
    id: z.string(),
});

export const GET = createZodRoute()
    .params(paramsSchema)
    .handler(async (_, context) => {
        const {id} = context.params;

        // Find all users that the current user follows
        const following = await prisma.follow.findMany({
            where: {followerId: id},
            select: {followingId: true}
        });

        console.log(`Following for user ${id}:`, following);
        const followingIds = following.map(f => f.followingId);

        // Find all users that follow the current user
        const followers = await prisma.follow.findMany({
            where: {followingId: id},
            select: {followerId: true}
        });
        console.log(`Followers for user ${id}:`, followers);
        const followerIds = followers.map(f => f.followerId);

        // Mutual friends: users who are both in followingIds and followerIds
        const mutualFriendIds = followingIds.filter(fid => followerIds.includes(fid));

        if (mutualFriendIds.length === 0) {
            return NextResponse.json([], {status: 200});
        }

        // Fetch user info for mutual friends
        const mutualFriends = await prisma.user.findMany({
            where: {id: {in: mutualFriendIds}},
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                image: true,
            }
        });

        console.log(`Mutual friends for user ${id}:`, mutualFriends);

        return NextResponse.json(mutualFriends, {status: 200});
    });
