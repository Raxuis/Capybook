import type {Metadata} from "next";
import {Inter, Manrope} from "next/font/google";
import "./globals.css";
import React from "react";
import {Layout} from "@/components/Layout";
import Header from "../components/Header";
import Dock from "@/components/Dock";

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
    description: "A simple way to track your reading progress.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${inter.variable} ${manrope.variable} antialiased`}
        >
        <Layout className="flex flex-col min-h-screen min-w-screen">
            <Header/>
            {children}
            <Dock/>
        </Layout>
        </body>
        </html>
    );
}
