# Analyse d'Impact sur la Protection des Données (DPIA) - Capybook

**Responsable du traitement** : Raphaël Raclot
**Email** : raxuis@proton.me
**Date de création** : 2025-01-XX
**Dernière mise à jour** : 2025-01-XX

---

## 1. Description systématique du traitement

### 1.1. Nature, portée, contexte et finalités

**Nature** : Application web de suivi de lecture (PWA)

**Portée** :
- Collecte et traitement de données personnelles d'utilisateurs
- Gestion de comptes utilisateurs
- Suivi de progression de lecture
- Interactions sociales entre utilisateurs
- Système de recommandations

**Contexte** :
- Application accessible via internet
- Utilisation gratuite
- Public cible : lecteurs de tous âges (16 ans minimum)
- Données stockées dans une base de données PostgreSQL
- Hébergement sur Vercel (États-Unis)

**Finalités** :
1. Gestion des comptes utilisateurs et authentification
2. Suivi de progression de lecture
3. Gestion de bibliothèque personnelle
4. Partage d'avis et d'opinions sur les livres
5. Statistiques de lecture personnalisées
6. Interactions sociales (suivi, prêt de livres)
7. Recommandations de livres
8. Monitoring et amélioration du service

### 1.2. Responsable du traitement

**Raphaël Raclot**
Email : raxuis@proton.me

### 1.3. Catégories de personnes concernées

- Utilisateurs inscrits de l'application
- Utilisateurs non inscrits (navigation publique limitée)

### 1.4. Catégories de données personnelles

**Données d'identification** :
- Email (obligatoire)
- Nom d'utilisateur (obligatoire)
- Nom complet (optionnel)
- Photo de profil (optionnelle)

**Données d'authentification** :
- Mot de passe (hashé)

**Données de contenu** :
- Livres ajoutés à la bibliothèque
- Progression de lecture
- Notes et citations
- Avis sur les livres
- Objectifs de lecture
- Statistiques de lecture

**Données sociales** :
- Relations de suivi (followers/following)
- Demandes de prêt de livres

**Données techniques** :
- Adresse IP
- User-Agent
- Cookies de session
- Données de monitoring (Sentry, avec consentement)

### 1.5. Destinataires des données

**Destinataires internes** :
- Responsable du traitement (accès technique)
- Administrateurs (accès limité pour la modération)

**Sous-traitants** :
- Vercel (hébergement)
- Neon (base de données)
- Sentry (monitoring, avec consentement)

**Destinataires externes** :
- Autres utilisateurs (pour les données publiques : profil, avis publics)
- Open Library (API publique, aucune donnée personnelle transmise)

### 1.6. Transferts de données hors UE

- **Vercel** (États-Unis) : hébergement de l'application
- **Sentry** (États-Unis) : monitoring (avec consentement)
- **Neon** : selon la région choisie (UE ou États-Unis)

**Garanties** :
- Clauses contractuelles types
- Privacy Shield (pour les services américains)

---

## 2. Nécessité et proportionnalité

### 2.1. Nécessité du traitement

Le traitement des données est nécessaire pour :
- Fournir le service de suivi de lecture
- Assurer l'authentification et la sécurité
- Personnaliser l'expérience utilisateur
- Améliorer le service (monitoring)

### 2.2. Proportionnalité

**Mesures de minimisation** :
- Collecte uniquement des données nécessaires
- Données optionnelles clairement identifiées
- Durées de conservation limitées
- Accès restreint aux données (principe du moindre privilège)

**Exemples** :
- Le nom complet est optionnel
- La photo de profil est optionnelle
- Le monitoring Sentry nécessite un consentement explicite

---

## 3. Évaluation des risques

### 3.1. Risques identifiés

#### Risque 1 : Accès non autorisé aux comptes utilisateurs

**Probabilité** : Moyenne
**Gravité** : Élevée
**Impact** : Accès à toutes les données personnelles d'un utilisateur

**Mesures de mitigation** :
- Mots de passe hashés avec bcrypt
- Authentification sécurisée (NextAuth.js)
- Protection CSRF
- Sessions avec expiration (30 jours)
- HTTPS pour toutes les communications

**Résidu de risque** : Faible

#### Risque 2 : Fuite de données par compromission de la base de données

**Probabilité** : Faible
**Gravité** : Très élevée
**Impact** : Accès à toutes les données de tous les utilisateurs

**Mesures de mitigation** :
- Accès restreint à la base de données
- Chiffrement en transit (HTTPS)
- Sauvegardes sécurisées
- Mises à jour de sécurité régulières
- Monitoring des accès

**Résidu de risque** : Faible

#### Risque 3 : Divulgation non intentionnelle de données personnelles

**Probabilité** : Moyenne
**Gravité** : Moyenne
**Impact** : Exposition de données personnelles à des tiers non autorisés

**Mesures de mitigation** :
- Respect des paramètres de confidentialité des avis
- Vérification des permissions avant affichage
- Modération des contenus publics
- Formation sur la protection des données

