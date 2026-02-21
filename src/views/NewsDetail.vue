<template>
  <div class="animate-fade-in">
    <!-- Loading State -->
    <div v-if="newsStore.loading" class="min-h-screen flex items-center justify-center pt-20">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
    </div>

    <!-- News Content -->
    <div v-else-if="news">
      <!-- Page Header - 简洁白色设计 -->
      <div class="relative bg-white pt-32 pb-12 overflow-hidden">
        <!-- 背景装饰 -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl"></div>
        </div>

        <div class="relative container-custom">
          <div class="max-w-4xl mx-auto">
            <!-- Breadcrumb -->
            <div class="flex items-center text-sm text-gray-500 mb-6">
              <RouterLink to="/news" class="hover:text-gray-600 transition-colors">新闻动态</RouterLink>
              <svg class="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <span class="text-gray-400">新闻详情</span>
            </div>

            <span class="inline-block px-3 py-1 bg-primary-100 text-gray-900 rounded-full text-sm font-medium mb-4">{{ news.category }}</span>
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">{{ news.title }}</h1>
            <div class="flex items-center text-gray-500 space-x-6">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ news.author }}
              </span>
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(news.created_at) }}
              </span>
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ news.view_count }} 阅读
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Article Content -->
      <section class="py-16 bg-gray-50">
        <div class="container-custom">
          <div class="max-w-3xl mx-auto">
            <!-- Cover Image -->
            <div v-if="news.cover_image" class="aspect-video bg-gray-100 rounded-3xl overflow-hidden mb-8">
              <img :src="news.cover_image" :alt="news.title" class="w-full h-full object-cover" />
            </div>

            <!-- Summary -->
            <div class="bg-primary-50 border-l-4 border-primary-500 p-6 mb-8 rounded-r-2xl">
              <p class="text-gray-700 font-medium">{{ news.summary }}</p>
            </div>

            <!-- Content -->
            <article class="prose prose-lg max-w-none">
              <div class="markdown-content text-gray-800 leading-relaxed text-lg" v-html="renderedContent"></div>
            </article>

            <!-- Back Button -->
            <div class="mt-12 pt-8 border-t border-gray-200">
              <button @click="$router.back()" class="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回新闻列表
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Not Found -->
    <div v-else class="min-h-screen flex items-center justify-center pt-20">
      <div class="text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">新闻不存在</h1>
        <p class="text-gray-600 mb-8">抱歉，您访问的新闻不存在或已删除</p>
        <RouterLink to="/news" class="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors">
          返回新闻列表
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNewsStore } from '@/stores'
import type { NewsItem } from '@/types'
import { marked } from 'marked'

const route = useRoute()
const newsStore = useNewsStore()

const newsId = computed(() => Number(route.params.id))

