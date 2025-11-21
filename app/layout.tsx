import type {Metadata} from "next";
import {Inter, Manrope} from "next/font/google";
import React from "react";
import {SessionProvider} from "next-auth/react";
import {SWRProvider} from "@/providers/swr-providers";
import {BadgeQueueProvider} from "@/Context/BadgeQueueContext";
import {NuqsAdapter} from "nuqs/adapters/next/app";
import {ViewTransitions} from "next-view-transitions";
import NextTopLoader from "nextjs-toploader";
import {Toaster} from "@/components/ui/toaster";
import {getServerUrl} from "@/utils/get-server-url";
import Head from "next/head";
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

export const metadata: Metadata = {
    title: "CapyBook 📕🦫",
    description: "La façon la plus simple de suivre votre progression en lecture.",
    metadataBase: new URL(getServerUrl())
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider>
            <SWRProvider>
                <BadgeQueueProvider>
                    <NuqsAdapter>
                        <ViewTransitions>
                            <Head>
                                <meta name="apple-mobile-web-app-title" content="Capybook"/>
                                <link rel="manifest" href="/manifest.json"/>
                            </Head>
                            <html lang="en">
                            <body className={`${inter.variable} ${manrope.variable} antialiased`}>
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
                            </body>
                            </html>
                        </ViewTransitions>
                    </NuqsAdapter>
                </BadgeQueueProvider>
            </SWRProvider>
        </SessionProvider>
    );
}