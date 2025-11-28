import React from "react";
import Header from "@/components/Header";
import Dock from "@/components/Dock";
import LendingRequestsManager from "@/managers/LendingRequestManager";

export default function UserLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-w-screen flex min-h-screen flex-col">
            <Header/>
            {children}
            <Dock/>
            <LendingRequestsManager/>
        </div>
    );
}