# Capybook

Capybook est une application moderne de suivi de lecture construite avec Next.js. Elle aide les lecteurs à suivre leur progression de lecture, gérer leur collection de livres, définir des objectifs de lecture, écrire des critiques et se connecter avec une communauté d'amoureux des livres.

## Vue d'ensemble

Capybook a été fondée en 2025 avec pour mission de transformer la façon dont les lecteurs suivent et apprécient leur expérience de lecture. L'application a été créée pour résoudre le problème courant de perdre le fil de sa progression de lecture ou d'oublier où l'on s'est arrêté dans un livre.

### Fonctionnalités Principales

- 📚 **Suivi de Progression** : Suivez votre progression dans chaque livre avec des outils intuitifs et personnalisables
- 📖 **Gestion de Bibliothèque** : Organisez votre bibliothèque personnelle avec les livres que vous lisez, voulez lire ou avez terminés
- 🎯 **Objectifs de Lecture** : Définissez et suivez des objectifs de lecture (livres, pages ou basés sur le temps)
- ⭐ **Critiques et Notes** : Écrivez et partagez des critiques de livres avec des paramètres de confidentialité personnalisables
- 🏆 **Succès et Badges** : Gagnez des badges pour diverses étapes de lecture
- 👥 **Communauté** : Connectez-vous avec d'autres lecteurs, suivez des amis et partagez votre parcours de lecture
- 📊 **Statistiques** : Analysez vos habitudes de lecture avec des statistiques détaillées et personnalisées
- 📅 **Livre du Jour** : Découvrez une nouvelle recommandation de livre chaque jour
- 🔄 **Prêt de Livres** : Empruntez et prêtez des livres avec des amis
- 📝 **Notes et Citations** : Prenez des notes et sauvegardez des citations de vos livres

## Stack Technologique

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Base de données** : PostgreSQL avec Prisma ORM
- **Authentification** : NextAuth.js v5
- **Styling** : Tailwind CSS
- **Composants UI** : Radix UI
- **Gestion d'État** : Zustand, SWR
- **Animations** : Motion (Framer Motion)
- **Tests** : Vitest (tests unitaires), Playwright (tests E2E)
- **Gestionnaire de Paquets** : pnpm

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** 20.x ou supérieur
- **pnpm** (recommandé) ou npm/yarn
- Base de données **PostgreSQL** (locale ou hébergée dans le cloud)
- **Git**

## Installation

### 1. Cloner le Dépôt

```bash
git clone https://github.com/Raxuis/Capybook.git
cd capybook
```

### 2. Installer les Dépendances

```bash
pnpm install
```

### 3. Variables d'Environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/capybook?schema=public"

# NextAuth
NEXTAUTH_SECRET="votre-clé-secrète-ici"
NEXTAUTH_URL="http://localhost:3000"

# Optionnel : Pour la production
AUTH_URL="http://localhost:3000"
```

**Important** :
- Générez une `NEXTAUTH_SECRET` sécurisée avec : `openssl rand -base64 32`
- Mettez à jour `DATABASE_URL` avec votre chaîne de connexion PostgreSQL
- Pour la production, définissez `NEXTAUTH_URL` sur votre domaine de production

### 4. Configuration de la Base de Données

Générez le client Prisma et exécutez les migrations :

```bash
# Générer le client Prisma
pnpm prisma generate

# Exécuter les migrations de base de données
pnpm prisma migrate dev

