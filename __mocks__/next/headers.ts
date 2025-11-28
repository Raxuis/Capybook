import { vi } from 'vitest';

export const headers = vi.fn(() => {
  return new Headers();
});

export const cookies = vi.fn(() => {
  const cookieStore = {
    get: vi.fn(),
    set: vi.fn(),
    has: vi.fn(),
    delete: vi.fn(),
    getAll: vi.fn(() => []),
  };
  return cookieStore;
});

export const draftMode = vi.fn(() => ({
  isEnabled: false,
  enable: vi.fn(),
  disable: vi.fn(),
}));
