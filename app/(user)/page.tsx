import Footer from "@/components/Footer";
import Testimonials from "@/components/Homepage/Testimonials";
import Hero from "@/components/Homepage/Hero";
import Features from "@/components/Homepage/Features";
import { Metadata } from "next";
import { getServerUrl } from "@/utils/get-server-url";

const baseUrl = getServerUrl();

const PAGE_TITLE = "Capybook - Votre compagnon de lecture";
const PAGE_DESCRIPTION = "Capybook est votre compagnon de lecture ultime, vous aidant à suivre vos livres, à découvrir de nouvelles lectures et à partager vos expériences littéraires.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: baseUrl,
    siteName: "CapyBook",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CapyBook - Votre compagnon de lecture",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["/twitter-image.png"],
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function Home() {
  // Structured Data (JSON-LD) for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CapyBook",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "description": PAGE_DESCRIPTION,
    "url": baseUrl,
    "logo": `${baseUrl}/web-app-manifest-512x512.png`,
    "screenshot": `${baseUrl}/opengraph-image.png`,
    "featureList": [
      "Suivi de progression de lecture",
      "Bibliothèque personnelle de livres",
      "Critiques et avis de livres",
      "Défis de lecture",
      "Livre du jour",
      "Statistiques de lecture",
      "Partage avec la communauté"
    ],
    "inLanguage": "fr-FR"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />

      <Features />

      <Testimonials />

      <Footer />
    </>
  )
}
