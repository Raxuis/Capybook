import {NextRequest, NextResponse} from 'next/server';
import {z} from "zod";
import prisma from "@/utils/prisma";
import {
    validateParams,
    validateBody,
    withErrorHandling,
    createResponse,
    createErrorResponse,
    withErrorHandlingContextOnly
} from "@/utils/api-validation";

const paramsSchema = z.object({
    userId: z.string({
        required_error: "L'ID utilisateur est requis",
        invalid_type_error: "L'ID utilisateur doit être une chaîne de caractères"
    }).cuid("L'ID utilisateur doit être un CUID valide"),
});

const putBodySchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(15, "Username must be less than 15 characters")
        .regex(/^[a-zA-Z0-9-]+$/, "Username can only contain letters, numbers, and hyphens"),
    favoriteColor: z.string()
        .min(1, "Favorite color is required")
        .max(30, "Favorite color must be less than 30 characters"),
});

async function handleGet(
    {params}: { params: Record<string, string> }
): Promise<NextResponse> {
    const {userId} = await validateParams(params, paramsSchema);

    const user = await prisma.user.findUnique({
        where: {id: userId},
        include: {
            ReadingGoal: true,
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
            },
            UserBookNotes: {
                include: {
                    Book: true
                }
            },
            UserBadge: {
                include: {
                    Badge: true
                }
            },
            lentBooks: {
                include: {
                    book: true,
                    borrower: true
                }
            },
            borrowedBooks: {
                include: {
                    book: true,
                    lender: true
                }
            }
        }
    });

    if (!user) {
        return createErrorResponse('User not found', 404);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...userWithoutPassword} = user;

    return createResponse(userWithoutPassword);
}

async function handlePut(
    request: NextRequest,
    {params}: { params: Record<string, string> }
): Promise<NextResponse> {
    const {userId} = await validateParams(params, paramsSchema);
    const {username, favoriteColor} = await validateBody(request, putBodySchema);

    const user = await prisma.user.findUnique({
        where: {id: userId},
    });

    if (!user) {
        return createErrorResponse('User not found', 404);
    }

    const existingUsername = await prisma.user.findFirst({
        where: {
            username,
            NOT: {id: userId}
        },
    });

    if (existingUsername) {
        return createErrorResponse('Username already taken', 409);
    }

    const updatedUser = await prisma.user.update({
        where: {id: userId},
        data: {
            username,
            favoriteColor,
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...userWithoutPassword} = updatedUser;

    return createResponse(userWithoutPassword);
}

export const GET = withErrorHandlingContextOnly(handleGet);
export const PUT = withErrorHandling(handlePut);