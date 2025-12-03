import type {Metadata, Viewport} from "next";
import {Inter, Manrope} from "next/font/google";
import React from "react";
import {SessionProvider} from "next-auth/react";
import {SWRProvider} from "@/providers/swr-providers";
import {BadgeQueueProvider} from "@/Context/BadgeQueueContext";
import {NuqsAdapter} from "nuqs/adapters/next/app";
import {ViewTransitions} from "next-view-transitions";
import NextTopLoader from "nextjs-toploader";
import {Toaster} from "@/components/ui/toaster";
import {PWAProvider} from "@/components/PWA/PWAProvider";
import {CookieConsentBanner} from "@/components/CookieConsent/CookieConsentBanner";
import {getServerUrl} from "@/utils/get-server-url";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const manrope = Manrope({
    variable: "--font-manrope",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
});

const baseUrl = getServerUrl();

const DEFAULT_TITLE = "CapyBook 📕🦫 - Votre compagnon de lecture";
const DEFAULT_DESCRIPTION = "La façon la plus simple de suivre votre progression en lecture. Suivez vos livres, découvrez de nouvelles lectures et partagez vos expériences littéraires.";
const TWITTER_DESCRIPTION = "La façon la plus simple de suivre votre progression en lecture.";

export const metadata: Metadata = {
    title: {
        default: DEFAULT_TITLE,
        template: "%s | CapyBook",
    },
    description: DEFAULT_DESCRIPTION,
    metadataBase: new URL(baseUrl),
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Capybook",
    },
    applicationName: "Capybook",
    keywords: [
        "lecture",
        "livres",
        "reading",
        "books",
        "tracker",
        "bibliothèque",
        "suivi de lecture",
        "book tracker",
        "reading tracker",
        "livres français",
        "critiques de livres",
        "book reviews",
        "challenges de lecture",
        "reading challenges",
    ],
    authors: [{name: "CapyBook Team"}],
    creator: "CapyBook",
    publisher: "CapyBook",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    icons: {
        icon: [
            {url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png"},
            {url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png"},
        ],
        apple: [
            {url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png"},
        ],
    },
    openGraph: {
        type: "website",
        locale: "fr_FR",
        url: baseUrl,
        siteName: "CapyBook",
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        images: [
            {
                url: "/opengraph-image.png",
                width: 1200,
                height: 630,
                alt: "CapyBook - Votre compagnon de lecture",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: DEFAULT_TITLE,
        description: TWITTER_DESCRIPTION,
        images: ["/twitter-image.png"],
        creator: "@capybook",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: baseUrl,
    },
    category: "education",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
        <body className={`${inter.variable} ${manrope.variable} antialiased`}>
        <SessionProvider>
            <SWRProvider>
                <BadgeQueueProvider>
                    <NuqsAdapter>
                        <ViewTransitions>
                            <PWAProvider>
                                {children}
                                <NextTopLoader
                                    color="#7a31c0"
                                    initialPosition={0.08}
                                    crawlSpeed={200}
                                    height={3}
                                    crawl={true}
                                    showSpinner={false}
                                    easing="ease"
                                    speed={200}
                                    shadow="0 0 10px #2299DD,0 0 5px #2299DD"
                                />
                                <Toaster/>
                                <CookieConsentBanner/>
                            </PWAProvider>
                        </ViewTransitions>
                    </NuqsAdapter>
                </BadgeQueueProvider>
            </SWRProvider>
        </SessionProvider>
        </body>
        </html>
    );
}
