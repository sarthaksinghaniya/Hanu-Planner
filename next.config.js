/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  compiler: {
    // Remove console in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    unoptimized: true, // Required for static exports
  },
  // Configure for static export
  output: 'export',
  distDir: 'out',
  // Disable server-side rendering at build time
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Generate a 404.html file for SPA routing
  generateBuildId: async () => 'build',
  // Handle trailing slashes for static export
  trailingSlash: true,
};

module.exports = nextConfig
