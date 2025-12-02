# Plan de Tests - Application Capybook

## Vue d'ensemble

Ce document décrit en détail les plans de tests mis en place pour l'application Capybook, une application Next.js de
gestion de lecture. Les tests couvrent à la fois les tests unitaires et les tests end-to-end (E2E).

---

## 1. Architecture des Tests

### 1.1 Types de Tests

L'application utilise deux types principaux de tests :

- **Tests Unitaires** : Testent des composants et hooks individuels de manière isolée
- **Tests End-to-End (E2E)** : Testent le comportement complet de l'application dans un navigateur réel

### 1.2 Outils et Frameworks

#### Tests Unitaires

- **Vitest** : Framework de test principal pour les tests unitaires
- **React Testing Library** : Bibliothèque pour tester les composants React
- **@testing-library/jest-dom** : Matchers DOM personnalisés
- **@testing-library/user-event** : Simulation d'interactions utilisateur
- **happy-dom** : Environnement DOM léger pour les tests

#### Tests E2E

- **Playwright** : Framework de test E2E avec support multi-navigateurs
- **Navigateurs testés** : Chromium, Firefox, WebKit (Safari)

### 1.3 Structure des Répertoires

```
tests/
├── e2e/              # Tests end-to-end
│   ├── auth.spec.ts
│   ├── navigation.spec.ts
│   ├── metadata.spec.ts
│   ├── example.spec.ts
│   └── global-setup.ts
├── unit/             # Tests unitaires
│   ├── button.test.tsx
│   ├── hook.test.ts
│   └── layout.test.tsx
├── fixtures/         # Données de test réutilisables
│   └── test-users.ts
└── utils/            # Utilitaires de test
    ├── helpers.tsx
    └── test-urls.ts
```

---

## 2. Configuration des Tests

### 2.1 Configuration Vitest (`vitest.config.mts`)

- **Environnement** : `happy-dom` (simulation DOM légère)
- **Fichier de setup** : `setupTests.ts` (configuration globale)
- **Globals** : Activés pour un accès direct aux fonctions de test
- **CSS** : Activé pour tester les styles
- **Exclusions** : `node_modules`, `dist`, `.next`, `tests/e2e`

### 2.2 Configuration Playwright (`playwright.config.ts`)

- **Timeout** : 30 secondes par test
- **Parallélisation** : Activée (désactivée en CI)
- **Retry** : 2 tentatives en CI, 0 en local
- **Workers** : 1 en CI, parallèle en local
- **Viewport** : 1280x720
- **Base URL** : `http://localhost:3000`
- **Web Server** : Démarre automatiquement le serveur de développement
- **Global Setup** : Crée un utilisateur de test avant l'exécution des tests

### 2.3 Setup Global (`setupTests.ts`)

Le fichier de setup configure :

- Les matchers DOM personnalisés (`@testing-library/jest-dom`)
- Le nettoyage automatique après chaque test
- Les mocks globaux :
    - `ResizeObserver`
    - `IntersectionObserver`
    - `window.matchMedia`
    - `window.scrollTo`

---

## 3. Tests Unitaires

### 3.1 Composant Button (`button.test.tsx`)

**Objectif** : Vérifier le bon fonctionnement du composant Button réutilisable.

**Éléments testés** :

1. **Rendu de base** : Le bouton s'affiche correctement avec son texte
2. **Gestion des événements** : Le handler `onClick` est appelé au clic
3. **État désactivé** : Le bouton est désactivé quand `disabled={true}`
4. **Protection contre les clics désactivés** : `onClick` n'est pas appelé quand le bouton est désactivé
5. **Variantes** : Test de toutes les variantes (`default`, `destructive`, `outline`, `ghost`)
6. **Tailles** : Test de toutes les tailles (`sm`, `lg`, `icon`)
7. **Accessibilité** : Vérification des attributs ARIA (`aria-label`)

**Techniques utilisées** :

- `render()` avec React Testing Library
- `userEvent.click()` pour simuler les interactions
- `vi.fn()` (Vitest) pour créer des mocks de fonctions
- `rerender()` pour tester différents props

### 3.2 Hook useUser (`hook.test.ts`)

