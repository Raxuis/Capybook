import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db/prisma";
import { auth } from "@/auth";
import {
  validateParams,
  withErrorHandling,
  createResponse,
  createErrorResponse,
  NextJSContext,
} from "@/utils/api-validation";

const paramsSchema = z.object({
  userId: z.string().cuid("L'ID utilisateur doit être un CUID valide"),
});

async function handleDelete(
  _: NextRequest,
  context: NextJSContext
): Promise<NextResponse> {
  const { userId } = await validateParams(context.params, paramsSchema);

  // Vérifier l'authentification
  const session = await auth();
  if (!session?.user?.id) {
    return createErrorResponse("Non authentifié", 401);
  }

  // Vérifier que l'utilisateur supprime son propre compte
  if (session.user.id !== userId) {
    return createErrorResponse("Accès non autorisé", 403);
  }

  try {
    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return createErrorResponse("Utilisateur non trouvé", 404);
    }

    // Supprimer l'utilisateur (cascade supprimera automatiquement toutes les données liées
    // grâce aux contraintes onDelete: Cascade dans le schéma Prisma)
    await prisma.user.delete({
      where: { id: userId },
    });

    return createResponse({
      message: "Compte supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    return createErrorResponse(
      "Erreur lors de la suppression du compte",
      500
    );
  }
}

export const DELETE = withErrorHandling(handleDelete);
