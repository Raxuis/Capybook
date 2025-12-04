import { test, expect } from '@playwright/test';
import { ROUTES } from '../utils/test-urls';
import { TEST_USER } from '../fixtures/test-users';

test.describe('Data Export', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter avant chaque test
    await page.goto(ROUTES.LOGIN, { waitUntil: 'load' });

    // Accepter les cookies si le bandeau apparaît (important pour RGPD)
    try {
      const cookieHeading = page.getByRole('heading', { name: 'Nous utilisons des cookies' });
      const isBannerVisible = await cookieHeading.isVisible({ timeout: 2000 }).catch(() => false);
      if (isBannerVisible) {
        const acceptButton = page.getByRole('button', { name: 'Tout accepter' });
        await acceptButton.click({ timeout: 3000 });
        await cookieHeading.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => { });
      }
    } catch (error) {
      // Le bandeau n'est peut-être pas présent, continuer quand même
    }

    const emailInput = page.getByLabel(/email/i).or(page.locator('input[type="email"]'));
    const passwordInput = page.getByLabel(/mot de passe|password/i).or(page.locator('input[type="password"]'));
    const submitButton = page.getByRole('button', { name: /se connecter|login|sign in/i });

    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill(TEST_USER.email);
    await passwordInput.fill(TEST_USER.password);
    await submitButton.click();

    // Attendre la redirection après connexion avec fallback et gestion d'erreur améliorée
    try {
      await Promise.race([
        page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 20000 }),
        page.waitForFunction(
          () => !window.location.pathname.includes('/login') ||
            !document.body.innerText.includes('Se connecter'),
          null,
          { timeout: 20000 }
        ),
      ]);
    } catch (err) {
      // Capturer une capture d'écran pour le débogage en cas d'échec
      await page.screenshot({ path: 'debug-login-timeout-data-export.png', fullPage: true });
      console.error('[data-export] Login timeout - Current URL:', page.url());
      console.error('[data-export] Page title:', await page.title().catch(() => 'N/A'));
      console.error('[data-export] Body text preview:', (await page.locator('body').textContent().catch(() => 'N/A'))?.slice(0, 200));
      throw err;
    }
  });

  test('should redirect to login if not authenticated', async ({ page, context }) => {
    // Nettoyer les cookies pour être non authentifié
    await context.clearCookies();
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'networkidle' });

    // Accepter les cookies si nécessaire
    try {
      const cookieHeading = page.getByRole('heading', { name: 'Nous utilisons des cookies' });
      const isBannerVisible = await cookieHeading.isVisible({ timeout: 2000 }).catch(() => false);
      if (isBannerVisible) {
        const acceptButton = page.getByRole('button', { name: 'Tout accepter' });
        await acceptButton.click({ timeout: 3000 });
        await cookieHeading.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => { });
      }
    } catch (error) {
      // Continue anyway
    }

    // Attendre soit la redirection, soit le message d'erreur
    try {
      await Promise.race([
        page.waitForURL(ROUTES.LOGIN, { timeout: 15000 }),
        page.waitForSelector('text=/accès non autorisé|non autorisé/i', { timeout: 15000 }),
        page.getByRole('heading', { name: /connexion|login/i }).waitFor({ state: 'visible', timeout: 15000 }),
      ]);
    } catch (err) {
      await page.screenshot({ path: 'debug-auth-redirect-timeout-data-export.png', fullPage: true });
      console.error('[data-export] Auth redirect timeout - Current URL:', page.url());
      throw err;
    }

    const currentUrl = page.url();
    expect(
      currentUrl.includes(ROUTES.LOGIN) ||
      currentUrl.includes(ROUTES.DELETE_ACCOUNT)
    ).toBeTruthy();
  });

  test('should display delete account page when authenticated', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'networkidle' });

    // Accepter les cookies si nécessaire
    try {
      const cookieHeading = page.getByRole('heading', { name: 'Nous utilisons des cookies' });
      const isBannerVisible = await cookieHeading.isVisible({ timeout: 2000 }).catch(() => false);
      if (isBannerVisible) {
        const acceptButton = page.getByRole('button', { name: 'Tout accepter' });
        await acceptButton.click({ timeout: 3000 });
        await cookieHeading.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => { });
      }
    } catch (error) {
      // Continue anyway
    }

    await page.waitForLoadState('domcontentloaded');

    // Vérifier que la page s'affiche
    await expect(page.getByRole('heading', { name: /suppression de compte/i, level: 1 })).toBeVisible({ timeout: 10000 });

    // Vérifier la présence de la section d'export
    await expect(page.getByText(/exporter vos données/i)).toBeVisible({ timeout: 10000 });

    // Vérifier la présence du bouton d'export
    await expect(page.getByRole('button', { name: /télécharger/i })).toBeVisible({ timeout: 10000 });
  });

  test('should export user data as JSON file', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'networkidle' });

    // Accepter les cookies si nécessaire
    try {
      const cookieHeading = page.getByRole('heading', { name: 'Nous utilisons des cookies' });
      const isBannerVisible = await cookieHeading.isVisible({ timeout: 2000 }).catch(() => false);
      if (isBannerVisible) {
        const acceptButton = page.getByRole('button', { name: 'Tout accepter' });
        await acceptButton.click({ timeout: 3000 });
        await cookieHeading.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => { });
      }
    } catch (error) {
      // Continue anyway
    }

    await page.waitForLoadState('domcontentloaded');

    // Attendre que le bouton soit visible
    const exportButton = page.getByRole('button', { name: /télécharger/i });
    await expect(exportButton).toBeVisible({ timeout: 10000 });

    // Écouter les téléchargements
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });

    // Cliquer sur le bouton d'export
    await exportButton.click();

    // Attendre le téléchargement
    const download = await downloadPromise;

    // Vérifier le nom du fichier
    const filename = download.suggestedFilename();
    expect(filename).toMatch(/capybook-data-.*\.json/);

    // Lire le contenu du fichier
    const path = await download.path();
    expect(path).toBeTruthy();

    // Lire et parser le JSON
    const fs = require('fs');
    const fileContent = fs.readFileSync(path, 'utf-8');
    const data = JSON.parse(fileContent);

    // Vérifier la structure des données exportées
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

    // Vérifier que l'email correspond
    expect(data.user.email).toBe(TEST_USER.email);
  });

  test('should show loading state during export', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'networkidle' });

    // Accepter les cookies si nécessaire
    try {
      const cookieHeading = page.getByRole('heading', { name: 'Nous utilisons des cookies' });
      const isBannerVisible = await cookieHeading.isVisible({ timeout: 2000 }).catch(() => false);
      if (isBannerVisible) {
        const acceptButton = page.getByRole('button', { name: 'Tout accepter' });
        await acceptButton.click({ timeout: 3000 });
        await cookieHeading.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => { });
      }
    } catch (error) {
      // Continue anyway
    }

    await page.waitForLoadState('domcontentloaded');

    const exportButton = page.getByRole('button', { name: /télécharger/i });
    await expect(exportButton).toBeVisible({ timeout: 10000 });

    // Cliquer et vérifier l'état de chargement
    await exportButton.click();

    // Attendre un peu pour que l'état de chargement s'affiche
    await page.waitForTimeout(500);

    // Vérifier que le bouton affiche un état de chargement
    const buttonText = await exportButton.textContent().catch(() => '');
    const isButtonDisabled = await exportButton.isDisabled().catch(() => false);

    expect(
      buttonText?.toLowerCase().match(/export|en cours/i) ||
      isButtonDisabled // Button might be disabled during loading
    ).toBeTruthy();
  });

  test('should handle export errors gracefully', async ({ page }) => {
    // Intercepter la requête API et la faire échouer
    await page.route('**/api/user/*/export', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'networkidle' });

    // Accepter les cookies si nécessaire
    try {
      const cookieHeading = page.getByRole('heading', { name: 'Nous utilisons des cookies' });
      const isBannerVisible = await cookieHeading.isVisible({ timeout: 2000 }).catch(() => false);
      if (isBannerVisible) {
        const acceptButton = page.getByRole('button', { name: 'Tout accepter' });
        await acceptButton.click({ timeout: 3000 });
        await cookieHeading.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => { });
      }
    } catch (error) {
      // Continue anyway
    }

    await page.waitForLoadState('domcontentloaded');

    const exportButton = page.getByRole('button', { name: /télécharger/i });
    await expect(exportButton).toBeVisible({ timeout: 10000 });
    await exportButton.click();

    // Vérifier qu'un message d'erreur s'affiche (peut être dans un toast)
    await expect(
      page.getByText(/erreur|error|impossible/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test('should display user rights information', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'networkidle' });

    // Accepter les cookies si nécessaire
    try {
      const cookieHeading = page.getByRole('heading', { name: 'Nous utilisons des cookies' });
      const isBannerVisible = await cookieHeading.isVisible({ timeout: 2000 }).catch(() => false);
      if (isBannerVisible) {
        const acceptButton = page.getByRole('button', { name: 'Tout accepter' });
        await acceptButton.click({ timeout: 3000 });
        await cookieHeading.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => { });
      }
    } catch (error) {
      // Continue anyway
    }

    await page.waitForLoadState('domcontentloaded');

    // Vérifier la présence des informations sur les droits RGPD
    await expect(page.getByText(/vos droits/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/RGPD/i)).toBeVisible({ timeout: 10000 });

    // Vérifier les liens vers la politique de confidentialité
    const privacyLink = page.locator('a[href="/privacy"]');
    await expect(privacyLink.first()).toBeVisible({ timeout: 10000 });
  });

  test('should list all data categories in export section', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'networkidle' });

    // Accepter les cookies si nécessaire
    try {
      const cookieHeading = page.getByRole('heading', { name: 'Nous utilisons des cookies' });
      const isBannerVisible = await cookieHeading.isVisible({ timeout: 2000 }).catch(() => false);
      if (isBannerVisible) {
        const acceptButton = page.getByRole('button', { name: 'Tout accepter' });
        await acceptButton.click({ timeout: 3000 });
        await cookieHeading.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => { });
      }
    } catch (error) {
      // Continue anyway
    }

    await page.waitForLoadState('domcontentloaded');

    // Vérifier la présence des catégories mentionnées dans la description
    await expect(page.getByText(/profil/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/livres/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/progression/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/notes/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/avis/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/objectifs/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/badges/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/statistiques/i)).toBeVisible({ timeout: 10000 });
  });
});
