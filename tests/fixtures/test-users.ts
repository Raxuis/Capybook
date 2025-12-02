/**
 * Test user fixtures for E2E and unit tests
 */
export const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
} as const;

export const TEST_USER_2 = {
  email: 'test2@example.com',
  password: 'password456',
  name: 'Test User 2',
} as const;

export type TestUser = typeof TEST_USER;
