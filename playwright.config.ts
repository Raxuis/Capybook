import {defineConfig, devices} from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './tests/e2e',

    /* Maximum time one test can run for. */
    timeout: 60 * 1000, // Increased to 60s to handle slower operations

    /* Run tests in files in parallel */
    fullyParallel: true,

    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,

    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,

    workers: process.env.CI ? 1 : undefined,

    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI
        ? [
            ['html'],
            ['github'],
            ['json', {outputFile: 'test-results/results.json'}],
        ]
        : [
            ['html'],
            ['list'],
        ],

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',

        /* Screenshot on failure */
        screenshot: process.env.CI ? 'only-on-failure' : 'off',

        /* Video on failure in CI */
        video: process.env.CI ? 'retain-on-failure' : 'off',

        /* Timeouts - increased for CI reliability */
        actionTimeout: process.env.CI ? 20 * 1000 : 10 * 1000,
        navigationTimeout: process.env.CI ? 30 * 1000 : 15 * 1000,

        /* Viewport */
        viewport: {width: 1280, height: 720},
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']},
        },

        {
            name: 'firefox',
            use: {...devices['Desktop Firefox']},
        },

        {
            name: 'webkit',
            use: {...devices['Desktop Safari']},
        },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],

    /* Run your local dev server before starting the tests */
    webServer: {
        command: process.env.CI
            ? 'pnpm prisma generate && pnpm build && pnpm start'
            : 'pnpm prisma generate && pnpm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: process.env.CI ? 180 * 1000 : 120 * 1000,
        stdout: 'pipe', // Changed from 'ignore' to see server output for debugging
        stderr: 'pipe',
        env: {
            AUTH_URL: 'http://localhost:3000',
            NODE_ENV: process.env.CI ? 'production' : 'development',
            NEXT_IMAGE_UNOPTIMIZED: 'true', // Disable image optimization for faster tests
            ...(process.env.DATABASE_URL && {DATABASE_URL: process.env.DATABASE_URL}),
            ...(process.env.NEXTAUTH_SECRET && {NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET}),
            ...(process.env.NEXTAUTH_URL && {NEXTAUTH_URL: process.env.NEXTAUTH_URL}),
        },
    },

    /* Global setup and teardown */
    globalSetup: './tests/e2e/global-setup.ts',
    // globalTeardown: './tests/e2e/global-teardown.ts',
});
