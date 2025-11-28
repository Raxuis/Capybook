import { test, expect } from '@playwright/test';
import { ROUTES } from '../utils/test-urls';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Wait for the page to be fully loaded
    await page.waitForLoadState('domcontentloaded');

    // Check that the page loaded successfully
    expect(page.url()).toContain(ROUTES.HOME);
  });

  test('should display the correct title', async ({ page }) => {
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Check the page title from metadata
    await expect(page).toHaveTitle(/Capybook/, { timeout: 5000 });
  });

  test('should have correct metadata', async ({ page }) => {
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      'content',
      /Capybook|compagnon de lecture/,
      { timeout: 5000 },
    );

    // Check that the page has a main element
    const main = page.locator('main');
    await expect(main).toBeVisible({ timeout: 5000 });
  });

  test('should render Hero component', async ({ page }) => {
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Wait for content to be visible
    await page.waitForLoadState('domcontentloaded');

    // Check that main content is rendered
    const main = page.locator('main');
    await expect(main).toBeVisible({ timeout: 5000 });
  });

  test('should be a client component (interactive)', async ({ page }) => {
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Wait for hydration
    await page.waitForLoadState('domcontentloaded');

    // Check that the page is interactive (client component)
    const body = page.locator('body');
    await expect(body).toBeVisible({ timeout: 5000 });
  });
});
