import {withSentryConfig} from "@sentry/nextjs";
import type {NextConfig} from "next";
import createPWA from "@ducanh2912/next-pwa";

const isProd = process.env.NODE_ENV === "production";

const withPWA = createPWA({
    dest: "public",
    disable: !isProd,
    register: true,
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    workboxOptions: {
        disableDevLogs: true,
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
                handler: "StaleWhileRevalidate",
                options: {
                    cacheName: "google-fonts",
                    expiration: {
                        maxEntries: 4,
                        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
                    },
                },
            },
            {
                urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
                handler: "CacheFirst",
                options: {
                    cacheName: "static-images",
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                    },
                },
            },
            {
                urlPattern: /\/_next\/static\/.*/i,
                handler: "CacheFirst",
                options: {
                    cacheName: "next-static",
                    expiration: {
                        maxEntries: 64,
                        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
                    },
                },
            },
            {
                urlPattern: /\/_next\/image.*/i,
                handler: "StaleWhileRevalidate",
                options: {
                    cacheName: "next-images",
                    expiration: {
                        maxEntries: 64,
                        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                    },
                },
            },
            {
                urlPattern: /^https:\/\/covers\.openlibrary\.org\/.*/i,
                handler: "StaleWhileRevalidate",
                options: {
                    cacheName: "openlibrary-covers",
                    expiration: {
                        maxEntries: 200,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                    },
                },
            },
            {
                urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
                handler: "StaleWhileRevalidate",
                options: {
                    cacheName: "unsplash-images",
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                    },
                },
            },
            {
                urlPattern: ({ request }) => request.destination === "document",
                handler: "NetworkFirst",
                options: {
                    cacheName: "pages",
                    networkTimeoutSeconds: 10,
                    expiration: {
                        maxEntries: 32,
                        maxAgeSeconds: 24 * 60 * 60, // 24 hours
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },
            {
                urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
                handler: "NetworkFirst",
                options: {
                    cacheName: "api-cache",
                    networkTimeoutSeconds: 10,
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 5 * 60, // 5 minutes
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },
        ],
        navigateFallback: "/offline.html",
        navigateFallbackDenylist: [/^\/api\/.*/, /^\/_next\/.*/],
        skipWaiting: true,
        clientsClaim: true,
    },
});

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "covers.openlibrary.org",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
        // Disable image optimization in test/development to avoid issues
        unoptimized: process.env.NODE_ENV === 'test' || process.env.NEXT_IMAGE_UNOPTIMIZED === 'true',
    },
    // Fix require-in-the-middle and import-in-the-middle version conflicts with Sentry
    serverExternalPackages: ['require-in-the-middle', 'import-in-the-middle'],
};

export default withSentryConfig(withPWA(nextConfig), {
    org: "capybook",
    project: "capybook",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: true,
    disableLogger: isProd,
    automaticVercelMonitors: true,
});
