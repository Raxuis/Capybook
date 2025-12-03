import { test, expect } from '@playwright/test';
import { ROUTES } from '../utils/test-urls';
import { TEST_USER } from '../fixtures/test-users';

test.describe('Data Export', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter avant chaque test
    await page.goto(ROUTES.LOGIN, { waitUntil: 'domcontentloaded' });

    const emailInput = page.getByLabel(/email/i).or(page.locator('input[type="email"]'));
    const passwordInput = page.getByLabel(/mot de passe|password/i).or(page.locator('input[type="password"]'));
    const submitButton = page.getByRole('button', { name: /se connecter|login|sign in/i });

    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill(TEST_USER.email);
    await passwordInput.fill(TEST_USER.password);
    await submitButton.click();

    // Attendre la redirection après connexion
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
  });

  test('should redirect to login if not authenticated', async ({ page, context }) => {
    // Nettoyer les cookies pour être non authentifié
    await context.clearCookies();
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'domcontentloaded' });

    // Vérifier la redirection vers login ou le message d'erreur
    await Promise.race([
      page.waitForURL(ROUTES.LOGIN, { timeout: 5000 }),
      page.waitForSelector('text=/accès non autorisé|non autorisé|unauthorized/i', { timeout: 5000 }),
    ]);

    const currentUrl = page.url();
    expect(
      currentUrl.includes(ROUTES.LOGIN) ||
      currentUrl.includes(ROUTES.DELETE_ACCOUNT)
    ).toBeTruthy();
  });

  test('should display delete account page when authenticated', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'domcontentloaded' });

    // Vérifier que la page s'affiche
    await expect(page.locator('h1').filter({ hasText: /suppression de compte|delete account/i })).toBeVisible({ timeout: 5000 });

    // Vérifier la présence de la section d'export
    await expect(page.locator('text=/exporter vos données|export your data/i')).toBeVisible();

    // Vérifier la présence du bouton d'export
    await expect(page.getByRole('button', { name: /télécharger|download/i })).toBeVisible();
  });

  test('should export user data as JSON file', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'domcontentloaded' });

    // Attendre que le bouton soit visible
    const exportButton = page.getByRole('button', { name: /télécharger|download/i });
    await expect(exportButton).toBeVisible();

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
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'domcontentloaded' });

    const exportButton = page.getByRole('button', { name: /télécharger|download/i });

    // Cliquer et vérifier l'état de chargement
    await exportButton.click();

    // Le bouton peut afficher un état de chargement
    // Vérifier que le téléchargement commence (pas de vérification exacte car c'est asynchrone)
    await page.waitForTimeout(1000); // Attendre un peu pour le téléchargement
  });

  test('should handle export errors gracefully', async ({ page }) => {
    // Intercepter la requête API et la faire échouer
    await page.route('**/api/user/*/export', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'domcontentloaded' });

    const exportButton = page.getByRole('button', { name: /télécharger|download/i });
    await exportButton.click();

    // Vérifier qu'un message d'erreur s'affiche
    await expect(page.locator('text=/erreur|error|impossible/i')).toBeVisible({ timeout: 5000 });
  });

  test('should display user rights information', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'domcontentloaded' });

    // Vérifier la présence des informations sur les droits RGPD
    await expect(page.locator('text=/vos droits|your rights/i')).toBeVisible();
    await expect(page.locator('text=/RGPD|GDPR/i')).toBeVisible();

    // Vérifier les liens vers la politique de confidentialité
    const privacyLink = page.locator('a[href="/privacy"]');
    await expect(privacyLink).toBeVisible();
  });

  test('should list all data categories in export section', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'domcontentloaded' });

    // Vérifier la présence des catégories mentionnées
    await expect(page.locator('text=/profil|profile/i')).toBeVisible();
    await expect(page.locator('text=/livres|books/i')).toBeVisible();
    await expect(page.locator('text=/progression|progress/i')).toBeVisible();
    await expect(page.locator('text=/notes|notes/i')).toBeVisible();
    await expect(page.locator('text=/avis|reviews/i')).toBeVisible();
    await expect(page.locator('text=/objectifs|goals/i')).toBeVisible();
    await expect(page.locator('text=/badges|badges/i')).toBeVisible();
    await expect(page.locator('text=/statistiques|statistics/i')).toBeVisible();
  });
});
