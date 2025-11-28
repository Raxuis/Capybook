import React from 'react';
import {Metadata} from 'next';
import {auth} from '@/auth';
import DailyBook from "@/components/DailyBook/DailyBook";

export const metadata: Metadata = {
    title: "Capybook Livre Du Jour",
    description: "Découvrez le livre du jour sur Capybook, une nouvelle fonctionnalité pour enrichir votre expérience de lecture."
};

export default async function BookShelf() {
    const session = await auth();
    return (
        <DailyBook user={session?.user || null}/>
    );
}