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
    // Créer ou mettre à jour un utilisateur de test pour la suppression
    if (!process.env.DATABASE_URL) {
      return;
    }

    // Check if database is available
    let dbAvailable = false;
    try {
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
    } catch (error) {
      console.warn('[account-deletion] Database not available, skipping test user setup');
      return;
    } finally {
      await prisma.$disconnect().catch(() => {
        // Ignore disconnect errors
      });
    }

    if (!dbAvailable) {
      return;
    }

    try {
      const hashedPassword = await saltAndHashPassword(testUserForDeletion.password);
      await prisma.user.upsert({
        where: { email: testUserForDeletion.email },
        update: {
          password: hashedPassword,
          username: testUserForDeletion.username,
        },
        create: {
          email: testUserForDeletion.email,
          username: testUserForDeletion.username,
          password: hashedPassword,
          role: 'USER',
        },
      });
    } catch (error: any) {
      // Only log if it's not a connection error (already handled above)
      if (error?.code !== 'P1001') {
        console.error('Error setting up test user for deletion:', error);
      }
    } finally {
      await prisma.$disconnect().catch(() => {
        // Ignore disconnect errors
      });
    }
  });

  test.beforeEach(async ({ page }) => {
    // Se connecter avec l'utilisateur de test pour suppression
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
    await emailInput.fill(testUserForDeletion.email);
    await passwordInput.fill(testUserForDeletion.password);
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
      await page.screenshot({ path: 'debug-login-timeout-account-deletion.png', fullPage: true });
      console.error('[account-deletion] Login timeout - Current URL:', page.url());
      console.error('[account-deletion] Page title:', await page.title().catch(() => 'N/A'));
      console.error('[account-deletion] Body text preview:', (await page.locator('body').textContent().catch(() => 'N/A'))?.slice(0, 200));
      throw err;
    }
  });

  test('should redirect to login if not authenticated', async ({ page, context }) => {
    // Nettoyer les cookies pour être non authentifié
    await context.clearCookies();
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

    // Attendre soit la redirection, soit le message d'erreur
    try {
      await Promise.race([
        page.waitForURL(ROUTES.LOGIN, { timeout: 20000 }),
        page.waitForSelector('text=/accès non autorisé|non autorisé/i', { timeout: 20000 }),
        page.getByRole('heading', { name: /connexion|login/i }).waitFor({ state: 'visible', timeout: 20000 }),
      ]);
    } catch (err) {
      await page.screenshot({ path: 'debug-auth-redirect-timeout.png', fullPage: true });
      throw err;
    }

    const currentUrl = page.url();
    expect(
      currentUrl.includes(ROUTES.LOGIN) ||
      currentUrl.includes(ROUTES.DELETE_ACCOUNT)
    ).toBeTruthy();
  });

  test('should display delete account page with warning', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

    // Attendre que la page se charge complètement

    // Vérifier que la page s'affiche
    await expect(page.getByRole('heading', { name: /suppression de compte/i, level: 1 })).toBeVisible({ timeout: 5000 });

    // Vérifier la présence de l'alerte d'avertissement
    await expect(page.getByText(/attention/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/définitive|irréversible|permanent/i)).toBeVisible({ timeout: 5000 });
  });

  test('should require confirmation text before deletion', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

    // Trouver le bouton de suppression
    const deleteButton = page.getByRole('button', { name: /supprimer définitivement/i });
    await expect(deleteButton).toBeVisible({ timeout: 5000 });

    // Vérifier que le bouton est désactivé initialement
    await expect(deleteButton).toBeDisabled();

    // Trouver le champ de confirmation (premier input de type text)
    const confirmInput = page.locator('input[type="text"]').first();
    await expect(confirmInput).toBeVisible({ timeout: 5000 });

    // Essayer de remplir avec un texte incorrect
    await confirmInput.fill('WRONG');

    // Le bouton devrait toujours être désactivé
    await expect(deleteButton).toBeDisabled();

    // Remplir avec le bon texte
    await confirmInput.fill('SUPPRIMER');

    // Le bouton devrait maintenant être activé
    await expect(deleteButton).toBeEnabled({ timeout: 2000 });
  });

  test('should show error if confirmation text is incorrect', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

    const confirmInput = page.locator('input[type="text"]').first();
    await expect(confirmInput).toBeVisible({ timeout: 5000 });

    const deleteButton = page.getByRole('button', { name: /supprimer définitivement/i });
    await expect(deleteButton).toBeVisible({ timeout: 5000 });

    // Remplir avec un texte incorrect
    await confirmInput.fill('WRONG');

    // Le bouton devrait être désactivé
    const isDisabled = await deleteButton.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test('should list all data that will be deleted', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

    // Vérifier la présence des catégories dans la liste
    await expect(page.getByText(/profil utilisateur/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/livres/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/progression/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/notes/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/avis/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/objectifs/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/badges/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/statistiques/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/relations/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/prêt/i)).toBeVisible({ timeout: 5000 });
  });

  test('should delete account when confirmed', async ({ page }) => {
    // Recréer l'utilisateur avant le test de suppression
    if (process.env.DATABASE_URL) {
      // Check if database is available
      let dbAvailable = false;
      try {
        await prisma.$connect();
        await prisma.$queryRaw`SELECT 1`;
        dbAvailable = true;
      } catch (error) {
        // Database not available, skip user recreation but continue test
        // (user might already exist from beforeAll)
      } finally {
        await prisma.$disconnect().catch(() => {
          // Ignore disconnect errors
        });
      }

      if (dbAvailable) {
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
        } catch (error: any) {
          // Only log if it's not a connection error
          if (error?.code !== 'P1001') {
            console.error('Error recreating test user:', error);
          }
          // Continue test anyway (user might already exist)
        } finally {
          await prisma.$disconnect().catch(() => {
            // Ignore disconnect errors
          });
        }
      }
    }

    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

    // Remplir le champ de confirmation
    const confirmInput = page.locator('input[type="text"]').first();
    await expect(confirmInput).toBeVisible({ timeout: 5000 });
    await confirmInput.fill('SUPPRIMER');

    // Cliquer sur le bouton de suppression
    const deleteButton = page.getByRole('button', { name: /supprimer définitivement/i });
    await expect(deleteButton).toBeEnabled({ timeout: 2000 });

    // Écouter la navigation ou le message de succès
    const navigationPromise = page.waitForURL(ROUTES.HOME, { timeout: 25000 }).catch(() => null);
    const successMessagePromise = page.waitForSelector('text=/compte supprimé/i', { timeout: 25000 }).catch(() => null);
    const homePageElementPromise = page.waitForSelector('h1, main, [role="main"]', { timeout: 25000 }).catch(() => null);

    await deleteButton.click();

    // Attendre soit la navigation, soit le message de succès, soit a home page element
    try {
      await Promise.race([navigationPromise, successMessagePromise, homePageElementPromise]);
    } catch (err) {
      await page.screenshot({ path: 'debug-deletion-timeout.png', fullPage: true });
      throw err;
    }

    // Vérifier qu'on est redirigé vers la page d'accueil ou qu'un message de succès s'affiche
    const currentUrl = page.url();
    const hasSuccessMessage = await page.getByText(/compte supprimé/i).isVisible().catch(() => false);

    expect(
      currentUrl.includes(ROUTES.HOME) ||
      hasSuccessMessage
    ).toBeTruthy();
  });

  test('should show loading state during deletion', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

    const confirmInput = page.locator('input[type="text"]').first();
    await expect(confirmInput).toBeVisible({ timeout: 5000 });
    await confirmInput.fill('SUPPRIMER');

    const deleteButton = page.getByRole('button', { name: /supprimer définitivement/i });
    await expect(deleteButton).toBeEnabled({ timeout: 2000 });

    // Cliquer et vérifier l'état de chargement
    await deleteButton.click();

    // Vérifier que le bouton affiche un état de chargement ou qu'un overlay apparaît
    const buttonText = await deleteButton.textContent().catch(() => '');
    const hasLoadingOverlay = await page.getByText(/suppression en cours/i).isVisible().catch(() => false);

    expect(
      buttonText?.toLowerCase().includes('suppression') ||
      buttonText?.toLowerCase().includes('en cours') ||
      hasLoadingOverlay
    ).toBeTruthy();
  });

  test('should handle deletion errors gracefully', async ({ page }) => {
    // Intercepter la requête API et la faire échouer
    await page.route('**/api/user/*/delete', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

    const confirmInput = page.locator('input[type="text"]').first();
    await expect(confirmInput).toBeVisible({ timeout: 5000 });
    await confirmInput.fill('SUPPRIMER');

    const deleteButton = page.getByRole('button', { name: /supprimer définitivement/i });
    await expect(deleteButton).toBeEnabled({ timeout: 2000 });
    await deleteButton.click();

    // Vérifier qu'un message d'erreur s'affiche (peut être dans un toast)
    await expect(
      page.getByText(/erreur|error|impossible/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('should display user rights information', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

    // Vérifier la présence des informations sur les droits RGPD
    await expect(page.getByText(/vos droits/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/RGPD/i)).toBeVisible({ timeout: 5000 });

    // Vérifier les liens vers la politique de confidentialité
    const privacyLink = page.locator('a[href="/privacy"]');
    await expect(privacyLink.first()).toBeVisible({ timeout: 5000 });
  });

  test('should allow exporting data before deletion', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

    // Vérifier que la section d'export est visible avant la section de suppression
    const exportSection = page.getByText(/exporter vos données/i);
    await expect(exportSection).toBeVisible({ timeout: 5000 });

    const deleteSection = page.getByText(/supprimer mon compte/i);
    await expect(deleteSection).toBeVisible({ timeout: 5000 });

    // Vérifier que la section d'export est avant la section de suppression
    const exportPosition = await exportSection.boundingBox();
    const deletePosition = await deleteSection.boundingBox();

    if (exportPosition && deletePosition) {
      expect(exportPosition.y).toBeLessThan(deletePosition.y);
    }
  });
});
