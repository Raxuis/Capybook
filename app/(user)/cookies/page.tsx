import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Cookies - Capybook",
  description: "Informations sur l'utilisation des cookies sur Capybook",
};

export default function CookiesPolicyPage() {
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Politique de Cookies</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-muted-foreground mb-8">
          Dernière mise à jour : {currentDate}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone)
            lors de la visite d&apos;un site web. Il permet au site de reconnaître votre navigateur et de mémoriser
            certaines informations vous concernant.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Cookies utilisés sur Capybook</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">2.1. Cookies strictement nécessaires</h3>
          <p>
            Ces cookies sont indispensables au fonctionnement de l&apos;application et ne peuvent pas être désactivés.
            Ils sont généralement définis en réponse à des actions que vous effectuez et qui équivalent à une demande
            de services, comme définir vos préférences de confidentialité, vous connecter ou remplir des formulaires.
          </p>

          <div className="bg-muted p-4 rounded-lg my-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Nom du cookie</th>
                  <th className="text-left p-2">Finalité</th>
                  <th className="text-left p-2">Durée</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2"><code>next-auth.session-token</code></td>
                  <td className="p-2">Maintien de votre session utilisateur après connexion</td>
                  <td className="p-2">30 jours</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2"><code>next-auth.csrf-token</code></td>
                  <td className="p-2">Protection contre les attaques CSRF</td>
                  <td className="p-2">Session</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mb-3 mt-6">2.2. Cookies de performance et d&apos;analyse</h3>
          <p>
            Ces cookies nous permettent de comprendre comment les visiteurs interagissent avec notre application
            en collectant et en rapportant des informations de manière anonyme. Ils nous aident à améliorer le
            fonctionnement de l'application.
          </p>

          <div className="bg-muted p-4 rounded-lg my-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Service</th>
                  <th className="text-left p-2">Finalité</th>
                  <th className="text-left p-2">Durée</th>
                  <th className="text-left p-2">Consentement requis</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2"><strong>Sentry</strong></td>
                  <td className="p-2">
                    Monitoring des erreurs et des performances de l'application.
                    Collecte d'informations techniques (type de navigateur, erreurs JavaScript, etc.)
                  </td>
                  <td className="p-2">90 jours</td>
                  <td className="p-2">Oui</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4">
            <strong>Note importante</strong> : Les cookies de performance nécessitent votre consentement.
            Vous pouvez les accepter ou les refuser via le bandeau de consentement qui apparaît lors de votre
            première visite.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Cookies tiers</h2>
          <p>
            Capybook n&apos;utilise pas de cookies de réseaux sociaux ou de publicité. Nous n&apos;intégrons pas de
            services publicitaires tiers qui déposeraient des cookies de tracking.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Gestion de vos préférences</h2>
          <p>
            Vous pouvez gérer vos préférences de cookies à tout moment :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Via le bandeau de consentement lors de votre première visite</li>
            <li>Depuis les paramètres de votre navigateur</li>
            <li>En nous contactant à raxuis@proton.me</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">4.1. Paramètres du navigateur</h3>
          <p>
            La plupart des navigateurs vous permettent de contrôler les cookies via leurs paramètres.
            Voici les liens vers les pages d'aide des principaux navigateurs :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies-preferences" target="_blank" rel="noopener noreferrer" className="text-primary underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary underline">Safari</a></li>
            <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary underline">Microsoft Edge</a></li>
          </ul>

          <p className="mt-4">
            <strong>Attention</strong> : Si vous désactivez tous les cookies, certaines fonctionnalités de
            Capybook pourraient ne plus fonctionner correctement, notamment l'authentification.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Durée de conservation</h2>
          <p>Les cookies sont conservés pour les durées suivantes :</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Cookies de session</strong> : supprimés à la fermeture du navigateur</li>
            <li><strong>Cookies d&apos;authentification</strong> : 30 jours maximum</li>
            <li><strong>Cookies de consentement</strong> : 13 mois maximum (conformément aux recommandations CNIL)</li>
            <li><strong>Cookies de monitoring (Sentry)</strong> : 90 jours maximum</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Service Worker et Cache</h2>
          <p>
            Capybook est une Progressive Web App (PWA) qui utilise un Service Worker pour permettre
            l'utilisation hors ligne. Le Service Worker met en cache certaines ressources localement
            sur votre appareil pour améliorer les performances.
          </p>
          <p>
            Ces données mises en cache ne contiennent pas de données personnelles et peuvent être
            supprimées à tout moment depuis les paramètres de votre navigateur (section "Données de
            site" ou "Stockage").
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
          <p>
            Nous pouvons modifier cette politique de cookies à tout moment. Les modifications importantes
            vous seront notifiées. La date de dernière mise à jour est indiquée en haut de cette page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
          <p>
            Pour toute question concernant notre utilisation des cookies, contactez-nous à :
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
