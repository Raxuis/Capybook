import React from 'react';
import {Metadata} from 'next';
import {auth} from '@/auth';
import ClientHydration from "@/hydratation/ClientHydratation";
import DailyBook from "@/components/DailyBook/DailyBook";

export const metadata: Metadata = {
    title: "Capybook Journal Quotidien",
    description: "Le journal quotidien de Capybook",
};

export default async function BookShelf() {
    const session = await auth();
    return (
        <ClientHydration userId={session?.user?.id}>
            <DailyBook/>
        </ClientHydration>
    );
}