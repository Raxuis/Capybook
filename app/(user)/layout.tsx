import React from "react";
import Header from "@/components/Header";
import Dock from "@/components/Dock";

export default function UserLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen min-w-screen flex flex-col">
            <Header/>
            {children}
            <Dock/>
        </div>
    );
}