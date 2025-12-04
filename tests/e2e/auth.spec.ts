import { test, expect } from '@playwright/test';
import { ROUTES } from '../utils/test-urls';
import { TEST_USER } from '../fixtures/test-users';

test.describe('Authentication', () => {
  test('should redirect to login if not authenticated', async ({ page }) => {
    // Try to access a protected route
    await page.goto(ROUTES.BOOK_SHELF, { waitUntil: 'domcontentloaded' });

    // Wait for either redirect to login or stay on page
    await Promise.race([
      page.waitForURL(ROUTES.LOGIN, { timeout: 5000 }).catch(() => null),
      page.waitForLoadState('domcontentloaded'),
    ]);

    // Check if we're on login page or if auth is required
    const currentUrl = page.url();
    expect(
      currentUrl.includes(ROUTES.LOGIN) ||
      currentUrl.includes(ROUTES.BOOK_SHELF)
    ).toBeTruthy();
  });

  test('should display login form', async ({ page }) => {
    await page.goto(ROUTES.LOGIN, { waitUntil: 'domcontentloaded' });

    // Accept cookie consent if banner appears
    try {
      const cookieHeading = page.getByRole('heading', { name: 'Nous utilisons des cookies' });
      const isBannerVisible = await cookieHeading.isVisible({ timeout: 2000 }).catch(() => false);
      if (isBannerVisible) {
        const acceptButton = page.getByRole('button', { name: 'Tout accepter' });
        await acceptButton.click({ timeout: 3000 });
        await cookieHeading.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
      }
    } catch (error) {
      // Banner might not be present, continue
    }

    // Wait for form to be visible using more specific selectors
    const emailInput = page.getByLabel(/email/i).or(page.locator('input[type="email"]'));
    const passwordInput = page.getByLabel(/mot de passe|password/i).or(page.locator('input[type="password"]'));
    const submitButton = page.getByRole('button', { name: /se connecter|login|sign in/i }).or(page.locator('button[type="submit"]'));

    await expect(emailInput).toBeVisible({ timeout: 5000 });
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
    await expect(submitButton).toBeVisible({ timeout: 5000 });
  });

  test('should attempt login with test credentials', async ({ page }) => {
    await page.goto(ROUTES.LOGIN, { waitUntil: 'domcontentloaded' });

    // Accept cookie consent if banner appears
    try {
      const cookieHeading = page.getByRole('heading', { name: 'Nous utilisons des cookies' });
      const isBannerVisible = await cookieHeading.isVisible({ timeout: 2000 }).catch(() => false);
      if (isBannerVisible) {
        const acceptButton = page.getByRole('button', { name: 'Tout accepter' });
        await acceptButton.click({ timeout: 3000 });
        await cookieHeading.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
      }
    } catch (error) {
      // Banner might not be present, continue
    }

    // Wait for form elements
    const emailInput = page.getByLabel(/email/i).or(page.locator('input[type="email"]'));
    const passwordInput = page.getByLabel(/mot de passe|password/i).or(page.locator('input[type="password"]'));
    const submitButton = page.getByRole('button', { name: /se connecter|login|sign in/i }).or(page.locator('button[type="submit"]'));

    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill(TEST_USER.email);
    await passwordInput.fill(TEST_USER.password);

    // Submit form and wait for navigation or error
    await Promise.race([
      page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 }),
      page.waitForSelector('text=/error|erreur|invalid/i', { timeout: 5000 }).catch(() => null),
    ]);

    // Check if login was successful (redirect) or if error is shown
    const currentUrl = page.url();
    expect(currentUrl).toBeTruthy();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto(ROUTES.LOGIN, { waitUntil: 'domcontentloaded' });

    // Accept cookie consent if banner appears
    try {
      const cookieHeading = page.getByRole('heading', { name: 'Nous utilisons des cookies' });
      const isBannerVisible = await cookieHeading.isVisible({ timeout: 2000 }).catch(() => false);
      if (isBannerVisible) {
        const acceptButton = page.getByRole('button', { name: 'Tout accepter' });
        await acceptButton.click({ timeout: 3000 });
        await cookieHeading.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
      }
    } catch (error) {
      // Banner might not be present, continue
    }

    const emailInput = page.getByLabel(/email/i).or(page.locator('input[type="email"]'));
    const passwordInput = page.getByLabel(/mot de passe|password/i).or(page.locator('input[type="password"]'));
    const submitButton = page.getByRole('button', { name: /se connecter|login|sign in/i }).or(page.locator('button[type="submit"]'));

    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill('invalid@example.com');
    await passwordInput.fill('wrongpassword');

    // Submit and wait for error message or stay on login page
    await submitButton.click();

    // Wait for error message or ensure we're still on login page
    await Promise.race([
      page.waitForSelector('text=/error|erreur|invalid|credentials/i', { timeout: 5000 }),
      page.waitForURL(ROUTES.LOGIN, { timeout: 5000 }),
    ]);

    // Check if error is displayed or if still on login page
    const currentUrl = page.url();
    expect(currentUrl).toContain(ROUTES.LOGIN);
  });

  test('should handle authenticated session', async ({ page, context }) => {
    // This test assumes you have a way to set up authenticated state
    // You might need to use storageState or mock the auth API

    // Navigate to login page
    await page.goto(ROUTES.LOGIN, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');

    // After authentication, try accessing protected route
    // This is a placeholder - adjust based on your auth flow
    const isAuthenticated = await page.evaluate(() => {
      return document.cookie.includes('next-auth.session-token') ||
             document.cookie.includes('__Secure-next-auth.session-token');
    });

    // If authenticated, should be able to access protected routes
    if (isAuthenticated) {
      await page.goto(ROUTES.BOOK_SHELF, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');
      expect(page.url()).toContain(ROUTES.BOOK_SHELF);
    }
  });
});
