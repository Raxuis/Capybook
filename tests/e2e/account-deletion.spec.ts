import { test, expect } from '@playwright/test';
import { ROUTES } from '../utils/test-urls';
import prisma from '@/utils/prisma';
import { saltAndHashPassword } from '@/utils/password';

test.describe('Account Deletion', () => {
  // Créer un utilisateur de test spécifique pour la suppression
  const testUserForDeletion = {
    email: 'delete-test@example.com',
    password: 'password123',
    username: 'deletetest',
  };

  test.beforeAll(async () => {
    // Créer un utilisateur de test pour la suppression
    if (process.env.DATABASE_URL) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: testUserForDeletion.email },
        });

        if (existingUser) {
          // Mettre à jour le mot de passe
          const hashedPassword = await saltAndHashPassword(testUserForDeletion.password);
          await prisma.user.update({
            where: { email: testUserForDeletion.email },
            data: { password: hashedPassword },
          });
        } else {
          // Créer l'utilisateur
          const hashedPassword = await saltAndHashPassword(testUserForDeletion.password);
          await prisma.user.create({
            data: {
              email: testUserForDeletion.email,
              username: testUserForDeletion.username,
              password: hashedPassword,
              role: 'USER',
            },
          });
        }
      } catch (error) {
        console.error('Error setting up test user for deletion:', error);
      } finally {
        await prisma.$disconnect();
      }
    }
  });

  test.beforeEach(async ({ page }) => {
    // Se connecter avec l'utilisateur de test pour suppression
    await page.goto(ROUTES.LOGIN, { waitUntil: 'domcontentloaded' });

    const emailInput = page.getByLabel(/email/i).or(page.locator('input[type="email"]'));
    const passwordInput = page.getByLabel(/mot de passe|password/i).or(page.locator('input[type="password"]'));
    const submitButton = page.getByRole('button', { name: /se connecter|login|sign in/i });

    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill(testUserForDeletion.email);
    await passwordInput.fill(testUserForDeletion.password);
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

  test('should display delete account page with warning', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'domcontentloaded' });

    // Vérifier que la page s'affiche
    await expect(page.locator('h1').filter({ hasText: /suppression de compte|delete account/i })).toBeVisible({ timeout: 5000 });

    // Vérifier la présence de l'alerte d'avertissement
    await expect(page.locator('text=/attention|warning/i')).toBeVisible();
    await expect(page.locator('text=/définitive|irréversible|permanent/i')).toBeVisible();
  });

  test('should require confirmation text before deletion', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'domcontentloaded' });

    // Trouver le bouton de suppression
    const deleteButton = page.getByRole('button', { name: /supprimer définitivement|delete permanently/i });
    await expect(deleteButton).toBeVisible();

    // Vérifier que le bouton est désactivé initialement
    await expect(deleteButton).toBeDisabled();

    // Trouver le champ de confirmation
    const confirmInput = page.locator('input[type="text"]').filter({
      has: page.locator('text=/SUPPRIMER|DELETE/i').locator('..')
    }).or(page.locator('input').filter({ hasText: /SUPPRIMER/i }));

    // Essayer de remplir avec un texte incorrect
    await confirmInput.fill('WRONG');

    // Le bouton devrait toujours être désactivé
    await expect(deleteButton).toBeDisabled();

    // Remplir avec le bon texte
    await confirmInput.fill('SUPPRIMER');

    // Le bouton devrait maintenant être activé
    await expect(deleteButton).toBeEnabled();
  });

  test('should show error if confirmation text is incorrect', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'domcontentloaded' });

    const confirmInput = page.locator('input[type="text"]').first();
    const deleteButton = page.getByRole('button', { name: /supprimer définitivement|delete permanently/i });

    // Remplir avec un texte incorrect et essayer de cliquer
    await confirmInput.fill('WRONG');

    // Le bouton devrait être désactivé, mais si on force le clic via JavaScript
    // ou si on remplit avec le bon texte puis on change, on devrait voir une erreur
    await confirmInput.fill('SUPPRIMER');
    await expect(deleteButton).toBeEnabled();

    // Changer le texte
    await confirmInput.fill('WRONG');

    // Essayer de forcer le clic (le bouton devrait être désactivé)
    const isDisabled = await deleteButton.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test('should list all data that will be deleted', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'domcontentloaded' });

    // Vérifier la présence des catégories
    await expect(page.locator('text=/profil utilisateur|user profile/i')).toBeVisible();
    await expect(page.locator('text=/livres|books/i')).toBeVisible();
    await expect(page.locator('text=/progression|progress/i')).toBeVisible();
    await expect(page.locator('text=/notes|notes/i')).toBeVisible();
    await expect(page.locator('text=/avis|reviews/i')).toBeVisible();
    await expect(page.locator('text=/objectifs|goals/i')).toBeVisible();
    await expect(page.locator('text=/badges|badges/i')).toBeVisible();
    await expect(page.locator('text=/statistiques|statistics/i')).toBeVisible();
    await expect(page.locator('text=/relations|relationships/i')).toBeVisible();
    await expect(page.locator('text=/prêt| lending/i')).toBeVisible();
  });

  test('should delete account when confirmed', async ({ page }) => {
    // Recréer l'utilisateur avant le test de suppression
    if (process.env.DATABASE_URL) {
      try {
        const hashedPassword = await saltAndHashPassword(testUserForDeletion.password);
        await prisma.user.upsert({
          where: { email: testUserForDeletion.email },
          update: { password: hashedPassword },
          create: {
            email: testUserForDeletion.email,
            username: testUserForDeletion.username,
            password: hashedPassword,
            role: 'USER',
          },
        });
      } catch (error) {
        console.error('Error recreating test user:', error);
      } finally {
        await prisma.$disconnect();
      }
    }

    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'domcontentloaded' });

    // Remplir le champ de confirmation
    const confirmInput = page.locator('input[type="text"]').first();
    await confirmInput.fill('SUPPRIMER');

    // Cliquer sur le bouton de suppression
    const deleteButton = page.getByRole('button', { name: /supprimer définitivement|delete permanently/i });
    await expect(deleteButton).toBeEnabled();

    // Écouter la navigation ou le message de succès
    const navigationPromise = page.waitForURL(ROUTES.HOME, { timeout: 10000 }).catch(() => null);
    const successMessagePromise = page.waitForSelector('text=/compte supprimé|account deleted/i', { timeout: 5000 }).catch(() => null);

    await deleteButton.click();

    // Attendre soit la navigation, soit le message de succès
    await Promise.race([navigationPromise, successMessagePromise]);

    // Vérifier qu'on est redirigé vers la page d'accueil ou qu'un message de succès s'affiche
    const currentUrl = page.url();
    const hasSuccessMessage = await page.locator('text=/compte supprimé|account deleted/i').isVisible().catch(() => false);

    expect(
      currentUrl.includes(ROUTES.HOME) ||
      hasSuccessMessage
    ).toBeTruthy();

    // Vérifier que l'utilisateur ne peut plus se connecter
    await page.goto(ROUTES.LOGIN, { waitUntil: 'domcontentloaded' });
    const emailInput = page.getByLabel(/email/i).or(page.locator('input[type="email"]'));
    const passwordInput = page.getByLabel(/mot de passe|password/i).or(page.locator('input[type="password"]'));
    const submitButton = page.getByRole('button', { name: /se connecter|login|sign in/i });

    await emailInput.fill(testUserForDeletion.email);
    await passwordInput.fill(testUserForDeletion.password);
    await submitButton.click();

    // Attendre un message d'erreur ou rester sur la page de login
    await page.waitForTimeout(2000);
    const isStillOnLogin = page.url().includes(ROUTES.LOGIN);
    const hasError = await page.locator('text=/erreur|error|invalid|credentials/i').isVisible().catch(() => false);

    expect(isStillOnLogin || hasError).toBeTruthy();
  });

  test('should show loading state during deletion', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'domcontentloaded' });

    const confirmInput = page.locator('input[type="text"]').first();
    await confirmInput.fill('SUPPRIMER');

    const deleteButton = page.getByRole('button', { name: /supprimer définitivement|delete permanently/i });

    // Cliquer et vérifier l'état de chargement
    await deleteButton.click();

    // Le bouton peut afficher un état de chargement
    const buttonText = await deleteButton.textContent();
    expect(buttonText).toMatch(/suppression|deletion|en cours|in progress/i);
  });

  test('should handle deletion errors gracefully', async ({ page }) => {
    // Intercepter la requête API et la faire échouer
    await page.route('**/api/user/*/delete', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'domcontentloaded' });

    const confirmInput = page.locator('input[type="text"]').first();
    await confirmInput.fill('SUPPRIMER');

    const deleteButton = page.getByRole('button', { name: /supprimer définitivement|delete permanently/i });
    await deleteButton.click();

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

  test('should allow exporting data before deletion', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'domcontentloaded' });

    // Vérifier que la section d'export est visible avant la section de suppression
    const exportSection = page.locator('text=/exporter vos données|export your data/i');
    await expect(exportSection).toBeVisible();

    const deleteSection = page.locator('text=/supprimer mon compte|delete my account/i');
    await expect(deleteSection).toBeVisible();

    // Vérifier que la section d'export est avant la section de suppression
    const exportPosition = await exportSection.boundingBox();
    const deletePosition = await deleteSection.boundingBox();

    if (exportPosition && deletePosition) {
      expect(exportPosition.y).toBeLessThan(deletePosition.y);
    }
  });
});
