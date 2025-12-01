# Test Plan - Capybook Application

## Overview

This document describes in detail the test plans implemented for the Capybook application, a Next.js reading management application. The tests cover both unit tests and end-to-end (E2E) tests.

---

## 1. Test Architecture

### 1.1 Test Types

The application uses two main types of tests:

- **Unit Tests**: Test individual components and hooks in isolation
- **End-to-End (E2E) Tests**: Test the complete application behavior in a real browser

### 1.2 Tools and Frameworks

#### Unit Tests

- **Vitest**: Main testing framework for unit tests
- **React Testing Library**: Library for testing React components
- **@testing-library/jest-dom**: Custom DOM matchers
- **@testing-library/user-event**: User interaction simulation
- **happy-dom**: Lightweight DOM environment for tests

#### E2E Tests

- **Playwright**: E2E testing framework with multi-browser support
- **Tested Browsers**: Chromium, Firefox, WebKit (Safari)

### 1.3 Directory Structure

```
tests/
├── e2e/              # End-to-end tests
│   ├── auth.spec.ts
│   ├── navigation.spec.ts
│   ├── metadata.spec.ts
│   ├── example.spec.ts
│   └── global-setup.ts
├── unit/             # Unit tests
│   ├── button.test.tsx
│   ├── hook.test.ts
│   └── layout.test.tsx
├── fixtures/         # Reusable test data
│   └── test-users.ts
└── utils/            # Test utilities
    ├── helpers.tsx
    └── test-urls.ts
```

---

## 2. Test Configuration

### 2.1 Vitest Configuration (`vitest.config.mts`)

- **Environment**: `happy-dom` (lightweight DOM simulation)
- **Setup File**: `setupTests.ts` (global configuration)
- **Globals**: Enabled for direct access to test functions
- **CSS**: Enabled for style testing
- **Exclusions**: `node_modules`, `dist`, `.next`, `tests/e2e`

### 2.2 Playwright Configuration (`playwright.config.ts`)

- **Timeout**: 30 seconds per test
- **Parallelization**: Enabled (disabled in CI)
- **Retry**: 2 attempts in CI, 0 locally
- **Workers**: 1 in CI, parallel locally
- **Viewport**: 1280x720
- **Base URL**: `http://localhost:3000`
- **Web Server**: Automatically starts the development server
- **Global Setup**: Creates a test user before test execution

### 2.3 Global Setup (`setupTests.ts`)

The setup file configures:

- Custom DOM matchers (`@testing-library/jest-dom`)
- Automatic cleanup after each test
- Global mocks:
    - `ResizeObserver`
    - `IntersectionObserver`
    - `window.matchMedia`
    - `window.scrollTo`

---

## 3. Unit Tests

### 3.1 Button Component (`button.test.tsx`)

**Objective**: Verify the proper functioning of the reusable Button component.

**Tested Elements**:

1. **Basic Rendering**: Button displays correctly with its text
2. **Event Handling**: The `onClick` handler is called on click
3. **Disabled State**: Button is disabled when `disabled={true}`
4. **Disabled Click Protection**: `onClick` is not called when button is disabled
5. **Variants**: Test all variants (`default`, `destructive`, `outline`, `ghost`)
6. **Sizes**: Test all sizes (`sm`, `lg`, `icon`)
7. **Accessibility**: Verification of ARIA attributes (`aria-label`)

**Techniques Used**:

- `render()` with React Testing Library
- `userEvent.click()` to simulate interactions
- `vi.fn()` (Vitest) to create function mocks
- `rerender()` to test different props

### 3.2 useUser Hook (`hook.test.ts`)

**Objective**: Verify the behavior of the custom `useUser` hook that manages user data.

**Tested Elements**:

1. **Return Structure**: The hook returns expected properties:
    - `user`: User data
    - `isLoading`: Loading state
    - `isValidating`: Validation state
    - `isError`: Error state
    - `refreshUser`: Refresh function
2. **Loading State**: `isLoading` is `true` during initial loading
3. **Error Handling**: `isError` is `true` when an error occurs
4. **refreshUser Function**: The `refreshUser` function calls SWR's `mutate`
5. **Undefined userId Handling**: The hook correctly handles the absence of user ID

**Techniques Used**:

- `renderHook()` from React Testing Library
- Mocks of `swr`, `zustand`, and `fetcher`
- Simulation of different states (loading, error, success)

### 3.3 Root Layout (`layout.test.tsx`)

**Objective**: Verify the rendering and structure of the application's root layout.

**Tested Elements**:

