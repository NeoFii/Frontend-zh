/**
 * 模型数据配置
 * 包含所有支持的模型供应商及其模型列表
 */

// i18n 文本字段
export interface I18nText {
  zh: string
  en: string
}

export interface Model {
  id: string
  name: string
  description: I18nText       // 简短描述（双语）
  fullDescription?: I18nText  // 详细描述（双语）
  prompt?: I18nText          // 推荐系统提示词（双语）
  tags: string[]              // 标签：['热门', '新品', '免费']
  contextLength?: number
  pricing?: {
    input: string             // 输入价格，如 '$2.1 / M Tokens'
    output: string            // 输出价格，如 '$8.4 / M Tokens'
  }
  publishedAt?: string        // 发布时间，如 '2026-02-13'
  capabilities?: string[]     // 能力标签，如 ['Vibe Coding', '旗舰全能']
  type?: string              // 类型，如 '对话'
  modelSize?: string         // 模型大小，如 '671B'（开源模型展示，闭源不展示）
  featureTags?: string[]      // 模型特色标签，如 ['文本', '多模态', '代码']
  isOpenSource?: boolean      // 是否为开源模型
}

export interface ModelVendor {
  id: string
  name: string
  providerId: string          // 对应 ProviderIcon 组件的 providerId
  color: string               // 主题色
  models: Model[]
}

