import { TEST_USER } from '../fixtures/test-users';
import prisma from '@/utils/prisma';
import { saltAndHashPassword } from '@/utils/password';

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
    console.error('[global-setup] Error setting up test user:', error);
    // Don't fail the setup if there's a DB issue
  } finally {
    await prisma.$disconnect();
  }
}

export default globalSetup;
