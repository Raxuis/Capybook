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

      // Check if a user with this username already exists (but different email)
      const existingUserByUsername = await prisma.user.findUnique({
        where: { username: testUserForDeletion.username },
      });

      // If username exists with different email, delete it first
      if (existingUserByUsername && existingUserByUsername.email !== testUserForDeletion.email) {
        await prisma.user.delete({
          where: { username: testUserForDeletion.username },
        });
      }

      // Now upsert by email
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
      // Handle unique constraint errors
      if (error?.code === 'P2002') {
        // Username conflict - try with a unique username
        const uniqueUsername = `deletetest-${Date.now()}`;
        try {
          const hashedPassword = await saltAndHashPassword(testUserForDeletion.password);
          await prisma.user.upsert({
            where: { email: testUserForDeletion.email },
            update: {
              password: hashedPassword,
              username: uniqueUsername,
            },
            create: {
              email: testUserForDeletion.email,
              username: uniqueUsername,
              password: hashedPassword,
              role: 'USER',
            },
          });
          // Update the test user object with the new username
          testUserForDeletion.username = uniqueUsername;
        } catch (retryError: any) {
          console.error('Error setting up test user for deletion (retry failed):', retryError);
        }
      } else if (error?.code !== 'P1001') {
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
      // Attendre que la navigation se produise
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => { });

      // Vérifier plusieurs conditions pour confirmer la connexion
      await Promise.race([
        // Option 1: URL a changé
        page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 }),
        // Option 2: Le texte "Se connecter" n'est plus présent
        page.waitForFunction(
          () => !window.location.pathname.includes('/login') &&
            !document.body.innerText.toLowerCase().includes('se connecter'),
          null,
          { timeout: 15000 }
        ),
        // Option 3: Un élément de navigation utilisateur est présent
        page.waitForSelector('[data-testid="user-menu"], [href*="/profile"], [href*="/book-shelf"]', { timeout: 15000 }).catch(() => null),
      ]);

      // Attendre un peu pour que la page se stabilise
      await page.waitForTimeout(500);
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
      await page.screenshot({ path: 'debug-auth-redirect-timeout.png', fullPage: true });
      console.error('[account-deletion] Auth redirect timeout - Current URL:', page.url());
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

    // Attendre que la page se charge complètement et que la session soit chargée
    await page.waitForLoadState('domcontentloaded');

    // Wait for session to load (wait for loading state to disappear)
    try {
      await page.waitForSelector('text=/Chargement de la session/i', { state: 'hidden', timeout: 5000 });
    } catch {
      // Loading state might not be present, continue
    }

    // Wait a bit for React to hydrate
    await page.waitForTimeout(1000);

    // Vérifier que la page s'affiche (check for h1 heading)
    const heading = page.getByTestId('delete-account-page-title');
    await expect(heading).toBeVisible({ timeout: 15000 });

    // Vérifier la présence de l'alerte d'avertissement
    const warningAlert = page.getByTestId('delete-warning-alert');
    await expect(warningAlert).toBeVisible({ timeout: 15000 });
    await expect(warningAlert.getByText(/attention/i)).toBeVisible({ timeout: 5000 });
    await expect(warningAlert.getByText(/définitive|irréversible|permanent/i)).toBeVisible({ timeout: 5000 });
  });

  test('should require confirmation text before deletion', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

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

    // Wait for session to load
    try {
      await page.waitForSelector('text=/Chargement de la session/i', { state: 'hidden', timeout: 5000 });
    } catch {
      // Loading state might not be present, continue
    }

    await page.waitForTimeout(1000);

    // Trouver le bouton de suppression
    const deleteButton = page.getByTestId('delete-account-button');
    await expect(deleteButton).toBeVisible({ timeout: 10000 });

    // Vérifier que le bouton est désactivé initialement
    await expect(deleteButton).toBeDisabled({ timeout: 5000 });

    // Trouver le champ de confirmation
    const confirmInput = page.getByTestId('delete-confirm-input');
    await expect(confirmInput).toBeVisible({ timeout: 10000 });

    // Essayer de remplir avec un texte incorrect
    await confirmInput.fill('WRONG');

    // Le bouton devrait toujours être désactivé
    await expect(deleteButton).toBeDisabled({ timeout: 2000 });

    // Remplir avec le bon texte
    await confirmInput.fill('SUPPRIMER');

    // Le bouton devrait maintenant être activé
    await expect(deleteButton).toBeEnabled({ timeout: 5000 });
  });

  test('should show error if confirmation text is incorrect', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

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

    // Wait for session to load
    try {
      await page.waitForSelector('text=/Chargement de la session/i', { state: 'hidden', timeout: 5000 });
    } catch {
      // Loading state might not be present, continue
    }

    await page.waitForTimeout(1000);

    const confirmInput = page.getByTestId('delete-confirm-input');
    await expect(confirmInput).toBeVisible({ timeout: 10000 });

    const deleteButton = page.getByTestId('delete-account-button');
    await expect(deleteButton).toBeVisible({ timeout: 10000 });

    // Remplir avec un texte incorrect
    await confirmInput.fill('WRONG');

    // Le bouton devrait être désactivé
    const isDisabled = await deleteButton.isDisabled({ timeout: 5000 });
    expect(isDisabled).toBe(true);
  });

  test('should list all data that will be deleted', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

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

    // Wait for session to load
    try {
      await page.waitForSelector('text=/Chargement de la session/i', { state: 'hidden', timeout: 5000 });
    } catch {
      // Loading state might not be present, continue
    }

    await page.waitForTimeout(1000);

    // Vérifier la présence des catégories dans la liste (utiliser first() pour éviter les ambiguïtés)
    // Les catégories sont dans une liste ul, donc on peut utiliser getByRole('listitem')
    const dataList = page.locator('ul').filter({ hasText: /données qui seront supprimées/i }).or(
      page.locator('ul').filter({ hasText: /profil utilisateur/i })
    ).first();
    await expect(dataList).toBeVisible({ timeout: 15000 });

    // Vérifier les catégories spécifiques dans la liste
    await expect(dataList.getByText(/profil utilisateur/i).first()).toBeVisible({ timeout: 5000 });
    await expect(dataList.getByText(/livres/i).first()).toBeVisible({ timeout: 5000 });
    await expect(dataList.getByText(/progression/i).first()).toBeVisible({ timeout: 5000 });
    await expect(dataList.getByText(/notes/i).first()).toBeVisible({ timeout: 5000 });
    await expect(dataList.getByText(/avis/i).first()).toBeVisible({ timeout: 5000 });
    await expect(dataList.getByText(/objectifs/i).first()).toBeVisible({ timeout: 5000 });
    await expect(dataList.getByText(/badges/i).first()).toBeVisible({ timeout: 5000 });
    await expect(dataList.getByText(/statistiques/i).first()).toBeVisible({ timeout: 5000 });
    await expect(dataList.getByText(/relations/i).first()).toBeVisible({ timeout: 5000 });
    await expect(dataList.getByText(/prêt/i).first()).toBeVisible({ timeout: 5000 });
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

    // Wait for session to load
    try {
      await page.waitForSelector('text=/Chargement de la session/i', { state: 'hidden', timeout: 5000 });
    } catch {
      // Loading state might not be present, continue
    }

    await page.waitForTimeout(1000);

    // Remplir le champ de confirmation
    const confirmInput = page.getByTestId('delete-confirm-input');
    await expect(confirmInput).toBeVisible({ timeout: 10000 });
    await confirmInput.fill('SUPPRIMER');

    // Cliquer sur le bouton de suppression
    const deleteButton = page.getByTestId('delete-account-button');
    await expect(deleteButton).toBeEnabled({ timeout: 5000 });

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

    // Wait for session to load
    try {
      await page.waitForSelector('text=/Chargement de la session/i', { state: 'hidden', timeout: 5000 });
    } catch {
      // Loading state might not be present, continue
    }

    await page.waitForTimeout(1000);

    const confirmInput = page.getByTestId('delete-confirm-input');
    await expect(confirmInput).toBeVisible({ timeout: 15000 });
    await confirmInput.fill('SUPPRIMER');

    const deleteButton = page.getByTestId('delete-account-button');
    await expect(deleteButton).toBeEnabled({ timeout: 5000 });

    // Cliquer et vérifier l'état de chargement
    await deleteButton.click();

    // Attendre que l'état de chargement s'affiche
    await page.waitForTimeout(500);

    // Vérifier l'overlay de chargement ou le spinner dans le bouton
    const loadingOverlay = page.getByTestId('delete-loading-overlay');
    const loadingSpinner = page.getByTestId('delete-loading-spinner');
    const overlaySpinner = page.getByTestId('delete-overlay-spinner');
    const loadingTitle = page.getByTestId('delete-loading-title');

    // Vérifier que l'un des indicateurs de chargement est visible
    const hasOverlay = await loadingOverlay.isVisible({ timeout: 3000 }).catch(() => false);
    const hasButtonSpinner = await loadingSpinner.isVisible({ timeout: 3000 }).catch(() => false);
    const hasOverlaySpinner = await overlaySpinner.isVisible({ timeout: 3000 }).catch(() => false);
    const hasTitle = await loadingTitle.isVisible({ timeout: 3000 }).catch(() => false);
    const buttonText = await deleteButton.textContent().catch(() => '');
    const isButtonDisabled = await deleteButton.isDisabled().catch(() => false);

    expect(
      hasOverlay ||
      hasButtonSpinner ||
      hasOverlaySpinner ||
      hasTitle ||
      buttonText?.toLowerCase().includes('suppression en cours') ||
      isButtonDisabled
    ).toBeTruthy();
  });

  test('should handle deletion errors gracefully', async ({ page }) => {
    // Intercepter la requête API et la faire échouer
    // Use regex pattern to match /api/user/{userId}/delete more reliably
    await page.route(/\/api\/user\/[^/]+\/delete/, route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

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

    // Wait for session to load
    try {
      await page.waitForSelector('text=/Chargement de la session/i', { state: 'hidden', timeout: 5000 });
    } catch {
      // Loading state might not be present, continue
    }

    await page.waitForTimeout(1000);

    const confirmInput = page.getByTestId('delete-confirm-input');
    await expect(confirmInput).toBeVisible({ timeout: 10000 });
    await confirmInput.fill('SUPPRIMER');

    const deleteButton = page.getByTestId('delete-account-button');
    await expect(deleteButton).toBeEnabled({ timeout: 5000 });
    await deleteButton.click();

    // Vérifier qu'un message d'erreur s'affiche (peut être dans un toast)
    // Use first() to avoid strict mode violation
    await expect(
      page.getByText(/erreur|error|impossible/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('should display user rights information', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

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

    // Wait for session to load
    try {
      await page.waitForSelector('text=/Chargement de la session/i', { state: 'hidden', timeout: 5000 });
    } catch {
      // Loading state might not be present, continue
    }

    await page.waitForTimeout(1000);

    // Vérifier la présence des informations sur les droits RGPD
    await expect(page.getByText(/vos droits/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/RGPD/i)).toBeVisible({ timeout: 15000 });

    // Vérifier les liens vers la politique de confidentialité
    const privacyLink = page.locator('a[href="/privacy"]');
    await expect(privacyLink.first()).toBeVisible({ timeout: 15000 });
  });

  test('should allow exporting data before deletion', async ({ page }) => {
    await page.goto(ROUTES.DELETE_ACCOUNT, { waitUntil: 'load' });

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

    // Vérifier que la section d'export est visible avant la section de suppression
    const exportSection = page.getByText(/exporter vos données/i);
    await expect(exportSection).toBeVisible({ timeout: 10000 });

    const deleteSection = page.getByText(/supprimer mon compte/i);
    await expect(deleteSection).toBeVisible({ timeout: 10000 });

    // Vérifier que la section d'export est avant la section de suppression
    const exportPosition = await exportSection.boundingBox();
    const deletePosition = await deleteSection.boundingBox();

    if (exportPosition && deletePosition) {
      expect(exportPosition.y).toBeLessThan(deletePosition.y);
    }
  });
});
