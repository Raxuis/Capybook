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
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: TEST_USER.email },
    });

    if (existingUser) {
      console.log(`[global-setup] Test user ${TEST_USER.email} already exists`);
      // Update password in case it changed
      const hashedPassword = await saltAndHashPassword(TEST_USER.password);
      await prisma.user.update({
        where: { email: TEST_USER.email },
        data: { password: hashedPassword },
      });
      console.log(`[global-setup] Updated password for test user: ${TEST_USER.email}`);
      return;
    }

    // Create test user
    const hashedPassword = await saltAndHashPassword(TEST_USER.password);
    const username = TEST_USER.email.split('@')[0]; // Use email prefix as username

    await prisma.user.create({
      data: {
        email: TEST_USER.email,
        username: username,
        password: hashedPassword,
        name: TEST_USER.name,
        role: 'USER', // Default role
      },
    });

    console.log(`[global-setup] Created test user: ${TEST_USER.email} with username: ${username}`);
  } catch (error: any) {
    console.error('[global-setup] Error creating test user:', error);
    // Don't fail the setup if user creation fails (might already exist or DB issue)
    if (error.code !== 'P2002') { // P2002 is unique constraint violation
      console.warn('[global-setup] Non-unique constraint error, continuing...');
    }
  } finally {
    await prisma.$disconnect();
  }
}

export default globalSetup;
