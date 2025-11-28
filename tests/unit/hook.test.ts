import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUser } from '@/hooks/useUser';

// Mock SWR
const mockMutate = vi.fn();
let mockSWRReturn = {
  data: null,
  error: null,
  isLoading: false,
  isValidating: false,
  mutate: mockMutate,
};

vi.mock('swr', () => ({
  default: vi.fn(() => mockSWRReturn),
}));

// Mock zustand store
let mockUserId: string | undefined = 'test-user-id';

vi.mock('@/store/useUserStore', () => ({
  useUserStore: vi.fn((selector: (state: any) => any) => {
    const state = {
      userId: mockUserId,
      setUserId: vi.fn(),
    };
    return selector(state);
  }),
}));

// Mock fetcher
vi.mock('@/utils/fetcher', () => ({
  fetcher: vi.fn(),
}));

describe('useUser Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserId = 'test-user-id';
    mockSWRReturn = {
      data: null,
      error: null,
      isLoading: false,
      isValidating: false,
      mutate: mockMutate,
    };
  });

  it('should return user data structure', () => {
    const { result } = renderHook(() => useUser());

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('isValidating');
    expect(result.current).toHaveProperty('isError');
    expect(result.current).toHaveProperty('refreshUser');
  });

  it('should handle loading state', () => {
    mockSWRReturn = {
      data: null,
      error: null,
      isLoading: true,
      isValidating: false,
      mutate: mockMutate,
    };

    const { result } = renderHook(() => useUser());

    // isLoading should be true initially due to isInitializing
    expect(result.current.isLoading).toBe(true);
  });

  it('should handle error state', () => {
    mockSWRReturn = {
      data: null,
      error: new Error('Failed to fetch'),
      isLoading: false,
      isValidating: false,
      mutate: mockMutate,
    };

    const { result } = renderHook(() => useUser());

    expect(result.current.isError).toBe(true);
  });

  it('should provide refreshUser function', async () => {
    const { result } = renderHook(() => useUser());

    expect(typeof result.current.refreshUser).toBe('function');

    await result.current.refreshUser();

    expect(mockMutate).toHaveBeenCalled();
  });

  it('should handle undefined userId', () => {
    mockUserId = undefined;

    const { result } = renderHook(() => useUser());

    // When userId is undefined, swrKey is null, so SWR returns null for data
    expect(result.current.user).toBeNull();
  });
});
