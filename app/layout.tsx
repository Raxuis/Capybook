import type {Metadata} from "next";
import {Inter, Manrope} from "next/font/google";
import "./globals.css";
import React from "react";
import {Layout} from "@/components/Layout";
import Header from "../components/Header";
import Dock from "@/components/Dock";
import {ViewTransitions} from 'next-view-transitions'
import {Toaster} from "@/components/ui/toaster";
import {SessionProvider} from "next-auth/react";
import {NuqsAdapter} from 'nuqs/adapters/next/app'


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
            <NuqsAdapter>
                <ViewTransitions>
                    <html lang="en">
                    <body
                        className={`${inter.variable} ${manrope.variable} antialiased`}
                    >
                    <Layout className="flex flex-col min-h-screen min-w-screen relative pt-28">
                        <Header/>
                        {children}
                        <Dock/>
                        <Toaster/>
                    </Layout>
                    </body>
                    </html>
                </ViewTransitions>
            </NuqsAdapter>
        </SessionProvider>
    );
}
