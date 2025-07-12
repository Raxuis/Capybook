import {createZodRoute} from 'next-zod-route'
import {z} from 'zod'
import prisma from "@/utils/prisma";
import {NextResponse} from 'next/server'

const createLendingSchema = z.object({
    lenderId: z.string().min(1, "L'ID du prêteur est requis"),
    borrowerId: z.string().min(1, "L'ID de l'emprunteur est requis"),
    bookId: z.string().min(1, "L'ID du livre est requis"),
    message: z.string().optional()
})

export const POST = createZodRoute()
    .body(createLendingSchema)
    .handler(async (_, context) => {
        try {
            const {lenderId, borrowerId, bookId, message} = context.body;

            // Vérifier que l'utilisateur prêteur possède bien le livre
            const userBook = await prisma.userBook.findFirst({
                where: {
                    userId: lenderId,
                    bookId: bookId
                },
                include: {
                    Book: true
                }
            })

            if (!userBook) {
                return NextResponse.json(
                    {error: 'Vous ne possédez pas ce livre dans votre bibliothèque'},
                    {status: 400}
                )
            }

            // Vérifier que l'emprunteur existe
            const borrower = await prisma.user.findUnique({
                where: {
                    id: borrowerId
                }
            })

            if (!borrower) {
                return NextResponse.json(
                    {error: 'Utilisateur emprunteur introuvable'},
                    {status: 404}
                )
            }

            // Vérifier qu'il n'y a pas déjà un prêt actif pour ce livre
            const existingLending = await prisma.bookLending.findFirst({
                where: {
                    bookId: bookId,
                    lenderId: lenderId,
                    status: {
                        in: ['PENDING', 'ACCEPTED']
                    },
                    returnedAt: null
                }
            })

            if (existingLending) {
                return NextResponse.json(
                    {error: 'Ce livre est déjà en cours de prêt'},
                    {status: 400}
                )
            }

            // Créer le prêt
            const lending = await prisma.bookLending.create({
                data: {
                    lenderId,
                    borrowerId,
                    bookId,
                    message,
                    status: 'PENDING' // En attente d'acceptation
                },
                include: {
                    lender: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            email: true
                        }
                    },
                    borrower: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            email: true
                        }
                    },
                    book: {
                        select: {
                            id: true,
                            title: true,
                            key: true,
                            cover: true,
                            authors: true
                        }
                    }
                }
            })

            return NextResponse.json({
                lending,
                message: 'Demande de prêt créée avec succès'
            })

        } catch (error) {
            console.error('Erreur lors de la création du prêt:', error)
            return NextResponse.json(
                {error: 'Erreur lors de la création du prêt'},
                {status: 500}
            )
        }
    })