**Objectif** : Vérifier le comportement du hook personnalisé `useUser` qui gère les données utilisateur.

**Éléments testés** :

1. **Structure de retour** : Le hook retourne les propriétés attendues :
    - `user` : Données utilisateur
    - `isLoading` : État de chargement
    - `isValidating` : État de validation
    - `isError` : État d'erreur
    - `refreshUser` : Fonction de rafraîchissement
2. **État de chargement** : `isLoading` est `true` pendant le chargement initial
3. **Gestion des erreurs** : `isError` est `true` quand une erreur survient
4. **Fonction refreshUser** : La fonction `refreshUser` appelle `mutate` de SWR
5. **Gestion de userId undefined** : Le hook gère correctement l'absence d'ID utilisateur

**Techniques utilisées** :

- `renderHook()` de React Testing Library
- Mocks de `swr`, `zustand`, et `fetcher`
- Simulation de différents états (loading, error, success)

### 3.3 Layout Root (`layout.test.tsx`)

**Objectif** : Vérifier le rendu et la structure du layout racine de l'application.

**Éléments testés** :

1. **Structure du layout** : Les enfants sont rendus correctement
2. **Structure HTML** : Les éléments `html` et `body` sont présents avec les bons attributs
3. **Attribut lang** : L'attribut `lang="fr"` est défini sur l'élément HTML
4. **Classes de police** : Les classes de police (`--font-inter`, `--font-manrope`) sont appliquées
5. **Rendu dans les providers** : Les composants enfants sont rendus dans les providers (SessionProvider, SWRConfig)

**Techniques utilisées** :

- Mocks complets de Next.js (`next/font/google`, `next-view-transitions`, `next/navigation`)
- Mocks des composants (`Header`, `Dock`, `Toaster`)
- Vérification de la structure DOM

---

## 4. Tests End-to-End (E2E)

### 4.1 Tests d'Authentification (`auth.spec.ts`)

**Objectif** : Vérifier le système d'authentification complet de l'application.

**Éléments testés** :

1. **Redirection vers login** :
    - Accès à une route protégée (`/book-shelf`) sans authentification
    - Vérification de la redirection vers `/login`

2. **Affichage du formulaire de connexion** :
    - Présence du champ email
    - Présence du champ mot de passe
    - Présence du bouton de soumission
    - Utilisation de sélecteurs flexibles (labels en français/anglais)

3. **Tentative de connexion** :
    - Remplissage des champs avec les identifiants de test
    - Soumission du formulaire
    - Vérification de la navigation après connexion ou affichage d'erreur

4. **Gestion des identifiants invalides** :
    - Tentative de connexion avec des identifiants incorrects
    - Vérification de l'affichage d'un message d'erreur
    - Vérification que l'utilisateur reste sur la page de login

5. **Gestion de session authentifiée** :
    - Vérification de la présence des cookies de session
    - Accès aux routes protégées quand authentifié

**Techniques utilisées** :

- `page.goto()` pour naviguer
- `page.fill()` pour remplir les formulaires
- `page.click()` pour cliquer
- `page.waitForURL()` pour attendre la navigation
- `page.waitForSelector()` pour attendre les éléments
- `Promise.race()` pour gérer les cas multiples

### 4.2 Tests de Navigation (`navigation.spec.ts`)

**Objectif** : Vérifier le système de navigation de l'application.

**Éléments testés** :

1. **Navigation avec App Router Link** :
    - Clic sur un lien de navigation
    - Vérification de la navigation vers la page cible
    - Utilisation de `Promise.all()` pour synchroniser navigation et clic

2. **Navigation vers différentes pages** :
    - Page About (`/about`)
    - Page Login (`/login`)
    - Page Register (`/register`)
    - Vérification que les pages se chargent correctement

3. **Navigation côté client** :
    - Navigation entre plusieurs pages
    - Utilisation du bouton retour du navigateur
    - Vérification que l'historique de navigation fonctionne

**Techniques utilisées** :

- `page.locator()` pour trouver les éléments
- `page.waitForLoadState('domcontentloaded')` pour attendre le chargement
- `page.goBack()` pour tester la navigation arrière
- Vérification des URLs avec `expect(page.url()).toContain()`

