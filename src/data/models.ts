/**
 * 模型数据配置
 * 包含所有支持的模型供应商及其模型列表
 */

export interface Model {
  id: string
  name: string
  description?: string
  tags: string[]       // ['热门', '新品', '免费']
  contextLength?: number
  pricing?: {
    input: string      // 输入价格，如 '¥2.1 / M Tokens'
    output: string     // 输出价格，如 '¥8.4 / M Tokens'
  }
  publishedAt?: string  // 发布时间，如 '2026-02-13'
  capabilities?: string[]  // 能力标签，如 ['Vibe Coding', '旗舰全能']
  type?: string         // 类型，如 '对话'
  modelSize?: string    // 模型大小，如 '671B'（开源模型展示，闭源不展示）
  featureTags?: string[]  // 模型特色标签，如 ['文本', '多模态', '代码']
  isOpenSource?: boolean  // 是否为开源模型
  fullDescription?: string  // 详细的模型简介
}

export interface ModelVendor {
  id: string
  name: string
  providerId: string    // 对应 ProviderIcon 组件的 providerId
  color: string        // 主题色
  models: Model[]
}

// 供应商列表及其模型数据
export const modelVendors: ModelVendor[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    providerId: 'openai',
    color: '#10A37F',
    models: [
      {
        id: 'gpt-4o',
        name: 'OpenAI/GPT-4o',
        description: '最新旗舰多模态模型，支持文本、图像和音频',
        fullDescription: 'GPT-4o 是 OpenAI 最新发布的旗舰模型，其中"o"代表"omni"（全能）。它能够处理文本、音频和图像输入，并生成相应的输出。该模型在理解和生成多语言内容方面表现出色，同时在视觉和音频理解方面实现了重大突破。GPT-4o 具有更快的响应速度和更低的成本，是构建下一代 AI 应用的理想选择。',
        tags: ['热门'],
        contextLength: 128000,
        pricing: {
          input: '$2.5 / M Tokens',
          output: '$10 / M Tokens'
        },
        publishedAt: '2024-05-13',
        capabilities: ['多模态', '128K上下文', '旗舰全能'],
        type: '对话',
        isOpenSource: false,
        featureTags: ['文本', '多模态', '音频', '视觉']
      },
      {
        id: 'gpt-4-turbo',
        name: 'OpenAI/GPT-4-Turbo',
        description: '高性能文本生成模型，支持128K上下文',
        tags: [],
        contextLength: 128000,
        pricing: {
          input: '$10 / M Tokens',
          output: '$30 / M Tokens'
        },
        publishedAt: '2024-03-15',
        capabilities: ['128K上下文', '代码生成'],
        type: '对话'
      },
      {
        id: 'gpt-4',
        name: 'OpenAI/GPT-4',
        description: '强大的文本理解和生成能力',
        tags: [],
        contextLength: 8192,
        pricing: {
          input: '$30 / M Tokens',
          output: '$60 / M Tokens'
        },
        publishedAt: '2023-03-14',
        capabilities: ['文本生成', '复杂推理'],
        type: '对话'
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'OpenAI/GPT-3.5-Turbo',
        description: '性价比最高的对话模型',
        tags: ['免费'],
        contextLength: 16385,
        pricing: {
          input: '$0.5 / M Tokens',
          output: '$1.5 / M Tokens'
        },
        publishedAt: '2023-03-01',
        capabilities: ['高性价比', '快速响应'],
        type: '对话'
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    providerId: 'anthropic',
    color: '#D97757',
    models: [
      {
        id: 'claude-3-5-sonnet',
        name: 'Anthropic/Claude-3.5-Sonnet',
        description: '最新旗舰模型，卓越的推理和编程能力',
        tags: ['热门', '新品'],
        contextLength: 200000,
        pricing: {
          input: '$3 / M Tokens',
          output: '$15 / M Tokens'
        },
        publishedAt: '2024-06-20',
        capabilities: ['200K上下文', '代码专家', 'Vibe Coding'],
        type: '对话'
      },
      {
        id: 'claude-3-opus',
        name: 'Anthropic/Claude-3-Opus',
        description: '最强大的模型，适用于复杂推理任务',
        tags: [],
        contextLength: 200000,
        pricing: {
          input: '$15 / M Tokens',
          output: '$75 / M Tokens'
        },
        publishedAt: '2024-03-04',
        capabilities: ['200K上下文', '复杂推理', '学术研究'],
        type: '对话'
      },
      {
        id: 'claude-3-sonnet',
        name: 'Anthropic/Claude-3-Sonnet',
        description: '平衡性能和成本的优秀选择',
        tags: [],
        contextLength: 200000,
        pricing: {
          input: '$3 / M Tokens',
          output: '$15 / M Tokens'
        },
        publishedAt: '2024-03-04',
        capabilities: ['200K上下文', '平衡性能'],
        type: '对话'
      },
      {
        id: 'claude-3-haiku',
        name: 'Anthropic/Claude-3-Haiku',
        description: '快速响应的轻量级模型',
        tags: ['免费'],
        contextLength: 200000,
        pricing: {
          input: '$0.25 / M Tokens',
          output: '$1.25 / M Tokens'
        },
        publishedAt: '2024-03-04',
        capabilities: ['200K上下文', '极速响应'],
        type: '对话'
      },
    ],
  },
  {
    id: 'google',
    name: 'Google',
    providerId: 'google',
    color: '#4285F4',
    models: [
      {
        id: 'gemini-1.5-pro',
        name: 'Google/Gemini-1.5-Pro',
        description: '支持100万token上下文的多模态模型',
        tags: ['热门'],
        contextLength: 1000000,
        pricing: {
          input: '$3.5 / M Tokens',
          output: '$10.5 / M Tokens'
        },
        publishedAt: '2024-05-15',
        capabilities: ['100万上下文', '多模态', '长文本处理'],
        type: '对话'
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Google/Gemini-1.5-Flash',
        description: '快速高效的轻量级模型',
        tags: ['新品', '免费'],
        contextLength: 1000000,
        pricing: {
          input: '$0.35 / M Tokens',
          output: '$1.05 / M Tokens'
        },
        publishedAt: '2024-05-15',
        capabilities: ['100万上下文', '极速响应'],
        type: '对话'
      },
      {
        id: 'gemini-1.0-pro',
        name: 'Google/Gemini-1.0-Pro',
        description: '强大的多模态理解能力',
        tags: [],
        contextLength: 32768,
        pricing: {
          input: '$0.5 / M Tokens',
          output: '$1.5 / M Tokens'
        },
        publishedAt: '2023-12-13',
        capabilities: ['多模态', '稳定可靠'],
        type: '对话'
      },
    ],
  },
  {
    id: 'meta',
    name: 'Meta',
    providerId: 'meta',
    color: '#0668E1',
    models: [
      {
        id: 'llama-3.1-405b',
        name: 'Meta/Llama-3.1-405B',
        description: '开源大模型，支持128K上下文',
        fullDescription: 'Llama 3.1 405B 是 Meta 发布的最大规模开源语言模型，拥有 4050 亿参数。作为 Llama 3.1 系列中的旗舰模型，它在多项基准测试中表现卓越，可媲美顶级闭源模型。该模型支持 128K 的上下文窗口，能够处理长文档分析、代码生成和复杂推理任务。完全开源的特性使开发者可以自由定制和部署。',
        tags: ['热门'],
        contextLength: 128000,
        pricing: {
          input: '免费',
          output: '免费'
        },
        publishedAt: '2024-07-23',
        capabilities: ['开源', '128K上下文', 'Vibe Coding'],
        type: '对话',
        isOpenSource: true,
        modelSize: '405B',
        featureTags: ['文本', '代码', '推理']
      },
      {
        id: 'llama-3.1-70b',
        name: 'Meta/Llama-3.1-70B',
        description: '高性能开源模型',
        tags: [],
        contextLength: 128000,
        pricing: {
          input: '免费',
          output: '免费'
        },
        publishedAt: '2024-07-23',
        capabilities: ['开源', '128K上下文'],
        type: '对话'
      },
      {
        id: 'llama-3-70b',
        name: 'Meta/Llama-3-70B',
        description: '强大的开源语言模型',
        tags: [],
        contextLength: 8192,
        pricing: {
          input: '免费',
          output: '免费'
        },
        publishedAt: '2024-04-18',
        capabilities: ['开源', '高效推理'],
        type: '对话'
      },
      {
        id: 'llama-3-8b',
        name: 'Meta/Llama-3-8B',
        description: '轻量级开源模型',
        tags: ['免费'],
        contextLength: 8192,
        pricing: {
          input: '免费',
          output: '免费'
        },
        publishedAt: '2024-04-18',
        capabilities: ['开源', '轻量高效'],
        type: '对话'
      },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    providerId: 'deepseek',
    color: '#1E3A5F',
    models: [
      {
        id: 'deepseek-chat',
        name: 'DeepSeek/DeepSeek-Chat',
        description: '高性能对话模型，优秀的编程能力',
        tags: ['热门'],
        contextLength: 64000,
        pricing: {
          input: '¥1 / M Tokens',
          output: '¥2 / M Tokens'
        },
        publishedAt: '2024-01-15',
        capabilities: ['编程专家', '中文优化'],
        type: '对话'
      },
      {
        id: 'deepseek-coder',
        name: 'DeepSeek/DeepSeek-Coder',
        description: '专为编程任务优化的模型',
        tags: [],
        contextLength: 16000,
        pricing: {
          input: '¥1 / M Tokens',
          output: '¥2 / M Tokens'
        },
        publishedAt: '2024-02-20',
        capabilities: ['代码生成', 'Vibe Coding'],
        type: '对话'
      },
      {
        id: 'deepseek-math',
        name: 'DeepSeek/DeepSeek-Math',
        description: '数学推理能力突出的模型',
        tags: ['新品'],
        contextLength: 4096,
        pricing: {
          input: '¥1 / M Tokens',
          output: '¥2 / M Tokens'
        },
        publishedAt: '2024-03-10',
        capabilities: ['数学推理', '学术研究'],
        type: '对话'
      },
    ],
  },
  {
    id: 'zhipu',
    name: '智谱AI',
    providerId: 'zhipu',
    color: '#2A5298',
    models: [
      {
        id: 'glm-4',
        name: '智谱AI/GLM-4',
        description: '国产旗舰大模型，支持长上下文',
        tags: ['热门'],
        contextLength: 128000,
        pricing: {
          input: '¥1 / M Tokens',
          output: '¥2 / M Tokens'
        },
        publishedAt: '2024-01-20',
        capabilities: ['国产模型', '128K上下文', '中文专家'],
        type: '对话'
      },
      {
        id: 'glm-4-plus',
        name: '智谱AI/GLM-4-Plus',
        description: 'GLM-4 增强版',
        tags: ['新品'],
        contextLength: 128000,
        pricing: {
          input: '¥5 / M Tokens',
          output: '¥10 / M Tokens'
        },
        publishedAt: '2024-06-15',
        capabilities: ['旗舰全能', '128K上下文'],
        type: '对话'
      },
      {
        id: 'glm-3-turbo',
        name: '智谱AI/GLM-3-Turbo',
        description: '性价比高的对话模型',
        tags: ['免费'],
        contextLength: 128000,
        pricing: {
          input: '¥0.1 / M Tokens',
          output: '¥0.2 / M Tokens'
        },
        publishedAt: '2023-10-27',
        capabilities: ['高性价比', '中文优化'],
        type: '对话'
      },
    ],
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    providerId: 'minimax',
    color: '#3B82F6',
    models: [
      {
        id: 'abab-6',
        name: 'MiniMax/abab-6',
        description: '最新一代大模型，优秀的对话能力',
        tags: ['热门'],
        contextLength: 245760,
        pricing: {
          input: '¥1 / M Tokens',
          output: '¥2 / M Tokens'
        },
        publishedAt: '2024-01-10',
        capabilities: ['240K上下文', '中文专家'],
        type: '对话'
      },
      {
        id: 'abab-5.5',
        name: 'MiniMax/abab-5.5',
        description: '高效的对话模型',
        tags: [],
        contextLength: 245760,
        pricing: {
          input: '¥1 / M Tokens',
          output: '¥2 / M Tokens'
        },
        publishedAt: '2023-08-15',
        capabilities: ['240K上下文', '稳定可靠'],
        type: '对话'
      },
      {
        id: 'abab-5',
        name: 'MiniMax/abab-5',
        description: '稳定可靠的对话模型',
        tags: [],
        contextLength: 245760,
        pricing: {
          input: '¥1 / M Tokens',
          output: '¥2 / M Tokens'
        },
        publishedAt: '2023-05-20',
        capabilities: ['240K上下文', '企业级'],
        type: '对话'
      },
    ],
  },
  {
    id: 'stepfun',
    name: '阶跃星辰',
    providerId: 'stepfun',
    color: '#1E40AF',
    models: [
      {
        id: 'step-1',
        name: '阶跃星辰/Step-1',
        description: '千亿参数大模型，优秀的推理能力',
        tags: ['热门'],
        contextLength: 32768,
        pricing: {
          input: '¥1 / M Tokens',
          output: '¥2 / M Tokens'
        },
        publishedAt: '2024-02-01',
        capabilities: ['复杂推理', '中文专家'],
        type: '对话'
      },
      {
        id: 'step-2',
        name: '阶跃星辰/Step-2',
        description: '万亿参数大模型',
        tags: ['新品'],
        contextLength: 32768,
        pricing: {
          input: '¥2 / M Tokens',
          output: '¥4 / M Tokens'
        },
        publishedAt: '2024-06-01',
        capabilities: ['万亿参数', '旗舰全能'],
        type: '对话'
      },
      {
        id: 'step-1v',
        name: '阶跃星辰/Step-1V',
        description: '多模态理解模型',
        tags: [],
        contextLength: 32768,
        pricing: {
          input: '¥1.5 / M Tokens',
          output: '¥3 / M Tokens'
        },
        publishedAt: '2024-03-15',
        capabilities: ['多模态', '图像理解'],
        type: '对话'
      },
    ],
  },
]

// 获取所有模型
export function getAllModels(): Model[] {
  return modelVendors.flatMap((vendor) => vendor.models)
}

// 根据供应商ID获取供应商
export function getVendorById(id: string): ModelVendor | undefined {
  return modelVendors.find((vendor) => vendor.id === id)
}

// 根据模型ID获取模型
export function getModelById(id: string): Model | undefined {
  return getAllModels().find((model) => model.id === id)
}

// 获取模型对应的供应商
export function getVendorByModelId(modelId: string): ModelVendor | undefined {
  return modelVendors.find((vendor) =>
    vendor.models.some((model) => model.id === modelId)
  )
}
