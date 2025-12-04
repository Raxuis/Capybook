import {TEST_USER} from '../fixtures/test-users';
import prisma from '@/utils/prisma';
import {saltAndHashPassword} from '@/utils/password';

/**
 * Global setup: Ensure test user exists before running E2E tests.
 * This must ALWAYS attempt to run when DATABASE_URL is set.
 */
async function globalSetup() {
    if (!process.env.DATABASE_URL) {
        console.warn('[global-setup] DATABASE_URL not set, skipping test user creation');
        return;
    }

    try {
        console.log('[global-setup] Connecting to database...');
        await prisma.$connect();

        const hashedPassword = await saltAndHashPassword(TEST_USER.password);
        const username = TEST_USER.email.split('@')[0];

        console.log('[global-setup] Seeding test user...');

        // Create or update test user
        await prisma.user.upsert({
            where: {email: TEST_USER.email},
            update: {
                password: hashedPassword,
                username,
                name: TEST_USER.name,
                role: 'USER',
            },
            create: {
                email: TEST_USER.email,
                username,
                password: hashedPassword,
                name: TEST_USER.name,
                role: 'USER',
            },
        });

        console.log(`[global-setup] Test user ready: ${TEST_USER.email}`);
    } catch (error: any) {
        console.error('[global-setup] ERROR while seeding test user: ', error);
    } finally {
        console.log('[global-setup] Disconnecting prisma...');
        await prisma.$disconnect().catch(() => {
        });
    }
}

export default globalSetup;