### 4.3 Tests de Métadonnées (`metadata.spec.ts`)

**Objectif** : Vérifier les métadonnées SEO et les balises HTML essentielles.

**Éléments testés** :

1. **Métadonnées de la page d'accueil** :
    - Titre de la page contient "Capybook"
    - Meta description contient des mots-clés pertinents

2. **Balises Open Graph** :
    - `og:title` (si présent)
    - `og:description` (si présent)
    - Vérification du contenu des balises

3. **Balises meta essentielles** :
    - `viewport` avec `width=device-width`
    - `charset` défini à `utf-8`
    - `lang="fr"` sur l'élément HTML

4. **Validation des métadonnées** :
    - Vérification que les métadonnées sont générées par `generateMetadata`
    - Vérification de la présence des balises dans le HTML

**Techniques utilisées** :

- `page.locator('meta[...]')` pour trouver les balises meta
- `expect().toHaveAttribute()` pour vérifier les attributs
- `page.content()` pour analyser le HTML complet

### 4.4 Tests de la Page d'Accueil (`example.spec.ts`)

**Objectif** : Vérifier le chargement et le rendu de la page d'accueil.

**Éléments testés** :

1. **Chargement de la page** :
    - La page se charge sans erreur
    - L'URL est correcte

2. **Titre de la page** :
    - Le titre contient "Capybook"

3. **Métadonnées** :
    - Meta description présente
    - Élément `main` visible

4. **Rendu des composants** :
    - Le composant Hero est rendu
    - Le contenu principal est visible

5. **Interactivité** :
    - La page est interactive (composant client)
    - Le body est visible

**Techniques utilisées** :

- `page.waitForLoadState()` pour attendre le chargement complet
- `page.locator('main')` pour trouver les éléments principaux
- Vérification de la visibilité avec `toBeVisible()`

### 4.5 Global Setup (`global-setup.ts`)

**Objectif** : Préparer l'environnement de test avant l'exécution des tests E2E.

**Fonctionnalités** :

1. **Création d'utilisateur de test** :
    - Vérifie si l'utilisateur de test existe déjà
    - Crée l'utilisateur s'il n'existe pas
    - Met à jour le mot de passe si l'utilisateur existe déjà

2. **Gestion des erreurs** :
    - Gère les erreurs de contrainte unique (utilisateur déjà existant)
    - N'interrompt pas les tests en cas d'erreur non critique

3. **Connexion à la base de données** :
    - Utilise Prisma pour interagir avec la base de données
    - Hash le mot de passe avec `saltAndHashPassword`
    - Déconnecte proprement après l'opération

**Techniques utilisées** :

- Prisma pour les opérations de base de données
- Gestion d'erreurs avec try/catch
- Logging pour le débogage

---

## 5. Utilitaires et Helpers

### 5.1 Helpers de Test (`tests/utils/helpers.tsx`)

#### Pour Playwright (E2E)

1. **`login(page, email, password)`** :
    - Navigue vers `/login`
    - Remplit les champs email et mot de passe
    - Soumet le formulaire
    - Attend la navigation

2. **`navigateTo(page, url)`** :
    - Navigue vers une URL
    - Attend que le réseau soit inactif

3. **`waitForPage(page, url)`** :
    - Attend que l'URL soit atteinte
    - Attend le chargement DOM et réseau

#### Pour React Testing Library (Unitaires)

1. **`AllTheProviders`** :
    - Wrapper qui fournit tous les providers nécessaires :
        - `SessionProvider` (NextAuth) avec session mockée
        - `SWRConfig` avec configuration de test

2. **`customRender`** :
    - Fonction `render` personnalisée qui utilise `AllTheProviders`
    - Permet de tester les composants qui dépendent des providers

### 5.2 Fixtures (`tests/fixtures/test-users.ts`)

**Données de test réutilisables** :

- `TEST_USER` : Utilisateur principal pour les tests
- `TEST_USER_2` : Utilisateur secondaire pour les tests multi-utilisateurs

### 5.3 Constantes de Routes (`tests/utils/test-urls.ts`)

**Routes centralisées** :

- Toutes les routes de l'application sont définies dans un objet `ROUTES`
- Facilite la maintenance et évite les erreurs de typage

