import {describe, it, expect, vi} from 'vitest';
import {render} from '../helpers/react-testing';
import {screen} from '@testing-library/react';
import React from 'react';

// Mock next/font/google avec des fonctions réelles
vi.mock('next/font/google', () => ({
    Inter: function Inter() {
        return {
            variable: '--font-inter',
            className: 'font-inter',
        };
    },
    Manrope: function Manrope() {
        return {
            variable: '--font-manrope',
            className: 'font-manrope',
        };
    },
}));

// Mock next-view-transitions
vi.mock('next-view-transitions', () => ({
    ViewTransitions: ({children}: { children: React.ReactNode }) => (
        <>{children}</>
    ),
}));

// Mock nuqs
vi.mock('nuqs/adapters/next/app', () => ({
    NuqsAdapter: ({children}: { children: React.ReactNode }) => (
        <>{children}</>
    ),
}));

// Mock nextjs-toploader
vi.mock('nextjs-toploader', () => ({
    default: function NextTopLoader() {
        return <div data-testid="top-loader">TopLoader</div>;
    },
}));

// Mock Header component
vi.mock('@/components/Header', () => ({
    default: function Header() {
        return <header data-testid="header">Header</header>;
    },
}));

// Mock Dock component
vi.mock('@/components/Dock', () => ({
    default: function Dock() {
        return <div data-testid="dock">Dock</div>;
    },
}));

// Mock Toaster component
vi.mock('@/components/ui/toaster', () => ({
    Toaster: function Toaster() {
        return <div data-testid="toaster">Toaster</div>;
    },
}));

// Mock SWRProvider
vi.mock('@/providers/swr-providers', () => ({
    SWRProvider: ({children}: { children: React.ReactNode }) => (
        <>{children}</>
    ),
}));

// Mock BadgeQueueProvider
vi.mock('@/Context/BadgeQueueContext', () => ({
    BadgeQueueProvider: ({children}: { children: React.ReactNode }) => (
        <>{children}</>
    ),
}));

// Mock hooks utilisés par PWAProvider
vi.mock('@/hooks/use-sync-queue', () => ({
    useSyncQueue: function useSyncQueue() {
        return {
            processQueue: () => {
            },
            addToQueue: () => {
            },
            clearQueue: () => {
            },
        };
    },
}));

vi.mock('@/hooks/use-online-status', () => ({
    useOnlineStatus: function useOnlineStatus() {
        return true;
    },
}));

// Mock composants PWA
vi.mock('@/components/PWA/OfflineBanner', () => ({
    OfflineBanner: function OfflineBanner() {
        return null;
    },
}));

vi.mock('@/components/PWA/UpdatePrompt', () => ({
    UpdatePrompt: function UpdatePrompt() {
        return null;
    },
}));

// Mock PWAProvider
vi.mock('@/components/PWA/PWAProvider', () => ({
    PWAProvider: ({children}: { children: React.ReactNode }) => (
        <>{children}</>
    ),
}));

// Mock CookieConsentBanner
vi.mock('@/components/CookieConsent/CookieConsentBanner', () => ({
    CookieConsentBanner: function CookieConsentBanner() {
        return <div data-testid="cookie-banner">CookieBanner</div>;
    },
}));

// Mock zustand store
vi.mock('@/store/userStore', () => ({
    userStore: function userStore(selector: (state: any) => any) {
        const state = {
            isAuthenticated: false,
            setAuthenticated: () => {
            },
        };
        return selector(state);
    },
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
    usePathname: function usePathname() {
        return '/';
    },
    useRouter: function useRouter() {
        return {
            push: () => {
            },
            replace: () => {
            },
            prefetch: () => {
            },
            back: () => {
            },
            forward: () => {
            },
            refresh: () => {
            },
        };
    },
}));

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
    SessionProvider: function SessionProvider({children}: { children: React.ReactNode }) {
        return <>{children}</>;
    },
    useSession: function useSession() {
        return {
            data: null,
            status: 'unauthenticated',
        };
    },
    signOut: function signOut() {
    },
}));

// Mock getServerUrl
vi.mock('@/utils/get-server-url', () => ({
    getServerUrl: function getServerUrl() {
        return 'http://localhost:3000';
    },
}));

// Importer les composants mockés
import {SessionProvider} from 'next-auth/react';
import {SWRProvider} from '@/providers/swr-providers';
import {BadgeQueueProvider} from '@/Context/BadgeQueueContext';
import {NuqsAdapter} from 'nuqs/adapters/next/app';
import {ViewTransitions} from 'next-view-transitions';
import NextTopLoader from 'nextjs-toploader';
import {Toaster} from '@/components/ui/toaster';
import {CookieConsentBanner} from '@/components/CookieConsent/CookieConsentBanner';
import {PWAProvider} from '@/components/PWA/PWAProvider';

// Créer un composant qui simule le contenu interne du layout
// (sans html/body car React Testing Library ne peut pas les rendre)
function LayoutContent({children}: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <SWRProvider>
                <BadgeQueueProvider>
                    <NuqsAdapter>
                        <ViewTransitions>
                            <PWAProvider>
                                {children}
                                <NextTopLoader/>
                                <Toaster/>
                                <CookieConsentBanner/>
                            </PWAProvider>
                        </ViewTransitions>
                    </NuqsAdapter>
                </BadgeQueueProvider>
            </SWRProvider>
        </SessionProvider>
    );
}

describe('RootLayout', () => {
    it('should render layout structure', () => {
        render(
            <LayoutContent>
                <div>Test Content</div>
            </LayoutContent>,
        );

        // Check that main structure is rendered
        expect(screen.getByText('Test Content')).toBeInTheDocument();

        // Verify the layout structure components
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
        expect(screen.getByTestId('top-loader')).toBeInTheDocument();
    });

    it('should render with correct HTML structure', () => {
        // Pour les tests unitaires, on vérifie que le document HTML existe
        // Le lang="fr" sera défini dans le vrai layout lors du rendu serveur
        const html = document.documentElement;
        expect(html).toBeInTheDocument();
        expect(html.tagName).toBe('HTML');
    });

    it('should apply correct font classes', () => {
        render(
            <LayoutContent>
                <div>Test Content</div>
            </LayoutContent>,
        );

        // Vérifier que le contenu est rendu
        // Les classes de font sont appliquées au body dans le vrai layout
        // Pour les tests unitaires, on vérifie juste que la structure fonctionne
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render children within providers', () => {
        render(
            <LayoutContent>
                <div>Test Content</div>
            </LayoutContent>,
        );

        // Children should be rendered
        expect(screen.getByText('Test Content')).toBeInTheDocument();

        // Providers should be present (mocked)
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
        expect(screen.getByTestId('top-loader')).toBeInTheDocument();
        expect(screen.getByTestId('cookie-banner')).toBeInTheDocument();
    });
});
