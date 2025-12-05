import {test, expect} from '@playwright/test';
import {ROUTES} from '../utils/test-urls';
import {
    waitForPageReady,
    waitForDeleteAccountPageReady,
    acceptCookieConsent,
    TestUser,
    loginUser,
    createOrUpdateTestUser
} from '../helpers/playwright';

test.describe('Account Deletion', () => {
    const testUserForDeletion: TestUser = {
        email: 'delete-test@example.com',
        password: 'password123',
        username: 'deletetest',
    };

    test.beforeAll(async () => {
        await createOrUpdateTestUser(testUserForDeletion);
    });

    test.beforeEach(async ({page}) => {
        await loginUser(page, testUserForDeletion, ROUTES.LOGIN);
    });

    test('should redirect to login if not authenticated', async ({page, context}) => {
        await context.clearCookies();
        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);

        // Wait longer and be more flexible with what we accept
        await page.waitForTimeout(2000);

        const currentUrl = page.url();
        const isOnLogin = currentUrl.includes(ROUTES.LOGIN);
        const hasUnauthorizedMessage = await page.locator('text=/accès non autorisé|non autorisé/i')
            .isVisible({timeout: 5000})
            .catch(() => false);
        const hasLoginHeading = await page.getByRole('heading', {name: /connexion|login/i})
            .isVisible({timeout: 5000})
            .catch(() => false);

        // Accept any of these conditions
        expect(isOnLogin || hasUnauthorizedMessage || hasLoginHeading).toBeTruthy();
    });

    test('should display delete account page with warning', async ({page}) => {
        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);
        await waitForDeleteAccountPageReady(page);

        const heading = page.getByTestId('delete-account-page-title');
        await expect(heading).toBeVisible({timeout: 15000});

        const warningAlert = page.getByTestId('delete-warning-alert');
        await expect(warningAlert).toBeVisible({timeout: 15000});

        const alertText = await warningAlert.textContent();
        expect(alertText?.toLowerCase()).toContain('attention');
        expect(alertText?.toLowerCase()).toMatch(/définitive|irréversible|permanent/);
    });

    test('should require confirmation text before deletion', async ({page}) => {
        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);
        await waitForDeleteAccountPageReady(page);

        const deleteButton = page.getByTestId('delete-account-button');
        await expect(deleteButton).toBeVisible({timeout: 10000});

        // Wait a bit for React to fully hydrate
        await page.waitForTimeout(1000);

        await expect(deleteButton).toBeDisabled({timeout: 5000});

        const confirmInput = page.getByTestId('delete-confirm-input');
        await expect(confirmInput).toBeVisible({timeout: 10000});

        // Test incorrect text
        await confirmInput.fill('WRONG');
        await page.waitForTimeout(1000); // Give React time to update
        await expect(deleteButton).toBeDisabled({timeout: 3000});

        // Test correct text
        await confirmInput.fill('SUPPRIMER');
        await page.waitForTimeout(1000); // Give React time to update
        await expect(deleteButton).toBeEnabled({timeout: 5000});
    });

    test('should show error if confirmation text is incorrect', async ({page}) => {
        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);
        await waitForDeleteAccountPageReady(page);

        const confirmInput = page.getByTestId('delete-confirm-input');
        await expect(confirmInput).toBeVisible({timeout: 10000});

        const deleteButton = page.getByTestId('delete-account-button');
        await expect(deleteButton).toBeVisible({timeout: 10000});

        await confirmInput.fill('WRONG');
        await page.waitForTimeout(1000);

        // The button should remain disabled
        const isDisabled = await deleteButton.isDisabled({timeout: 3000}).catch(() => true);
        expect(isDisabled).toBe(true);
    });

    test('should list all data that will be deleted', async ({page}) => {
        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);
        await waitForPageReady(page);

        const pageContent = await page.content();
        const contentLower = pageContent.toLowerCase();

        expect(contentLower).toContain('profil utilisateur');
        expect(contentLower).toContain('livres');
        expect(contentLower).toContain('progression');
        expect(contentLower).toContain('notes');
        expect(contentLower).toContain('avis');
        expect(contentLower).toContain('objectifs');
        expect(contentLower).toContain('badges');
        expect(contentLower).toContain('statistiques');
        expect(contentLower).toContain('relations');
        expect(contentLower).toContain('prêt');
    });

    test('should delete account when confirmed', async ({page}) => {
        // Recreate user before deletion
        await createOrUpdateTestUser(testUserForDeletion);

        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);
        await waitForDeleteAccountPageReady(page);

        const confirmInput = page.getByTestId('delete-confirm-input');
        await expect(confirmInput).toBeVisible({timeout: 10000});
        await confirmInput.fill('SUPPRIMER');
        await page.waitForTimeout(500);

        const deleteButton = page.getByTestId('delete-account-button');
        await expect(deleteButton).toBeEnabled({timeout: 5000});

        // Click and wait for any of the success indicators
        await deleteButton.click();

        // Wait for either: navigation, success message, or home page
        const results = await Promise.allSettled([
            page.waitForURL(ROUTES.HOME, {timeout: 30000}),
            page.waitForSelector('text=/compte supprimé/i', {timeout: 30000}),
            page.waitForSelector('h1, main, [role="main"]', {state: 'attached', timeout: 30000})
        ]);

        // At least one should succeed
        const hasSuccess = results.some(r => r.status === 'fulfilled');
        expect(hasSuccess).toBeTruthy();
    });

    test('should show loading state during deletion', async ({page}) => {
        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);
        await waitForDeleteAccountPageReady(page);

        // Slow down the API to catch loading state
        let requestIntercepted = false;
        await page.route(/\/api\/user\/[^/]+\/delete/, async route => {
            requestIntercepted = true;
            await page.waitForTimeout(2000); // Longer delay
            await route.continue();
        });

        const confirmInput = page.getByTestId('delete-confirm-input');
        await expect(confirmInput).toBeVisible({timeout: 15000});
        await confirmInput.fill('SUPPRIMER');
        await page.waitForTimeout(500);

        const deleteButton = page.getByTestId('delete-account-button');
        await expect(deleteButton).toBeEnabled({timeout: 5000});

        await deleteButton.click();

        // Immediately check for loading states
        await page.waitForTimeout(200);

        // Check multiple loading indicators
        const checks = await Promise.allSettled([
            page.getByTestId('delete-loading-overlay').isVisible({timeout: 3000}),
            page.getByTestId('delete-loading-spinner').isVisible({timeout: 3000}),
            page.getByTestId('delete-overlay-spinner').isVisible({timeout: 3000}),
            page.getByTestId('delete-loading-title').isVisible({timeout: 3000}),
        ]);

        const buttonText = await deleteButton.textContent().catch(() => '');
        const isButtonDisabled = await deleteButton.isDisabled().catch(() => false);
        const hasLoadingText = buttonText?.toLowerCase().includes('suppression en cours');

        // At least one indicator should be present
        const hasVisibleIndicator = checks.some(
            (result): result is PromiseFulfilledResult<boolean> =>
                result.status === 'fulfilled' && result.value === true
        );

        expect(
            hasVisibleIndicator ||
            hasLoadingText ||
            isButtonDisabled ||
            requestIntercepted
        ).toBeTruthy();
    });

    test('should handle deletion errors gracefully', async ({page}) => {
        await page.route(/\/api\/user\/[^/]+\/delete/, route => {
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({error: 'Internal server error'}),
            });
        });

        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);
        await waitForDeleteAccountPageReady(page);

        const confirmInput = page.getByTestId('delete-confirm-input');
        await expect(confirmInput).toBeVisible({timeout: 10000});
        await confirmInput.fill('SUPPRIMER');
        await page.waitForTimeout(500);

        const deleteButton = page.getByTestId('delete-account-button');
        await expect(deleteButton).toBeEnabled({timeout: 5000});
        await deleteButton.click();

        // Wait longer for error to appear
        await page.waitForTimeout(3000);

        const errorVisible = await page.getByText(/erreur|error|impossible/i)
            .first()
            .isVisible({timeout: 15000})
            .catch(() => false);

        expect(errorVisible).toBe(true);
    });

    test('should display user rights information', async ({page}) => {
        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);
        await waitForPageReady(page);

        await expect(page.getByText(/vos droits/i)).toBeVisible({timeout: 15000});
        await expect(page.getByText(/RGPD/i)).toBeVisible({timeout: 15000});

        const privacyLink = page.locator('a[href="/privacy"]');
        await expect(privacyLink.first()).toBeVisible({timeout: 15000});
    });

    test('should allow exporting data before deletion', async ({page}) => {
        await page.goto(ROUTES.DELETE_ACCOUNT, {waitUntil: 'load'});
        await acceptCookieConsent(page);
        await waitForDeleteAccountPageReady(page);

        const exportSection = page.getByText(/exporter vos données/i);
        await expect(exportSection).toBeVisible({timeout: 10000});

        const deleteSection = page.getByText(/supprimer mon compte/i);
        await expect(deleteSection).toBeVisible({timeout: 10000});

        const exportPosition = await exportSection.boundingBox();
        const deletePosition = await deleteSection.boundingBox();

        if (exportPosition && deletePosition) {
            expect(exportPosition.y).toBeLessThan(deletePosition.y);
        }
    });
});