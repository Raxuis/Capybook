import {ReactElement} from 'react';
import {render, RenderOptions} from '@testing-library/react';
import {SessionProvider} from 'next-auth/react';
import {SWRConfig} from 'swr';

/**
 * Create mock session for testing
 */
export function createMockSession() {
    return {
        user: {
            id: 'test-user-id',
            name: 'Test User',
            email: 'test@example.com',
            username: 'testuser',
            role: 'USER' as const,
            image: null,
            emailVerified: null,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
}

/**
 * Wrapper component with all providers
 */
interface AllTheProvidersProps {
    children: React.ReactNode;
    session?: ReturnType<typeof createMockSession> | null;
}

export function AllTheProviders({children, session}: AllTheProvidersProps) {
    const mockSession = session ?? createMockSession();

    return (
        <SessionProvider session={mockSession as Parameters<typeof SessionProvider>[0]['session']}>
            <SWRConfig value={{provider: () => new Map(), dedupingInterval: 0}}>
                {children}
            </SWRConfig>
        </SessionProvider>
    );
}

/**
 * Custom render with providers
 */
export function renderWithProviders(
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'> & {
        session?: ReturnType<typeof createMockSession> | null;
    },
) {
    const {session, ...renderOptions} = options ?? {};

    return render(ui, {
        wrapper: ({children}) => (
            <AllTheProviders session={session}>
                {children}
            </AllTheProviders>
        ),
        ...renderOptions
    });
}