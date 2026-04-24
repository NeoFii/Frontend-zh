import { BrandMark } from '@/components/brand/BrandLogo'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <div className="flex flex-col items-center">
        {/* Logo 动画 */}
        <BrandMark size="lg" className="mb-6 animate-pulse shadow-lg shadow-gray-900/20" />

        {/* 加载动画 */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        <p className="mt-6 text-gray-500 text-sm">{'加载中...'}</p>
      </div>
    </div>
  )
}
