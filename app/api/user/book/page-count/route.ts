import {NextResponse} from "next/server";
import prisma from "@/utils/prisma";
import {z} from "zod";
import {createZodRoute} from "next-zod-route";

const bodySchema = z.object({
    userId: z.string(),
    bookId: z.string(),
    pageCount: z.number(),
});

export const PUT = createZodRoute().body(bodySchema).handler(async (_, context) => {
    try {
        const {userId, bookId, pageCount} = context.body;

        const updatedBook = await prisma.book.update({
            where: {id: bookId},
            data: {numberOfPages: pageCount}
        });

        return NextResponse.json({success: true, book: updatedBook}, {status: 200});
    } catch (error) {
        console.error("Error updating page count:", error);
        return NextResponse.json({error: "Failed to update page count"}, {status: 500});
    }
});