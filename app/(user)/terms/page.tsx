import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d&apos;Utilisation - Capybook",
  description: "Conditions générales d&apos;utilisation de Capybook",
};

export default function TermsOfServicePage() {
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Conditions Générales d&apos;Utilisation</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-muted-foreground mb-8">
          Dernière mise à jour : {currentDate}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
          <p>
            Les présentes Conditions Générales d&apos;Utilisation (ci-après &quot;CGU&quot;) ont pour objet de définir les
            conditions et modalités d&apos;utilisation de l&apos;application web Capybook (ci-après &quot;l&apos;Application&quot; ou &quot;le Service&quot;).
          </p>
          <p className="mt-4">
            L&apos;utilisation de l&apos;Application implique l&apos;acceptation sans réserve des présentes CGU. Si vous n&apos;acceptez
            pas ces conditions, vous ne devez pas utiliser l&apos;Application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Définitions</h2>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Application</strong> : désigne l&apos;application web Capybook accessible via internet</li>
            <li><strong>Utilisateur</strong> : désigne toute personne physique ou morale utilisant l&apos;Application</li>
            <li><strong>Compte</strong> : désigne l&apos;espace personnel créé par l&apos;Utilisateur pour accéder aux fonctionnalités de l&apos;Application</li>
            <li><strong>Contenu</strong> : désigne tous les éléments (textes, images, données) publiés par l&apos;Utilisateur sur l&apos;Application</li>
            <li><strong>Éditeur</strong> : désigne Raphaël Raclot, responsable de l&apos;Application</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Acceptation des CGU</h2>
          <p>
            L&apos;utilisation de l&apos;Application suppose l&apos;acceptation pleine et entière des présentes CGU.
            En créant un compte ou en utilisant l&apos;Application, vous reconnaissez avoir lu, compris et accepté
            ces conditions.
          </p>
          <p className="mt-4">
            L&apos;Éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications
            entrent en vigueur dès leur publication. Il est de votre responsabilité de consulter régulièrement
            les CGU pour prendre connaissance des éventuelles modifications.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Accès au Service</h2>
          <p>
            L&apos;Application est accessible gratuitement à tout utilisateur disposant d&apos;un accès à internet.
            Tous les coûts liés à l&apos;accès au service (matériel, logiciels, connexion internet) sont à la
            charge de l&apos;utilisateur.
          </p>
          <p className="mt-4">
            L&apos;Éditeur se réserve le droit de :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>modifier, suspendre ou interrompre l&apos;accès à tout ou partie de l&apos;Application</li>
            <li>refuser l&apos;accès à l&apos;Application, unilatéralement et sans préavis, à tout utilisateur ne
                respectant pas les présentes CGU</li>
            <li>modifier ou supprimer tout contenu publié sur l&apos;Application</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Création de compte</h2>
          <p>
            Pour utiliser certaines fonctionnalités de l'Application, vous devez créer un compte en fournissant :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>une adresse email valide</li>
            <li>un nom d&apos;utilisateur unique</li>
            <li>un mot de passe sécurisé</li>
          </ul>
          <p className="mt-4">
            Vous vous engagez à :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>fournir des informations exactes, complètes et à jour</li>
            <li>maintenir la sécurité de votre compte et de votre mot de passe</li>
            <li>notifier immédiatement l&apos;Éditeur de toute utilisation non autorisée de votre compte</li>
            <li>être responsable de toutes les activités qui se produisent sous votre compte</li>
          </ul>
          <p className="mt-4">
            <strong>Âge minimum</strong> : L&apos;Application n&apos;est pas destinée aux personnes de moins de 16 ans.
            Si vous avez moins de 16 ans, vous devez obtenir l&apos;autorisation de vos parents ou tuteurs légaux
            avant d&apos;utiliser l&apos;Application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Fonctionnalités</h2>
          <p>L&apos;Application propose les fonctionnalités suivantes :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Suivi de progression de lecture (pourcentage ou nombre de pages)</li>
            <li>Gestion de bibliothèque personnelle</li>
            <li>Rédaction d&apos;avis et de notes sur les livres</li>
            <li>Définition d'objectifs de lecture</li>
            <li>Statistiques de lecture</li>
            <li>Système de badges et de récompenses</li>
            <li>Suivi d'autres utilisateurs et interactions sociales</li>
            <li>Système de prêt de livres entre utilisateurs</li>
            <li>Découverte de livres du jour</li>
          </ul>
          <p className="mt-4">
            L&apos;Éditeur se réserve le droit d&apos;ajouter, modifier ou supprimer des fonctionnalités à tout moment,
            sans préavis.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contenu utilisateur</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">7.1. Responsabilité</h3>
          <p>
            Vous êtes seul responsable du contenu que vous publiez sur l&apos;Application (avis, notes, citations, etc.).
            Vous garantissez que ce contenu :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>ne viole aucun droit de propriété intellectuelle</li>
            <li>ne contient pas de propos diffamatoires, injurieux, obscènes, menaçants ou discriminatoires</li>
            <li>ne contient pas de virus ou tout autre code malveillant</li>
            <li>respecte la vie privée et les droits des tiers</li>
            <li>est conforme à la législation en vigueur</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">7.2. Droits de propriété intellectuelle</h3>
          <p>
            En publiant du contenu sur l&apos;Application, vous accordez à l&apos;Éditeur une licence non exclusive,
            mondiale, gratuite et transférable pour utiliser, reproduire, modifier et afficher ce contenu
            dans le cadre de l&apos;Application.
          </p>
          <p className="mt-4">
            Vous conservez tous vos droits de propriété intellectuelle sur votre contenu.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">7.3. Modération</h3>
          <p>
            L&apos;Éditeur se réserve le droit de modérer, modifier ou supprimer tout contenu qui ne respecterait
            pas les présentes CGU ou qui serait contraire à la législation en vigueur, sans préavis ni justification.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Confidentialité et protection des données</h2>
          <p>
            Le traitement de vos données personnelles est régi par notre <a href="/privacy" className="text-primary underline">Politique de Confidentialité</a>,
            qui fait partie intégrante des présentes CGU.
          </p>
          <p className="mt-4">
            Conformément au RGPD, vous disposez de droits sur vos données personnelles (accès, rectification,
            suppression, portabilité, opposition). Pour exercer ces droits, contactez-nous à raxuis@proton.me
            ou utilisez la page <a href="/delete-account" className="text-primary underline">Suppression de compte</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Obligations de l&apos;utilisateur</h2>
          <p>En utilisant l&apos;Application, vous vous engagez à :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>utiliser l&apos;Application conformément à sa destination et aux présentes CGU</li>
            <li>ne pas utiliser l&apos;Application à des fins illégales ou frauduleuses</li>
            <li>ne pas tenter d&apos;accéder de manière non autorisée à l&apos;Application ou à ses systèmes</li>
            <li>ne pas perturber le fonctionnement de l&apos;Application</li>
            <li>ne pas copier, reproduire ou exploiter commercialement l&apos;Application sans autorisation</li>
            <li>respecter les droits de propriété intellectuelle de l&apos;Éditeur et des tiers</li>
            <li>ne pas publier de contenu illicite, diffamatoire ou contraire aux bonnes mœurs</li>
            <li>respecter la vie privée des autres utilisateurs</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Disponibilité du service</h2>
          <p>
            L&apos;Éditeur s&apos;efforce d&apos;assurer une disponibilité du service 24h/24 et 7j/7, mais ne peut garantir
            une accessibilité absolue. L&apos;Application peut être temporairement indisponible pour des raisons
            de maintenance, de mise à jour ou de cas de force majeure.
          </p>
          <p className="mt-4">
            L&apos;Éditeur ne saurait être tenu responsable des dommages résultant de l&apos;indisponibilité du service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Propriété intellectuelle</h2>
          <p>
            L&apos;Application et l&apos;ensemble de ses éléments (structure, design, logos, textes, images, etc.) sont
            la propriété exclusive de l&apos;Éditeur ou de ses partenaires et sont protégés par les lois françaises
            et internationales relatives à la propriété intellectuelle.
          </p>
          <p className="mt-4">
            Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des
            éléments de l&apos;Application, quel que soit le moyen ou le procédé utilisé, est interdite sans
            autorisation écrite préalable de l&apos;Éditeur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Limitation de responsabilité</h2>
          <p>
            L&apos;Éditeur ne saurait être tenu responsable :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>des dommages directs ou indirects résultant de l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser l&apos;Application</li>
            <li>de la perte de données ou de contenus</li>
            <li>des dommages résultant d&apos;une intrusion ou d&apos;une manipulation frauduleuse des données</li>
            <li>des contenus publiés par les utilisateurs</li>
            <li>des interruptions ou dysfonctionnements du service</li>
            <li>des dommages résultant de l&apos;utilisation de l&apos;Application de manière non conforme aux CGU</li>
          </ul>
          <p className="mt-4">
            L&apos;Utilisateur est seul responsable de l&apos;utilisation qu&apos;il fait de l&apos;Application et des conséquences
            qui en découlent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Résiliation</h2>
          <p>
            Vous pouvez supprimer votre compte à tout moment depuis la page <a href="/delete-account" className="text-primary underline">Suppression de compte</a>
            ou en nous contactant à raxuis@proton.me.
          </p>
          <p className="mt-4">
            L&apos;Éditeur se réserve le droit de suspendre ou supprimer votre compte, sans préavis ni remboursement,
            en cas de violation des présentes CGU ou de comportement inapproprié.
          </p>
          <p className="mt-4">
            En cas de résiliation, vos données personnelles seront supprimées conformément à notre Politique
            de Confidentialité, sauf obligations légales de conservation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Droit applicable et juridiction compétente</h2>
          <p>
            Les présentes CGU sont régies par le droit français. En cas de litige et à défaut d&apos;accord amiable,
            le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. Contact</h2>
          <p>
            Pour toute question concernant les présentes CGU, vous pouvez nous contacter à :
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