**Résidu de risque** : Faible

#### Risque 4 : Perte de données

**Probabilité** : Faible
**Gravité** : Élevée
**Impact** : Perte définitive des données utilisateurs

**Mesures de mitigation** :
- Sauvegardes régulières de la base de données
- Tests de restauration
- Redondance des systèmes

**Résidu de risque** : Faible

#### Risque 5 : Utilisation abusive des données par un sous-traitant

**Probabilité** : Faible
**Gravité** : Élevée
**Impact** : Utilisation non autorisée des données par un sous-traitant

**Mesures de mitigation** :
- Contrats avec clauses de protection des données
- Vérification de la conformité des sous-traitants
- Clauses contractuelles types pour les transferts hors UE
- Audit régulier des sous-traitants

**Résidu de risque** : Faible

### 3.2. Évaluation globale des risques

**Niveau de risque global** : **FAIBLE à MOYEN**

Les mesures de sécurité mises en place permettent de réduire significativement les risques identifiés. Les résidus de risque sont principalement liés à des événements exceptionnels ou à des vulnérabilités non encore découvertes.

---

## 4. Mesures de sécurité et garanties

### 4.1. Mesures techniques

- **Chiffrement** :
  - Mots de passe hashés (bcrypt)
  - HTTPS pour toutes les communications
  - Chiffrement en transit pour les données sensibles

- **Authentification et autorisation** :
  - Authentification sécurisée (NextAuth.js)
  - Sessions avec expiration
  - Protection CSRF et XSS
  - Vérification des permissions avant chaque accès

- **Sécurité des données** :
  - Accès restreint à la base de données
  - Principe du moindre privilège
  - Sauvegardes régulières
  - Monitoring des accès

### 4.2. Mesures organisationnelles

- **Gestion des accès** :
  - Accès restreint aux administrateurs
  - Traçabilité des actions d'administration
  - Rotation des accès si nécessaire

- **Formation** :
  - Formation continue sur la sécurité
  - Veille sur les bonnes pratiques
  - Documentation des procédures

- **Gestion des incidents** :
  - Procédure de signalement
  - Plan de réponse aux incidents
  - Notification aux autorités et utilisateurs si nécessaire

### 4.3. Garanties pour les transferts hors UE

- Clauses contractuelles types
- Privacy Shield (pour les services américains)
- Vérification de la conformité des sous-traitants

---

## 5. Consultation des parties prenantes

### 5.1. Consultation interne

- **Responsable du traitement** : Raphaël Raclot
- **Développeurs** : Consultation pour l'implémentation technique

### 5.2. Consultation externe

- **Utilisateurs** : Feedback via les canaux de contact
- **Autorités de contrôle** : Consultation de la CNIL si nécessaire

---

## 6. Conclusion et recommandations

### 6.1. Conclusion

L'analyse d'impact montre que les risques pour les droits et libertés des personnes sont **limités** grâce aux mesures de sécurité mises en place. Le traitement est **nécessaire et proportionné** aux finalités déclarées.

### 6.2. Recommandations

**Court terme** :
- Mettre en place un monitoring plus poussé des accès
- Effectuer des tests de pénétration
- Documenter les procédures de réponse aux incidents

**Moyen terme** :
- Réaliser un audit de sécurité annuel
- Mettre à jour régulièrement les dépendances de sécurité
- Former l'équipe sur les bonnes pratiques de sécurité

**Long terme** :
- Évaluer la nécessité d'un DPO si l'application grandit
- Considérer une certification de sécurité si nécessaire
- Maintenir une veille réglementaire active

### 6.3. Révision

Cette DPIA doit être révisée :
- Lors de l'ajout de nouvelles fonctionnalités significatives
- Lors de changements majeurs dans le traitement des données
- Au moins tous les 3 ans
- En cas d'incident de sécurité majeur

---

## 7. Approbation

**Approuvé par** : Raphaël Raclot
**Date** : 2025-01-XX
**Prochaine révision** : 2028-01-XX

---

## Annexe : Matrice des risques

| Risque | Probabilité | Gravité | Impact | Mesures | Résidu |
|--------|-------------|---------|--------|---------|--------|
| Accès non autorisé | Moyenne | Élevée | Élevé | Authentification, CSRF, HTTPS | Faible |
| Fuite de données | Faible | Très élevée | Très élevé | Chiffrement, accès restreint | Faible |
| Divulgation non intentionnelle | Moyenne | Moyenne | Moyen | Confidentialité, modération | Faible |
| Perte de données | Faible | Élevée | Élevé | Sauvegardes, redondance | Faible |
| Abus sous-traitant | Faible | Élevée | Élevé | Contrats, audit | Faible |

**Légende** :
- Probabilité : Faible / Moyenne / Élevée
- Gravité : Faible / Moyenne / Élevée / Très élevée
- Impact : Faible / Moyen / Élevé / Très élevé
- Résidu : Faible / Moyen / Élevé
