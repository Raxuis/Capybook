import type { Metadata } from "next";
import { getServerUrl } from "@/utils/get-server-url";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - Capybook",
  description: "Politique de confidentialité et protection des données personnelles de Capybook",
};

export default function PrivacyPolicyPage() {
  const baseUrl = getServerUrl();
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-muted-foreground mb-8">
          Dernière mise à jour : {currentDate}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            La présente Politique de Confidentialité décrit la manière dont Capybook (&quot;nous&quot;, &quot;notre&quot;, &quot;l&apos;application&quot;)
            collecte, utilise, stocke et protège vos données personnelles lorsque vous utilisez notre application web
            de suivi de lecture accessible à l'adresse <strong>{baseUrl}</strong>.
          </p>
          <p>
            Capybook est une application développée par Raphaël Raclot, qui vous permet de suivre votre progression
            de lecture, gérer votre bibliothèque personnelle, écrire des avis sur les livres, et interagir avec une
            communauté de lecteurs.
          </p>
          <p>
            En utilisant Capybook, vous acceptez les pratiques décrites dans cette politique. Si vous n&apos;acceptez pas
            cette politique, veuillez ne pas utiliser notre application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Responsable du Traitement</h2>
          <p>
            Le responsable du traitement des données personnelles est :
          </p>
          <div className="bg-muted p-4 rounded-lg my-4">
            <p className="mb-2"><strong>Raphaël Raclot</strong></p>
            <p className="mb-2">Email : raxuis@proton.me</p>
            <p>Pour toute question concernant vos données personnelles, vous pouvez nous contacter à cette adresse.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Données Collectées</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.1. Données d&apos;identification</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Email</strong> : collecté lors de l'inscription, utilisé pour l'authentification et la communication</li>
            <li><strong>Nom d&apos;utilisateur</strong> : collecté lors de l&apos;inscription, visible publiquement sur votre profil</li>
            <li><strong>Nom complet</strong> : optionnel, peut être ajouté à votre profil</li>
            <li><strong>Mot de passe</strong> : stocké de manière sécurisée (hashé avec bcrypt), jamais accessible en clair</li>
            <li><strong>Photo de profil</strong> : optionnelle, stockée si vous en uploadez une</li>
            <li><strong>Couleur favorite</strong> : préférence de personnalisation de l&apos;interface</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.2. Données de lecture</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Livres ajoutés</strong> : livres que vous avez dans votre bibliothèque</li>
            <li><strong>Progression de lecture</strong> : pourcentage ou nombre de pages lues par livre</li>
            <li><strong>Notes et citations</strong> : notes personnelles, citations et pensées associées aux livres</li>
            <li><strong>Avis et notes</strong> : avis que vous rédigez sur les livres (avec paramètres de confidentialité)</li>
            <li><strong>Objectifs de lecture</strong> : objectifs que vous vous fixez (nombre de livres, pages, temps)</li>
            <li><strong>Statistiques de lecture</strong> : pages lues par jour, temps de lecture, genres préférés</li>
            <li><strong>Badges obtenus</strong> : récompenses et réalisations</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.3. Données sociales</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Relations de suivi</strong> : utilisateurs que vous suivez et qui vous suivent</li>
            <li><strong>Demandes de prêt</strong> : demandes d&apos;emprunt et de prêt de livres entre utilisateurs</li>
            <li><strong>Vues du livre du jour</strong> : historique des livres du jour que vous avez consultés</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.4. Données techniques</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Cookies de session</strong> : cookies nécessaires à l&apos;authentification (durée : 30 jours)</li>
            <li><strong>Données de navigation</strong> : collectées par Sentry pour le monitoring des erreurs (avec votre consentement)</li>
            <li><strong>Adresse IP</strong> : collectée automatiquement par le serveur pour des raisons de sécurité</li>
            <li><strong>User-Agent</strong> : type de navigateur et système d'exploitation</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Finalités du Traitement</h2>
          <p>Vos données personnelles sont traitées pour les finalités suivantes :</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Gestion de votre compte</strong> : création, authentification, gestion du profil</li>
            <li><strong>Fonctionnalités de l&apos;application</strong> : suivi de lecture, gestion de bibliothèque, statistiques</li>
            <li><strong>Interactions sociales</strong> : suivi d'autres utilisateurs, partage d'avis, système de prêt</li>
            <li><strong>Personnalisation</strong> : recommandations de livres, livre du jour personnalisé</li>
            <li><strong>Sécurité</strong> : prévention de la fraude, protection contre les abus</li>
            <li><strong>Amélioration du service</strong> : analyse des erreurs via Sentry (avec consentement), amélioration de l'expérience utilisateur</li>
            <li><strong>Obligations légales</strong> : respect des obligations légales et réglementaires</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Base Légale du Traitement</h2>
          <p>Le traitement de vos données personnelles est basé sur :</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Exécution d&apos;un contrat</strong> : données nécessaires à la fourniture du service (email, mot de passe, données de lecture)</li>
            <li><strong>Consentement</strong> : pour les cookies non essentiels et le monitoring via Sentry</li>
            <li><strong>Intérêt légitime</strong> : amélioration du service, sécurité, prévention de la fraude</li>
            <li><strong>Obligation légale</strong> : conservation de certaines données pour répondre aux obligations légales</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Conservation des Données</h2>
          <p>Vos données sont conservées pour les durées suivantes :</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Données de compte</strong> : jusqu&apos;à la suppression de votre compte ou 3 ans d&apos;inactivité</li>
            <li><strong>Données de lecture</strong> : jusqu&apos;à la suppression de votre compte</li>
            <li><strong>Cookies de session</strong> : 30 jours maximum</li>
            <li><strong>Données de monitoring (Sentry)</strong> : 90 jours maximum</li>
            <li><strong>Logs serveur</strong> : 12 mois maximum</li>
            <li><strong>Données à caractère probatoire</strong> : conformément aux obligations légales (généralement 5 ans)</li>
          </ul>
          <p>
            À l&apos;expiration de ces durées, vos données sont supprimées de manière sécurisée, sauf si une obligation
            légale impose une conservation plus longue.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Partage des Données</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">7.1. Données publiques</h3>
          <p>
            Certaines de vos données sont visibles publiquement sur votre profil :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Nom d&apos;utilisateur</li>
            <li>Photo de profil (si vous en avez une)</li>
            <li>Avis publics que vous publiez</li>
            <li>Statistiques de lecture (si vous les partagez)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">7.2. Sous-traitants</h3>
          <p>Nous partageons vos données avec les sous-traitants suivants :</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Vercel</strong> : hébergement de l&apos;application (États-Unis - conforme au Privacy Shield)</li>
            <li><strong>PostgreSQL/Neon</strong> : base de données (localisation selon votre région)</li>
            <li><strong>Sentry</strong> : monitoring et gestion des erreurs (États-Unis - avec votre consentement)</li>
            <li><strong>Open Library</strong> : récupération des données de livres (API publique, aucune donnée personnelle transmise)</li>
          </ul>
          <p>
            Tous nos sous-traitants sont soumis à des obligations contractuelles strictes concernant la protection
            de vos données et sont conformes au RGPD.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">7.3. Transferts hors UE</h3>
          <p>
            Certains de nos sous-traitants sont situés hors de l&apos;Union Européenne. Dans ce cas, nous nous assurons
            que des garanties appropriées sont en place (clauses contractuelles types, Privacy Shield, etc.).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Vos Droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>

          <div className="bg-muted p-4 rounded-lg my-4">
            <h3 className="text-xl font-semibold mb-3">8.1. Droit d'accès</h3>
            <p>
              Vous pouvez demander l'accès à toutes vos données personnelles que nous détenons.
              Vous pouvez accéder à la plupart de vos données directement depuis votre profil.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg my-4">
            <h3 className="text-xl font-semibold mb-3">8.2. Droit de rectification</h3>
            <p>
              Vous pouvez corriger ou mettre à jour vos données personnelles à tout moment depuis votre profil
              ou en nous contactant.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg my-4">
            <h3 className="text-xl font-semibold mb-3">8.3. Droit à l&apos;effacement</h3>
            <p>
              Vous pouvez demander la suppression de votre compte et de toutes vos données personnelles.
              Vous pouvez faire cette demande depuis la page <a href="/delete-account" className="text-primary underline">Suppression de compte</a>.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg my-4">
            <h3 className="text-xl font-semibold mb-3">8.4. Droit à la portabilité</h3>
            <p>
              Vous pouvez demander à recevoir vos données dans un format structuré et couramment utilisé.
              Contactez-nous à raxuis@proton.me pour faire cette demande.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg my-4">
            <h3 className="text-xl font-semibold mb-3">8.5. Droit d&apos;opposition</h3>
            <p>
              Vous pouvez vous opposer au traitement de vos données pour des motifs légitimes, notamment
              pour le monitoring via Sentry (vous pouvez retirer votre consentement dans les paramètres).
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg my-4">
            <h3 className="text-xl font-semibold mb-3">8.6. Droit à la limitation</h3>
            <p>
              Vous pouvez demander la limitation du traitement de vos données dans certains cas prévus par le RGPD.
            </p>
          </div>

          <p className="mt-4">
            Pour exercer ces droits, contactez-nous à <strong>raxuis@proton.me</strong>. Nous répondrons à votre
            demande dans un délai d&apos;un mois maximum.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Sécurité des Données</h2>
          <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Chiffrement des mots de passe avec bcrypt</li>
            <li>HTTPS pour toutes les communications</li>
            <li>Authentification sécurisée via NextAuth.js</li>
            <li>Protection contre les attaques CSRF et XSS</li>
            <li>Accès restreint aux données (principe du moindre privilège)</li>
            <li>Sauvegardes régulières de la base de données</li>
            <li>Surveillance et détection des incidents de sécurité</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Cookies</h2>
          <p>
            Capybook utilise des cookies pour le bon fonctionnement de l'application. Pour plus d'informations,
            consultez notre <a href="/cookies" className="text-primary underline">Politique de Cookies</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Mineurs</h2>
          <p>
            Capybook n&apos;est pas destiné aux personnes de moins de 16 ans. Si vous avez moins de 16 ans,
            vous devez obtenir l&apos;autorisation de vos parents ou tuteurs légaux avant d&apos;utiliser l&apos;application.
          </p>
          <p>
            Si nous apprenons qu&apos;un mineur de moins de 16 ans a fourni des données personnelles sans autorisation,
            nous supprimerons ces données dans les plus brefs délais.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Modifications de la Politique</h2>
          <p>
            Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications importantes
            vous seront notifiées par email ou via une notification dans l&apos;application. La date de dernière mise
            à jour est indiquée en haut de cette page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Réclamation</h2>
          <p>
            Si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD,
            vous avez le droit d&apos;introduire une réclamation auprès de l&apos;autorité de contrôle compétente :
          </p>
          <div className="bg-muted p-4 rounded-lg my-4">
            <p className="mb-2"><strong>CNIL (Commission Nationale de l&apos;Informatique et des Libertés)</strong></p>
            <p className="mb-2">3 Place de Fontenoy - TSA 80715</p>
            <p className="mb-2">75334 PARIS CEDEX 07</p>
            <p className="mb-2">Téléphone : 01 53 73 22 22</p>
            <p>Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.cnil.fr</a></p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité ou le traitement de vos données,
            contactez-nous à :
          </p>
          <div className="bg-muted p-4 rounded-lg my-4">
            <p className="mb-2"><strong>Email</strong> : raxuis@proton.me</p>
            <p><strong>Responsable</strong> : Raphaël Raclot</p>
          </div>
        </section>
      </div>
    </div>
  );
}