1. **Layout Structure**: Children are rendered correctly
2. **HTML Structure**: `html` and `body` elements are present with correct attributes
3. **Lang Attribute**: The `lang="fr"` attribute is set on the HTML element
4. **Font Classes**: Font classes (`--font-inter`, `--font-manrope`) are applied
5. **Rendering in Providers**: Child components are rendered in providers (SessionProvider, SWRConfig)

**Techniques Used**:

- Complete mocks of Next.js (`next/font/google`, `next-view-transitions`, `next/navigation`)
- Component mocks (`Header`, `Dock`, `Toaster`)
- DOM structure verification

---

## 4. End-to-End (E2E) Tests

### 4.1 Authentication Tests (`auth.spec.ts`)

**Objective**: Verify the complete authentication system of the application.

**Tested Elements**:

1. **Redirect to Login**:
    - Access to a protected route (`/book-shelf`) without authentication
    - Verification of redirect to `/login`

2. **Login Form Display**:
    - Presence of email field
    - Presence of password field
    - Presence of submit button
    - Use of flexible selectors (labels in French/English)

3. **Login Attempt**:
    - Fill fields with test credentials
    - Submit form
    - Verify navigation after login or error display

4. **Invalid Credentials Handling**:
    - Login attempt with incorrect credentials
    - Verify error message display
    - Verify user remains on login page

5. **Authenticated Session Management**:
    - Verify presence of session cookies
    - Access to protected routes when authenticated

**Techniques Used**:

- `page.goto()` to navigate
- `page.fill()` to fill forms
- `page.click()` to click
- `page.waitForURL()` to wait for navigation
- `page.waitForSelector()` to wait for elements
- `Promise.race()` to handle multiple cases

### 4.2 Navigation Tests (`navigation.spec.ts`)

**Objective**: Verify the application's navigation system.

**Tested Elements**:

1. **Navigation with App Router Link**:
    - Click on a navigation link
    - Verify navigation to target page
    - Use of `Promise.all()` to synchronize navigation and click

2. **Navigation to Different Pages**:
    - About page (`/about`)
    - Login page (`/login`)
    - Register page (`/register`)
    - Verify pages load correctly

3. **Client-Side Navigation**:
    - Navigation between multiple pages
    - Use of browser back button
    - Verify navigation history works

**Techniques Used**:

- `page.locator()` to find elements
- `page.waitForLoadState('domcontentloaded')` to wait for loading
- `page.goBack()` to test backward navigation
- URL verification with `expect(page.url()).toContain()`

### 4.3 Metadata Tests (`metadata.spec.ts`)

**Objective**: Verify SEO metadata and essential HTML tags.

**Tested Elements**:

1. **Homepage Metadata**:
    - Page title contains "Capybook"
    - Meta description contains relevant keywords

2. **Open Graph Tags**:
    - `og:title` (if present)
    - `og:description` (if present)
    - Verification of tag content

3. **Essential Meta Tags**:
    - `viewport` with `width=device-width`
    - `charset` set to `utf-8`
    - `lang="fr"` on HTML element

4. **Metadata Validation**:
    - Verify metadata is generated by `generateMetadata`
    - Verify presence of tags in HTML

**Techniques Used**:

- `page.locator('meta[...]')` to find meta tags
- `expect().toHaveAttribute()` to verify attributes
- `page.content()` to analyze complete HTML

### 4.4 Homepage Tests (`example.spec.ts`)

**Objective**: Verify the loading and rendering of the homepage.

**Tested Elements**:

1. **Page Loading**:
    - Page loads without error
    - URL is correct

2. **Page Title**:
    - Title contains "Capybook"

3. **Metadata**:
    - Meta description present
    - `main` element visible

4. **Component Rendering**:
    - Hero component is rendered
    - Main content is visible

5. **Interactivity**:
    - Page is interactive (client component)
    - Body is visible

**Techniques Used**:

- `page.waitForLoadState()` to wait for complete loading
- `page.locator('main')` to find main elements
- Visibility verification with `toBeVisible()`

### 4.5 Global Setup (`global-setup.ts`)

**Objective**: Prepare the test environment before E2E test execution.

**Features**:

1. **Test User Creation**:
    - Checks if test user already exists
    - Creates user if it doesn't exist
    - Updates password if user already exists

2. **Error Handling**:
    - Handles unique constraint errors (user already exists)
    - Doesn't interrupt tests on non-critical errors

3. **Database Connection**:
    - Uses Prisma to interact with database
    - Hashes password with `saltAndHashPassword`
    - Disconnects properly after operation

**Techniques Used**:

- Prisma for database operations
- Error handling with try/catch
- Logging for debugging

