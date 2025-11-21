import {withSentryConfig} from "@sentry/nextjs";
import type {NextConfig} from "next";
import withPWA from "next-pwa";

const isProd = process.env.NODE_ENV === "production";

const pwa = withPWA({
    dest: "public",
    disable: !isProd,
    register: true,
    skipWaiting: true,
});

const nextConfig = pwa({
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
    },
}) as NextConfig; // ✅ THIS fixes TS2322

export default withSentryConfig(nextConfig, {
    org: "capybook",
    project: "capybook",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: true,
    disableLogger: isProd,
    automaticVercelMonitors: true,
});
