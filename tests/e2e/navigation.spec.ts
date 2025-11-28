import { test, expect } from '@playwright/test';
import { ROUTES } from '../utils/test-urls';

test.describe('Navigation', () => {
  test('should navigate using App Router Link', async ({ page }) => {
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Wait for navigation to be ready
    await page.waitForLoadState('domcontentloaded');

    // Find and click a navigation link - use more specific selector
    const aboutLink = page.locator('a[href="/about"]').first();

    // Wait for link to be visible and clickable
    await aboutLink.waitFor({ state: 'visible', timeout: 5000 });

    // Click and wait for navigation
    await Promise.all([
      page.waitForURL(ROUTES.ABOUT, { timeout: 10000 }),
      aboutLink.click(),
    ]);

    expect(page.url()).toContain(ROUTES.ABOUT);
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto(ROUTES.ABOUT, { waitUntil: 'domcontentloaded' });

    // Wait for page to load and ensure we're not redirected
    await page.waitForLoadState('domcontentloaded');

    // Verify we're on the about page (not redirected to login)
    await expect(page).toHaveURL(new RegExp(ROUTES.ABOUT.replace('/', '\\/')), { timeout: 5000 });
    expect(page.url()).toContain(ROUTES.ABOUT);
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto(ROUTES.LOGIN, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain(ROUTES.LOGIN);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto(ROUTES.REGISTER, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain(ROUTES.REGISTER);
  });

  test('should handle client-side navigation', async ({ page }) => {
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');

    // Navigate to another page
    await page.goto(ROUTES.ABOUT, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');

    // Navigate back using browser back button
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');

    // Should be back on home page
    expect(page.url()).toContain(ROUTES.HOME);
  });
});
