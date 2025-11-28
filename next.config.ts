import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'covers.openlibrary.org',
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com"
            }
        ],
        // Disable image optimization in test/development to avoid issues
        unoptimized: process.env.NODE_ENV === 'test' || process.env.NEXT_IMAGE_UNOPTIMIZED === 'true',
    },

};

export default nextConfig;
