import path from 'path'
import { fileURLToPath } from 'url'
import createNextIntlPlugin from 'next-intl/plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// next-intl 插件配置
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
// 通过环境变量控制 standalone 模式（用于 Docker 构建）
// 本地开发时不需要 standalone，直接运行 pnpm build 即可
// Docker 构建时设置 NEXT_STANDALONE=true pnpm build
const useStandalone = process.env.NEXT_STANDALONE === 'true'
const nextConfig = {
  // 支持 Docker 多阶段构建
  output: useStandalone ? 'standalone' : undefined,

  // 显式配置路径别名解析（解决 Docker 构建时 @/ 别名无法识别的问题）
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/': path.resolve(__dirname, 'src') + '/',
    }
    return config
  },

  // 生产环境优化
  productionBrowserSourceMaps: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // 优化图片格式
    formats: ['image/avif', 'image/webp'],
  },

  // API 代理配置 - 通过环境变量控制代理目标
  // 本地开发: API_URL=http://127.0.0.1:8000 pnpm start
  // Docker: 自动使用 http://backend:8000
  async rewrites() {
    const apiUrl = process.env.API_URL || 'http://127.0.0.1:8000';
    return [
      // API 代理
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      // 处理英文 locale 的 model 路由（localePrefix: 'as-needed' 配置下）
      // /model/:id -> /en/model/:id (内部重写，不改变 URL)
      {
        source: '/model/:path*',
        destination: '/en/model/:path*',
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

export default withNextIntl(nextConfig);
