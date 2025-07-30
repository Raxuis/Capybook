import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import prisma from "@/utils/prisma";
import {validateSearchParams, withErrorHandling, createResponse, createErrorResponse} from "@/utils/api-validation";

const searchUsersSchema = z.object({
    q: z.string().min(1, "Le terme de recherche est requis"),
    excludeId: z.string().cuid("L'ID à exclure doit être un CUID valide").optional(),
    limit: z.string()
        .optional()
        .transform((val) => val || "10")
        .pipe(
            z.string()
                .transform((val) => parseInt(val, 10))
                .refine((val) => !isNaN(val) && val > 0 && val <= 50, "La limite doit être un nombre entre 1 et 50")
        ),
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
            image: true
        },
        take: limit,
        orderBy: [
            // Prioriser les correspondances exactes de username
            {
                username: 'asc'
            },
            // Puis par nom
            {
                name: 'asc'
            }
        ]
    });

    return createResponse({
        users,
        count: users.length,
        searchTerm: searchTerm.trim(),
        hasMore: users.length === limit
    });
}

// Export du handler avec gestion d'erreur
export const GET = withErrorHandling(handleGet);