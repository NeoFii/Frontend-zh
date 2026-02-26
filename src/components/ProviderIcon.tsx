/**
 * 厂商图标组件
 * 优先使用官方图标，失败时使用备用方案
 */

import React from 'react'
import Image from 'next/image'

interface ProviderIconProps {
  providerId: string
  name: string
  size?: number
  className?: string
}

// 备用颜色配置
const fallbackColors: Record<string, string> = {
  'ali-bailian': '#FF6A00',
  'silicon-flow': '#0066FF',
  'morelink': '#7C3AED',
  'ppio': '#EC4899',
  'wuxin': '#0891B2',
  'baidu-cloud': '#2932E1',
  'sophnet': '#1E3A5F',
  'qiniu': '#10B981',
  'parallel-cloud': '#F59E0B',
  'ucloud': '#8B5CF6',
  'xfyun': '#DC2626',
  'volcano': '#EA580C',
  'cornerstone': '#4B5563',
  'kwai': '#FF6600',
  'minimax': '#3B82F6',
  'moonshot': '#1F2937',
  'lingyi': '#D97706',
  'stepfun': '#1E40AF',
  'xiaomi': '#FF6900',
  'deepseek': '#1E3A5F',
}

// 备用图标组件
const FallbackIcon: React.FC<{ name: string; providerId: string; size: number }> = ({
  name,
  providerId,
  size,
}) => {
  const initial = name.charAt(0)
  const color = fallbackColors[providerId] || '#6B7280'

  return (
    <div
      className="rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.4,
      }}
    >
      {initial}
    </div>
  )
}

export const ProviderIcon: React.FC<ProviderIconProps> = ({
  providerId,
  name,
  size = 40,
  className = '',
}) => {
  const [useFallback, setUseFallback] = React.useState(false)

  // 如果图标加载失败，使用备用方案
  if (useFallback) {
    return <FallbackIcon name={name} providerId={providerId} size={size} />
  }

  return (
    <Image
      src={`/icons/providers/${providerId}.png`}
      alt={name}
      width={size}
      height={size}
      className={`rounded-xl object-cover flex-shrink-0 ${className}`}
      onError={() => setUseFallback(true)}
    />
  )
}

export default ProviderIcon
