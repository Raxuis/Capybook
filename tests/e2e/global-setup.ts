import {TEST_USER} from '../fixtures/test-users';
import prisma from '@/utils/prisma';
import {comparePassword, saltAndHashPassword} from "@/utils/password";

/**
 * Global setup: Ensure test user exists before running E2E tests.
 */
async function globalSetup() {
    if (!process.env.DATABASE_URL) {
        console.warn('[global-setup] DATABASE_URL not set, skipping test user creation');
        return;
    }

    try {
        console.log('[global-setup] Connecting to database...');
        await prisma.$connect();

        // Use the same hashPassword function as your app
        const hashedPassword = await saltAndHashPassword(TEST_USER.password);
        const username = TEST_USER.email.split('@')[0];

        console.log('[global-setup] Seeding test user...');

        // Create or update test user
        const user = await prisma.user.upsert({
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

        console.log(`[global-setup] Test user ready: ${TEST_USER.email} (ID: ${user.id})`);

        // Verify the password hash works

        const isValid = await comparePassword(TEST_USER.password, user.password!);
        console.log(`[global-setup] Password verification: ${isValid ? 'PASSED' : 'FAILED'}`);

        if (!isValid) {
            throw new Error('Password hash verification failed!');
        }

    } catch (error: any) {
        console.error('[global-setup] ERROR while seeding test user:', error);
        console.error('[global-setup] Stack:', error.stack);
        throw error; // Fail fast if setup fails
    } finally {
        console.log('[global-setup] Disconnecting prisma...');
        await prisma.$disconnect().catch((e) => {
            console.error('[global-setup] Error disconnecting:', e);
        });
    }
}

export default globalSetup;