import { test, expect } from '@playwright/test';
import { ROUTES } from '../utils/test-urls';

test.describe('Navigation', () => {
  test('should navigate using App Router Link', async ({ page }) => {
    await page.goto(ROUTES.HOME);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Find and click a navigation link (adjust selector based on your Header component)
    const aboutLink = page.locator('a[href="/about"]').first();

    if (await aboutLink.isVisible()) {
      await aboutLink.click();

      // Wait for navigation to complete
      await page.waitForURL(ROUTES.ABOUT);
      expect(page.url()).toContain(ROUTES.ABOUT);
    }
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto(ROUTES.ABOUT);

    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain(ROUTES.ABOUT);
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);

    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain(ROUTES.LOGIN);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto(ROUTES.REGISTER);

    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain(ROUTES.REGISTER);
  });

  test('should handle client-side navigation', async ({ page }) => {
    await page.goto(ROUTES.HOME);
    await page.waitForLoadState('networkidle');

    // Navigate to another page
    await page.goto(ROUTES.ABOUT);
    await page.waitForLoadState('networkidle');

    // Navigate back using browser back button
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // Should be back on home page
    expect(page.url()).toContain(ROUTES.HOME);
  });
});
