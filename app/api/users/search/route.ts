import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import prisma from "@/lib/db/prisma";
import {validateSearchParams, withErrorHandling, createResponse, createErrorResponse} from "@/utils/api-validation";

const searchUsersSchema = z.object({
    q: z.string().min(1, "Le terme de recherche est requis"),
    excludeId: z.string().cuid("L'ID à exclure doit être un CUID valide").optional(),
    limit: z.coerce.number().int(
        "La limite doit être un nombre entier"
    ).min(1,
        {message: "La limite doit être au moins 1"}
    ).max(50, {
        message: "La limite ne peut pas dépasser 50"
    }).optional(),
});

async function handleGet(
    request: NextRequest
): Promise<NextResponse> {
    const {q: searchTerm, excludeId, limit} = validateSearchParams(
        new URL(request.url).searchParams,
        searchUsersSchema
    );

    if (searchTerm.trim().length < 2) {
        return createErrorResponse("Le terme de recherche doit contenir au moins 2 caractères", 400);
    }

    const searchConditions = {
        OR: [
            {
                username: {
                    contains: searchTerm.trim(),
                    mode: 'insensitive' as const
                }
            },
            {
                name: {
                    contains: searchTerm.trim(),
                    mode: 'insensitive' as const
                }
            },
            {
                email: {
                    contains: searchTerm.trim(),
                    mode: 'insensitive' as const
                }
            }
        ],
        // Exclure l'utilisateur actuel si spécifié
        ...(excludeId && {
            NOT: {
                id: excludeId
            }
        })
    };

    // Rechercher les utilisateurs
    const users = await prisma.user.findMany({
        where: searchConditions,
        select: {
            id: true,
            username: true,
            name: true,
            email: true,
            image: true,
        },
        ...(limit && {take: limit}),
        orderBy: [
            {username: 'asc'},
            {name: 'asc'},
        ],
    });

    return createResponse({
        users,
        count: users.length,
        searchTerm: searchTerm.trim(),
        hasMore: limit ? users.length === limit : false
    });
}

// Export du handler avec gestion d'erreur
export const GET = withErrorHandling(handleGet);