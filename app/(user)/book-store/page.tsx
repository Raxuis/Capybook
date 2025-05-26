import React from 'react';
import type {Metadata} from "next";
import {auth} from "@/auth";
import ClientHydration from "@/hydratation/ClientHydratation";
import BookStore from "@/components/BookStore/BookStore";

export const metadata: Metadata = {
    title: "Capybook Librairie",
    description: "La librairie de Capybook",
};

export default async function BookShelf() {
    const session = await auth();
    return (
        <ClientHydration userId={session?.user?.id}>
            <BookStore/>
        </ClientHydration>
    );
}