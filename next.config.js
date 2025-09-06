/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // Remove console in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    unoptimized: true, // Required for static exports
    domains: ['localhost'],
  },
  // Disable static exports for API routes
  output: 'standalone',
  // Handle API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Handle static files and routes
  async exportPathMap() {
    return {
      '/': { page: '/' },
      '/timetable': { page: '/timetable' },
      // Add other static pages here
    };
  },
};

module.exports = nextConfig
