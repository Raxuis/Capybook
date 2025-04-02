"use client";

import Footer from "@/components/Footer";
import Testimonials from "@/components/Homepage/Testimonials";
import Hero from "@/components/Homepage/Hero";
import Features from "@/components/Homepage/Features";

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