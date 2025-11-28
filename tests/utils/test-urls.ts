/**
 * Centralized route constants for testing
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  BOOK_STORE: '/book-store',
  BOOK_SHELF: '/book-shelf',
  DASHBOARD: '/dashboard',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
