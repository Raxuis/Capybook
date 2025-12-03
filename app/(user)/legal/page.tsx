import type { Metadata } from "next";
import { getServerUrl } from "@/utils/get-server-url";

export const metadata: Metadata = {
  title: "Mentions Légales - Capybook",
  description: "Mentions légales de Capybook",
};

export default function LegalNoticePage() {
  const baseUrl = getServerUrl();
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-muted-foreground mb-8">
          Dernière mise à jour : {currentDate}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Éditeur du site</h2>
          <div className="bg-muted p-4 rounded-lg my-4">
            <p className="mb-2"><strong>Nom</strong> : Raphaël Raclot</p>
            <p className="mb-2"><strong>Application</strong> : Capybook</p>
            <p className="mb-2"><strong>Email</strong> : raxuis@proton.me</p>
            <p className="mb-2"><strong>Site web</strong> : <a href={baseUrl} className="text-primary underline">{baseUrl}</a></p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Hébergement</h2>
          <div className="bg-muted p-4 rounded-lg my-4">
            <p className="mb-2"><strong>Hébergeur</strong> : Vercel Inc.</p>
            <p className="mb-2"><strong>Adresse</strong> : 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
            <p className="mb-2"><strong>Site web</strong> : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">vercel.com</a></p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Base de données</h2>
          <div className="bg-muted p-4 rounded-lg my-4">
            <p className="mb-2"><strong>Service</strong> : Neon (PostgreSQL serverless)</p>
            <p className="mb-2"><strong>Site web</strong> : <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="text-primary underline">neon.tech</a></p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Propriété intellectuelle</h2>
          <p>
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur
            et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les
            documents téléchargeables et les représentations iconographiques et photographiques.
          </p>
          <p className="mt-4">
            La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement
            interdite sauf autorisation expresse de l'éditeur.
          </p>
          <p className="mt-4">
            Les marques, logos et autres signes distinctifs présents sur le site sont la propriété de leurs
            détenteurs respectifs.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Données de livres</h2>
          <p>
            Les données de livres (titres, auteurs, couvertures, descriptions) proviennent de l'API publique
            d'Open Library, un projet de l'Internet Archive. Ces données sont utilisées conformément aux
            conditions d'utilisation d'Open Library.
          </p>
          <p className="mt-4">
            <strong>Open Library</strong> : <a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer" className="text-primary underline">openlibrary.org</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Responsabilité</h2>
          <p>
            L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site,
            dont il se réserve le droit de corriger, à tout moment et sans préavis, le contenu.
          </p>
          <p className="mt-4">
            Toutefois, l'éditeur ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations
            mises à disposition sur ce site. En conséquence, l'éditeur décline toute responsabilité :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>pour toute interruption du site</li>
            <li>pour toute survenance de bugs</li>
            <li>pour toute erreur ou omission portant sur des informations disponibles sur le site</li>
            <li>pour tout dommage résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification
                des informations mises à disposition sur le site</li>
            <li>et plus généralement pour tout dommage, direct ou indirect, quelles qu'en soient les causes, origines,
                nature ou conséquences, provoqué à raison de l'accès de quiconque au site ou de l'impossibilité d'y accéder</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Liens hypertextes</h2>
          <p>
            Le site peut contenir des liens hypertextes vers d'autres sites présents sur le réseau Internet.
            Les liens vers ces autres ressources vous font quitter le site Capybook.
          </p>
          <p className="mt-4">
            Il est possible de créer un lien vers la page de présentation de ce site sans autorisation expresse
            de l'éditeur. Aucune autorisation ni demande d'information préalable ne peut être exigée par l'éditeur
            à l'égard d'un site qui souhaite établir un lien vers le site de l'éditeur. Il convient toutefois
            d'afficher ce site dans une nouvelle fenêtre du navigateur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Protection des données personnelles</h2>
          <p>
            Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général
            sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression
            et d'opposition aux données personnelles vous concernant.
          </p>
          <p className="mt-4">
            Pour plus d'informations, consultez notre <a href="/privacy" className="text-primary underline">Politique de Confidentialité</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Conditions d'utilisation</h2>
          <p>
            L'utilisation du site implique l'acceptation pleine et entière des conditions générales d'utilisation
            décrites ci-après. Ces conditions d'utilisation sont susceptibles d'être modifiées ou complétées à tout moment.
          </p>
          <p className="mt-4">
            Pour plus d'informations, consultez nos <a href="/terms" className="text-primary underline">Conditions Générales d'Utilisation</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord
            amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
          <p>
            Pour toute question concernant ces mentions légales, vous pouvez nous contacter à :
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
