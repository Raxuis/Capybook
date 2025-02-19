"use client";

import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Layout} from "@/components/Layout";

export default function Header() {

    return (
        <header
            className="fixed top-0 left-0 w-full backdrop-blur-lg border-b border-gray-200"
        >
            <Layout className="flex flex-row items-center justify-between">
                <Link href="/" className="flex items-center gap-3 font-manrope text-2xl font-bold text-gray-900">
                    <Image src="/icon.png" alt="Livre Track Icon" width={40} height={40}
                           className="rounded-lg shadow-md"/>
                    Livre Track
                </Link>
                <Button variant="outline" className="text-gray-900 border-gray-300 hover:bg-gray-100">
                    Se connecter
                </Button>
            </Layout>
        </header>
    );
}