# (Optionnel) Initialiser les badges
pnpm seed-badges
```

### 5. Démarrer le Serveur de Développement

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

## Scripts Disponibles

### Développement

```bash
pnpm dev              # Démarrer le serveur de développement avec Turbopack
pnpm build            # Construire pour la production
pnpm start            # Démarrer le serveur de production
pnpm lint             # Exécuter ESLint
pnpm type-check       # Vérifier les types TypeScript
```

### Base de Données

```bash
pnpm prisma generate  # Générer le client Prisma
pnpm prisma migrate   # Exécuter les migrations de base de données
pnpm prisma studio    # Ouvrir Prisma Studio (interface graphique de la base de données)
pnpm seed-badges      # Initialiser les badges dans la base de données
```

### Tests

```bash
pnpm test             # Exécuter les tests unitaires en mode watch
pnpm test:unit        # Exécuter les tests unitaires une fois
pnpm test:unit:watch  # Exécuter les tests unitaires en mode watch
pnpm test:e2e         # Exécuter les tests E2E
pnpm test:e2e:ui      # Exécuter les tests E2E avec l'interface Playwright
pnpm test:e2e:report  # Afficher le rapport des tests E2E
```

## Structure du Projet

```
capybook/
├── app/                    # Pages App Router Next.js
│   ├── (user)/            # Routes utilisateur
│   ├── (admin)/           # Routes administrateur
│   └── api/               # Routes API
├── components/            # Composants React
│   ├── ui/               # Composants UI réutilisables
│   ├── Dashboard/        # Composants du tableau de bord
│   ├── BookStore/        # Composants de la librairie
│   └── ...
├── prisma/               # Schéma et migrations Prisma
├── lib/                  # Bibliothèques utilitaires
├── hooks/                # Hooks React personnalisés
├── store/                # Stores Zustand
├── tests/                # Fichiers de test
│   ├── e2e/             # Tests end-to-end
│   ├── unit/            # Tests unitaires
│   └── utils/           # Utilitaires de test
└── public/              # Assets statiques
```

## Fonctionnalités en Détail

### Suivi de Progression

- Suivre la progression en pourcentage ou en pages
- Définir un livre actuel
- Marquer les livres comme terminés
- Consulter l'historique de lecture

### Gestion de Bibliothèque

- Ajouter des livres à votre collection
- Organiser les livres en étagères (en cours, à lire, terminés)
- Rechercher et découvrir de nouveaux livres
- Voir les détails et couvertures des livres

### Critiques et Confidentialité

- Écrire des critiques détaillées de livres
- Noter les livres de 1 à 5 étoiles
- Contrôler la visibilité des critiques :
  - **Public** : Visible par tous
  - **Privé** : Accessible uniquement via un lien privé
  - **Amis** : Visible par vos abonnés
  - **Ami Spécifique** : Visible par un ami sélectionné

### Objectifs de Lecture

- Définir des objectifs pour :
  - Nombre de livres à lire
  - Nombre de pages à lire
  - Temps passé à lire
- Suivre la progression vers les objectifs
- Définir des échéances

### Statistiques

- Consulter les statistiques de lecture :
  - Livres lus
  - Pages lues
  - Série de lecture
  - Distribution par genre
  - Rythme de lecture

### Livre du Jour

- Découvrir une nouvelle recommandation de livre chaque jour
- Consulter l'historique des livres du jour
- Suivre les livres du jour que vous avez consultés

### Prêt de Livres

- Demander à emprunter des livres à des amis
- Gérer les demandes de prêt (accepter/refuser)
- Suivre les livres empruntés et prêtés
- Définir des dates d'échéance et des rappels

## Schéma de Base de Données

L'application utilise PostgreSQL avec les modèles principaux suivants :

- **User** : Comptes et profils utilisateurs
- **Book** : Informations sur les livres
- **UserBook** : Collection de livres et progression de l'utilisateur
- **BookReview** : Critiques et notes
- **ReadingGoal** : Objectifs de lecture
- **Badge** & **UserBadge** : Système de succès
- **BookLending** : Système d'emprunt de livres
- **ReadingProgress** & **ReadingDay** : Statistiques de lecture
- **DailyBook** : Recommandations de livres quotidiennes

Voir `prisma/schema.prisma` pour le schéma complet.

## Authentification

L'application utilise NextAuth.js v5 avec :

- **Provider Credentials** : Authentification par email/mot de passe
- **Sessions JWT** : Durée de session de 30 jours
- **Accès basé sur les rôles** : Rôles USER, ADMIN, MODERATOR
- **Routes Protégées** : Protection des routes basée sur le middleware

## Déploiement

### Vercel (Recommandé)

1. Poussez votre code sur GitHub
2. Importez le projet dans Vercel
3. Ajoutez les variables d'environnement dans le tableau de bord Vercel
4. Déployez

Le script `vercel-build` exécute automatiquement :
- Génération du client Prisma
- Exécution des migrations
- Initialisation des badges
- Construction de l'application

### Autres Plateformes

Assurez-vous de :
1. Définir toutes les variables d'environnement requises
2. Exécuter `pnpm prisma generate` avant la construction
3. Exécuter `pnpm prisma migrate deploy` pour appliquer les migrations
4. Optionnellement exécuter `pnpm seed-badges` pour initialiser les données

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à soumettre une Pull Request.

1. Forkez le dépôt
2. Créez votre branche de fonctionnalité (`git checkout -b feature/MaFonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajouter MaFonctionnalite'`)
4. Poussez vers la branche (`git push origin feature/MaFonctionnalite`)
5. Ouvrez une Pull Request

## Tests

Le projet inclut des tests complets :

- **Tests Unitaires** : Tests de composants et hooks avec Vitest
- **Tests E2E** : Tests de flux utilisateur complets avec Playwright

Voir [TESTS.fr.md](./TESTS.fr.md) pour la documentation détaillée des tests.

## Licence

Ce projet est privé et n'est pas licencié pour un usage public.

## Support

Pour le support, envoyez un email à raxuis@proton.me ou ouvrez une issue sur GitHub.

## Remerciements

- Construit avec [Next.js](https://nextjs.org)
- Composants UI de [Radix UI](https://www.radix-ui.com)
- Icônes de [Lucide](https://lucide.dev)
- Gestion de base de données avec [Prisma](https://www.prisma.io)

---

Fait avec ❤️ par [Raphaël Raclot](https://www.linkedin.com/in/raphael-raclot/)
