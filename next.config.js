/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  reactProductionProfiling: true, // Optional, for performance
  productionBrowserSourceMaps: true, // Helps trace production errors
  output: 'standalone', // Important for Amplify
  experimental: {
    serverActions: true // only if you're using server actions
  }
}

module.exports = nextConfig
