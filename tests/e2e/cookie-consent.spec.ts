import { test, expect } from '@playwright/test';
import { ROUTES } from '../utils/test-urls';

test.describe('Cookie Consent Banner', () => {
  // Utiliser un contexte isolé pour chaque test pour éviter les interférences
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should display cookie banner on first visit', async ({ page, context }) => {
    // Nettoyer le localStorage avant le test
    await context.clearCookies();
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Attendre que le bandeau soit visible
    const cookieBanner = page.locator('text=Nous utilisons des cookies').or(
      page.locator('text=We use cookies')
    );

    await expect(cookieBanner).toBeVisible({ timeout: 5000 });

    // Vérifier la présence des boutons
    await expect(page.getByRole('button', { name: /tout accepter|accept all/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /refuser|reject/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /personnaliser|customize/i })).toBeVisible();
  });

  test('should not display banner after accepting cookies', async ({ page, context }) => {
    // Nettoyer le localStorage
    await context.clearCookies();
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Accepter tous les cookies
    const acceptButton = page.getByRole('button', { name: /tout accepter|accept all/i });
    await expect(acceptButton).toBeVisible();
    await acceptButton.click();

    // Attendre que le bandeau disparaisse
    await expect(page.locator('text=Nous utilisons des cookies')).not.toBeVisible({ timeout: 3000 });

    // Recharger la page
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Vérifier que le bandeau ne réapparaît pas
    await expect(page.locator('text=Nous utilisons des cookies')).not.toBeVisible({ timeout: 2000 });
  });

  test('should not display banner after rejecting cookies', async ({ page, context }) => {
    // Nettoyer le localStorage
    await context.clearCookies();
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Refuser tous les cookies
    const rejectButton = page.getByRole('button', { name: /refuser|reject/i });
    await expect(rejectButton).toBeVisible();
    await rejectButton.click();

    // Attendre que le bandeau disparaisse
    await expect(page.locator('text=Nous utilisons des cookies')).not.toBeVisible({ timeout: 3000 });

    // Recharger la page
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Vérifier que le bandeau ne réapparaît pas
    await expect(page.locator('text=Nous utilisons des cookies')).not.toBeVisible({ timeout: 2000 });
  });

  test('should open settings modal when clicking customize', async ({ page, context }) => {
    // Nettoyer le localStorage
    await context.clearCookies();
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Cliquer sur personnaliser
    const customizeButton = page.getByRole('button', { name: /personnaliser|customize/i });
    await expect(customizeButton).toBeVisible();
    await customizeButton.click();

    // Vérifier que la modal s'ouvre
    await expect(page.locator('text=Paramètres des cookies').or(
      page.locator('text=Cookie settings')
    )).toBeVisible({ timeout: 3000 });

    // Vérifier la présence des catégories de cookies
    await expect(page.locator('text=Cookies nécessaires').or(
      page.locator('text=Necessary cookies')
    )).toBeVisible();

    await expect(page.locator('text=Cookies d\'analyse').or(
      page.locator('text=Analytics cookies')
    )).toBeVisible();
  });

  test('should save preferences when clicking save in settings', async ({ page, context }) => {
    // Nettoyer le localStorage
    await context.clearCookies();
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Ouvrir les paramètres
    const customizeButton = page.getByRole('button', { name: /personnaliser|customize/i });
    await customizeButton.click();

    // Attendre que la modal soit visible
    await expect(page.locator('text=Paramètres des cookies')).toBeVisible();

    // Désactiver les cookies d'analyse (si activés)
    const analyticsCheckbox = page.locator('input[type="checkbox"]').nth(1); // Le deuxième checkbox (analytics)
    const isChecked = await analyticsCheckbox.isChecked();

    if (isChecked) {
      await analyticsCheckbox.click();
    }

    // Sauvegarder les préférences
    const saveButton = page.getByRole('button', { name: /enregistrer|save/i });
    await saveButton.click();

    // Vérifier que la modal se ferme
    await expect(page.locator('text=Paramètres des cookies')).not.toBeVisible({ timeout: 3000 });

    // Vérifier que les préférences sont sauvegardées dans localStorage
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

  test('should show cookie button after consent is given', async ({ page, context }) => {
    // Nettoyer le localStorage
    await context.clearCookies();
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Accepter les cookies
    const acceptButton = page.getByRole('button', { name: /tout accepter|accept all/i });
    await acceptButton.click();

    // Attendre que le bandeau disparaisse
    await expect(page.locator('text=Nous utilisons des cookies')).not.toBeVisible({ timeout: 3000 });

    // Vérifier la présence du bouton "Cookies" en bas à droite
    const cookieButton = page.getByRole('button', { name: /cookies/i });
    await expect(cookieButton).toBeVisible({ timeout: 3000 });
  });

  test('should reopen settings when clicking cookie button', async ({ page, context }) => {
    // Nettoyer le localStorage
    await context.clearCookies();
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Accepter les cookies
    const acceptButton = page.getByRole('button', { name: /tout accepter|accept all/i });
    await acceptButton.click();

    // Attendre que le bouton cookies apparaisse
    const cookieButton = page.getByRole('button', { name: /cookies/i });
    await expect(cookieButton).toBeVisible({ timeout: 3000 });

    // Cliquer sur le bouton cookies
    await cookieButton.click();

    // Vérifier que la modal s'ouvre
    await expect(page.locator('text=Paramètres des cookies')).toBeVisible({ timeout: 3000 });
  });

  test('should link to cookies policy page', async ({ page, context }) => {
    // Nettoyer le localStorage
    await context.clearCookies();
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

    // Le lien peut être dans le bandeau ou dans le footer
    const linkInBanner = page.locator('text=Nous utilisons des cookies').locator('..').locator('a[href="/cookies"]');
    const linkInFooter = page.locator('footer').locator('a[href="/cookies"]');

    const bannerLinkVisible = await linkInBanner.isVisible().catch(() => false);
    const footerLinkVisible = await linkInFooter.isVisible().catch(() => false);

    expect(bannerLinkVisible || footerLinkVisible).toBeTruthy();
  });
});
