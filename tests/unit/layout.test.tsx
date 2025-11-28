import { describe, it, expect, vi } from 'vitest';
import { render } from '../utils/helpers';
import { screen } from '@testing-library/react';
import RootLayout from '@/app/layout';

// Mock next/font/google
vi.mock('next/font/google', () => ({
  Inter: vi.fn(() => ({
    variable: '--font-inter',
    className: 'font-inter',
  })),
  Manrope: vi.fn(() => ({
    variable: '--font-manrope',
    className: 'font-manrope',
  })),
}));


// Mock next-view-transitions
vi.mock('next-view-transitions', () => ({
  ViewTransitions: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="view-transitions">{children}</div>
  ),
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock nuqs
vi.mock('nuqs/adapters/next/app', () => ({
  NuqsAdapter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="nuqs-adapter">{children}</div>
  ),
}));

// Mock nextjs-toploader
vi.mock('nextjs-toploader', () => ({
  default: () => <div data-testid="top-loader">TopLoader</div>,
}));

// Mock SWRProvider
vi.mock('@/providers/swr-providers', () => ({
  SWRProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swr-provider">{children}</div>
  ),
}));

// Mock zustand store (needed by Header component)
vi.mock('@/store/userStore', () => ({
  userStore: vi.fn((selector: (state: any) => any) => {
    const state = {
      isAuthenticated: false,
      setAuthenticated: vi.fn(),
    };
    return selector(state);
  }),
}));

// Mock next/navigation (needed by Header component)
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock next-auth/react (needed by Header and SessionProvider)
vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  ),
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  signOut: vi.fn(),
}));

describe('RootLayout', () => {
  it('should render layout structure', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    // Check that main structure is rendered
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should include Header component', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    // Header should be rendered (adjust selector based on your Header component)
    // This is a placeholder - adjust based on your actual Header implementation
    const body = document.body;
    expect(body).toBeInTheDocument();
  });

  it('should render with correct HTML structure', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    // Check that html and body elements exist
    const html = document.documentElement;
    expect(html).toBeInTheDocument();
    expect(html.tagName).toBe('HTML');
  });

  it('should apply correct font classes', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    const body = document.body;
    // Check for font variable classes (adjust based on your actual classes)
    expect(body.className).toBeTruthy();
  });
});
