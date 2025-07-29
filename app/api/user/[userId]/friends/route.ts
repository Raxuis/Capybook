import {NextResponse} from 'next/server';
import {z} from "zod";
import prisma from "@/utils/prisma";
import {validateParams, withErrorHandling, createResponse} from "@/utils/api-validation";

const paramsSchema = z.object({
    userId: z.string().uuid("L'ID utilisateur doit être un UUID valide"),
});

async function handleGet(
    {params}: { params: Record<string, string> }
): Promise<NextResponse> {
    const {userId} = validateParams(params, paramsSchema);

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
        return createResponse([]);
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

    return createResponse(mutualFriends);
}

export const GET = withErrorHandling(handleGet);