import React from 'react';
import type {Metadata} from "next";
import {auth} from "@/auth";
import DashboardContentSimplified from '@/components/Dashboard/DashboardContentSimplified';
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import {DashboardLayout} from "@/components/Layout";
import DashboardContentStats from "@/components/Dashboard/DashboardContentStats";
import ClientHydration from "@/hydratation/ClientHydratation";

export const metadata: Metadata = {
    title: "Capybook Dashboard",
    description: "Le tableau de bord de Capybook",
};

export default async function BookShelf({searchParams}: {
    searchParams: { view?: string };
}) {
    const session = await auth();
    const showStatistics = searchParams.view === "statistics";

    return (
        <DashboardLayout>
            <ClientHydration userId={session?.user?.id}>
                <DashboardHeader showStatistics={showStatistics}/>
                {showStatistics ? <DashboardContentStats/> : <DashboardContentSimplified/>}
            </ClientHydration>
        </DashboardLayout>
    );
}
