/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Environment variables are now handled automatically by Next.js
  // No need for dotenv-webpack in modern Next.js
  experimental: {
    // Add any experimental features if needed
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack config if needed
    return config;
  }
};

module.exports = nextConfig;