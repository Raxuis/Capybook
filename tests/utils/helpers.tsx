import { Page } from '@playwright/test';
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';

/**
 * Playwright helper: Accept cookie consent banner if present
 * This should be called before any interactions on pages that might show the banner
 */
export async function acceptCookieConsent(page: Page) {
  try {
    // Check if cookie banner is visible (it appears on all pages if consent not given)
    const cookieHeading = page.getByRole('heading', { name: 'Nous utilisons des cookies' });
    const isVisible = await cookieHeading.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      // Accept all cookies to dismiss the banner
      const acceptButton = page.getByRole('button', { name: 'Tout accepter' });
      await acceptButton.click({ timeout: 3000 });

      // Wait for banner to disappear
      await cookieHeading.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {
        // Banner might already be gone, that's fine
      });
    }
  } catch (error) {
    // If banner doesn't exist or is already dismissed, that's fine
    // Don't fail the test if cookie consent is already handled
  }
}

/**
 * Playwright helper: Login a user (with automatic cookie consent handling)
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');

  // Accept cookie consent if banner appears
  await acceptCookieConsent(page);

  // Wait for form to be ready
  const emailInput = page.getByLabel(/email/i).or(page.locator('input[type="email"]'));
  const passwordInput = page.getByLabel(/mot de passe|password/i).or(page.locator('input[type="password"]'));
  const submitButton = page.getByRole('button', { name: /se connecter|login|sign in/i }).or(page.locator('button[type="submit"]'));

  await emailInput.waitFor({ state: 'visible', timeout: 5000 });
  await emailInput.fill(email);
  await passwordInput.fill(password);
  await submitButton.click();

  // Wait for navigation away from login page
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 20000 });
}

/**
 * Playwright helper: Navigate to a URL and wait for it to load
 */
export async function navigateTo(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
}

/**
 * Playwright helper: Wait for a page to be fully loaded
 */
export async function waitForPage(page: Page, url: string) {
  await page.waitForURL(url);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
}

/**
 * React Testing Library helper: Render component with providers
 */
interface AllTheProvidersProps {
  children: React.ReactNode;
}

function AllTheProviders({ children }: AllTheProvidersProps) {
  // Mock session matching the Session type from next-auth.d.ts
  const mockSession = {
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      role: 'USER' as const,
      image: null,
      emailVerified: null,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  return (
    <SessionProvider session={mockSession as Parameters<typeof SessionProvider>[0]['session']}>
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {children}
      </SWRConfig>
    </SessionProvider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
// Override render with our custom render
export { customRender as render };
