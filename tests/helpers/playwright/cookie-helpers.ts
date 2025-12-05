import {Page} from '@playwright/test';

/**
 * Accept cookie consent banner if present
 * This should be called before any interactions on pages that might show the banner
 */
export async function acceptCookieConsent(page: Page): Promise<void> {
    try {
        const cookieHeading = page.getByRole('heading', {name: 'Nous utilisons des cookies'});
        const isVisible = await cookieHeading.isVisible({timeout: 2000}).catch(() => false);

        if (isVisible) {
            const acceptButton = page.getByRole('button', {name: 'Tout accepter'});
            await acceptButton.click({timeout: 3000});
            await cookieHeading.waitFor({state: 'hidden', timeout: 3000}).catch(() => {
            });
        }
    } catch (error) {
        // Banner doesn't exist or is already dismissed
    }
}