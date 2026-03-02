import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { modelVendors, getModelById, getVendorByModelId } from '@/data/models'

interface ModelDetailPageProps {
  params: {
    locale: string
    modelId: string
  }
}

// 生成静态路径
export function generateStaticParams() {
  const paths: { locale: string; modelId: string }[] = []

  modelVendors.forEach((vendor) => {
    vendor.models.forEach((model) => {
      paths.push({ locale: 'zh', modelId: model.id })
      paths.push({ locale: 'en', modelId: model.id })
    })
  })

  return paths
}

// 格式化日期
function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ModelDetailPage({ params }: ModelDetailPageProps) {
  const { modelId, locale } = params

  const model = getModelById(modelId)
  const vendor = getVendorByModelId(modelId)

  if (!model || !vendor) {
    notFound()
  }

  // 同步获取翻译
  const tModel = locale === 'zh' ? {
    backToList: '返回模型列表',
    modelScale: '模型规模',
    openSource: '开源模型',
    modelType: '模型类型',
    closedSource: '闭源模型',
    contextLength: '上下文长度',
    pricing: '定价',
    noPricing: '暂无定价',
    modelIntro: '模型简介',
    noIntro: '暂无简介',
    modelFeatures: '模型特色',
    coreCapabilities: '核心能力',
    tryNow: '立即体验',
    viewDocs: '查看文档',
    input: '输入',
    output: '输出',
    tokens: 'Tokens',
    publishedAt: '发布时间',
  } : {
    backToList: 'Back to Model List',
    modelScale: 'Model Scale',
    openSource: 'Open Source',
    modelType: 'Model Type',
    closedSource: 'Closed Source',
    contextLength: 'Context Length',
    pricing: 'Pricing',
    noPricing: 'Pricing TBD',
    modelIntro: 'Model Introduction',
    noIntro: 'No introduction available',
    modelFeatures: 'Model Features',
    coreCapabilities: 'Core Capabilities',
    tryNow: 'Try Now',
    viewDocs: 'View Docs',
    input: 'Input',
    output: 'Output',
    tokens: 'Tokens',
    publishedAt: 'Published',
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
          {tModel.backToList}
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
                {tModel.publishedAt}: {formatDate(model.publishedAt, locale)}
              </div>
            )}
          </div>
        </div>

        {/* 关键信息卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* 模型大小 - 仅开源模型显示 */}
          {model.isOpenSource && model.modelSize && (
            <div className="bg-[#F7F8FA] rounded-xl p-5">
              <div className="text-[13px] text-[#666666] mb-1">{tModel.modelScale}</div>
              <div className="text-[24px] font-semibold text-[#181E25]">
                {model.modelSize}
              </div>
              <div className="text-[12px] text-[#10B981] mt-1">{tModel.openSource}</div>
            </div>
          )}

          {/* 闭源模型显示类型标签 */}
          {!model.isOpenSource && (
            <div className="bg-[#F7F8FA] rounded-xl p-5">
              <div className="text-[13px] text-[#666666] mb-1">{tModel.modelType}</div>
              <div className="text-[24px] font-semibold text-[#181E25]">
                {model.type || (locale === 'zh' ? '对话' : 'Chat')}
              </div>
              <div className="text-[12px] text-[#2563EB] mt-1">{tModel.closedSource}</div>
            </div>
          )}

          {/* 上下文长度 */}
          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">{tModel.contextLength}</div>
            <div className="text-[24px] font-semibold text-[#181E25]">
              {model.contextLength
                ? model.contextLength >= 1000
                  ? `${(model.contextLength / 1000).toFixed(0)}K`
                  : model.contextLength.toString()
                : (locale === 'zh' ? '未知' : 'N/A')}
            </div>
            <div className="text-[12px] text-[#666666] mt-1">{tModel.tokens}</div>
          </div>

          {/* 价格信息 */}
          <div className="bg-[#F7F8FA] rounded-xl p-5">
            <div className="text-[13px] text-[#666666] mb-1">{tModel.pricing}</div>
            {model.pricing ? (
              <div className="space-y-1">
                <div className="text-[14px] text-[#181E25]">
                  {tModel.input}: {model.pricing.input}
                </div>
                <div className="text-[14px] text-[#181E25]">
                  {tModel.output}: {model.pricing.output}
                </div>
              </div>
            ) : (
              <div className="text-[24px] font-semibold text-[#181E25]">
                {tModel.noPricing}
              </div>
            )}
          </div>
        </div>

        {/* 模型简介 */}
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">
            {tModel.modelIntro}
          </h2>
          <div className="bg-[#F7F8FA] rounded-xl p-6">
            <p className="text-[15px] text-[#666666] leading-[1.8]">
              {model.fullDescription || model.description || tModel.noIntro}
            </p>
          </div>
        </div>

        {/* 模型特色标签 */}
        {model.featureTags && model.featureTags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[20px] font-semibold text-[#181E25] mb-4">
              {tModel.modelFeatures}
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
              {tModel.coreCapabilities}
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
            {tModel.tryNow}
          </button>
          <button className="px-6 py-3 border border-gray-200 text-[#181E25] text-[14px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
            {tModel.viewDocs}
          </button>
        </div>
      </div>
    </main>
  )
}