---

## 5. Utilities and Helpers

### 5.1 Test Helpers (`tests/utils/helpers.tsx`)

#### For Playwright (E2E)

1. **`login(page, email, password)`**:
    - Navigates to `/login`
    - Fills email and password fields
    - Submits form
    - Waits for navigation

2. **`navigateTo(page, url)`**:
    - Navigates to a URL
    - Waits for network to be idle

3. **`waitForPage(page, url)`**:
    - Waits for URL to be reached
    - Waits for DOM and network loading

#### For React Testing Library (Unit)

1. **`AllTheProviders`**:
    - Wrapper that provides all necessary providers:
        - `SessionProvider` (NextAuth) with mocked session
        - `SWRConfig` with test configuration

2. **`customRender`**:
    - Custom `render` function that uses `AllTheProviders`
    - Allows testing components that depend on providers

### 5.2 Fixtures (`tests/fixtures/test-users.ts`)

**Reusable Test Data**:

- `TEST_USER`: Main user for tests
- `TEST_USER_2`: Secondary user for multi-user tests

### 5.3 Route Constants (`tests/utils/test-urls.ts`)

**Centralized Routes**:

- All application routes are defined in a `ROUTES` object
- Facilitates maintenance and avoids typing errors

---

## 6. Test Strategies

### 6.1 Unit Tests

**Approach**:

- Complete component isolation
- Mocks of all external dependencies
- Fast and deterministic tests
- Focus on business logic

**Coverage**:

- Reusable UI components
- Custom hooks
- Layouts and base structures

### 6.2 E2E Tests

**Approach**:

- Tests in a production-like environment
- Use of a real browser
- Complete user flow tests
- Verification of integration between components

**Coverage**:

- Complete authentication
- Navigation between pages
- Metadata and SEO
- Loading of main pages

### 6.3 Test Data Management

**Test Users**:

- Automatic creation before E2E tests
- Reuse between tests
- Optional cleanup after tests

**Isolation**:

- Each E2E test is independent
- Use of fixtures for data
- No dependency between tests

---

## 7. Test Execution

### 7.1 Available Commands

```bash
# Unit tests
pnpm test              # Run tests in watch mode
pnpm test:unit         # Run tests once
pnpm test:unit:watch   # Run tests in watch mode

# E2E tests
pnpm test:e2e          # Run all E2E tests
pnpm test:e2e:ui       # Run tests with Playwright UI
pnpm test:e2e:report   # Display HTML test report
```

### 7.2 CI/CD Environment

**CI Configuration**:

- Automatic retry (2 attempts)
- Workers limited to 1 to avoid conflicts
- HTML and JSON report generation
- Screenshots and videos on failure
- Playwright traces for debugging

**Required Environment Variables**:

- `DATABASE_URL`: Database connection URL
- `NEXTAUTH_SECRET`: Secret for NextAuth
- `NEXTAUTH_URL`: Application URL

---

## 8. Tested Elements - Summary

### 8.1 Tested Features

✅ **Authentication**

- Login form
- Credential validation
- Error handling
- Redirect after login
- Route protection

✅ **Navigation**

- Navigation between pages
- Client-side navigation
- Browser history
- App Router links

✅ **Metadata and SEO**

- Page titles
- Meta descriptions
- Open Graph tags
- Essential HTML attributes

✅ **UI Components**

- Buttons with variants
- Disabled states
- Event handling
- Accessibility

✅ **Custom Hooks**

- State management (loading, error)
- SWR integration
- User data management

✅ **Layouts**

- HTML structure
- Providers
- Font configuration

### 8.2 Quality and Reliability

- **Isolation**: Each test is independent
- **Deterministic**: Tests produce the same results on each execution
- **Maintainable**: Organized and reusable test code
- **Documented**: Explicit comments and helpers
- **Robust**: Appropriate error handling and timeouts

---

## 9. Future Improvements

### 9.1 Tests to Add

- Form tests (validation, submission)
- API tests (Next.js API routes)
- Complex component tests (Dashboard, BookStore)
- Performance tests
- In-depth accessibility tests (a11y)

### 9.2 Optimizations

- Increase code coverage
- Automated regression tests
- Load tests for critical routes
- Visual tests (comparative screenshots)

---

## Conclusion

The Capybook application has a complete test suite covering:

- Unit tests for components and hooks
- E2E tests for critical user flows
- Robust and maintainable test infrastructure
- Reusable helpers and fixtures
- Configuration adapted for development and CI/CD

This testing strategy ensures the quality and reliability of the application while facilitating development and maintenance.
