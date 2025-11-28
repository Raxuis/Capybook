# Testing Setup Guide

This project uses a comprehensive testing setup with **Playwright** for end-to-end (E2E) testing and **Vitest + React Testing Library** for unit and component testing.

## Quick Start

### Installation

Install all required dependencies:

```bash
pnpm add -D \
  playwright \
  @playwright/test \
  vitest \
  @vitest/ui \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  happy-dom \
  @vitejs/plugin-react \
  eslint-plugin-playwright \
  eslint-plugin-testing-library
```

**Note**:
- The config file is named `vitest.config.mts` (not `.ts`) to ensure proper ESM support with Vitest 4.x
- We use `happy-dom` instead of `jsdom` for better ESM compatibility. If you prefer `jsdom`, you may encounter ESM compatibility issues with newer versions of dependencies.

Install Playwright browsers:

```bash
pnpm exec playwright install --with-deps
```

### Verify Installation

Run the test scripts to verify everything is set up correctly:

```bash
# Run unit tests
pnpm test:unit

# Run E2E tests (will start dev server automatically)
pnpm test:e2e
```

## Overview

### Test Stack

- **Playwright**: E2E testing across Chromium, Firefox, and WebKit browsers
- **Vitest**: Fast unit and component test runner
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM assertions
- **@testing-library/user-event**: User interaction simulation

## Directory Structure

```
/
├── tests/
│   ├── e2e/                    # Playwright E2E tests
│   │   ├── example.spec.ts      # Basic homepage tests
│   │   ├── navigation.spec.ts  # Navigation flow tests
│   │   ├── auth.spec.ts        # Authentication tests
│   │   └── metadata.spec.ts    # Metadata validation tests
│   ├── unit/                   # Vitest unit/component tests
│   │   ├── button.test.tsx     # Button component tests
│   │   ├── layout.test.tsx     # Layout component tests
│   │   └── hook.test.ts        # Custom hook tests
│   ├── utils/                  # Test utilities
│   │   ├── helpers.ts          # Shared helper functions
│   │   └── test-urls.ts        # Route constants
│   └── fixtures/               # Test data fixtures
│       └── test-users.ts       # Test user data
├── __mocks__/                   # Next.js API mocks
│   ├── next/
│   │   ├── navigation.ts       # Mock Next.js router
│   │   └── headers.ts          # Mock Next.js headers API
├── playwright.config.ts         # Playwright configuration
├── vitest.config.mts            # Vitest configuration
└── setupTests.ts               # Vitest setup file
```

## App Router Testing Considerations

This project uses Next.js App Router, which has specific testing considerations:

### Server Components vs Client Components

- **Server Components** (default): Rendered on the server, cannot use hooks or browser APIs
- **Client Components** (marked with `"use client"`): Can use hooks, state, and browser APIs

### Testing Strategies

1. **E2E Tests (Playwright)**: Test the full application flow including SSR, client-side navigation, and API routes
2. **Component Tests (Vitest + RTL)**: Test individual components in isolation
3. **Unit Tests (Vitest)**: Test utilities, hooks, and pure functions

### Metadata Testing

App Router uses `generateMetadata` functions for dynamic metadata. Playwright tests can validate:
- Document title
- Meta tags
- Open Graph tags
- Structured data

## Configuration

### Playwright Configuration

The `playwright.config.ts` file is configured with:

- **Base URL**: Uses `NEXT_PUBLIC_SITE_URL` environment variable or defaults to `http://localhost:3000`
- **Test Directory**: `./tests/e2e`
- **Retries**: 1 retry in CI, 0 locally
- **Trace**: Retained on failure for debugging
- **Web Server**: Automatically starts Next.js dev server before tests
- **Browsers**: Chromium, Firefox, and WebKit

### Vitest Configuration

The `vitest.config.mts` file is configured with:

- **Environment**: `jsdom` for browser-like testing
- **Setup Files**: `setupTests.ts` for global test configuration
- **Path Aliases**: `@/*` resolves to project root
- **React Plugin**: For JSX/TSX transformation

## Running Tests

### Unit and Component Tests

```bash
# Run all unit tests once
pnpm test:unit

# Run tests in watch mode
pnpm test:unit:watch

# Or use the shorthand
pnpm test
```

### E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run E2E tests in UI mode (interactive)
pnpm test:e2e:ui

# View test report
pnpm test:e2e:report
```

### Running Specific Tests

```bash
# Run a specific test file
pnpm test:unit tests/unit/button.test.tsx

# Run tests matching a pattern
pnpm test:unit -t "button"

