"use client";

import {Link} from "next-view-transitions";
import Image from "next/image";
import {Layout} from "@/components/Layout";
import {MagneticButton} from "@/components/Button/MagneticButton";
import {Button} from "@/components/ui/button";
import {Sparkles} from "lucide-react";
import {useSession} from "next-auth/react";
import {useRef} from "react";

export default function Header() {

    const session = useSession();
    const headerRef = useRef<HTMLElement>(null);

    return (
        <header
            ref={headerRef}
            className="fixed top-4 backdrop-blur-lg border border-gray-200 rounded-full max-w-5xl w-full mx-auto z-50"
        >
            <Layout className="flex flex-row items-center justify-between py-4 relative">
                <Link href="/" className="flex items-center gap-3 font-manrope text-2xl font-bold text-gray-900">
                    <Image src="/icon.png" alt="Livre Track Icon" width={40} height={40}
                           className="rounded-full p-1 shadow-md"/>
                    Livre Track
                </Link>
                <MagneticButton parentRef={headerRef}>
                    <Button
                        variant="outline"
                        asChild
                        className="relative overflow-hidden font-inter group p-6 rounded-full border border-gray-300 shadow-md transition-all duration-300 bg-white/30 backdrop-blur-md hover:shadow-lg hover:border-amber-500"
                    >
                        <Link href={
                            session.data ? "/dashboard" : "/login"
                        } className="flex items-center gap-2 font-semibold text-lg">
                            <span
                                className="relative z-10 text-gray-900 transition-colors duration-300 group-hover:text-amber-600">
                                Commencer l&#39;aventure
                            </span>
                            <Sparkles
                                className="relative z-10 -me-1 ms-2 opacity-70 transition-transform duration-300 group-hover:scale-110 group-hover:text-amber-600"
                                size={18}
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                            <span
                                className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-400 opacity-0 transition-opacity duration-500 group-hover:opacity-20"></span>
                        </Link>
                    </Button>
                </MagneticButton>
            </Layout>
        </header>
    );
}
