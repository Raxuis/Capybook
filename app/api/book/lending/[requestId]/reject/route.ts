import {z} from "zod";
import {createZodRoute} from "next-zod-route";
import {NextResponse} from 'next/server';
import prisma from "@/utils/prisma";

const bodySchema = z.object({
    lenderId: z.string(),
});

const paramsSchema = z.object({
    requestId: z.string(),
});

export const PUT = createZodRoute()
    .body(bodySchema)
    .params(paramsSchema)
    .handler(async (_, context) => {
        const {lenderId} = context.body;
        const {requestId} = context.params;

        try {
            // Vérifier que la demande existe et est en attente
            const lendingRequest = await prisma.bookLending.findUnique({
                where: {id: requestId},
                include: {
                    lender: true,
                    borrower: true,
                    book: true
                }
            });

            if (!lendingRequest) {
                return NextResponse.json(
                    {error: "Demande de prêt non trouvée."},
                    {status: 404}
                );
            }

            // Vérifier que l'utilisateur est bien le propriétaire du livre
            if (lendingRequest.lenderId !== lenderId) {
                return NextResponse.json(
                    {error: "Vous n'êtes pas autorisé à refuser cette demande."},
                    {status: 403}
                );
            }

            // Vérifier que la demande est bien en attente
            if (lendingRequest.status !== 'PENDING') {
                return NextResponse.json(
                    {error: "Cette demande n'est plus en attente."},
                    {status: 400}
                );
            }

            // Refuser la demande
            const updatedLendingRequest = await prisma.bookLending.update({
                where: {id: requestId},
                data: {
                    status: 'REJECTED',
                    rejectedAt: new Date(),
                },
                include: {
                    lender: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true
                        }
                    },
                    borrower: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true
                        }
                    },
                    book: {
                        select: {
                            id: true,
                            key: true,
                            title: true,
                            authors: true,
                            cover: true,
                            numberOfPages: true
                        }
                    }
                }
            });

            return NextResponse.json(
                {
                    message: "Demande refusée avec succès",
                    data: updatedLendingRequest
                },
                {status: 200}
            );

        } catch (error) {
            console.error('Erreur lors du refus de la demande:', error);
            return NextResponse.json(
                {error: "Erreur interne du serveur"},
                {status: 500}
            );
        }
    });