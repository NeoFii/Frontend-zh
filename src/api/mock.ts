// Mock 数据 - 用于开发演示
import type { ProductItem, ApiResponse } from '@/types'

export const mockProduct: ProductItem = {
  id: 1,
  name: 'TierFlow',
  short_description: '智能分层推理引擎，通过动态缓存与模型路由技术，为企业降低 70% 的 AI 推理成本',
  full_description: 'TierFlow 是 Eucal AI 推出的企业级推理优化平台。通过智能分层缓存、动态模型路由和自适应压缩技术，帮助企业在不降低服务质量的前提下，显著降低 AI 推理成本。',
  category: '推理优化',
  icon: 'RocketLaunchIcon',
  is_active: true,
  sort_order: 1,
  created_at: '2024-01-15T08:00:00Z',
  tagline: '让每一次推理都更高效',

  // 产品亮点 - 简化为4个核心能力
  highlights: [
    {
      id: '1',
      title: '智能分层缓存',
      description: '基于语义相似度的多级缓存系统，自动识别重复请求，缓存命中率高达 85%',
      icon: 'BoltIcon'
    },
    {
      id: '2',
      title: '动态模型路由',
      description: '根据请求复杂度智能选择最优模型，在性能与成本之间实现最佳平衡',
      icon: 'ArrowsRightLeftIcon'
    },
    {
      id: '3',
      title: '自适应压缩',
      description: '智能上下文压缩技术，减少 Token 消耗，提升响应速度',
      icon: 'CompressIcon'
    },
    {
      id: '4',
      title: '高可用架构',
      description: '多区域部署，自动故障转移，确保 99.9% 的服务可用性',
      icon: 'ServerIcon'
    }
  ],

  // 使用场景 - 简化为2个核心场景
  use_cases: [
    {
      id: '1',
      title: '客服场景成本优化',
      description: '针对高频客服对话场景，TierFlow 的智能缓存可将常见问题的响应成本降低 80%，同时保持亚秒级响应速度。',
      benefits: [
        '缓存命中率 85%+',
        '平均响应延迟 < 100ms',
        '推理成本降低 70%'
      ],
      image: 'ChatBubbleLeftRightIcon'
    },
    {
      id: '2',
      title: '内容生成智能路由',
      description: '根据内容生成任务的复杂度，自动选择最适合的模型，在保证质量的同时优化成本结构。',
      benefits: [
        '成本节省高达 60%',
        '生成质量保持稳定',
        '支持 20+ 主流模型'
      ],
      image: 'DocumentTextIcon'
    }
  ],

  // 数据统计 - 核心指标
  stats: [
    { label: '成本降低', value: '70', suffix: '%' },
    { label: '平均延迟', value: '<100', suffix: 'ms' },
    { label: '服务可用性', value: '99.9', suffix: '%' },
    { label: '缓存命中率', value: '85', suffix: '%' }
  ],

  // 客户评价 - 简化为2条
  testimonials: [
    {
      id: '1',
      content: '接入 TierFlow 后，我们的 AI 客服成本下降了 70%，响应速度反而更快了。这是目前市面上最成熟的推理优化方案。',
      author: '李明远',
      company: '某头部电商技术 VP'
    },
    {
      id: '2',
      content: '作为初创公司，TierFlow 帮助我们用更少的预算支撑了更大的业务量，ROI 非常可观。',
      author: '张雪',
      company: '某 AI 创业公司 CTO'
    }
  ],

  // 价格方案 - 简化为3档
  pricing: {
    description: '透明的定价，按实际使用量付费',
    contact_sales: false,
    plans: [
      {
        id: 'starter',
        name: '入门版',
        price: '¥0',
        period: '月',
        description: '适合个人开发者和小型项目',
        features: [
          '每月 10 万 Tokens',
          '基础缓存功能',
          '标准路由策略',
          '社区支持'
        ],
        is_recommended: false
      },
      {
        id: 'pro',
        name: '专业版',
        price: '¥999',
        period: '月',
        description: '适合成长型企业',
        features: [
          '每月 100 万 Tokens',
          '高级缓存策略',
          '智能路由优化',
          '优先技术支持',
          '详细分析报告'
        ],
        is_recommended: true
      },
      {
        id: 'enterprise',
        name: '企业版',
        price: '定制',
        period: '',
        description: '适合大型企业',
        features: [
          '不限 Tokens',
          '私有化部署',
          '定制优化策略',
          '专属客户成功',
          'SLA 保障'
        ],
        is_recommended: false
      }
    ]
  },

  // FAQ - 精简为4个核心问题
  faqs: [
    {
      id: '1',
      question: 'TierFlow 如何降低推理成本？',
      answer: 'TierFlow 通过三层技术降低推理成本：智能缓存减少重复计算、动态路由选择性价比最优模型、自适应压缩减少 Token 消耗。综合可降低 50%-80% 的推理成本。'
    },
    {
      id: '2',
      question: '接入 TierFlow 需要修改现有代码吗？',
      answer: '不需要。TierFlow 提供与 OpenAI 兼容的 API 接口，只需修改 API Endpoint 和 Key，即可无缝接入，现有代码无需任何改动。'
    },
    {
      id: '3',
      question: '支持哪些模型提供商？',
      answer: 'TierFlow 支持 OpenAI、Anthropic、Azure、百度文心、阿里通义等主流模型，并持续增加对更多提供商的支持。'
    },
    {
      id: '4',
      question: '数据安全如何保障？',
      answer: 'TierFlow 提供端到端加密传输，缓存数据经过脱敏处理。企业版支持私有化部署，所有数据存储在您的自有基础设施中。'
    }
  ]
}

// 模拟 API 响应
export function mockFetchProductDetail(id: number): Promise<ApiResponse<ProductItem>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: '200',
        message: 'success',
        data: { ...mockProduct, id }
      })
    }, 500)
  })
}