// 供应商列表及其模型数据
export const modelVendors: ModelVendor[] = [
  // ============================================================================
  // OpenAI
  // ============================================================================
  {
    id: 'openai',
    name: 'OpenAI',
    providerId: 'openai',
    color: '#10a37f',
    models: [
      {
        id: 'gpt-4.1',
        name: 'GPT-4.1',
        description: {
          zh: 'OpenAI 最强通用模型，支持百万 Token 上下文，代码与指令跟随能力领先。',
          en: "OpenAI's most capable general model with 1M token context, leading in coding and instruction following."
        },
        fullDescription: {
          zh: 'GPT-4.1 在 SWE-bench 编码基准上大幅领先前代，支持 1M Token 上下文，主要面向 API 开发者，在长文档理解、多步指令和视频理解方面均创下新高。',
          en: 'GPT-4.1 significantly outperforms its predecessor on SWE-bench coding benchmarks, supports 1M token context, and is primarily designed for API developers with state-of-the-art performance in long document comprehension, multi-step instructions, and video understanding.'
        },
        prompt: {
          zh: '你是一个专业的 AI 助手，擅长代码开发、复杂推理和长文档分析。请用清晰、结构化的方式回答问题，在处理代码时提供可运行的示例，在分析文档时提炼关键信息。',
          en: 'You are a professional AI assistant skilled in software development, complex reasoning, and long document analysis. Provide clear, structured responses. When handling code, include runnable examples. When analyzing documents, extract and summarize key information concisely.'
        },
        tags: ['热门', '代码', '长上下文'],
        contextLength: 1000000,
        pricing: { input: '$2.00/M', output: '$8.00/M' },
        publishedAt: '2025-04-14',
        capabilities: ['文本', '代码', '视觉', '工具调用'],
        type: 'chat',
        featureTags: ['1M上下文', 'Function Calling'],
        isOpenSource: false
      },
      {
        id: 'gpt-4.1-mini',
        name: 'GPT-4.1 mini',
        description: {
          zh: '小模型中的性能标杆，延迟比 GPT-4o 低近一半，性价比极高。',
          en: 'The performance benchmark among small models—nearly half the latency of GPT-4o with exceptional cost efficiency.'
        },
        fullDescription: {
          zh: 'GPT-4.1 mini 在众多基准测试中超越 GPT-4o，延迟更低，成本减少 83%，是生产环境高频调用的理想选择，同样支持 1M Token 上下文。',
          en: 'GPT-4.1 mini surpasses GPT-4o on many benchmarks while offering 83% lower cost and significantly reduced latency. With 1M token context support, it\'s ideal for high-frequency production use cases.'
        },
        prompt: {
          zh: '你是一个高效、简洁的 AI 助手。请用最少的 Token 提供准确、实用的回答。优先给出直接结论，必要时再展开说明。',
          en: 'You are an efficient, concise AI assistant. Provide accurate and practical answers using minimal tokens. Lead with direct conclusions and expand only when necessary.'
        },
        tags: ['热门', '快速', '经济', '代码'],
        contextLength: 1000000,
        pricing: { input: '$0.40/M', output: '$1.60/M' },
        publishedAt: '2025-04-14',
        capabilities: ['文本', '代码', '视觉'],
        type: 'chat',
        featureTags: ['低延迟', '1M上下文'],
        isOpenSource: false
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: {
          zh: 'OpenAI 经典多模态旗舰，原生文本+图像理解，生产环境广泛应用。',
          en: 'OpenAI\'s classic multimodal flagship with native text and image understanding, widely deployed in production.'
        },
        fullDescription: {
          zh: 'GPT-4o（omni）是 OpenAI 的原生多模态模型，比 GPT-4 Turbo 更快更便宜，在写作、代码、STEM 方面表现出色，支持图像输入和结构化输出。',
          en: 'GPT-4o (omni) is OpenAI\'s native multimodal model, faster and cheaper than GPT-4 Turbo, with strong performance in writing, coding, and STEM. Supports image input and structured outputs.'
        },
        prompt: {
          zh: '你是一个多才多艺的 AI 助手，能够处理文字、图像和代码任务。请根据用户提供的内容（文字或图片）给出详细、准确的分析和建议。',
          en: 'You are a versatile AI assistant capable of handling text, image, and coding tasks. Provide detailed and accurate analysis or suggestions based on whatever content the user provides—text or images.'
        },
        tags: ['热门', '多模态', '视觉'],
        contextLength: 128000,
        pricing: { input: '$2.50/M', output: '$10.00/M' },
        publishedAt: '2024-05-13',
        capabilities: ['文本', '图像', '代码', '视觉'],
        type: 'chat',
        featureTags: ['原生多模态', '结构化输出'],
        isOpenSource: false
      },
      {
        id: 'o3',
        name: 'o3',
        description: {
          zh: 'OpenAI 旗舰推理模型，擅长数学、科学、复杂视觉任务，支持 200K 上下文。',
          en: 'OpenAI\'s flagship reasoning model excelling at math, science, and complex visual tasks with 200K context.'
        },
        fullDescription: {
          zh: 'o3 是 OpenAI o 系列推理模型旗舰，在复杂多步推理、数学和科学任务上超越前代，通过内部思维链进行深度推理，支持 200K token 上下文窗口。',
          en: 'o3 is the flagship of OpenAI\'s o-series reasoning models. It outperforms its predecessors on complex multi-step reasoning, mathematics, and scientific tasks through deep chain-of-thought reasoning, supporting a 200K token context window.'
        },
        prompt: {
          zh: '你是一个擅长深度推理的 AI 助手。面对复杂问题，请系统地分解为子问题，逐步推导，展示清晰的思维过程，并在得出结论前验证每一步的正确性。',
          en: 'You are an AI assistant specialized in deep reasoning. For complex problems, systematically break them into sub-problems, derive step by step, show clear reasoning, and verify each step before drawing conclusions.'
        },
        tags: ['推理', '代码'],
        contextLength: 200000,
        pricing: { input: '$2.00/M', output: '$8.00/M' },
        publishedAt: '2025-04-16',
        capabilities: ['文本', '代码', '视觉', '推理'],
        type: 'reasoning',
        featureTags: ['思维链', '200K上下文'],
        isOpenSource: false
      },
      {
        id: 'o4-mini',
        name: 'o4-mini',
        description: {
          zh: '轻量级推理模型，数学与代码能力突出，价格仅为 o3 的一半。',
          en: 'Lightweight reasoning model with outstanding math and coding ability at half the cost of o3.'
        },
        fullDescription: {
          zh: 'o4-mini 是紧凑型推理模型，在数学、编码和视觉任务上性能出色，成本显著低于 o3，适合需要推理能力但预算有限的高频调用场景。',
          en: 'o4-mini is a compact reasoning model with excellent performance on math, coding, and visual tasks at a significantly lower cost than o3. Ideal for high-frequency use cases that require reasoning capabilities on a budget.'
        },
        prompt: {
          zh: '你是一个高效的推理助手，专注于数学计算、代码调试和逻辑分析。请给出简洁但严谨的推理过程，避免冗余，直达核心答案。',
          en: 'You are an efficient reasoning assistant focused on mathematical computation, code debugging, and logical analysis. Provide concise yet rigorous reasoning, avoiding redundancy and going straight to the core answer.'
        },
        tags: ['推理', '经济', '代码'],
        contextLength: 200000,
        pricing: { input: '$1.10/M', output: '$4.40/M' },
        publishedAt: '2025-04-16',
        capabilities: ['文本', '代码', '视觉', '推理'],
        type: 'reasoning',
        featureTags: ['思维链', '高性价比'],
        isOpenSource: false
      }
    ]
  },

  // ============================================================================
  // Anthropic
  // ============================================================================
  {
    id: 'anthropic',
    name: 'Anthropic',
    providerId: 'anthropic',
    color: '#d97706',
    models: [
      {
        id: 'claude-opus-4-5',
        name: 'Claude Opus 4.5',
        description: {
          zh: 'Anthropic 旗舰模型，在长程 Agent 任务、复杂代码、多步推理上表现最强。',
          en: 'Anthropic\'s flagship model, delivering top performance on long-horizon agent tasks, complex coding, and multi-step reasoning.'
        },
        fullDescription: {
          zh: 'Claude Opus 4.5 是 Anthropic 迄今最强模型，SWE-bench 编码任务领先，Token 效率提升 65%，是首次纳入 Notion Agent 的 Opus 版本，支持扩展思考（Extended Thinking）模式。',
          en: 'Claude Opus 4.5 is Anthropic\'s most powerful model to date, leading on SWE-bench coding tasks with 65% better token efficiency. It\'s the first Opus version to be integrated into Notion Agent, supporting Extended Thinking mode.'
        },
        prompt: {
          zh: '你是 Claude，Anthropic 训练的 AI 助手。你以诚实、无害、乐于助人为核心原则。面对复杂任务，请深思熟虑，提供详尽、有深度的回答，必要时使用扩展思考模式来解决多步骤问题。',
          en: 'You are Claude, an AI assistant trained by Anthropic. Your core principles are honesty, harmlessness, and helpfulness. For complex tasks, think carefully and provide thorough, nuanced responses. Use extended thinking when solving multi-step problems.'
        },
        tags: ['热门', '推理', '代码'],
        contextLength: 200000,
        pricing: { input: '$5.00/M', output: '$25.00/M' },
        publishedAt: '2025-11-24',
        capabilities: ['文本', '图像', '代码', '工具调用'],
        type: 'chat',
        featureTags: ['Extended Thinking', '200K上下文', 'Agent'],
        isOpenSource: false
      },
      {
        id: 'claude-sonnet-4-5',
        name: 'Claude Sonnet 4.5',
        description: {
          zh: '性能与成本的最佳均衡点，SWE-bench 77.2%，可自主运行超30小时复杂任务。',
          en: 'The ideal balance of performance and cost—77.2% on SWE-bench, capable of autonomous complex tasks for 30+ hours.'
        },
        fullDescription: {
          zh: 'Claude Sonnet 4.5 是 Claude 4.5 系列的核心模型，以均衡的性价比提供前沿代码和推理能力，支持长时间自主 Agent 工作，是大多数生产场景的首选。',
          en: 'Claude Sonnet 4.5 is the core model of the Claude 4.5 series, offering cutting-edge coding and reasoning at a balanced price. It supports long-horizon autonomous agent work and is the preferred choice for most production scenarios.'
        },
        prompt: {
          zh: '你是一个智能、高效的 AI 助手，擅长代码开发、文档写作和复杂分析。请以专业、清晰的方式回答，对于编程问题提供完整可运行的代码，对于分析任务给出结构化的洞察。',
          en: 'You are an intelligent, efficient AI assistant skilled in software development, document writing, and complex analysis. Respond professionally and clearly. For coding problems, provide complete and runnable code. For analytical tasks, deliver structured insights.'
        },
        tags: ['热门', '代码', '多模态'],
        contextLength: 200000,
        pricing: { input: '$3.00/M', output: '$15.00/M' },
        publishedAt: '2025-09-29',
        capabilities: ['文本', '图像', '代码', '工具调用'],
        type: 'chat',
        featureTags: ['Extended Thinking', '200K上下文'],
        isOpenSource: false
      },
      {
        id: 'claude-haiku-4-5',
        name: 'Claude Haiku 4.5',
        description: {
          zh: 'Claude 4.5 系列最轻量版本，接近 Sonnet 4 的性能，价格降低三分之一。',
          en: 'The lightest model in the Claude 4.5 series—Sonnet 4-level performance at one-third the cost.'
        },
        fullDescription: {
          zh: 'Claude Haiku 4.5 以仅 $1/$5 per MTok 的价格提供接近 Claude Sonnet 4 的能力，适合高频轻量任务、实时交互和大规模部署，支持高吞吐量并发。',
          en: 'Claude Haiku 4.5 delivers near-Claude Sonnet 4 capability at just $1/$5 per MTok. Ideal for high-frequency lightweight tasks, real-time interactions, and large-scale deployments with high-throughput concurrency.'
        },
        prompt: {
          zh: '你是一个快速响应的 AI 助手。请提供简洁、准确的回答，避免不必要的冗余。对于简单问题直接给出答案，对于复杂问题先给出核心结论再按需补充细节。',
          en: 'You are a fast-responding AI assistant. Provide concise and accurate answers without unnecessary verbosity. For simple questions, give direct answers. For complex ones, lead with the core conclusion and add details only as needed.'
        },
        tags: ['快速', '经济'],
        contextLength: 200000,
        pricing: { input: '$1.00/M', output: '$5.00/M' },
        publishedAt: '2025-10-01',
        capabilities: ['文本', '图像', '代码'],
        type: 'chat',
        featureTags: ['低延迟', '高吞吐'],
        isOpenSource: false
      }
    ]
  },

  // ============================================================================
  // Google
  // ============================================================================
  {
    id: 'google',
    name: 'Google',
    providerId: 'google',
    color: '#4285f4',
    models: [
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        description: {
          zh: 'Google 推理旗舰，原生混合推理（Thinking）模式，支持 1M Token 上下文。',
          en: 'Google\'s reasoning flagship with native hybrid Thinking mode, supporting 1M token context.'
        },
        fullDescription: {
          zh: 'Gemini 2.5 Pro 是 Google 首个原生混合推理模型，在代码和复杂推理任务上领先，支持 1M token 上下文、视频/音频输入及 Grounding with Google Search。',
          en: 'Gemini 2.5 Pro is Google\'s first native hybrid reasoning model, leading in coding and complex reasoning tasks. It supports 1M token context, video/audio input, and Grounding with Google Search.'
        },
        prompt: {
          zh: '你是 Gemini，Google 开发的 AI 助手。你能处理文本、图像、音频和视频等多种模态。请综合利用你的推理能力和知识，提供深思熟虑、有据可查的回答。当需要最新信息时，请主动使用搜索工具。',
          en: 'You are Gemini, an AI assistant developed by Google. You can handle text, images, audio, and video modalities. Leverage your reasoning capabilities and knowledge to provide well-reasoned, evidence-based answers. Use search tools proactively when up-to-date information is needed.'
        },
        tags: ['热门', '推理', '长上下文', '多模态'],
        contextLength: 1000000,
        pricing: { input: '$1.25/M', output: '$10.00/M' },
        publishedAt: '2025-06-17',
        capabilities: ['文本', '图像', '视频', '音频', '代码'],
        type: 'chat',
        featureTags: ['Thinking Mode', '1M上下文', '原生多模态', 'Google Search'],
        isOpenSource: false
      },
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        description: {
          zh: '均衡快速模型，Thinking 模式默认开启，1M 上下文，性价比突出。',
          en: 'A balanced, fast model with Thinking mode enabled by default, 1M context, and outstanding cost efficiency.'
        },
        fullDescription: {
          zh: 'Gemini 2.5 Flash 以极低成本提供推理能力，Thinking 模式默认启用，适合高吞吐生产场景，兼具速度与智能，支持 1M token 上下文。',
          en: 'Gemini 2.5 Flash delivers reasoning capabilities at minimal cost with Thinking mode enabled by default. It\'s designed for high-throughput production scenarios, balancing speed and intelligence with 1M token context.'
        },
        prompt: {
          zh: '你是一个快速、智能的 AI 助手，能够高效处理各类任务。请在保证质量的前提下，尽量简洁地回答问题。对于需要推理的任务，展示简明的思维过程；对于日常任务，直接提供答案。',
          en: 'You are a fast and intelligent AI assistant capable of handling a wide range of tasks efficiently. Be concise while maintaining quality. For reasoning tasks, show a brief thought process; for everyday tasks, provide direct answers.'
        },
        tags: ['热门', '快速', '经济', '推理'],
        contextLength: 1000000,
        pricing: { input: '$0.30/M', output: '$2.50/M' },
        publishedAt: '2025-06-17',
        capabilities: ['文本', '图像', '视频', '代码'],
        type: 'chat',
        featureTags: ['Thinking Mode', '1M上下文'],
        isOpenSource: false
      },
      {
        id: 'gemini-2.5-flash-lite',
        name: 'Gemini 2.5 Flash-Lite',
        description: {
          zh: '成本最低的 2.5 系列模型，专为高吞吐低延迟场景设计。',
          en: 'The most cost-efficient model in the 2.5 series, designed for high-throughput, low-latency scenarios.'
        },
        fullDescription: {
          zh: 'Gemini 2.5 Flash-Lite 是 Gemini 家族中价格最低的成员，适合分类、路由、自动补全等对成本极度敏感的高频任务，仍支持 1M token 上下文。',
          en: 'Gemini 2.5 Flash-Lite is the most affordable member of the Gemini family, suited for cost-sensitive, high-frequency tasks like classification, routing, and autocompletion—while still supporting a 1M token context.'
        },
        prompt: {
          zh: '你是一个轻量级 AI 助手，专注于快速、准确地完成具体任务，如分类、摘要，信息提取和简短问答。请保持回答简洁，避免不必要的扩展。',
          en: 'You are a lightweight AI assistant focused on quickly and accurately completing specific tasks such as classification, summarization, information extraction, and short Q&A. Keep responses concise and avoid unnecessary elaboration.'
        },
        tags: ['经济', '快速'],
        contextLength: 1000000,
        pricing: { input: '$0.10/M', output: '$0.40/M' },
        publishedAt: '2025-07-01',
        capabilities: ['文本', '图像', '代码'],
        type: 'chat',
        featureTags: ['极低成本', '1M上下文'],
        isOpenSource: false
      }
    ]
  },

  // ============================================================================
  // Meta
  // ============================================================================
  {
    id: 'meta',
    name: 'Meta',
    providerId: 'meta',
    color: '#1877f2',
    models: [
      {
        id: 'llama-4-maverick',
        name: 'Llama 4 Maverick',
        description: {
          zh: 'Meta 旗舰开源多模态模型，400B 参数/17B 激活，原生多模态，1M Token 上下文。',
          en: 'Meta\'s flagship open-source multimodal model—400B params / 17B active, native multimodal, 1M token context.'
        },
        fullDescription: {
          zh: 'Llama 4 Maverick 是 Meta 首款原生多模态 MoE 开源模型，128 个专家，在多模态基准上超越 GPT-4o 和 Gemini 2.0 Flash，接近 DeepSeek-V3 的推理编码性能，MIT 开源可商用。',
          en: 'Llama 4 Maverick is Meta\'s first native multimodal MoE open-source model with 128 experts. It surpasses GPT-4o and Gemini 2.0 Flash on multimodal benchmarks, matches DeepSeek-V3 on reasoning and coding, and is MIT-licensed for commercial use.'
        },
        prompt: {
          zh: '你是 Llama，由 Meta 开发的开源 AI 助手。你能理解文本和图像，擅长多语言交流、代码生成和复杂推理。请以开放、包容的方式回答用户问题，尊重不同文化和观点。',
          en: 'You are Llama, an open-source AI assistant developed by Meta. You can understand text and images, and excel at multilingual communication, code generation, and complex reasoning. Respond openly and inclusively, respecting diverse cultures and perspectives.'
        },
        tags: ['热门', '多模态', '视觉', '开源', '长上下文'],
        contextLength: 1000000,
        pricing: { input: '$0.50/M', output: '$0.77/M' },
        publishedAt: '2025-04-05',
        capabilities: ['文本', '图像', '视觉', '代码'],
        type: 'chat',
        modelSize: '400B (17B active)',
        featureTags: ['MoE架构', '开源可部署', '原生多模态'],
        isOpenSource: true
      },
      {
        id: 'llama-4-scout',
        name: 'Llama 4 Scout',
        description: {
          zh: '业界最长上下文开源模型，支持 10M Token，单张 H100 GPU 可部署。',
          en: 'The open-source model with the world\'s longest context—10M tokens, deployable on a single H100 GPU.'
        },
        fullDescription: {
          zh: 'Llama 4 Scout 拥有业界最长的 10M token 上下文窗口，使用 iRoPE 架构实现超长序列扩展，可在单张 H100 GPU 上部署，适合超大文档分析和超长代码库处理。',
          en: 'Llama 4 Scout boasts the industry\'s longest 10M token context window, achieved via the iRoPE architecture for ultra-long sequence extension. It\'s deployable on a single H100 GPU and ideal for analyzing massive documents or processing extremely large codebases.'
        },
        prompt: {
          zh: '你是一个专为超长上下文设计的 AI 助手。你可以处理超大文档、长代码库和多文件分析。请在分析时注意跨越文档不同部分的关联性，提供全面且有洞察力的总结。',
          en: 'You are an AI assistant designed for ultra-long context. You can process massive documents, large codebases, and multi-file analysis. Pay attention to cross-document relationships and provide comprehensive, insightful summaries.'
        },
        tags: ['长上下文', '开源', '经济'],
        contextLength: 10000000,
        pricing: { input: '$0.11/M', output: '$0.34/M' },
        publishedAt: '2025-04-05',
        capabilities: ['文本', '图像', '代码'],
        type: 'chat',
        modelSize: '109B (17B active)',
        featureTags: ['10M上下文', '单卡可部署', '开源'],
        isOpenSource: true
      },
      {
        id: 'llama-3-3-70b',
        name: 'Llama 3.3 70B',
        description: {
          zh: 'Meta 成熟主流开源文本模型，性能对标 GPT-4o，完全开源免费自部署。',
          en: 'Meta\'s mature, mainstream open-source text model—GPT-4o-level performance, fully open-source and self-hostable.'
        },
        fullDescription: {
          zh: 'Llama 3.3 70B 是 Meta 开源生态的主力文本模型，多项基准对标 GPT-4o，采用 MIT 许可协议，可免费商用和自部署，是企业私有化部署的首选方案之一。',
          en: 'Llama 3.3 70B is the workhorse of Meta\'s open-source ecosystem. It matches GPT-4o on multiple benchmarks, is MIT-licensed for free commercial use and self-deployment, and is one of the top choices for enterprise private deployments.'
        },
        prompt: {
          zh: '你是一个开源的 AI 助手，基于 Meta 的 Llama 3.3 模型。请以客观、中立的方式回答问题，在涉及专业领域时注明知识局限性，并鼓励用户参考权威来源进行验证。',
          en: 'You are an open-source AI assistant based on Meta\'s Llama 3.3 model. Answer questions objectively and neutrally. Acknowledge knowledge limitations in specialized domains and encourage users to verify with authoritative sources.'
        },
        tags: ['开源', '经济'],
        contextLength: 128000,
        pricing: { input: '开源自部署', output: '开源自部署' },
        publishedAt: '2024-12-06',
        capabilities: ['文本', '代码'],
        type: 'chat',
        modelSize: '70B',
        featureTags: ['MIT开源', '自部署'],
        isOpenSource: true
      }
    ]
  },

  // ============================================================================
  // DeepSeek
  // ============================================================================
  {
    id: 'deepseek',
    name: 'DeepSeek',
    providerId: 'deepseek',
    color: '#2563eb',
    models: [
      {
        id: 'deepseek-v3',
        name: 'DeepSeek V3',
        description: {
          zh: '极致性价比的 MoE 通用模型，价格比 GPT-4o 低约 10 倍，开源可自部署。',
          en: 'The ultimate cost-efficient MoE general model—~10x cheaper than GPT-4o, open-source and self-deployable.'
        },
        fullDescription: {
          zh: 'DeepSeek V3 (deepseek-chat) 是当前最具性价比的旗舰模型之一，MoE 架构兼顾性能与效率，比同级闭源模型便宜 10-30 倍，支持 128K 上下文，MIT 开源，缓存命中后输入价格低至 $0.028/M。',
          en: 'DeepSeek V3 (deepseek-chat) is one of the most cost-effective flagship models available. Its MoE architecture balances performance and efficiency, costing 10–30x less than comparable closed-source models. It supports 128K context, is MIT-licensed, and offers cached input pricing as low as $0.028/M.'
        },
        prompt: {
          zh: '你是 DeepSeek，一个由深度求索开发的 AI 助手。你擅长中英文双语任务、代码开发、数学推理和文本分析。请以专业、严谨的态度回答问题，对于不确定的内容主动说明。',
          en: 'You are DeepSeek, an AI assistant developed by DeepSeek. You excel at bilingual (Chinese/English) tasks, software development, mathematical reasoning, and text analysis. Answer professionally and rigorously, and openly acknowledge uncertainty when it arises.'
        },
        tags: ['热门', '经济', '开源'],
        contextLength: 128000,
        pricing: { input: '$0.27/M', output: '$0.42/M' },
        publishedAt: '2025-12-01',
        capabilities: ['文本', '代码', '工具调用'],
        type: 'chat',
        modelSize: '671B MoE',
        featureTags: ['开源', 'MIT许可', '极低成本', '缓存优化'],
        isOpenSource: true
      },
      {
        id: 'deepseek-r1',
        name: 'DeepSeek R1',
        description: {
          zh: '具有可见思维链的开源推理模型，数学与代码能力顶尖，价格远低于同类闭源产品。',
          en: 'Open-source reasoning model with visible chain-of-thought, top-tier math and coding, at a fraction of closed-source costs.'
        },
        fullDescription: {
          zh: 'DeepSeek R1 是首个媲美 OpenAI o1 水平的开源推理模型，支持显式链式思维（Chain-of-Thought），在数学、代码、逻辑推理上表现卓越，价格仅为 o1 的约 1/20，MIT 开源。',
          en: 'DeepSeek R1 is the first open-source reasoning model matching OpenAI o1\'s performance. It supports explicit Chain-of-Thought, excels at math, code, and logical reasoning, costs roughly 1/20th of o1, and is MIT-licensed.'
        },
        prompt: {
          zh: '你是 DeepSeek R1，一个擅长深度推理的 AI 助手。面对复杂问题，请展开完整的思维链过程：先理解问题，再逐步推导，最后给出明确结论。你的推理过程应透明、可验证。',
          en: 'You are DeepSeek R1, an AI assistant specialized in deep reasoning. For complex problems, unfold a complete chain of thought: first understand the problem, then derive step by step, and finally present a clear conclusion. Your reasoning should be transparent and verifiable.'
        },
        tags: ['推理', '代码', '经济', '开源'],
        contextLength: 128000,
        pricing: { input: '$0.55/M', output: '$2.19/M' },
        publishedAt: '2025-01-20',
        capabilities: ['文本', '代码', '推理'],
        type: 'reasoning',
        modelSize: '671B MoE',
        featureTags: ['思维链可见', '开源', 'MIT许可'],
        isOpenSource: true
      }
    ]
  },

  // ============================================================================
  // 智谱AI
  // ============================================================================
  {
    id: 'zhipu',
    name: '智谱AI',
    providerId: 'zhipu',
    color: '#6366f1',
    models: [
      {
        id: 'glm-4-6',
        name: 'GLM-4.6',
        description: {
          zh: '智谱旗舰编程模型，MoE 355B 架构，多项基准对齐 Claude Sonnet 4，200K 上下文。',
          en: 'Zhipu\'s flagship coding model with MoE 355B architecture, benchmarked against Claude Sonnet 4, with 200K context.'
        },
        fullDescription: {
          zh: 'GLM-4.6 基于 MoE 架构，在 CC-Bench 覆盖六大开发领域的 52 个编程任务中表现优异，支持工具调用、图像识别和联网搜索，支持国产芯片（寒武纪/摩尔线程）部署。',
          en: 'GLM-4.6 is built on a MoE architecture and excels across 52 programming tasks in CC-Bench spanning 6 development domains. It supports tool calling, image recognition, and web search, and can be deployed on domestic Chinese chips (Cambricon/Moore Threads).'
        },
        prompt: {
          zh: '你是 GLM，智谱 AI 开发的大语言模型助手。你擅长中文理解、代码生成、工具调用和联网检索。请以专业、流畅的中文回答用户问题，在处理编程任务时提供可运行的代码示例，在需要实时信息时主动使用搜索工具。',
          en: 'You are GLM, a large language model assistant developed by Zhipu AI. You excel at Chinese comprehension, code generation, tool calling, and web search. Respond professionally in fluent Chinese, provide runnable code examples for programming tasks, and use search tools proactively when real-time information is needed.'
        },
        tags: ['热门', '代码', '新品'],
        contextLength: 200000,
        pricing: { input: '¥5/M', output: '¥5/M' },
        publishedAt: '2025-07-01',
        capabilities: ['文本', '图像', '代码', '工具调用', '联网'],
        type: 'chat',
        modelSize: '355B MoE (12B active)',
        featureTags: ['国产芯片适配', 'FP8量化', '200K上下文'],
        isOpenSource: false
      },
      {
        id: 'glm-4-flash',
        name: 'GLM-4-Flash',
        description: {
          zh: '完全免费的轻量模型，生成速度高达 72 t/s，适合高频低成本场景。',
          en: 'A completely free lightweight model with generation speeds up to 72 t/s, ideal for high-frequency, low-cost scenarios.'
        },
        fullDescription: {
          zh: 'GLM-4-Flash 是智谱对外完全免费开放的轻量大模型，生成速度约 72 tokens/s，适合 To C 产品覆盖亿级用户的高频调用场景，是入门级 AI 集成的理想选择。',
          en: 'GLM-4-Flash is Zhipu\'s fully free lightweight model with ~72 tokens/s generation speed. It\'s ideal for consumer products serving hundreds of millions of users in high-frequency scenarios and is a perfect choice for entry-level AI integration.'
        },
        prompt: {
          zh: '你是一个免费、快速的 AI 助手。请高效地回答用户的日常问题，保持回答简洁明了，适合快速问答、简单文本处理和基础信息查询等轻量级任务。',
          en: 'You are a free, fast AI assistant. Efficiently answer everyday questions with concise and clear responses. Best suited for lightweight tasks such as quick Q&A, simple text processing, and basic information queries.'
        },
        tags: ['经济', '快速'],
        contextLength: 128000,
        pricing: { input: '免费', output: '免费' },
        publishedAt: '2024-07-01',
        capabilities: ['文本', '代码'],
        type: 'chat',
        featureTags: ['完全免费', '极速响应'],
        isOpenSource: false
      },
      {
        id: 'glm-z1-airx',
        name: 'GLM-Z1-AirX',
        description: {
          zh: '国内最快推理模型，200 tokens/s，DeepSeek-R1 媲美性能，价格仅 1/30。',
          en: 'China\'s fastest reasoning model—200 tokens/s, DeepSeek-R1-level performance at 1/30th the cost.'
        },
        fullDescription: {
          zh: 'GLM-Z1-AirX 是智谱推理模型系列的极速版，推理速度高达 200 tokens/s（比常规快8倍），性能媲美 DeepSeek-R1，价格仅为后者的 1/30，32B 开源，适合高频推理场景。',
          en: 'GLM-Z1-AirX is the ultra-fast version of Zhipu\'s reasoning model series, achieving 200 tokens/s (8x faster than typical). It matches DeepSeek-R1 in performance at 1/30th the cost, is open-source at 32B, and is ideal for high-frequency reasoning tasks.'
        },
        prompt: {
          zh: '你是 GLM-Z1，一个擅长快速推理的 AI 助手。请以高效的方式完成推理任务，展示清晰的思维链过程，同时保持极快的响应速度。对于复杂问题，请给出完整的推导过程；对于简单问题，直接给出答案。',
          en: 'You are GLM-Z1, an AI assistant specialized in fast reasoning. Complete reasoning tasks efficiently, demonstrate a clear chain of thought, and maintain rapid response times. Provide full derivations for complex problems and direct answers for simple ones.'
        },
        tags: ['推理', '快速', '经济'],
        contextLength: 128000,
        pricing: { input: '¥0.2/M', output: '¥0.6/M' },
        publishedAt: '2025-04-14',
        capabilities: ['文本', '代码', '推理'],
        type: 'reasoning',
        modelSize: '32B',
        featureTags: ['极速推理', '思维链', '开源'],
        isOpenSource: true
      }
    ]
  },

  // ============================================================================
  // MiniMax
  // ============================================================================
  {
    id: 'minimax',
    name: 'MiniMax',
    providerId: 'minimax',
    color: '#ec4899',
    models: [
      {
        id: 'minimax-m2-5',
        name: 'MiniMax M2.5',
        description: {
          zh: '最新旗舰，SWE-bench 80.2%，Agent 任务速度媲美 Claude Opus 4.6，智能到几乎免费。',
          en: 'Latest flagship—SWE-bench 80.2%, agent task speed rivaling Claude Opus 4.6, at near-free pricing.'
        },
        fullDescription: {
          zh: 'MiniMax M2.5 在 SWE-Bench Verified（80.2%）、Multi-SWE-Bench（51.3%）、BrowseComp（76.3%）全面领先，集成 Office 技能（Word/PPT/Excel），MIT 开源，230B MoE 架构。',
          en: 'MiniMax M2.5 leads across SWE-Bench Verified (80.2%), Multi-SWE-Bench (51.3%), and BrowseComp (76.3%). It integrates Office skills (Word/PPT/Excel), is MIT-licensed, and uses a 230B MoE architecture.'
        },
        prompt: {
          zh: '你是 MiniMax M2.5，一个顶尖的 AI 助手，专为 Agent 任务和复杂软件工程设计。你能高效地使用工具、浏览网页、处理 Office 文档。请主动利用这些能力来完成用户的复杂任务，并在每步操作前说明你的计划。',
          en: 'You are MiniMax M2.5, a top-tier AI assistant designed for agent tasks and complex software engineering. You can efficiently use tools, browse the web, and handle Office documents. Proactively leverage these capabilities for complex tasks and explain your plan before each step.'
        },
        tags: ['热门', '新品', '代码', '经济'],
        contextLength: 205000,
        pricing: { input: '$0.30/M', output: '$1.20/M' },
        publishedAt: '2026-03-03',
        capabilities: ['文本', '代码', '工具调用', 'Office'],
        type: 'chat',
        modelSize: '230B MoE (10B active)',
        featureTags: ['Agent SOTA', 'MIT开源', 'Office技能'],
        isOpenSource: true
      },
      {
        id: 'minimax-m2',
        name: 'MiniMax M2',
        description: {
          zh: '开源旗舰，230B MoE 架构，兼顾工具调用、推理与搜索，价格极具竞争力。',
          en: 'Open-source flagship with 230B MoE architecture, balancing tool use, reasoning, and search at highly competitive pricing.'
        },
        fullDescription: {
          zh: 'MiniMax M2 以 Claude 3.5 Sonnet 8% 的成本提供相近性能，推理速度约 100 tokens/s，230B MoE 架构，MIT 开源，多路并发适合规模化部署。',
          en: 'MiniMax M2 delivers performance comparable to Claude 3.5 Sonnet at just 8% of the cost, with ~100 tokens/s inference speed, a 230B MoE architecture, MIT license, and multi-route concurrency suited for large-scale deployments.'
        },
        prompt: {
          zh: '你是 MiniMax M2，一个开源的高性能 AI 助手。你擅长工具调用，信息检索和代码开发。请以高效，专业的方式完成任务，在使用工具时清晰说明调用原因，并将结果整合到最终答案中。',
          en: 'You are MiniMax M2, a high-performance open-source AI assistant. You excel at tool calling, information retrieval, and code development. Complete tasks efficiently and professionally. Clearly explain why you\'re calling each tool and integrate results into the final answer.'
        },
        tags: ['开源', '经济', '代码'],
        contextLength: 205000,
        pricing: { input: '$0.26/M', output: '$1.00/M' },
        publishedAt: '2025-10-23',
        capabilities: ['文本', '代码', '工具调用'],
        type: 'chat',
        modelSize: '230B MoE (10B active)',
        featureTags: ['MIT开源', '100 TPS'],
        isOpenSource: true
      },
      {
        id: 'minimax-01',
        name: 'MiniMax-01',
        description: {
          zh: '百万 Token 超长上下文模型，输入价格 $0.20/M，适合超长文档处理。',
          en: 'Million-token ultra-long context model at $0.20/M input—ideal for processing extremely long documents.'
        },
        fullDescription: {
          zh: 'MiniMax-01 提供业界领先的百万 Token 上下文窗口，以极低价格实现超长文档分析、多文档对比和大型代码库处理，是长上下文场景中性价比最高的选择之一。',
          en: 'MiniMax-01 offers an industry-leading 1M token context window at minimal cost, enabling ultra-long document analysis, multi-document comparison, and large codebase processing. It\'s one of the best cost-performance options for long-context scenarios.'
        },
        prompt: {
          zh: '你是一个专为长文档处理设计的 AI 助手，支持高达 100 万 Token 的上下文。你可以分析超长文档、对比多个文件、理解庞大的代码库。请充分利用你的长上下文能力，在回答时注意引用文档中的具体内容作为支撑。',
          en: 'You are an AI assistant designed for long document processing with up to 1 million token context. You can analyze ultra-long documents, compare multiple files, and understand large codebases. Leverage your long-context capability fully and cite specific document content to support your answers.'
        },
        tags: ['长上下文', '经济'],
        contextLength: 1000000,
        pricing: { input: '$0.20/M', output: '$1.10/M' },
        publishedAt: '2025-01-15',
        capabilities: ['文本', '代码'],
        type: 'chat',
        featureTags: ['1M上下文', '极低成本'],
        isOpenSource: false
      }
    ]
  },

  // ============================================================================
  // Moonshot AI（月之暗面）
  // ============================================================================
  {
    id: 'moonshot',
    name: 'Moonshot AI',
    providerId: 'moonshot',
    color: '#7c3aed',
    models: [
      {
        id: 'kimi-k2-5',
        name: 'Kimi K2.5',
        description: {
          zh: '原生多模态 Agent 模型，独创 Agent Swarm 并行100智能体，BrowseComp 78.4%。',
          en: 'Native multimodal agent model with proprietary Agent Swarm parallelizing 100 agents, achieving 78.4% on BrowseComp.'
        },
        fullDescription: {
          zh: 'Kimi K2.5 是 Moonshot AI 最新开源旗舰模型，基于万亿参数 MoE 架构，训练于 15T 混合视觉文本数据，独创 Agent Swarm 技术可并行调度 100 个子智能体，比串行方式快 4.5 倍，MIT 开源。',
          en: 'Kimi K2.5 is Moonshot AI\'s latest open-source flagship, built on a trillion-parameter MoE architecture trained on 15T mixed vision-text data. Its proprietary Agent Swarm technology parallelizes 100 sub-agents, running 4.5x faster than serial execution. MIT-licensed.'
        },
        prompt: {
          zh: '你是 Kimi，月之暗面开发的 AI 助手。你擅长多模态理解、Agent 任务协同和网页浏览。在处理复杂任务时，你可以将任务分解并协调多个子任务并行执行。请以高效，透明的方式展示你的任务规划和执行过程。',
          en: 'You are Kimi, an AI assistant developed by Moonshot AI. You excel at multimodal understanding, agent task coordination, and web browsing. For complex tasks, decompose them and coordinate multiple sub-tasks in parallel. Present your task planning and execution process in an efficient and transparent manner.'
        },
        tags: ['热门', '新品', '多模态', '视觉', '开源'],
        contextLength: 256000,
        pricing: { input: '$0.60/M', output: '$2.50/M' },
        publishedAt: '2026-01-01',
        capabilities: ['文本', '图像', '视频', '代码', 'Agent'],
        type: 'chat',
        modelSize: '1T MoE (32B active)',
        featureTags: ['Agent Swarm', '原生多模态', '开源', '256K上下文'],
        isOpenSource: true
      },
      {
        id: 'kimi-k2-thinking',
        name: 'Kimi K2 Thinking',
        description: {
          zh: '深度推理版本，适合复杂多步骤指令与 Agent 任务，支持思维链输出。',
          en: 'Deep reasoning variant optimized for complex multi-step instructions and agent tasks with chain-of-thought output.'
        },
        fullDescription: {
          zh: 'Kimi K2 Thinking 是专为复杂推理、多步骤任务和 Agent 场景优化的深度思考版本，在高难度任务上表现更为稳定，输出清晰的思维链过程，适合需要高质量推理输出的场景。',
          en: 'Kimi K2 Thinking is the deep-thinking variant optimized for complex reasoning, multi-step tasks, and agent scenarios. It delivers more stable performance on difficult tasks with clear chain-of-thought output, suited for use cases requiring high-quality reasoning.'
        },
        prompt: {
          zh: '你是 Kimi K2 Thinking，一个专注于深度推理的 AI 助手。在回答问题前，请系统地思考：分析问题本质、识别关键约束、探索可能方案、评估每个方案的优劣，最后给出最优解答。你的思维过程应对用户可见且易于理解。',
          en: 'You are Kimi K2 Thinking, an AI assistant focused on deep reasoning. Before answering, think systematically: analyze the problem\'s essence, identify key constraints, explore possible solutions, evaluate each option\'s trade-offs, then deliver the optimal answer. Your thought process should be visible and easy to follow.'
        },
        tags: ['推理', '代码'],
        contextLength: 256000,
        pricing: { input: '$1.15/M', output: '$8.00/M' },
        publishedAt: '2025-11-06',
        capabilities: ['文本', '代码', '推理', 'Agent'],
        type: 'reasoning',
        featureTags: ['思维链', 'Deep Thinking'],
        isOpenSource: false
      }
    ]
  },

  // ============================================================================
  // 百度文心
  // ============================================================================
  {
    id: 'baidu',
    name: '百度文心',
    providerId: 'baidu-cloud',
    color: '#ef4444',
    models: [
      {
        id: 'ernie-5-0',
        name: '文心 5.0',
        description: {
          zh: '百度原生全模态旗舰，文本图像音频视频统一建模，LMArena 全球前十（中国第一）。',
          en: 'Baidu\'s native omni-modal flagship unifying text, image, audio, and video—global top-10 on LMArena, #1 in China.'
        },
        fullDescription: {
          zh: '文心 5.0 是百度最新一代原生全模态大模型，采用统一建模技术联合处理文本、图像、音频、视频四类模态，在 LMArena 评测中以 1460 分进入全球文本榜前十，创意写作尤为突出，深度集成百度搜索生态。',
          en: 'Wenxin 5.0 is Baidu\'s latest native omni-modal large model using unified modeling to jointly process text, images, audio, and video. It scored 1460 on LMArena to enter the global top 10 text leaderboard, with particularly outstanding creative writing, deeply integrated with Baidu\'s search ecosystem.'
        },
        prompt: {
          zh: '你是文心，百度开发的全模态 AI 助手。你能处理文字、图像、音频和视频内容，深度融合百度搜索知识。请以专业、准确的方式回答用户问题，在创意写作时发挥丰富的想象力，在信息查询时提供有据可查的答案。',
          en: 'You are Wenxin, Baidu\'s omni-modal AI assistant capable of processing text, images, audio, and video, deeply integrated with Baidu\'s search knowledge. Answer professionally and accurately. Show rich creativity in creative writing, and provide well-sourced answers for information queries.'
        },
        tags: ['热门', '新品', '多模态'],
        contextLength: 128000,
        pricing: { input: '价格详询千帆', output: '价格详询千帆' },
        publishedAt: '2026-01-22',
        capabilities: ['文本', '图像', '音频', '视频'],
        type: 'chat',
        featureTags: ['全模态', '百度搜索增强', 'LMArena前十'],
        isOpenSource: false
      },
      {
        id: 'ernie-4-5-turbo',
        name: '文心 4.5 Turbo',
        description: {
          zh: '多模态基础大模型，效果优化版，已于 2025年6月开源，47B MoE 架构。',
          en: 'Multimodal foundation model—optimized performance edition, open-sourced in June 2025 with a 47B MoE architecture.'
        },
        fullDescription: {
          zh: '文心 4.5 Turbo 基于文心 4.5 多模态基础模型，效果更优、成本更低，于 2025年6月30日正式开源（47B MoE 架构），支持预训练权重完全开放，是国内开源多模态模型的重要里程碑。',
          en: 'Wenxin 4.5 Turbo is built on the Wenxin 4.5 multimodal foundation model with improved performance and lower cost. It was fully open-sourced on June 30, 2025 (47B MoE architecture) with complete pre-trained weights—a major milestone for open-source multimodal models in China.'
        },
        prompt: {
          zh: '你是文心 4.5 Turbo，一个开源的多模态 AI 助手。你能理解图像和文字，擅长中文内容创作、图文分析和知识问答。请充分发挥你的多模态能力，为用户提供图文结合的丰富回答。',
          en: 'You are Wenxin 4.5 Turbo, an open-source multimodal AI assistant. You can understand images and text, excel at Chinese content creation, image-text analysis, and knowledge Q&A. Leverage your multimodal capabilities to provide rich, image-and-text-combined responses.'
        },
        tags: ['多模态', '开源'],
        contextLength: 128000,
        pricing: { input: '¥4/M', output: '¥12/M' },
        publishedAt: '2025-04-25',
        capabilities: ['文本', '图像', '代码'],
        type: 'chat',
        modelSize: '47B MoE',
        featureTags: ['开源', 'MoE架构', '预训练权重开放'],
        isOpenSource: true
      },
      {
        id: 'ernie-x1-turbo',
        name: '文心 X1 Turbo',
        description: {
          zh: '百度推理模型，幻觉控制国内领先，工具调用能力强，原生接入百度搜索。',
          en: 'Baidu\'s reasoning model with industry-leading hallucination control in China, strong tool use, and native Baidu Search integration.'
        },
        fullDescription: {
          zh: '文心 X1 Turbo 是百度推理专属模型，在中国信通院测评获最高级「4+级」，幻觉控制得分 80.56% 位列第一，内置百度搜索实现高精度实时检索，适合政务、医疗等高可信度场景。',
          en: 'Wenxin X1 Turbo is Baidu\'s dedicated reasoning model, achieving the highest \'4+ grade\' in China Academy of Information and Communications Technology evaluations, ranking first with an 80.56% hallucination control score. Built-in Baidu Search enables high-accuracy real-time retrieval, ideal for high-trust scenarios like government and healthcare.'
        },
        prompt: {
          zh: '你是文心 X1 Turbo，百度的推理大模型。你以高可信度、低幻觉为核心优势，深度集成百度搜索。在回答问题时，请优先基于可靠信息来源，明确区分已知事实与推断，在不确定时主动搜索验证，确保信息的准确性和可追溯性。',
          en: 'You are Wenxin X1 Turbo, Baidu\'s reasoning large model, with high reliability and minimal hallucination as your core strengths, deeply integrated with Baidu Search. When answering, prioritize reliable sources, clearly distinguish known facts from inferences, and proactively search to verify when uncertain—ensuring accuracy and traceability.'
        },
        tags: ['推理', '热门'],
        contextLength: 128000,
        pricing: { input: '¥4/M', output: '¥12/M' },
        publishedAt: '2025-04-25',
        capabilities: ['文本', '代码', '推理', '工具调用', '联网'],
        type: 'reasoning',
        featureTags: ['百度搜索增强', '深度思考', '幻觉控制'],
        isOpenSource: false
      }
    ]
  },

  // ============================================================================
  // 阶跃星辰
  // ============================================================================
  {
    id: 'stepfun',
    name: '阶跃星辰',
    providerId: 'stepfun',
    color: '#0891b2',
    models: [
      {
        id: 'step-3',
        name: 'Step 3',
        description: {
          zh: '阶跃星辰最新 MoE 旗舰，总参数321B，视觉推理能力顶尖，已开源。',
          en: 'StepFun\'s latest MoE flagship—321B total params, top-tier visual reasoning, open-sourced.'
        },
        fullDescription: {
          zh: 'Step 3 采用 MoE 架构并引入 MFA（多矩阵因子注意力）和 AFD（注意力-FFN分离）优化，预训练覆盖 20T 文本和 4T 图文混合数据，在数学、代码、多模态理解基准上均达到开源 SOTA。',
          en: 'Step 3 employs MoE architecture with MFA (Multi-matrix Factor Attention) and AFD (Attention-FFN Decoupling) optimizations, pretrained on 20T text and 4T mixed image-text data. It achieves open-source SOTA on math, code, and multimodal understanding benchmarks.'
        },
        prompt: {
          zh: '你是 Step 3，阶跃星辰开发的多模态 AI 助手。你具备强大的视觉理解和数学推理能力，能够分析图像中的细节、解决复杂数学问题和生成高质量代码。请综合运用这些能力，提供全面、准确的回答。',
          en: 'You are Step 3, a multimodal AI assistant developed by StepFun. You have strong visual understanding and mathematical reasoning capabilities, able to analyze image details, solve complex math problems, and generate high-quality code. Combine these abilities to provide comprehensive and accurate responses.'
        },
        tags: ['热门', '新品', '多模态', '推理', '开源'],
        contextLength: 256000,
        pricing: { input: '¥1.5/M', output: '¥4/M' },
        publishedAt: '2025-08-01',
        capabilities: ['文本', '图像', '代码', '推理'],
        type: 'chat',
        modelSize: '321B MoE (38B active)',
        featureTags: ['MFA架构', 'AFD优化', '开源'],
        isOpenSource: true
      },
      {
        id: 'step-3-5-flash',
        name: 'Step 3.5 Flash',
        description: {
          zh: '极速轻量推理模型，196B MoE 仅11B激活，256K上下文，AIME 2025 达 97.3%。',
          en: 'Ultra-fast lightweight reasoning model—196B MoE with only 11B active, 256K context, 97.3% on AIME 2025.'
        },
        fullDescription: {
          zh: 'Step 3.5 Flash 是阶跃星辰专为推理和 Agent 场景设计的轻量模型，AIME 2025 得分 97.3%，Agency-Bench 88.2，通过稀疏 MoE 实现极高推理效率，开源可自部署。',
          en: 'Step 3.5 Flash is StepFun\'s lightweight model designed for reasoning and agent scenarios. It scores 97.3% on AIME 2025 and 88.2 on Agency-Bench, achieving ultra-high reasoning efficiency through sparse MoE, and is open-source for self-deployment.'
        },
        prompt: {
          zh: '你是 Step 3.5 Flash，一个专为推理和 Agent 任务设计的高效 AI 助手。你在数学竞赛和自主任务执行方面表现卓越。请以快速、准确的方式完成推理任务，在执行 Agent 任务时主动规划步骤并逐一执行。',
          en: 'You are Step 3.5 Flash, an efficient AI assistant designed for reasoning and agent tasks. You excel at math competitions and autonomous task execution. Complete reasoning tasks quickly and accurately. For agent tasks, proactively plan steps and execute them one by one.'
        },
        tags: ['推理', '快速', '开源', '新品'],
        contextLength: 256000,
        pricing: { input: '详询平台', output: '详询平台' },
        publishedAt: '2025-10-01',
        capabilities: ['文本', '代码', '推理', 'Agent'],
        type: 'reasoning',
        modelSize: '196B MoE (11B active)',
        featureTags: ['极速推理', 'Agent能力', '开源'],
        isOpenSource: true
      },
      {
        id: 'step-1v',
        name: 'Step-1V',
        description: {
          zh: '千亿多模态视觉模型，在 SuperCLUE 多模态榜单中位列国内第一，接近 GPT-4o。',
          en: 'Hundred-billion-parameter multimodal vision model—#1 in China on SuperCLUE multimodal, approaching GPT-4o.'
        },
        fullDescription: {
          zh: 'Step-1V 是阶跃星辰的千亿参数多模态模型，在 SuperCLUE 多模态理解测评中位列国内第一，在细粒度视觉认知方面超越 GPT-4o，支持图像、视频理解及「拍照问」等应用场景。',
          en: 'Step-1V is StepFun\'s hundred-billion-parameter multimodal model, ranking #1 in China on SuperCLUE multimodal understanding evaluation. It surpasses GPT-4o on fine-grained visual cognition and supports image/video understanding and \'photo question\' scenarios.'
        },
        prompt: {
          zh: '你是 Step-1V，阶跃星辰的多模态视觉 AI 助手。你具备细粒度的视觉理解能力，可以分析图片中的文字、图表、场景和细节。在分析图像时，请从整体到细节进行系统描述，特别关注用户感兴趣的视觉元素。',
          en: 'You are Step-1V, StepFun\'s multimodal visual AI assistant with fine-grained visual understanding. You can analyze text, charts, scenes, and details in images. When analyzing images, provide systematic descriptions from overview to details, with special attention to visual elements the user is interested in.'
        },
        tags: ['多模态', '视觉'],
        contextLength: 32000,
        pricing: { input: '¥3/M', output: '¥9/M' },
        publishedAt: '2024-07-01',
        capabilities: ['文本', '图像', '视觉'],
        type: 'chat',
        modelSize: '~100B',
        featureTags: ['多模态理解', '细粒度视觉', 'SuperCLUE第一'],
        isOpenSource: false
      }
    ]
  }
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
