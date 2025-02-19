"use client";

import Link from "next/link";
import Image from "next/image";
// import Dropdown from "@/components/Header/Dropdown";


export default function Header() {
    return (
        <div className="flex justify-between items-center py-4 px-4">
            <Link href="/" className="flex items-center gap-2 font-manrope text-2xl font-bold">
                <Image src="/icon.png" alt="Livre Track Icon" width={50} height={50}/>
                Livre Track
            </Link>
            {/*<Dropdown/>*/}
        </div>
    );
}
