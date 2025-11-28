"use client";

import {useEffect, ReactNode} from "react";
import {useUserStore} from "@/store/useUserStore";

interface ClientHydrationProps {
    userId?: string;
    children: ReactNode;
}

export default function ClientHydration({userId, children}: ClientHydrationProps) {
    const setUserId = useUserStore((state) => state.setUserId);

    useEffect(() => {
        if (userId) {
            setUserId(userId);
        }
    }, [userId, setUserId]);

    return <>{children}</>;
}
