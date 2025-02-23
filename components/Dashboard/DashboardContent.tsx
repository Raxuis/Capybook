'use client';

import React from 'react';
import {useUser} from "@/hooks/useUser";

interface DashboardContentProps {
    userId?: string;
}

export default function DashboardContent({userId}: DashboardContentProps) {
    const {user} = useUser(userId);

    if (!user) {
        return <div>Chargement...</div>;
    }

    console.log(user);

    return (
        <div>
            Dashboard
            <div>
                <h1>Bonjour {user.username}</h1>
            </div>
        </div>
    );
}