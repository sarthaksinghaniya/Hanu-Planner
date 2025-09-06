import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      // 禁用 webpack 的热模块替换
      config.watchOptions = {
        ignored: ['**/*'], // 忽略所有文件变化
      };
    }
    return config;
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
  // Configure for static export
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true, // Required for static exports
  },
  // Disable server-side rendering at build time
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Generate a 404.html file for SPA routing
  generateBuildId: async () => 'build',
  // Handle trailing slashes for static export
  trailingSlash: true,
};

export default nextConfig;
