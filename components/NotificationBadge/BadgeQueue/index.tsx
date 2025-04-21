import React, {useEffect, useState} from 'react';
import BadgeNotification from '../index';

interface Badge {
    name: string;
    ownerDescription: string;
    publicDescription?: string;
    category: string;
    requirement?: number;
    icon: string | React.ReactNode;
}

interface BadgeQueueProps {
    badges: Badge[];
}

export default function BadgeQueue({badges}: BadgeQueueProps) {
    const [queue, setQueue] = useState<Badge[]>([]);
    const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);

    useEffect(() => {
        if (badges.length > 0) {
            setQueue((prev) => [...prev, ...badges]);
        }
    }, [badges]);

    useEffect(() => {
        if (!currentBadge && queue.length > 0) {
            const [next, ...rest] = queue;
            setCurrentBadge(next);
            setQueue(rest);
        }
    }, [queue, currentBadge]);

    const handleClose = () => {
        setCurrentBadge(null); // ce déclenche une nouvelle popup s’il reste des badges
    };

    return (
        <>
            {currentBadge && (
                <BadgeNotification
                    badge={currentBadge}
                    showConfetti
                    onClose={handleClose}
                    autoCloseDelay={5000}
                />
            )}
        </>
    );
}
