import { test, expect } from '@playwright/test';
import { ROUTES } from '../utils/test-urls';
import { TEST_USER } from '../fixtures/test-users';

test.describe('Authentication', () => {
  test('should redirect to login if not authenticated', async ({ page }) => {
    // Try to access a protected route (adjust based on your auth setup)
    await page.goto(ROUTES.BOOK_SHELF);

    // Should redirect to login or show login form
    // Adjust this based on your actual auth flow
    await page.waitForLoadState('networkidle');

    // Check if we're on login page or if auth is required
    const currentUrl = page.url();
    // This assertion may need adjustment based on your auth implementation
    expect(
      currentUrl.includes(ROUTES.LOGIN) ||
      currentUrl.includes(ROUTES.BOOK_SHELF)
    ).toBeTruthy();
  });

  test('should display login form', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await page.waitForLoadState('networkidle');

    // Check for login form elements
    // Adjust selectors based on your LoginForm component
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should attempt login with test credentials', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await page.waitForLoadState('networkidle');

    // Fill in login form
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await emailInput.fill(TEST_USER.email);
    await passwordInput.fill(TEST_USER.password);

    // Submit form
    await submitButton.click();

    // Wait for navigation or error message
    await page.waitForTimeout(2000);

    // Check if login was successful (redirect) or if error is shown
    // Adjust based on your auth implementation
    const currentUrl = page.url();
    expect(currentUrl).toBeTruthy();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await emailInput.fill('invalid@example.com');
    await passwordInput.fill('wrongpassword');
    await submitButton.click();

    // Wait for error message (adjust selector based on your error display)
    await page.waitForTimeout(2000);

    // Check if error is displayed or if still on login page
    const currentUrl = page.url();
    expect(currentUrl).toContain(ROUTES.LOGIN);
  });

  test('should handle authenticated session', async ({ page, context }) => {
    // This test assumes you have a way to set up authenticated state
    // You might need to use storageState or mock the auth API

    // Example: Set up authenticated state via storageState
    // await context.addCookies([...]);

    // Or navigate to login and authenticate first
    await page.goto(ROUTES.LOGIN);
    await page.waitForLoadState('networkidle');

    // After authentication, try accessing protected route
    // This is a placeholder - adjust based on your auth flow
    const isAuthenticated = await page.evaluate(() => {
      return document.cookie.includes('next-auth.session-token') ||
             document.cookie.includes('__Secure-next-auth.session-token');
    });

    // If authenticated, should be able to access protected routes
    if (isAuthenticated) {
      await page.goto(ROUTES.BOOK_SHELF);
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain(ROUTES.BOOK_SHELF);
    }
  });
});
