import { TEST_USER } from '../fixtures/test-users';
import prisma from '@/utils/prisma';
import { saltAndHashPassword } from '@/utils/password';

/**
 * Check if database is available
 */
async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    return false;
  } finally {
    await prisma.$disconnect().catch(() => {
      // Ignore disconnect errors
    });
  }
}

/**
 * Global setup: Create test user before running E2E tests
 *
 * This function is called by Playwright before all tests run.
 * It should export an async function that Playwright will execute.
 */
async function globalSetup() {
  // Only run if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.warn('[global-setup] DATABASE_URL not set, skipping test user creation');
    return;
  }

  // Check if database is available
  const dbAvailable = await isDatabaseAvailable();
  if (!dbAvailable) {
    console.warn('[global-setup] Database not available, skipping test user creation');
    console.warn('[global-setup] Make sure PostgreSQL is running on localhost:5432 or set DATABASE_URL');
    return;
  }

  try {
    // Use upsert to create or update test user (handles race conditions)
    const hashedPassword = await saltAndHashPassword(TEST_USER.password);
    const username = TEST_USER.email.split('@')[0]; // Use email prefix as username

    await prisma.user.upsert({
      where: { email: TEST_USER.email },
      update: {
        password: hashedPassword,
        username: username,
        name: TEST_USER.name,
      },
      create: {
        email: TEST_USER.email,
        username: username,
        password: hashedPassword,
        name: TEST_USER.name,
        role: 'USER', // Default role
      },
    });

    // Only log in debug mode to reduce noise
    if (process.env.DEBUG) {
      console.log(`[global-setup] Test user ${TEST_USER.email} ready (username: ${username})`);
    }
  } catch (error: any) {
    // Only log if it's not a connection error (already handled above)
    if (error?.code !== 'P1001') {
      console.error('[global-setup] Error setting up test user:', error);
    }
    // Don't fail the setup if there's a DB issue
  } finally {
    await prisma.$disconnect().catch(() => {
      // Ignore disconnect errors
    });
  }
}

export default globalSetup;