---

## 6. Stratégies de Test

### 6.1 Tests Unitaires

**Approche** :

- Isolation complète des composants
- Mocks de toutes les dépendances externes
- Tests rapides et déterministes
- Focus sur la logique métier

**Couverture** :

- Composants UI réutilisables
- Hooks personnalisés
- Layouts et structures de base

### 6.2 Tests E2E

**Approche** :

- Tests dans un environnement proche de la production
- Utilisation d'un navigateur réel
- Tests des flux utilisateur complets
- Vérification de l'intégration entre les composants

**Couverture** :

- Authentification complète
- Navigation entre les pages
- Métadonnées et SEO
- Chargement des pages principales

### 6.3 Gestion des Données de Test

**Utilisateurs de test** :

- Création automatique avant les tests E2E
- Réutilisation entre les tests
- Nettoyage optionnel après les tests

**Isolation** :

- Chaque test E2E est indépendant
- Utilisation de fixtures pour les données
- Pas de dépendance entre les tests

---

## 7. Exécution des Tests

### 7.1 Commandes Disponibles

```bash
# Tests unitaires
pnpm test              # Exécute les tests en mode watch
pnpm test:unit         # Exécute les tests une fois
pnpm test:unit:watch   # Exécute les tests en mode watch

# Tests E2E
pnpm test:e2e          # Exécute tous les tests E2E
pnpm test:e2e:ui       # Exécute les tests avec l'UI Playwright
pnpm test:e2e:report   # Affiche le rapport HTML des tests
```

### 7.2 Environnement CI/CD

**Configuration CI** :

- Retry automatique (2 tentatives)
- Workers limités à 1 pour éviter les conflits
- Génération de rapports HTML et JSON
- Screenshots et vidéos en cas d'échec
- Traces Playwright pour le débogage

**Variables d'environnement requises** :

- `DATABASE_URL` : URL de la base de données
- `NEXTAUTH_SECRET` : Secret pour NextAuth
- `NEXTAUTH_URL` : URL de l'application

---

## 8. Éléments Testés - Résumé

### 8.1 Fonctionnalités Testées

✅ **Authentification**

- Formulaire de connexion
- Validation des identifiants
- Gestion des erreurs
- Redirection après connexion
- Protection des routes

✅ **Navigation**

- Navigation entre les pages
- Navigation côté client
- Historique du navigateur
- Liens App Router

✅ **Métadonnées et SEO**

- Titres de pages
- Meta descriptions
- Balises Open Graph
- Attributs HTML essentiels

✅ **Composants UI**

- Boutons avec variantes
- États désactivés
- Gestion des événements
- Accessibilité

✅ **Hooks Personnalisés**

- Gestion des états (loading, error)
- Intégration avec SWR
- Gestion des données utilisateur

✅ **Layouts**

- Structure HTML
- Providers
- Configuration des polices

### 8.2 Qualité et Fiabilité

- **Isolation** : Chaque test est indépendant
- **Déterministe** : Les tests produisent les mêmes résultats à chaque exécution
- **Maintenable** : Code de test organisé et réutilisable
- **Documenté** : Commentaires et helpers explicites
- **Robuste** : Gestion des erreurs et timeouts appropriés

---

## 9. Améliorations Futures

### 9.1 Tests à Ajouter

- Tests de formulaires (validation, soumission)
- Tests d'API (routes API Next.js)
- Tests de composants complexes (Dashboard, BookStore)
- Tests de performance
- Tests d'accessibilité approfondis (a11y)

### 9.2 Optimisations

- Augmentation de la couverture de code
- Tests de régression automatisés
- Tests de charge pour les routes critiques
- Tests visuels (screenshots comparatifs)

---

## Conclusion

L'application Capybook dispose d'une suite de tests complète couvrant :

- Les tests unitaires pour les composants et hooks
- Les tests E2E pour les flux utilisateur critiques
- Une infrastructure de test robuste et maintenable
- Des helpers et fixtures réutilisables
- Une configuration adaptée au développement et à la CI/CD

Cette stratégie de test garantit la qualité et la fiabilité de l'application tout en facilitant le développement et la
maintenance.
