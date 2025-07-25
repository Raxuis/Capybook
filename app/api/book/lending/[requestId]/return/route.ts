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
            const bookLending = await prisma.bookLending.findUnique({
                where: {
                    id: requestId
                },
                include: {
                    book: true,
                    lender: true,
                    borrower: true
                }
            });

            if (!bookLending) {
                return NextResponse.json(
                    {error: "Demande de prêt introuvable"},
                    {status: 404}
                );
            }

            if (bookLending.lenderId !== lenderId) {
                return NextResponse.json(
                    {error: "Vous n'êtes pas autorisé à effectuer cette action"},
                    {status: 403}
                );
            }

            // Vérifier que le livre est actuellement prêté (status ACCEPTED et pas encore retourné)
            if (bookLending.status !== 'ACCEPTED' || bookLending.returnedAt) {
                return NextResponse.json(
                    {error: "Ce livre n'est pas actuellement prêté ou a déjà été retourné"},
                    {status: 400}
                );
            }

            const updatedLending = await prisma.bookLending.update({
                where: {
                    id: requestId
                },
                data: {
                    status: 'RETURNED',
                    returnedAt: new Date(),
                    updatedAt: new Date()
                },
                include: {
                    book: true,
                    lender: {
                        select: {
                            id: true,
                            username: true,
                            name: true
                        }
                    },
                    borrower: {
                        select: {
                            id: true,
                            username: true,
                            name: true
                        }
                    }
                }
            });

            return NextResponse.json({
                message: "Livre marqué comme retourné avec succès",
                lending: updatedLending
            }, {status: 200});

        } catch (error) {
            console.error('Erreur lors du marquage du retour:', error);
            return NextResponse.json(
                {error: "Erreur interne du serveur"},
                {status: 500}
            );
        }
    });