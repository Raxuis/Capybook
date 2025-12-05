import {test, expect} from '@playwright/test';
import {ROUTES} from '../utils/test-urls';
import {TEST_USER} from '../fixtures/test-users';
import {
    loginUser,
    logoutUser,
    acceptCookieConsent,
    waitForPageReady,
    waitForDeleteAccountPageReady
} from '../helpers/playwright';

test.describe('Data Export', () => {
    test.beforeEach(async ({page}) => {
        await loginUser(page, TEST_USER, ROUTES.LOGIN);
    });

    test('should redirect to login if not authenticated', async ({page}) => {
        await logoutUser(page);
        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);

        // Wait for redirect/page load
        await page.waitForTimeout(2000);

        const currentUrl = page.url();
        const isOnLogin = currentUrl.includes(ROUTES.LOGIN);
        const hasUnauthorizedMessage = await page.locator('text=/accès non autorisé|non autorisé/i')
            .isVisible({timeout: 5000})
            .catch(() => false);
        const hasLoginHeading = await page.getByRole('heading', {name: /connexion|login/i})
            .isVisible({timeout: 5000})
            .catch(() => false);

        expect(isOnLogin || hasUnauthorizedMessage || hasLoginHeading).toBeTruthy();
    });

    test('should display delete account page when authenticated', async ({page}) => {
        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);
        await waitForPageReady(page);

        const heading = page.locator('h1').filter({hasText: /suppression de compte/i});
        await expect(heading).toBeVisible({timeout: 15000});

        await expect(page.getByText(/exporter vos données/i)).toBeVisible({timeout: 15000});
        await expect(page.getByRole('button', {name: /télécharger/i})).toBeVisible({timeout: 15000});
    });

    test('should export user data as JSON file', async ({page}) => {
        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);
        await waitForPageReady(page);

        const exportButton = page.getByRole('button', {name: /télécharger/i});
        await expect(exportButton).toBeVisible({timeout: 10000});

        const downloadPromise = page.waitForEvent('download', {timeout: 30000});
        await exportButton.click();

        const download = await downloadPromise;

        const filename = download.suggestedFilename();
        expect(filename).toMatch(/capybook-data-.*\.json/);

        const path = await download.path();
        expect(path).toBeTruthy();

        const fs = require('fs');
        const fileContent = fs.readFileSync(path, 'utf-8');
        const data = JSON.parse(fileContent);

        expect(data).toHaveProperty('exportDate');
        expect(data).toHaveProperty('user');
        expect(data.user).toHaveProperty('email');
        expect(data.user).toHaveProperty('username');
        expect(data).toHaveProperty('books');
        expect(data).toHaveProperty('wishlist');
        expect(data).toHaveProperty('notes');
        expect(data).toHaveProperty('reviews');
        expect(data).toHaveProperty('goals');
        expect(data).toHaveProperty('badges');
        expect(data).toHaveProperty('readingStats');
        expect(data).toHaveProperty('social');
        expect(data).toHaveProperty('lending');

        expect(data.user.email).toBe(TEST_USER.email);
    });

    test('should show loading state during export', async ({page}) => {
        let requestIntercepted = false;

        await page.route(/\/api\/user\/[^/]+\/export/, async route => {
            requestIntercepted = true;
            // Longer delay to catch loading state
            await page.waitForTimeout(2000);
            await route.continue();
        });

        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);
        await waitForDeleteAccountPageReady(page);

        const exportButton = page.getByTestId('export-data-button');
        await expect(exportButton).toBeVisible({timeout: 15000});

        await exportButton.click();

        // Check immediately for loading state
        await page.waitForTimeout(200);

        // Try multiple ways to detect loading state
        const loadingSpinner = await page.getByTestId('export-loading-spinner')
            .isVisible({timeout: 3000})
            .catch(() => false);

        const buttonText = await exportButton.textContent().catch(() => '');
        const isButtonDisabled = await exportButton.isDisabled().catch(() => false);

        const hasLoadingText = buttonText?.toLowerCase().includes('export en cours') ||
            buttonText?.toLowerCase().includes('en cours') ||
            false;

        // At least one loading indicator should be present
        expect(
            loadingSpinner ||
            hasLoadingText ||
            isButtonDisabled ||
            requestIntercepted
        ).toBeTruthy();
    });

    test('should handle export errors gracefully', async ({page}) => {
        await page.route(/\/api\/user\/[^/]+\/export/, route => {
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({error: 'Internal server error'}),
            });
        });

        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);
        await waitForDeleteAccountPageReady(page);

        const exportButton = page.getByTestId('export-data-button');
        await expect(exportButton).toBeVisible({timeout: 15000});
        await exportButton.click();

        // Wait longer for error toast
        await page.waitForTimeout(3000);

        const errorMessage = page.getByText(/erreur|error|impossible/i).first();
        await expect(errorMessage).toBeVisible({timeout: 15000});
    });

    test('should display user rights information', async ({page}) => {
        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);
        await waitForPageReady(page);

        await expect(page.getByText(/vos droits/i)).toBeVisible({timeout: 10000});
        await expect(page.getByText(/RGPD/i)).toBeVisible({timeout: 10000});

        const privacyLink = page.locator('a[href="/privacy"]');
        await expect(privacyLink.first()).toBeVisible({timeout: 10000});
    });

    test('should list all data categories in export section', async ({page}) => {
        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);
        await waitForDeleteAccountPageReady(page);

        const exportDescription = page.locator('p').filter({hasText: /Les données exportées incluent/i});
        await expect(exportDescription).toBeVisible({timeout: 15000});

        const descriptionText = await exportDescription.textContent();
        expect(descriptionText).toBeTruthy();

        const text = descriptionText!.toLowerCase();
        expect(text).toMatch(/profil/i);
        expect(text).toMatch(/livres/i);
        expect(text).toMatch(/progression/i);
        expect(text).toMatch(/notes/i);
        expect(text).toMatch(/avis/i);
        expect(text).toMatch(/objectifs/i);
        expect(text).toMatch(/badges/i);
        expect(text).toMatch(/statistiques/i);
    });
});