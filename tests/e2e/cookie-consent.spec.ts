import {test, expect} from '@playwright/test';
import {ROUTES} from '../utils/test-urls';
import {acceptCookieConsent} from '../helpers/playwright';

test.describe('Cookie Consent Banner', () => {
    test('should display cookie banner on first visit', async ({page, context}) => {
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        const cookieHeading = page.getByRole('heading', {name: 'Nous utilisons des cookies'});
        await expect(cookieHeading).toBeVisible({timeout: 5000});

        await expect(page.getByRole('button', {name: 'Tout accepter'})).toBeVisible({timeout: 5000});
        await expect(page.getByRole('button', {name: 'Refuser'})).toBeVisible({timeout: 5000});
        await expect(page.getByRole('button', {name: 'Personnaliser'})).toBeVisible({timeout: 5000});
    });

    test('should not display banner after accepting cookies', async ({page, context}) => {
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        const cookieHeading = page.getByRole('heading', {name: 'Nous utilisons des cookies'});
        await expect(cookieHeading).toBeVisible({timeout: 5000});

        await acceptCookieConsent(page);

        await expect(cookieHeading).not.toBeVisible({timeout: 5000});

        await page.reload({waitUntil: 'load'});

        await expect(cookieHeading).not.toBeVisible({timeout: 3000});
    });

    test('should not display banner after rejecting cookies', async ({page, context}) => {
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        const cookieHeading = page.getByRole('heading', {name: 'Nous utilisons des cookies'});
        await expect(cookieHeading).toBeVisible({timeout: 5000});

        const rejectButton = page.getByRole('button', {name: 'Refuser'});
        await rejectButton.click();

        await expect(cookieHeading).not.toBeVisible({timeout: 5000});

        await page.reload({waitUntil: 'load'});

        await expect(cookieHeading).not.toBeVisible({timeout: 3000});
    });

    test('should open settings modal when clicking customize', async ({page, context}) => {
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        const cookieHeading = page.getByRole('heading', {name: 'Nous utilisons des cookies'});
        await expect(cookieHeading).toBeVisible({timeout: 5000});

        const customizeButton = page.getByRole('button', {name: 'Personnaliser'});
        await customizeButton.click();

        await expect(page.getByText('Paramètres des cookies', {exact: false})).toBeVisible({timeout: 5000});

        await expect(page.getByText('Cookies nécessaires', {exact: false})).toBeVisible({timeout: 3000});
        await expect(page.getByText('Cookies d\'analyse', {exact: false})).toBeVisible({timeout: 3000});
    });

    test('should save preferences when clicking save in settings', async ({page, context}) => {
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        const cookieHeading = page.getByRole('heading', {name: 'Nous utilisons des cookies'});
        await expect(cookieHeading).toBeVisible({timeout: 5000});

        const customizeButton = page.getByRole('button', {name: 'Personnaliser'});
        await customizeButton.click();

        await expect(page.getByText('Paramètres des cookies', {exact: false})).toBeVisible({timeout: 5000});

        const checkboxes = page.locator('input[type="checkbox"]');
        const analyticsCheckbox = checkboxes.nth(1);

        await expect(analyticsCheckbox).toBeVisible({timeout: 3000});

        const isChecked = await analyticsCheckbox.isChecked();
        if (isChecked) {
            await analyticsCheckbox.click();
        }

        const saveButton = page.getByRole('button', {name: /enregistrer/i});
        await saveButton.click();

        await expect(page.getByText('Paramètres des cookies', {exact: false})).not.toBeVisible({timeout: 5000});

        const preferences = await page.evaluate(() => {
            return localStorage.getItem('capybook-cookie-preferences');
        });

        expect(preferences).toBeTruthy();
        if (preferences) {
            const parsed = JSON.parse(preferences);
            expect(parsed.necessary).toBe(true);
            expect(parsed.analytics).toBe(false);
        }
    });

    test('should show cookie button after consent is given', async ({page, context}) => {
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        await acceptCookieConsent(page);

        const cookieButton = page.getByRole('button', {name: 'Cookies'});
        await expect(cookieButton).toBeVisible({timeout: 5000});
    });

    test('should reopen settings when clicking cookie button', async ({page, context}) => {
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        await acceptCookieConsent(page);

        const cookieButton = page.getByRole('button', {name: 'Cookies'});
        await expect(cookieButton).toBeVisible({timeout: 5000});

        await cookieButton.click();

        await expect(page.getByText('Paramètres des cookies', {exact: false})).toBeVisible({timeout: 5000});
    });

    test('should link to cookies policy page', async ({page, context}) => {
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        const cookieHeading = page.getByRole('heading', {name: 'Nous utilisons des cookies'});
        await expect(cookieHeading).toBeVisible({timeout: 5000});

        const linkInBanner = cookieHeading.locator('..').locator('..').locator('a[href="/cookies"]').filter({hasText: /politique de cookies/i}).first();
        const linkInFooter = page.locator('footer').locator('a[href="/cookies"]');

        const bannerLinkVisible = await linkInBanner.isVisible().catch(() => false);
        const footerLinkVisible = await linkInFooter.isVisible().catch(() => false);

        expect(bannerLinkVisible || footerLinkVisible).toBeTruthy();
    });
});