// 默认新闻详情数据
const defaultNewsDetails: Record<number, NewsItem> = {
  1: {
    id: 1,
    title: 'TierFlow 智能分层推理引擎正式发布',
    summary: 'Eucal AI 推出首款产品 TierFlow，通过智能分层缓存与动态路由技术，将 AI 推理成本降低 70%，响应速度提升至毫秒级别。',
    content: `2026年2月20日，Eucal AI 正式宣布推出其首款产品——TierFlow 智能分层推理引擎。这款产品标志着公司在人工智能推理优化领域的重大突破。

**产品亮点**

TierFlow 采用创新的三层架构设计：

1. **智能分层缓存系统**
   基于语义相似度的多级缓存机制，能够自动识别和存储高频查询结果。通过向量数据库和语义匹配技术，缓存命中率达到 85% 以上，显著降低重复计算成本。

2. **动态模型路由引擎**
   实时评估任务复杂度，智能选择最优模型组合。简单任务自动分配至轻量级模型，复杂任务无缝升级至大语言模型，实现性能与成本的最佳平衡。

3. **高可用推理集群**
   多节点冗余部署架构，支持自动故障转移和负载均衡。经过严格测试，系统可用性达到 99.9%，可支持 10万+ QPS 的高并发场景。

**技术优势**

- 推理成本降低 70%，平均响应时间 50ms
- 支持 GPT、Claude、文心一言等主流大模型
- 企业级 SLA 保障，7×24小时技术支持
- 完善的 API 文档和开发者工具链

**客户反馈**

内测期间，TierFlow 已服务超过 50 家企业客户，涵盖电商、金融、教育等多个行业。客户普遍反馈推理成本大幅降低，系统稳定性显著提升。

**未来规划**

Eucal AI 创始人表示："TierFlow 只是我们征程的开始。未来我们将持续投入研发，推出更多创新产品，让 AI 技术惠及每一个企业。"

目前，TierFlow 已开放免费试用，欢迎访问官网了解更多详情。`,
    category: '产品动态',
    created_at: '2026-02-20',
    view_count: 1280,
    is_published: true,
    author: 'Eucal AI 团队',
  },
  2: {
    id: 2,
    title: 'Eucal AI 完成天使轮融资',
    summary: '公司成功完成数千万人民币天使轮融资，资金将用于 TierFlow 产品的持续研发和市场拓展。',
    content: `2026年2月15日，Eucal AI 宣布完成数千万人民币天使轮融资。本轮融资由知名投资机构领投，多家战略投资方跟投。

**融资背景**

Eucal AI 成立于2026年初，是一家专注于人工智能推理优化的创新型科技公司。公司核心团队来自全球顶尖高校和一线科技公司，在机器学习、分布式系统等领域拥有深厚积累。

**资金用途**

本轮融资资金将主要用于以下方向：

1. **产品研发**
   持续优化 TierFlow 智能分层推理引擎，开发更多企业级功能特性，提升产品竞争力。

2. **团队扩充**
   引进更多优秀的 AI 研发工程师和产品人才，加速技术创新和产品迭代。

3. **市场拓展**
   扩大销售和服务团队，深入服务更多行业客户，建立完善的合作伙伴生态。

4. **基础设施建设**
   扩建高性能推理集群，提升服务容量和稳定性，为全球客户提供优质服务。

**投资方评价**

领投方表示："AI 推理优化是一个极具潜力的细分市场。Eucal AI 团队技术实力雄厚，产品思路清晰，我们相信他们有望成为该领域的领导者。"

**未来展望**

公司创始人表示："这笔融资是对我们团队和产品的高度认可。我们将秉持'让 AI 推理更快、更省、更稳定'的使命，为客户创造更大价值。"

Eucal AI 计划在 2026 年下半年启动 Pre-A 轮融资，以支持更快速的发展。`,
    category: '公司新闻',
    created_at: '2026-02-15',
    view_count: 856,
    is_published: true,
    author: 'Eucal AI 团队',
  },
  3: {
    id: 3,
    title: 'TierFlow 与多家云服务商达成合作',
    summary: 'TierFlow 已正式接入主流云服务平台，为企业用户提供更便捷的部署和使用体验。',
    content: `2026年2月10日，Eucal AI 宣布 TierFlow 智能分层推理引擎已与多家主流云服务商达成战略合作，为企业用户提供更加便捷的部署和使用体验。

**合作内容**

TierFlow 现已正式接入以下云服务平台：

1. **公有云市场**
   TierFlow 已在多家云厂商的应用市场上线，用户可一键部署，快速接入智能推理优化服务。

2. **容器化部署**
   提供官方 Docker 镜像和 Kubernetes 部署方案，支持私有化部署和混合云架构。

3. **API 集成**
   标准化的 RESTful API 设计，与主流云平台服务无缝集成，降低接入门槛。

4. **联合解决方案**
   与云服务商联合推出行业解决方案，覆盖电商、金融、教育等多个垂直领域。

**客户收益**

通过与云服务商的合作，TierFlow 客户将获得：

- **便捷部署**：支持云端一键部署，最快 5 分钟完成接入
- **弹性扩容**：依托云平台弹性计算能力，自动应对流量高峰
- **成本优化**：结合云厂商优惠政策，进一步降低企业使用成本
- **安全保障**：继承云服务商的安全合规认证，满足企业级安全要求

**合作伙伴评价**

某云服务商负责人表示："TierFlow 是 AI 推理优化领域的创新产品，与我们的云服务形成完美互补。这次合作将为双方客户创造更大价值。"

**未来计划**

Eucal AI 计划在未来半年内与更多云服务商达成合作，同时探索 Serverless 等新兴部署模式，为客户提供更灵活的服务选择。

目前，TierFlow 云端版本已正式上线，新用户可享受 30 天免费试用。`,
    category: '合作动态',
    created_at: '2026-02-10',
    view_count: 642,
    is_published: true,
    author: 'Eucal AI 团队',
  },
}

const news = computed(() => {
  const storeNews = newsStore.currentNews
  if (storeNews) {
    return storeNews
  }
  // 如果没有从 API 获取到数据，使用默认数据
  return defaultNewsDetails[newsId.value]
})

// Markdown 渲染
const renderedContent = computed(() => {
  const content = news.value?.content
  if (!content) return '<p class="text-gray-500">暂无详细内容</p>'
  return marked.parse(content, { breaks: true })
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  if (newsId.value) {
    newsStore.loadNewsDetail(newsId.value)
  }
})
</script>

<style scoped>
/* Markdown 内容样式 */
.markdown-content :deep(h1) {
  @apply text-2xl font-bold text-gray-900 mt-8 mb-4;
}

.markdown-content :deep(h2) {
  @apply text-xl font-bold text-gray-900 mt-6 mb-3;
}

.markdown-content :deep(h3) {
  @apply text-lg font-bold text-gray-900 mt-5 mb-2;
}

.markdown-content :deep(p) {
  @apply mb-4 leading-relaxed;
}

.markdown-content :deep(ul), .markdown-content :deep(ol) {
  @apply mb-4 pl-6;
}

.markdown-content :deep(ul) {
  @apply list-disc;
}

.markdown-content :deep(ol) {
  @apply list-decimal;
}

.markdown-content :deep(li) {
  @apply mb-2;
}

.markdown-content :deep(strong) {
  @apply font-bold text-gray-900;
}

.markdown-content :deep(code) {
  @apply bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800;
}

.markdown-content :deep(pre) {
  @apply bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto mb-4;
}

.markdown-content :deep(pre code) {
  @apply bg-transparent text-gray-100 p-0;
}

.markdown-content :deep(blockquote) {
  @apply border-l-4 border-primary-500 pl-4 italic text-gray-600 my-4;
}

.markdown-content :deep(a) {
  @apply text-primary-600 hover:text-primary-700 underline;
}

.markdown-content :deep(hr) {
  @apply my-8 border-gray-200;
}

.markdown-content :deep(table) {
  @apply w-full border-collapse mb-4;
}

.markdown-content :deep(th), .markdown-content :deep(td) {
  @apply border border-gray-200 px-4 py-2 text-left;
}

.markdown-content :deep(th) {
  @apply bg-gray-50 font-semibold;
}
</style>
