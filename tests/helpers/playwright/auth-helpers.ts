import {Page} from '@playwright/test';
import {acceptCookieConsent} from "@/tests/helpers/playwright/cookie-helpers";

export interface TestUser {
    email: string;
    password: string;
    username?: string;
}

/**
 * Connecte un utilisateur
 */
export async function loginUser(page: Page, user: TestUser, loginRoute: string) {
    await page.goto(loginRoute, {waitUntil: 'load'});

    await acceptCookieConsent(page);

    const emailInput = page.getByLabel(/email/i).or(page.locator('input[type="email"]'));
    const passwordInput = page.getByLabel(/mot de passe|password/i).or(page.locator('input[type="password"]'));
    const submitButton = page.getByRole('button', {name: /se connecter|login|sign in/i});

    await emailInput.waitFor({state: 'visible', timeout: 5000});
    await emailInput.fill(user.email);
    await passwordInput.fill(user.password);
    await submitButton.click();

    try {
        await page.waitForLoadState('networkidle', {timeout: 10000}).catch(() => {
        });

        await Promise.race([
            page.waitForURL((url) => !url.pathname.includes('/login'), {timeout: 15000}),
            page.waitForFunction(
                () => !window.location.pathname.includes('/login') &&
                    !document.body.innerText.toLowerCase().includes('se connecter'),
                null,
                {timeout: 15000}
            ),
            page.waitForSelector('[data-testid="user-menu"], [href*="/profile"], [href*="/book-shelf"]',
                {timeout: 15000}).catch(() => null),
        ]);

        await page.waitForTimeout(500);
    } catch (err) {
        await page.screenshot({
            path: `debug-login-timeout-${Date.now()}.png`,
            fullPage: true
        });
        console.error('[login] Login failed:', page.url());
        throw err;
    }
}

/**
 * Déconnecte l'utilisateur en supprimant les cookies
 */
export async function logoutUser(page: Page) {
    await page.context().clearCookies();
}