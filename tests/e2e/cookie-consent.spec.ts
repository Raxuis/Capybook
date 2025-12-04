import {test, expect} from '@playwright/test';
import {ROUTES} from '../utils/test-urls';

test.describe('Cookie Consent Banner', () => {
    test('should display cookie banner on first visit', async ({page, context}) => {
        // Nettoyer le localStorage et les cookies avant le test
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        // Attendre que le bandeau soit visible (il peut prendre un peu de temps à s'afficher)
        // Use getByRole to target the heading specifically to avoid strict-mode violation
        const cookieHeading = page.getByRole('heading', {name: 'Nous utilisons des cookies'});
        await expect(cookieHeading).toBeVisible({timeout: 5000});

        // Vérifier la présence des boutons
        await expect(page.getByRole('button', {name: 'Tout accepter'})).toBeVisible({timeout: 5000});
        await expect(page.getByRole('button', {name: 'Refuser'})).toBeVisible({timeout: 5000});
        await expect(page.getByRole('button', {name: 'Personnaliser'})).toBeVisible({timeout: 5000});
    });

    test('should not display banner after accepting cookies', async ({page, context}) => {
        // Nettoyer le localStorage et les cookies
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        // Attendre que le bandeau soit visible
        const cookieHeading = page.getByRole('heading', {name: 'Nous utilisons des cookies'});
        await expect(cookieHeading).toBeVisible({timeout: 5000});

        // Accepter tous les cookies
        const acceptButton = page.getByRole('button', {name: 'Tout accepter'});
        await acceptButton.click();

        // Attendre que le bandeau disparaisse (check the heading since it's inside the banner)
        await expect(cookieHeading).not.toBeVisible({timeout: 5000});

        // Recharger la page
        await page.reload({waitUntil: 'load'});

        // Vérifier que le bandeau ne réapparaît pas (check the heading)
        await expect(cookieHeading).not.toBeVisible({timeout: 3000});
    });

    test('should not display banner after rejecting cookies', async ({page, context}) => {
        // Nettoyer le localStorage et les cookies
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        // Attendre que le bandeau soit visible
        const cookieHeading = page.getByRole('heading', {name: 'Nous utilisons des cookies'});
        await expect(cookieHeading).toBeVisible({timeout: 5000});

        // Refuser tous les cookies
        const rejectButton = page.getByRole('button', {name: 'Refuser'});
        await rejectButton.click();

        // Attendre que le bandeau disparaisse (check the heading since it's inside the banner)
        await expect(cookieHeading).not.toBeVisible({timeout: 5000});

        // Recharger la page
        await page.reload({waitUntil: 'load'});

        // Vérifier que le bandeau ne réapparaît pas (check the heading)
        await expect(cookieHeading).not.toBeVisible({timeout: 3000});
    });

    test('should open settings modal when clicking customize', async ({page, context}) => {
        // Nettoyer le localStorage et les cookies
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        // Attendre que le bandeau soit visible
        const cookieHeading = page.getByRole('heading', {name: 'Nous utilisons des cookies'});
        await expect(cookieHeading).toBeVisible({timeout: 5000});

        // Cliquer sur personnaliser
        const customizeButton = page.getByRole('button', {name: 'Personnaliser'});
        await customizeButton.click();

        // Vérifier que la modal s'ouvre
        await expect(page.getByText('Paramètres des cookies', {exact: false})).toBeVisible({timeout: 5000});

        // Vérifier la présence des catégories de cookies
        await expect(page.getByText('Cookies nécessaires', {exact: false})).toBeVisible({timeout: 3000});
        await expect(page.getByText('Cookies d\'analyse', {exact: false})).toBeVisible({timeout: 3000});
    });

    test('should save preferences when clicking save in settings', async ({page, context}) => {
        // Nettoyer le localStorage et les cookies
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        // Attendre que le bandeau soit visible
        const cookieHeading = page.getByRole('heading', {name: 'Nous utilisons des cookies'});
        await expect(cookieHeading).toBeVisible({timeout: 5000});

        // Ouvrir les paramètres
        const customizeButton = page.getByRole('button', {name: 'Personnaliser'});
        await customizeButton.click();

        // Attendre que la modal soit visible
        await expect(page.getByText('Paramètres des cookies', {exact: false})).toBeVisible({timeout: 5000});

        // Désactiver les cookies d'analyse (le deuxième checkbox, le premier est désactivé)
        const checkboxes = page.locator('input[type="checkbox"]');
        const analyticsCheckbox = checkboxes.nth(1);

        // Attendre que le checkbox soit visible
        await expect(analyticsCheckbox).toBeVisible({timeout: 3000});

        const isChecked = await analyticsCheckbox.isChecked();
        if (isChecked) {
            await analyticsCheckbox.click();
        }

        // Sauvegarder les préférences
        const saveButton = page.getByRole('button', {name: /enregistrer/i});
        await saveButton.click();

        // Vérifier que la modal se ferme
        await expect(page.getByText('Paramètres des cookies', {exact: false})).not.toBeVisible({timeout: 5000});

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

    test('should show cookie button after consent is given', async ({page, context}) => {
        // Nettoyer le localStorage et les cookies
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        // Attendre que le bandeau soit visible
        const cookieHeading = page.getByRole('heading', {name: 'Nous utilisons des cookies'});
        await expect(cookieHeading).toBeVisible({timeout: 5000});

        // Accepter les cookies
        const acceptButton = page.getByRole('button', {name: 'Tout accepter'});
        await acceptButton.click();

        // Attendre que le bandeau disparaisse (check the heading since it's inside the banner)
        await expect(cookieHeading).not.toBeVisible({timeout: 5000});

        // Vérifier la présence du bouton "Cookies" en bas à droite
        const cookieButton = page.getByRole('button', {name: 'Cookies'});
        await expect(cookieButton).toBeVisible({timeout: 5000});
    });

    test('should reopen settings when clicking cookie button', async ({page, context}) => {
        // Nettoyer le localStorage et les cookies
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        // Attendre que le bandeau soit visible
        const cookieHeading = page.getByRole('heading', {name: 'Nous utilisons des cookies'});
        await expect(cookieHeading).toBeVisible({timeout: 5000});

        // Accepter les cookies
        const acceptButton = page.getByRole('button', {name: 'Tout accepter'});
        await acceptButton.click();

        // Attendre que le bouton cookies apparaisse
        const cookieButton = page.getByRole('button', {name: 'Cookies'});
        await expect(cookieButton).toBeVisible({timeout: 5000});

        // Cliquer sur le bouton cookies
        await cookieButton.click();

        // Vérifier que la modal s'ouvre
        await expect(page.getByText('Paramètres des cookies', {exact: false})).toBeVisible({timeout: 5000});
    });

    test('should link to cookies policy page', async ({page, context}) => {
        // Nettoyer le localStorage et les cookies
        await context.clearCookies();
        await page.goto(ROUTES.HOME, {waitUntil: 'load'});

        // Attendre que le bandeau soit visible
        const cookieHeading = page.getByRole('heading', {name: 'Nous utilisons des cookies'});
        await expect(cookieHeading).toBeVisible({timeout: 5000});

        // Vérifier le lien dans le bandeau - find link near the heading
        const linkInBanner = cookieHeading.locator('..').locator('..').locator('a[href="/cookies"]').filter({hasText: /politique de cookies/i}).first();
        const linkInFooter = page.locator('footer').locator('a[href="/cookies"]');

        const bannerLinkVisible = await linkInBanner.isVisible().catch(() => false);
        const footerLinkVisible = await linkInFooter.isVisible().catch(() => false);

        expect(bannerLinkVisible || footerLinkVisible).toBeTruthy();
    });
});
