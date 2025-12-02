import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton instance
 * Ensures only one instance exists across the application
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const client = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = client;
}

export default client;
