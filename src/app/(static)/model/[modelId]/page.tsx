import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { modelVendors, getModelById, getVendorByModelId } from '@/data/models'

interface ModelDetailPageProps {
  params: {
    modelId: string
  }
}

// 生成静态路径
export function generateStaticParams() {
  const paths: { modelId: string }[] = []

  modelVendors.forEach((vendor) => {
    vendor.models.forEach((model) => {
      paths.push({ modelId: model.id })
    })
  })

  return paths
}

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ModelDetailPage({ params }: ModelDetailPageProps) {
  const { modelId } = params

  const model = getModelById(modelId)
  const vendor = getVendorByModelId(modelId)

  if (!model || !vendor) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1000px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {/* 返回按钮 */}
        <Link
          href="/model"
          className="inline-flex items-center gap-2 text-[14px] text-[#666666] hover:text-[#181E25] transition-colors mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          返回模型列表
        </Link>

        {/* 头部信息 */}
        <div className="flex items-start gap-4 mb-8">
          {/* 供应商图标 */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src={`/icons/providers/${vendor.providerId}.png`}
              alt={vendor.name}
              fill
              className="rounded-xl object-cover"
            />
          </div>

          <div className="flex-1">
            {/* 生产商 */}
            <div className="text-[14px] text-[#666666] mb-1">
              {vendor.name}
            </div>

            {/* 模型名称 */}
            <h1 className="text-[28px] lg:text-[32px] font-semibold text-[#181E25] mb-2">
              {model.name}
            </h1>

            {/* 发布时间 */}
            {model.publishedAt && (
              <div className="text-[14px] text-[#9CA3AF]">
                发布时间: {formatDate(model.publishedAt)}
              </div>
            )}
          </div>
        </div>

        {/* 关键信息卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* 模型大小 - 仅开源模型显示 */}
          {model.isOpenSource && model.modelSize && (
            <div className="bg-[#F7F8FA] rounded-xl p-5">
              <div className="text-[13px] text-[#666666] mb-1">模型规模</div>
              <div className="text-[24px] font-semibold text-[#181E25]">
                {model.modelSize}
              </div>
              <div className="text-[12px] text-[#10B981] mt-1">开源模型</div>
            </div>
          )}

          {/* 闭源模型显示类型标签 */}
          {!model.isOpenSource && (
            <div className="bg-[#F7F8FA] rounded-xl p-5">
              <div className="text-[13px] text-[#666666] mb-1">模型类型</div>
              <div className="text-[24px] font-semibold text-[#181E25]">
                {model.type || '对话'}
              </div>
              <div className="text-[12px] text-[#2563EB] mt-1">闭源模型</div>
            </div>
          )}

          {/* 上下文长度 */}
          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">上下文长度</div>
            <div className="text-[24px] font-semibold text-[#181E25]">
              {model.contextLength
                ? model.contextLength >= 1000
                  ? `${(model.contextLength / 1000).toFixed(0)}K`
                  : model.contextLength.toString()
                : '未知'}
            </div>
            <div className="text-[12px] text-[#666666] mt-1">Tokens</div>
          </div>

          {/* 价格信息 */}
          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">定价</div>
            {model.pricing ? (
              <div className="space-y-1">
                <div className="text-[14px] text-[#181E25]">
                  输入: {model.pricing.input}
                </div>
                <div className="text-[14px] text-[#181E25]">
                  输出: {model.pricing.output}
                </div>
              </div>
            ) : (
              <div className="text-[24px] font-semibold text-[#181E25]">
                暂无定价
              </div>
            )}
          </div>
        </div>

        {/* 模型简介 */}
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">
            模型简介
          </h2>
          <div className="bg-[#F7F8FA] rounded-xl p-6">
            <p className="text-[15px] text-[#666666] leading-[1.8]">
              {model.fullDescription || model.description || '暂无简介'}
            </p>
          </div>
        </div>

        {/* 模型特色标签 */}
        {model.featureTags && model.featureTags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">
              模型特色
            </h2>
            <div className="flex flex-wrap gap-3">
              {model.featureTags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-[#F7F8FA] rounded-lg text-[14px] text-[#181E25] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 能力标签 */}
        {model.capabilities && model.capabilities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">
              核心能力
            </h2>
            <div className="flex flex-wrap gap-3">
              {model.capabilities.map((capability) => (
                <span
                  key={capability}
                  className="px-4 py-2 text-[13px] font-medium text-[#4B5563] rounded-full border border-transparent"
                  style={{
                    background:
                      'linear-gradient(white, white) padding-box, linear-gradient(to right, #2563EB, #8B5CF6) border-box',
                  }}
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <button className="px-6 py-3 bg-[#181E25] text-white text-[14px] font-medium rounded-lg hover:opacity-90 transition-opacity">
            立即体验
          </button>
          <button className="px-6 py-3 border border-gray-200 text-[#181E25] text-[14px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
            查看文档
          </button>
        </div>
      </div>
    </main>
  )
}
