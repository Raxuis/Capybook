import React from 'react';
import type {Metadata} from "next";
import {auth} from "@/auth";
import DashboardContent from '@/components/Dashboard/DashboardContent';

export const metadata: Metadata = {
    title: "Livre Track Dashboard",
    description: "Le tableau de bord de Livre Track",
};

export default async function Dashboard() {
    const session = await auth();

    return <DashboardContent userId={session?.user?.id}/>;
}