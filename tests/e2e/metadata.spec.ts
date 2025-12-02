import { test, expect } from '@playwright/test';
import { ROUTES } from '../utils/test-urls';

test.describe('Metadata', () => {
  test('should have correct homepage metadata', async ({ page }) => {
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Check document title
    await expect(page).toHaveTitle(/Capybook/);

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      'content',
      /Capybook|compagnon de lecture|progression en lecture/,
    );
  });

  test('should have correct Open Graph tags', async ({ page }) => {
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Check for Open Graph title (if implemented)
    const ogTitle = page.locator('meta[property="og:title"]');
    if (await ogTitle.count() > 0) {
      await expect(ogTitle).toHaveAttribute('content', /Capybook/);
    }

    // Check for Open Graph description (if implemented)
    const ogDescription = page.locator('meta[property="og:description"]');
    if (await ogDescription.count() > 0) {
      await expect(ogDescription).toHaveAttribute(
        'content',
        /Capybook|compagnon de lecture/,
      );
    }
  });

  test('should have correct viewport meta tag', async ({ page }) => {
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute(
      'content',
      /width=device-width/,
    );
  });

  test('should have correct charset', async ({ page }) => {
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    const charset = page.locator('meta[charset]');
    await expect(charset).toHaveAttribute('charset', 'utf-8');
  });

  test('should validate metadata from generateMetadata function', async ({
    page,
  }) => {
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Get the full HTML to check metadata
    const html = await page.content();

    // Check that title is in the HTML
    expect(html).toMatch(/Capybook|CapyBook/);

    // Check that description meta tag exists
    expect(html).toMatch(/<meta[^>]*name=["']description["'][^>]*>/i);
  });

  test('should have correct lang attribute', async ({ page }) => {
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'fr');
  });
});
