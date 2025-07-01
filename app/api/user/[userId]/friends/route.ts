import {createZodRoute} from 'next-zod-route';
import {NextResponse} from 'next/server';
import {z} from "zod";
import prisma from "@/utils/prisma";

const paramsSchema = z.object({
    userId: z.string(),
});

export const GET = createZodRoute()
    .params(paramsSchema)
    .handler(async (_, context) => {
        const {userId} = context.params;

        const following = await prisma.follow.findMany({
            where: {followerId: userId},
            select: {followingId: true}
        });

        const followingIds = following.map(f => f.followingId);

        const followers = await prisma.follow.findMany({
            where: {followingId: userId},
            select: {followerId: true}
        });
        const followerIds = followers.map(f => f.followerId);

        const mutualFriendIds = followingIds.filter(fid => followerIds.includes(fid));

        if (mutualFriendIds.length === 0) {
            return NextResponse.json([], {status: 200});
        }

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
        
        return NextResponse.json(mutualFriends, {status: 200});
    });
