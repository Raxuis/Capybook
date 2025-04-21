"use client";

import React, {createContext, useContext, useState, useEffect} from "react";
import BadgeNotification from "@/components/NotificationBadge";

interface Badge {
    name: string;
    ownerDescription: string;
    publicDescription?: string;
    category: string;
    requirement?: number;
    icon: string | React.ReactNode;
}

interface BadgeQueueContextType {
    addBadges: (badges: Badge[]) => void;
}

const BadgeQueueContext = createContext<BadgeQueueContextType | undefined>(undefined);

export const useBadgeQueue = () => {
    const context = useContext(BadgeQueueContext);
    if (!context) throw new Error("useBadgeQueue must be used within a BadgeQueueProvider");
    return context;
};

export const BadgeQueueProvider = ({children}: { children: React.ReactNode }) => {
    const [queue, setQueue] = useState<Badge[]>([]);
    const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);

    const addBadges = (badges: Badge[]) => {
        console.log("Adding badges to queue:", badges);
        setQueue(prev => [...prev, ...badges]);
    };

    useEffect(() => {
        if (!currentBadge && queue.length > 0) {
            const [next, ...rest] = queue;
            setCurrentBadge(next);
            setQueue(rest);
        }
    }, [queue, currentBadge]);

    const handleClose = () => {
        setCurrentBadge(null);
    };

    return (
        <BadgeQueueContext.Provider value={{addBadges}}>
            {children}
            {currentBadge && (
                <BadgeNotification
                    badge={currentBadge}
                    showConfetti
                    onClose={handleClose}
                    autoCloseDelay={5000}
                />
            )}
        </BadgeQueueContext.Provider>
    );
};
