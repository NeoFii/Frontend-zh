/** @type {import('next').NextConfig} */
const nextConfig = {
  // 生产环境优化
  productionBrowserSourceMaps: false,

  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // 优化图片格式
    formats: ['image/avif', 'image/webp'],
  },

  // API 代理配置
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
    ];
  },

  // 编译优化
  compiler: {
    // 移除 console.log（保留 error 和 warn）
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // 实验性功能
  experimental: {
    // 优化包导入 - 减少 tree-shaking 后的重复代码
    optimizePackageImports: ['@heroicons/react', 'react-markdown'],
  },
};

export default nextConfig;
