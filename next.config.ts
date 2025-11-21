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