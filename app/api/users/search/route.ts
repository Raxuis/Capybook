import {createZodRoute} from 'next-zod-route'
import {z} from 'zod'
import prisma from "@/utils/prisma";
import {NextResponse} from 'next/server'

const searchUsersSchema = z.object({
    q: z.string().min(1, "Le terme de recherche est requis"),
    excludeId: z.string().optional()
})

export const GET = createZodRoute()
    .query(searchUsersSchema)
    .handler(async (_, context) => {
        try {
            const {q: searchTerm, excludeId} = context.query

            // Construire les conditions de recherche
            const searchConditions = {
                OR: [
                    {
                        username: {
                            contains: searchTerm,
                            mode: 'insensitive' as const
                        }
                    },
                    {
                        name: {
                            contains: searchTerm,
                            mode: 'insensitive' as const
                        }
                    },
                    {
                        email: {
                            contains: searchTerm,
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
            }

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
                take: 10, // Limiter les résultats
                orderBy: {
                    username: 'asc'
                }
            })

            return NextResponse.json({
                users,
                count: users.length
            })

        } catch (error) {
            console.error('Erreur lors de la recherche d\'utilisateurs:', error)
            return NextResponse.json(
                {error: 'Erreur lors de la recherche d\'utilisateurs'},
                {status: 500}
            )
        }
    })