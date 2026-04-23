import path from 'path'
import { fileURLToPath } from 'url'
import proxyConfig from './src/lib/proxy-config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const useStandalone = process.env.NEXT_STANDALONE === 'true'
const imageHostnames = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || 'eucal.ai,www.eucal.ai,neofii.fun')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean)

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: useStandalone ? 'standalone' : undefined,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/': path.resolve(__dirname, 'src') + '/',
    }
    return config
  },
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: imageHostnames.map((hostname) => ({
      protocol: 'https',
      hostname,
    })),
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    const { apiUrl, testingApiUrl, routerApiUrl } = proxyConfig.resolveProxyTargets()
    const rewrites = []

    if (testingApiUrl) {
      rewrites.push({
        source: '/testing-api/:path*',
        destination: `${testingApiUrl}/api/:path*`,
      })
    }

    if (routerApiUrl) {
      rewrites.push({
        source: '/router-api/:path*',
        destination: `${routerApiUrl}/:path*`,
      })
    }

    if (apiUrl) {
      rewrites.push({
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      })
    }

    return rewrites
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'react-markdown'],
  },
}

export default nextConfig
