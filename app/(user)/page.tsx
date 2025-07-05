"use client";

import Footer from "@/components/Footer";
import Testimonials from "@/components/Homepage/Testimonials";
import Hero from "@/components/Homepage/Hero";
import Features from "@/components/Homepage/Features";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Capybook - Votre compagnon de lecture",
    description: "Capybook est votre compagnon de lecture ultime, vous aidant à suivre vos livres, à découvrir de nouvelles lectures et à partager vos expériences littéraires.",
};

export default function Home() {
    return (
        <>
            <main className="flex-1">
                <Hero/>

                <Features/>

                <Testimonials/>
            </main>

            <Footer/>
        </>
    )
}