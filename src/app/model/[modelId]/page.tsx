import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getModelById, getVendorByModelId } from '@/data/models'

interface PageProps {
  params: {
    modelId: string
  }
}

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ModelDetailPage({ params }: PageProps) {
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
        <a
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
          Back to Models
        </a>

        {/* 模型头部信息 */}
        <div className="flex items-start gap-6 mb-8">
          {/* 厂商图标 */}
          <div className="flex-shrink-0">
            <Image
              src={`/icons/providers/${vendor.providerId}.png`}
              alt={vendor.name}
              width={56}
              height={56}
              className="rounded-lg object-cover"
              unoptimized
            />
          </div>

          {/* 模型名称和厂商 */}
          <div className="flex-1">
            <h1 className="text-[28px] font-semibold text-[#181E25] mb-2">
              {model.name}
            </h1>
            <div className="flex items-center gap-3">
              <span
                className="text-[14px] px-3 py-1 rounded-full"
                style={{ backgroundColor: `${vendor.color}20`, color: vendor.color }}
              >
                {vendor.name}
              </span>
              {model.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[12px] px-2 py-1 rounded-full bg-[#F3F4F6] text-[#6B7280]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 模型描述 */}
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">
            Model Introduction
          </h2>
          <div className="bg-[#F7F8FA] rounded-xl p-6">
            <p className="text-[15px] text-[#666666] leading-[1.8]">
              {model.description?.en || 'No description available.'}
            </p>
          </div>
        </div>

        {/* 模型特色标签 */}
        {model.featureTags && model.featureTags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">
              Key Features
            </h2>
            <div className="flex flex-wrap gap-3">
              {model.featureTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[14px] px-4 py-2 rounded-full bg-[#F0F5FF] text-[#2563EB]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 模型详细信息 */}
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">
            Model Details
          </h2>
          <div className="bg-[#F7F8FA] rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {model.contextLength && (
                <div>
                  <span className="text-[14px] text-[#6B7280]">Context Length</span>
                  <p className="text-[15px] text-[#181E25] font-medium">
                    {(model.contextLength / 1000).toFixed(0)}K
                  </p>
                </div>
              )}
              {model.publishedAt && (
                <div>
                  <span className="text-[14px] text-[#6B7280]">Published</span>
                  <p className="text-[15px] text-[#181E25] font-medium">
                    {formatDate(model.publishedAt)}
                  </p>
                </div>
              )}
              {model.pricing && (
                <>
                  <div>
                    <span className="text-[14px] text-[#6B7280]">Input Price</span>
                    <p className="text-[15px] text-[#181E25] font-medium">
                      {model.pricing.input}
                    </p>
                  </div>
                  <div>
                    <span className="text-[14px] text-[#6B7280]">Output Price</span>
                    <p className="text-[15px] text-[#181E25] font-medium">
                      {model.pricing.output}
                    </p>
                  </div>
                </>
              )}
              {model.modelSize && (
                <div>
                  <span className="text-[14px] text-[#6B7280]">Model Size</span>
                  <p className="text-[15px] text-[#181E25] font-medium">{model.modelSize}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 能力标签 */}
        {model.capabilities && model.capabilities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">
              Capabilities
            </h2>
            <div className="flex flex-wrap gap-3">
              {model.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="text-[14px] px-4 py-2 rounded-full bg-[#F3F4F6] text-[#4B5563]"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
