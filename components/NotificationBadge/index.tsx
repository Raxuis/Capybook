import React, {useState, useEffect, useCallback} from 'react';
import {Award, X} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Badge {
    name: string;
    ownerDescription: string;
    publicDescription?: string;
    category: string;
    requirement?: number;
    icon: string | React.ReactNode;
}

interface BadgeNotificationProps {
    badge: Badge | null;
    showConfetti?: boolean;
    onClose?: () => void;
    autoCloseDelay?: number;
}

const triggerConfetti = (): void => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {startVelocity: 30, spread: 360, ticks: 60, zIndex: 0};

    const randomInRange = (min: number, max: number): number => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
            ...defaults,
            particleCount,
            origin: {x: randomInRange(0.1, 0.3), y: Math.random() - 0.2}
        });

        confetti({
            ...defaults,
            particleCount,
            origin: {x: randomInRange(0.7, 0.9), y: Math.random() - 0.2}
        });
    }, 250);
};

export default function BadgeNotification({
                                              badge,
                                              showConfetti = false,
                                              onClose,
                                              autoCloseDelay = 6000
                                          }: BadgeNotificationProps): React.ReactElement | null {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isClosing, setIsClosing] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);

        if (showConfetti) {
            setTimeout(triggerConfetti, 300);
        }

        // Auto-fermeture après délai
        const timer = setTimeout(() => {
            handleClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
    }, [autoCloseDelay, showConfetti]);

    const handleClose = useCallback((): void => {
        setIsClosing(true);
        setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            onClose && onClose();
        }, 500);
    }, [onClose]);

    if (!badge) return null;

    return (
        <div className={`fixed top-4 right-4 max-w-sm z-50 transform transition-all duration-500 ease-in-out ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } ${isClosing ? 'translate-x-full opacity-0' : ''}`}>
            <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
                <div className="flex p-4 items-start">
                    {/* Icône du badge */}
                    <div className="flex-shrink-0 bg-primary text-primary-foreground p-2 rounded-md mr-3">
                        <div className="text-xl">
                            {typeof badge.icon === 'string' ? badge.icon : badge.icon || <Award className="h-5 w-5"/>}
                        </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 pt-0.5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">
                                {badge.name}
                            </h3>
                            <button
                                onClick={handleClose}
                                className="ml-4 text-muted-foreground hover:text-foreground focus:outline-none"
                            >
                                <X className="h-4 w-4"/>
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {badge.ownerDescription}
                        </p>
                    </div>
                </div>

                {/* Barre de progression pour l'auto-fermeture */}
                <div className="h-1 bg-muted">
                    <div
                        className="h-full bg-primary animate-shrink"
                        style={{
                            animationDuration: `${autoCloseDelay / 1000}s`
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
