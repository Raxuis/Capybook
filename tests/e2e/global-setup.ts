import 'dotenv/config';
import {TEST_USER} from '../fixtures/test-users';
import {saltAndHashPassword, comparePassword} from '@/utils/password';

/**
 * Global setup: Ensure test user exists before running E2E tests.
 */
async function globalSetup() {
    console.log('[global-setup] Starting global setup...');

    if (!process.env.DATABASE_URL) {
        console.error('[global-setup] ❌ DATABASE_URL not set!');
        throw new Error('DATABASE_URL environment variable is required');
    }

    console.log('[global-setup] DATABASE_URL is set');

    // Import Prisma dynamically to avoid issues with build-time imports
    const {PrismaClient} = await import('@prisma/client');
    const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });

    try {
        console.log('[global-setup] Connecting to database...');
        await prisma.$connect();
        console.log('[global-setup] ✓ Connected to database');

        // Test database connection
        console.log('[global-setup] Testing database connection...');
        await prisma.$queryRaw`SELECT 1`;
        console.log('[global-setup] ✓ Database query successful');

        // Use the same hashPassword function as your app
        console.log('[global-setup] Hashing password...');
        const hashedPassword = await saltAndHashPassword(TEST_USER.password);
        console.log(`[global-setup] ✓ Password hashed: ${hashedPassword.substring(0, 20)}...`);

        const username = TEST_USER.email.split('@')[0];

        console.log('[global-setup] Upserting test user...');
        console.log(`[global-setup] Email: ${TEST_USER.email}`);
        console.log(`[global-setup] Username: ${username}`);
        console.log(`[global-setup] Name: ${TEST_USER.name}`);

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

        console.log('[global-setup] ✓ Test user upserted successfully');
        console.log(`[global-setup] User ID: ${user.id}`);
        console.log(`[global-setup] User email: ${user.email}`);
        console.log(`[global-setup] User has password: ${!!user.password}`);

        // Verify the user exists in database
        console.log('[global-setup] Verifying user in database...');
        const verifyUser = await prisma.user.findUnique({
            where: {email: TEST_USER.email},
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                password: true,
                role: true,
            },
        });

        if (!verifyUser) {
            throw new Error('User verification failed: User not found after creation');
        }

        console.log('[global-setup] ✓ User verified in database');
        console.log(`[global-setup] Verified user ID: ${verifyUser.id}`);
        console.log(`[global-setup] Verified user has password: ${!!verifyUser.password}`);

        // Verify the password hash works
        if (verifyUser.password) {
            console.log('[global-setup] Testing password verification...');
            const isValid = await comparePassword(TEST_USER.password, verifyUser.password);
            console.log(`[global-setup] Password verification: ${isValid ? '✓ PASSED' : '❌ FAILED'}`);

            if (!isValid) {
                throw new Error('Password hash verification failed! The hashed password does not match.');
            }
        } else {
            throw new Error('User has no password stored!');
        }

        console.log('[global-setup] ✅ All checks passed!');
        console.log('[global-setup] Test user is ready for E2E tests');
        console.log(`[global-setup] Credentials: ${TEST_USER.email} / ${TEST_USER.password}`);

    } catch (error: any) {
        console.error('[global-setup] ❌ ERROR while seeding test user:', error);
        console.error('[global-setup] Error name:', error.name);
        console.error('[global-setup] Error message:', error.message);
        if (error.stack) {
            console.error('[global-setup] Stack trace:', error.stack);
        }
        throw error; // Fail fast if setup fails
    } finally {
        console.log('[global-setup] Disconnecting from database...');
        await prisma.$disconnect().catch((e) => {
            console.error('[global-setup] Error disconnecting:', e);
        });
        console.log('[global-setup] ✓ Disconnected');
    }
}

export default globalSetup;