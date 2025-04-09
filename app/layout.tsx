import type {Metadata} from "next";
import {Inter, Manrope} from "next/font/google";
import "./globals.css";
import React from "react";
import NextTopLoader from 'nextjs-toploader';
import Header from "../components/Header";
import Dock from "@/components/Dock";
import {ViewTransitions} from 'next-view-transitions'
import {Toaster} from "@/components/ui/toaster";
import {SessionProvider} from "next-auth/react";
import {NuqsAdapter} from 'nuqs/adapters/next/app'
import {SWRProvider} from "@/providers/swr-providers";


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
    title: "Livre Track 📕",
    description: "La façon la plus simple de suivre votre progression en lecture.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider>
            <SWRProvider>
                <NuqsAdapter>
                    <ViewTransitions>
                        <html lang="en">
                        <body
                            className={`${inter.variable} ${manrope.variable} antialiased`}
                        >
                        <div className="min-h-screen flex flex-col">
                            <Header/>
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
                            <Dock/>
                            <Toaster/>
                        </div>
                        </body>
                        </html>
                    </ViewTransitions>
                </NuqsAdapter>
            </SWRProvider>
        </SessionProvider>
    );
}
