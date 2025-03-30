import React from 'react';
import type {Metadata} from "next";
import {auth} from "@/auth";
import DashboardContent from '@/components/Dashboard/DashboardContent';
import ClientHydration from "@/hydratation/ClientHydratation";

export const metadata: Metadata = {
    title: "Livre Track Dashboard",
    description: "Le tableau de bord de Livre Track",
};

export default async function BookShelf() {
    const session = await auth();
    return (
        <ClientHydration userId={session?.user?.id}>
            <DashboardContent/>
        </ClientHydration>
    );
}