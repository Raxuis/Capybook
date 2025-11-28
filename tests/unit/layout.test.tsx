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
    <>{children}</>
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
    <>{children}</>
  ),
}));

// Mock nextjs-toploader
vi.mock('nextjs-toploader', () => ({
  default: () => <div data-testid="top-loader">TopLoader</div>,
}));

// Mock Header component
vi.mock('@/components/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

// Mock Dock component
vi.mock('@/components/Dock', () => ({
  default: () => <div data-testid="dock">Dock</div>,
}));

// Mock Toaster component
vi.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

// Mock SWRProvider
vi.mock('@/providers/swr-providers', () => ({
  SWRProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
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
    <>{children}</>
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
    // The children should be rendered within the layout
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    // Verify the layout structure components (root layout only has Toaster and TopLoader)
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
    expect(screen.getByTestId('top-loader')).toBeInTheDocument();
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
    expect(html.getAttribute('lang')).toBe('fr');
  });

  it('should apply correct font classes', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    const body = document.body;
    // Check for font variable classes
    expect(body.className).toContain('--font-inter');
    expect(body.className).toContain('--font-manrope');
    expect(body.className).toContain('antialiased');
  });

  it('should render children within providers', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    // Children should be rendered
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    // Providers should be present (mocked)
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });
});
