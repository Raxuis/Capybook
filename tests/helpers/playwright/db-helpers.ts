import prisma from '@/utils/prisma';
import {saltAndHashPassword} from '@/utils/password';
import {TestUser} from './auth-helpers';

/**
 * Check if database is available
 */
export async function isDatabaseAvailable(): Promise<boolean> {
    if (!process.env.DATABASE_URL) return false;

    try {
        await prisma.$connect();
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch (error) {
        console.warn('[db] Database not available');
        return false;
    } finally {
        await prisma.$disconnect().catch(() => {
        });
    }
}

/**
 * Create or update a test user
 */
export async function createOrUpdateTestUser(user: TestUser): Promise<boolean> {
    const dbAvailable = await isDatabaseAvailable();
    if (!dbAvailable) return false;

    try {
        const hashedPassword = await saltAndHashPassword(user.password);

        const existingUserByUsername = await prisma.user.findUnique({
            where: {username: user.username},
        });

        if (existingUserByUsername && existingUserByUsername.email !== user.email) {
            await prisma.user.delete({
                where: {username: user.username},
            });
        }

        await prisma.user.upsert({
            where: {email: user.email},
            update: {
                password: hashedPassword,
                username: user.username,
            },
            create: {
                email: user.email,
                username: user.username || user.email.split('@')[0],
                password: hashedPassword,
                role: 'USER',
            },
        });

        return true;
    } catch (error: any) {
        if (error?.code === 'P2002') {
            const uniqueUsername = `${user.username}-${Date.now()}`;
            try {
                const hashedPassword = await saltAndHashPassword(user.password);
                await prisma.user.upsert({
                    where: {email: user.email},
                    update: {
                        password: hashedPassword,
                        username: uniqueUsername,
                    },
                    create: {
                        email: user.email,
                        username: uniqueUsername,
                        password: hashedPassword,
                        role: 'USER',
                    },
                });
                user.username = uniqueUsername;
                return true;
            } catch (retryError: any) {
                console.error('[db] Error creating user (retry):', retryError);
                return false;
            }
        } else if (error?.code !== 'P1001') {
            console.error('[db] Error creating user:', error);
        }
        return false;
    } finally {
        await prisma.$disconnect().catch(() => {
        });
    }
}

/**
 * Delete a test user
 */
export async function deleteTestUser(email: string): Promise<boolean> {
    const dbAvailable = await isDatabaseAvailable();
    if (!dbAvailable) return false;

    try {
        await prisma.user.delete({
            where: {email},
        });
        return true;
    } catch (error: any) {
        if (error?.code !== 'P2025') {
            console.error('[db] Error deleting user:', error);
        }
        return false;
    } finally {
        await prisma.$disconnect().catch(() => {
        });
    }
}