# Run a specific Playwright test
pnpm test:e2e tests/e2e/auth.spec.ts
```

## Example Tests Explained

### E2E Tests

#### `example.spec.ts`

Tests the basic homepage functionality:
- Page loads successfully
- Correct title from metadata
- Meta description is present
- Main content is rendered
- Client component interactivity

#### `navigation.spec.ts`

Tests App Router navigation:
- Link-based navigation
- Route changes
- Client-side navigation
- Browser back/forward buttons

#### `auth.spec.ts`

Tests authentication flows:
- Redirect to login when unauthenticated
- Login form display
- Successful login
- Invalid credentials handling
- Authenticated session management

#### `metadata.spec.ts`

Tests metadata generation:
- Document title
- Meta description
- Open Graph tags
- Viewport settings
- Charset and lang attributes

### Unit/Component Tests

#### `button.test.tsx`

Tests the Button component:
- Rendering
- Click events
- Disabled state
- Variants and sizes
- Accessibility attributes

#### `layout.test.tsx`

Tests the RootLayout component:
- Layout structure
- Provider wrapping
- HTML structure
- Font classes

#### `hook.test.ts`

Tests the `useAuth` custom hook:
- Authentication state
- Session handling
- State updates on session changes

## Writing New Tests

### Writing E2E Tests

1. Create a new file in `tests/e2e/` with `.spec.ts` extension
2. Import Playwright test utilities:
   ```typescript
   import { test, expect } from '@playwright/test';
   ```
3. Use helper functions from `tests/utils/helpers.ts`:
   ```typescript
   import { navigateTo, login } from '../utils/helpers';
   import { ROUTES } from '../utils/test-urls';
   ```
4. Write test cases:
   ```typescript
   test('should do something', async ({ page }) => {
     await page.goto(ROUTES.HOME);
     // ... test assertions
   });
   ```

### Writing Component Tests

1. Create a new file in `tests/unit/` with `.test.tsx` extension
2. Import testing utilities:
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { render, screen } from '../utils/helpers';
   import userEvent from '@testing-library/user-event';
   ```
3. Use the `render` helper which includes all providers:
   ```typescript
   render(<YourComponent />);
   ```
4. Write test cases:
   ```typescript
   it('should render correctly', () => {
     render(<YourComponent />);
     expect(screen.getByText('Hello')).toBeInTheDocument();
   });
   ```

### Writing Hook Tests

1. Use `renderHook` from `@testing-library/react`:
   ```typescript
   import { renderHook } from '@testing-library/react';

   const { result } = renderHook(() => useYourHook());
   ```

## Mocking Next.js APIs

### Mocking `next/navigation`

The `__mocks__/next/navigation.ts` file provides mocks for:
- `useRouter()`
- `usePathname()`
- `useSearchParams()`
- `useParams()`
- `redirect()`
- `notFound()`

These are automatically used in Vitest tests when you import from `next/navigation`.

### Mocking `next/headers`

The `__mocks__/next/headers.ts` file provides mocks for:
- `headers()`
- `cookies()`
- `draftMode()`

### Using Mocks

```typescript
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

// The mock is automatically used
const router = useRouter();
router.push('/somewhere');
```

## Test Utilities

### Helper Functions

Located in `tests/utils/helpers.ts`:

- **`login(page, email, password)`**: Logs in a user in Playwright tests
- **`navigateTo(page, url)`**: Navigates and waits for page load
- **`waitForPage(page, url)`**: Waits for specific page to load
- **`render(ui, options)`**: Renders React components with all providers

### Route Constants

Located in `tests/utils/test-urls.ts`:

```typescript
import { ROUTES } from '../utils/test-urls';

await page.goto(ROUTES.HOME);
```

### Test Fixtures

Located in `tests/fixtures/test-users.ts`:

```typescript
import { TEST_USER } from '../fixtures/test-users';

await login(page, TEST_USER.email, TEST_USER.password);
```

## CI/CD Recommendations

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:unit

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm exec playwright install --with-deps
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Environment Variables

Set these in your CI environment:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Troubleshooting

### Slow SSR Cold Start

If tests are timing out due to slow Next.js startup:

1. Increase `webServer.timeout` in `playwright.config.ts`
2. Use `reuseExistingServer: true` to reuse a running dev server
3. Pre-warm the server before running tests

### App Router Dynamic Routes

When testing dynamic routes:

```typescript
// Use parameterized routes
await page.goto('/book/[id]'); // ❌ Wrong
await page.goto('/book/123');   // ✅ Correct
```

### Metadata Quirks

Metadata from `generateMetadata` is only available after the page loads:

```typescript
await page.goto('/');
await page.waitForLoadState('networkidle');
const title = await page.title();
```

### jsdom Limitations

jsdom doesn't support all browser APIs. Common issues:

- **ResizeObserver**: Mocked in `setupTests.ts`
- **IntersectionObserver**: Mocked in `setupTests.ts`
- **matchMedia**: Mocked in `setupTests.ts`
- **CSS animations**: Not supported, use `waitFor` instead of animation delays

### Playwright Timeouts

If tests are flaky:

1. Increase `actionTimeout` and `navigationTimeout` in `playwright.config.ts`
2. Use `page.waitForLoadState('networkidle')` after navigation
3. Use `page.waitForSelector()` for specific elements

### TypeScript Errors

If you see TypeScript errors:

1. Ensure `@types/node` and `@types/react` are installed
2. Check that `tsconfig.json` includes test files
3. Restart your TypeScript server

## Best Practices

1. **Test User Behavior**: Write tests from the user's perspective
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Keep Tests Isolated**: Each test should be independent
4. **Use Descriptive Names**: Test names should clearly describe what they test
5. **Avoid Testing Implementation Details**: Test what the user sees, not internal state
6. **Mock External Dependencies**: Mock API calls, external services, etc.
7. **Clean Up**: Use `afterEach` hooks to clean up test state
8. **Use Fixtures**: Reuse test data through fixtures

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Vitest Documentation](https://vitest.dev)
- [React Testing Library Documentation](https://testing-library.com/react)
- [Next.js Testing Documentation](https://nextjs.org/docs/app/building-your-application/testing)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review test output and error messages
3. Check that all dependencies are installed
4. Ensure the dev server is running for E2E tests
5. Verify environment variables are set correctly
