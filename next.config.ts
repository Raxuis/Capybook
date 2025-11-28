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
    // Fix require-in-the-middle version conflict
    serverExternalPackages: ['require-in-the-middle'],
    experimental: {
        serverComponentsExternalPackages: ['require-in-the-middle'],
    },
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
