import {test, expect} from '@playwright/test';
import {ROUTES} from '../utils/test-urls';
import {navigateTo, waitForPageReady} from '../helpers/playwright';

test.describe('Navigation', () => {
    test('should navigate using App Router Link', async ({page}) => {
        await navigateTo(page, ROUTES.HOME);

        const aboutLink = page.locator('a[href="/about"]').first();
        await aboutLink.waitFor({state: 'visible', timeout: 10000});

        await Promise.race([
            Promise.all([
                page.waitForURL(ROUTES.ABOUT, {timeout: 15000}),
                aboutLink.click(),
            ]),
            Promise.all([
                page.waitForSelector('h1:has-text("À propos"), h1:has-text("About")', {timeout: 15000}),
                aboutLink.click(),
            ]),
        ]);

        const currentUrl = page.url();
        const hasAboutHeading = await page.getByRole('heading', {
            name: /à propos|about/i,
            level: 1
        }).isVisible().catch(() => false);

        expect(
            currentUrl.includes(ROUTES.ABOUT) || hasAboutHeading
        ).toBeTruthy();
    });

    test('should navigate to about page', async ({page}) => {
        await navigateTo(page, ROUTES.ABOUT);
        await waitForPageReady(page);

        await Promise.race([
            page.waitForURL(new RegExp(ROUTES.ABOUT.replace('/', '\\/')), {timeout: 15000}),
            page.waitForSelector('h1:has-text("À propos"), h1:has-text("About")', {timeout: 15000}),
            page.getByRole('heading', {name: /à propos|about/i, level: 1}).waitFor({state: 'visible', timeout: 15000}),
        ]);

        const currentUrl = page.url();
        const hasAboutHeading = await page.getByRole('heading', {
            name: /à propos|about/i,
            level: 1
        }).isVisible().catch(() => false);

        expect(
            currentUrl.includes(ROUTES.ABOUT) || hasAboutHeading
        ).toBeTruthy();
    });

    test('should navigate to login page', async ({page}) => {
        await navigateTo(page, ROUTES.LOGIN);
        expect(page.url()).toContain(ROUTES.LOGIN);
    });

    test('should navigate to register page', async ({page}) => {
        await navigateTo(page, ROUTES.REGISTER);
        expect(page.url()).toContain(ROUTES.REGISTER);
    });

    test('should handle client-side navigation', async ({page}) => {
        await navigateTo(page, ROUTES.HOME);
        await navigateTo(page, ROUTES.ABOUT);

        await page.goBack({waitUntil: 'domcontentloaded'});
        await page.waitForLoadState('domcontentloaded');

        expect(page.url()).toContain(ROUTES.HOME);
    });
});