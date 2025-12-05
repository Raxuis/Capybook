import {Page} from '@playwright/test';

/**
 * Wait for page to be completely loaded and hydrated by React
 */
export async function waitForPageReady(page: Page): Promise<void> {
    // Wait for basic loading
    await page.waitForLoadState('domcontentloaded');

    // Try to wait for network idle but don't fail if timeout
    await page.waitForLoadState('networkidle', {timeout: 5000}).catch(() => {
    });

    // Wait for session loading to disappear
    await page.waitForSelector('text=/Chargement de la session/i', {
        state: 'hidden',
        timeout: 5000
    }).catch(() => {
    });

    // Wait for main content to be in DOM
    await page.waitForSelector('main, [role="main"], h1', {
        state: 'attached',
        timeout: 10000
    }).catch(() => {
    });

    // Longer delay for React hydration (especially important for forms)
    await page.waitForTimeout(1000);
}

/**
 * Wait for delete account page to be ready
 */
export async function waitForDeleteAccountPageReady(page: Page): Promise<void> {
    await waitForPageReady(page);

    // Wait for the page title
    await page.waitForSelector('[data-testid="delete-account-page-title"]', {
        state: 'visible',
        timeout: 15000
    });

    // Wait for delete button to be in DOM
    await page.waitForSelector('[data-testid="delete-account-button"]', {
        state: 'attached',
        timeout: 10000
    });

    // Wait for export button
    await page.waitForSelector('[data-testid="export-data-button"]', {
        state: 'attached',
        timeout: 10000
    });

    // Additional time for full hydration
    await page.waitForTimeout(500);
}

/**
 * Wait for form to be interactive
 */
export async function waitForFormReady(page: Page, formSelector?: string): Promise<void> {
    const selector = formSelector || 'form';
    await page.waitForSelector(selector, {state: 'visible', timeout: 10000});
    await page.waitForLoadState('networkidle', {timeout: 5000}).catch(() => {
    });
    await page.waitForTimeout(500);
}

/**
 * Wait for a toast/notification to appear
 */
export async function waitForToast(page: Page, textPattern: RegExp | string, timeout = 10000): Promise<boolean> {
    try {
        const selector = typeof textPattern === 'string'
            ? `text="${textPattern}"`
            : `text=${textPattern}`;

        await page.waitForSelector(selector, {
            state: 'visible',
            timeout
        });
        return true;
    } catch {
        return false;
    }
}

/**
 * Check if element exists and is visible with retry logic
 */
export async function isElementVisible(page: Page, selector: string, maxRetries = 3): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const element = page.locator(selector);
            const isVisible = await element.isVisible({timeout: 2000});
            if (isVisible) return true;
        } catch {
            if (i < maxRetries - 1) {
                await page.waitForTimeout(500);
            }
        }
    }
    return false;
}