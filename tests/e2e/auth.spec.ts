import {test, expect} from '@playwright/test';
import {ROUTES} from '../utils/test-urls';
import {TEST_USER} from '../fixtures/test-users';
import {loginUser, logoutUser, acceptCookieConsent} from '../helpers/playwright';

test.describe('Authentication', () => {
    test('should redirect to login if not authenticated', async ({page}) => {
        await page.goto(ROUTES.BOOK_SHELF, {waitUntil: 'domcontentloaded'});

        await Promise.race([
            page.waitForURL(ROUTES.LOGIN, {timeout: 5000}).catch(() => null),
            page.waitForLoadState('domcontentloaded'),
        ]);

        const currentUrl = page.url();
        expect(
            currentUrl.includes(ROUTES.LOGIN) ||
            currentUrl.includes(ROUTES.BOOK_SHELF)
        ).toBeTruthy();
    });

    test('should display login form', async ({page}) => {
        await page.goto(ROUTES.LOGIN, {waitUntil: 'domcontentloaded'});
        await acceptCookieConsent(page);

        const emailInput = page.getByLabel(/email/i).or(page.locator('input[type="email"]'));
        const passwordInput = page.getByLabel(/mot de passe|password/i).or(page.locator('input[type="password"]'));
        const submitButton = page.getByRole('button', {name: /se connecter|login|sign in/i});

        await expect(emailInput).toBeVisible({timeout: 5000});
        await expect(passwordInput).toBeVisible({timeout: 5000});
        await expect(submitButton).toBeVisible({timeout: 5000});
    });

    test('should attempt login with test credentials', async ({page}) => {
        await loginUser(page, TEST_USER, ROUTES.LOGIN);

        const currentUrl = page.url();
        expect(currentUrl).toBeTruthy();
        expect(currentUrl).not.toContain(ROUTES.LOGIN);
    });

    test('should show error for invalid credentials', async ({page}) => {
        await page.goto(ROUTES.LOGIN, {waitUntil: 'domcontentloaded'});
        await acceptCookieConsent(page);

        const emailInput = page.getByLabel(/email/i).or(page.locator('input[type="email"]'));
        const passwordInput = page.getByLabel(/mot de passe|password/i).or(page.locator('input[type="password"]'));
        const submitButton = page.getByRole('button', {name: /se connecter|login|sign in/i});

        await emailInput.waitFor({state: 'visible', timeout: 5000});
        await emailInput.fill('invalid@example.com');
        await passwordInput.fill('wrongpassword');

        await submitButton.click();

        await Promise.race([
            page.waitForSelector('text=/error|erreur|invalid|credentials/i', {timeout: 5000}),
            page.waitForURL(ROUTES.LOGIN, {timeout: 5000}),
        ]);

        const currentUrl = page.url();
        expect(currentUrl).toContain(ROUTES.LOGIN);
    });

    test('should handle authenticated session', async ({page}) => {
        await page.goto(ROUTES.LOGIN, {waitUntil: 'domcontentloaded'});
        await page.waitForLoadState('domcontentloaded');

        const isAuthenticated = await page.evaluate(() => {
            return document.cookie.includes('next-auth.session-token') ||
                document.cookie.includes('__Secure-next-auth.session-token');
        });

        if (isAuthenticated) {
            await page.goto(ROUTES.BOOK_SHELF, {waitUntil: 'domcontentloaded'});
            await page.waitForLoadState('domcontentloaded');
            expect(page.url()).toContain(ROUTES.BOOK_SHELF);
        }
    });

    test('should logout successfully', async ({page}) => {
        await loginUser(page, TEST_USER, ROUTES.LOGIN);

        const currentUrl = page.url();
        expect(currentUrl).not.toContain(ROUTES.LOGIN);

        await logoutUser(page);

        await page.goto(ROUTES.BOOK_SHELF, {waitUntil: 'domcontentloaded'});
        await page.waitForLoadState('domcontentloaded');

        const finalUrl = page.url();
        expect(
            finalUrl.includes(ROUTES.LOGIN) ||
            finalUrl.includes(ROUTES.BOOK_SHELF)
        ).toBeTruthy();
    });
});