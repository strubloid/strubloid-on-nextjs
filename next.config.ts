import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, '')],
    },
    // Fast Refresh and Development Settings
    onDemandEntries: {
        maxInactiveAge: 15 * 1000,
        pagesBufferLength: 5,
    },
    // Webpack configuration for better hot reload
    webpack: (config, { dev }) => {
        if (dev) {
            config.watchOptions = {
                poll: 2000,
                aggregateTimeout: 500,
            };
        }
        return config;
    },
};

export default nextConfig;
