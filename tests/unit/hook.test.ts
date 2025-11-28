import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

// Mock next-auth/react
let mockSessionData: any = null;
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: mockSessionData,
    status: mockSessionData ? 'authenticated' : 'unauthenticated',
  }),
}));

// Mock zustand store
let mockIsAuthenticated = false;
const mockSetAuthenticated = vi.fn((value: boolean) => {
  mockIsAuthenticated = value;
});

vi.mock('@/store/userStore', () => ({
  userStore: vi.fn((selector: (state: any) => any) => {
    const state = {
      isAuthenticated: mockIsAuthenticated,
      setAuthenticated: mockSetAuthenticated,
    };
    return selector(state);
  }),
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = false;
    mockSessionData = null;
  });

  it('should return authentication state', () => {
    mockSessionData = null;

    const { result } = renderHook(() => useAuth());

    expect(result.current).toHaveProperty('isAuthenticated');
    expect(result.current).toHaveProperty('setAuthenticated');
  });

  it('should set authenticated to true when session exists', async () => {
    mockSessionData = {
      user: {
        name: 'Test User',
        email: 'test@example.com',
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    renderHook(() => useAuth());

    await waitFor(() => {
      expect(mockSetAuthenticated).toHaveBeenCalledWith(true);
    });
  });

  it('should set authenticated to false when session is null', async () => {
    mockSessionData = null;

    renderHook(() => useAuth());

    await waitFor(() => {
      expect(mockSetAuthenticated).toHaveBeenCalledWith(false);
    });
  });

  it('should update authentication state when session changes', async () => {
    // Initially no session
    mockSessionData = null;

    const { rerender } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(mockSetAuthenticated).toHaveBeenCalledWith(false);
    });

    // Session appears
    mockSessionData = {
      user: {
        name: 'Test User',
        email: 'test@example.com',
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    rerender();

    await waitFor(() => {
      expect(mockSetAuthenticated).toHaveBeenCalledWith(true);
    });
  });
});
