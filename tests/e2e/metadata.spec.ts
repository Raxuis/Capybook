import { test, expect } from '@playwright/test';
import { ROUTES } from '../utils/test-urls';

test.describe('Metadata', () => {
  test('should have correct homepage metadata', async ({ page }) => {
    await page.goto(ROUTES.HOME);

    // Check document title
    await expect(page).toHaveTitle(/Livre Track/);

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      'content',
      /La façon la plus simple de suivre votre progression en lecture/,
    );
  });

  test('should have correct Open Graph tags', async ({ page }) => {
    await page.goto(ROUTES.HOME);

    // Check for Open Graph title (if implemented)
    const ogTitle = page.locator('meta[property="og:title"]');
    if (await ogTitle.count() > 0) {
      await expect(ogTitle).toHaveAttribute('content', /Livre Track/);
    }

    // Check for Open Graph description (if implemented)
    const ogDescription = page.locator('meta[property="og:description"]');
    if (await ogDescription.count() > 0) {
      await expect(ogDescription).toHaveAttribute(
        'content',
        /La façon la plus simple/,
      );
    }
  });

  test('should have correct viewport meta tag', async ({ page }) => {
    await page.goto(ROUTES.HOME);

    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute(
      'content',
      /width=device-width/,
    );
  });

  test('should have correct charset', async ({ page }) => {
    await page.goto(ROUTES.HOME);

    const charset = page.locator('meta[charset]');
    await expect(charset).toHaveAttribute('charset', 'utf-8');
  });

  test('should validate metadata from generateMetadata function', async ({
    page,
  }) => {
    await page.goto(ROUTES.HOME);

    // Get the full HTML to check metadata
    const html = await page.content();

    // Check that title is in the HTML
    expect(html).toContain('Livre Track');

    // Check that description meta tag exists
    expect(html).toMatch(/<meta[^>]*name=["']description["'][^>]*>/i);
  });

  test('should have correct lang attribute', async ({ page }) => {
    await page.goto(ROUTES.HOME);

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });
});
