import {Page} from '@playwright/test';

/**
 * Navigate to a URL and wait for it to load
 */
export async function navigateTo(page: Page, url: string): Promise<void> {
    await page.goto(url);
    await page.waitForLoadState('networkidle');
}

/**
 * Wait for a page to be fully loaded
 */
export async function waitForPage(page: Page, url: string): Promise<void> {
    await page.waitForURL(url);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
}

/**
 * Wait for navigation after an action
 */
export async function waitForNavigation(
    page: Page,
    expectedUrl: string,
    timeout = 15000
): Promise<void> {
    try {
        await Promise.race([
            page.waitForURL(expectedUrl, {timeout}),
            page.waitForURL((url) => url.toString().includes(expectedUrl), {timeout}),
            page.waitForLoadState('networkidle', {timeout: timeout / 2}).catch(() => {
            }),
        ]);
    } catch (error) {
        await page.screenshot({
            path: `debug-navigation-timeout-${Date.now()}.png`,
            fullPage: true
        });
        throw error;
    }
}