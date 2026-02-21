# Eucal AI 官网项目记忆文档

## 项目概述
- **项目名称**: Eucal AI 公司官网
- **技术栈**: FastAPI (Python 3.10) + Vue 3 + Vite + Tailwind CSS
- **包管理器**: 前端使用 PNPM，后端使用 UV
- **项目结构**: 前后端分离，各自独立 Git 仓库
- **Docker 部署**: 已配置 docker-compose.yml，支持一键启动前后端服务

## 目录结构
```
Eucal_AI/
├── frontend/          # 前端仓库 (Vue 3 + Vite)
│   ├── src/
│   │   ├── api/           # API 请求模块
│   │   │   ├── index.ts   # axios 实例配置
│   │   │   ├── news.ts    # 新闻相关 API
│   │   │   └── products.ts # 产品相关 API
│   │   ├── components/    # 组件
│   │   │   └── layout/    # 布局组件
│   │   │       ├── AppHeader.vue
│   │   │       └── AppFooter.vue
│   │   ├── router/        # 路由配置
│   │   │   └── index.ts   # Vue Router 配置
│   │   ├── stores/        # Pinia 状态管理
│   │   │   ├── index.ts
│   │   │   └── modules/   # 状态模块
│   │   │       ├── app.ts
│   │   │       ├── news.ts
│   │   │       └── products.ts
│   │   ├── types/         # TypeScript 类型定义
│   │   │   └── index.ts
│   │   └── views/         # 页面视图
│   │       ├── Home.vue       # 首页
│   │       ├── About.vue      # 关于我们
│   │       ├── Products.vue   # 产品服务
│   │       ├── ProductDetail.vue
│   │       ├── News.vue       # 新闻动态
│   │       ├── NewsDetail.vue
│   │       ├── Login.vue      # 登录
│   │       └── NotFound.vue   # 404
│   ├── public/            # 静态资源
│   ├── package.json       # PNPM 依赖配置
│   ├── tailwind.config.js # Tailwind 设计系统配置
│   ├── vite.config.ts     # Vite 构建配置
│   └── Dockerfile
├── backend/           # 后端仓库 (FastAPI)
│   ├── app/               # 应用代码
│   │   ├── api/           # API 路由
│   │   ├── core/          # 核心模块
│   │   ├── models/        # 数据模型
│   │   ├── services/      # 业务逻辑
│   │   └── utils/         # 工具函数
│   ├── pyproject.toml     # UV 项目配置
│   └── Dockerfile
├── nginx/             # Nginx 配置
│   └── conf.d/
└── docker-compose.yml # Docker 编排配置
```

## Git Worktree 配置
- **主仓库**: `f:\Eucal_AI\frontend\` (master 分支)
- **开发分支**: `f:\Eucal_AI\frontend\.worktrees\feature-ui-design\` (feature/ui-design 分支)

## 设计参考
- **参考风格**: Minimax 官网 (minimaxi.com)
- **设计特点**:
  - 纯白背景 + 极简风格
  - 超大号粗体标题 (font-bold, text-6xl 到 8xl)
  - 深色按钮为主 CTA (bg-gray-900, rounded-full)
  - 橙色/暖色作为强调色 (primary-500 到 orange-600 渐变)
  - 丰富的产品展示图/示意图
  - 圆润的圆角设计 (rounded-2xl/3xl)
  - 清晰的视觉层次: 标签 → 大标题 → 副标题 → 描述 → CTA
  - 渐变图标卡片 + 阴影效果

## 关键决策记录
- **2025-02-21**: 确定首页结构为 产品简介 → 功能 → 榜单 → 快速开始
- **2025-02-21**: 首款产品命名为 "TierFlow" (智能分层推理引擎)
- **2025-02-21**: 参考 Minimax 官网风格进行设计优化
- **2025-02-21**: 建立 Memory.md 机制，每次对话沉淀关键信息
- **2025-02-21**: 产品详情页重构为营销风格 (参考 minimaxi.com 设计)
- **2025-02-21**: ProductItem 类型扩展营销字段 (highlights/use_cases/pricing等)
- **2025-02-21**: 路由标题默认值修改为 "Eucal AI" (原"示例科技有限公司")
- **2025-02-21**: 导航栏改为滚动隐藏模式（向下滚动隐藏，向上滚动/顶部显示）

## 首页结构 (Home.vue)
当前首页按以下顺序组织：

### 1. Hero Section - TierFlow 产品简介
- 产品标签: "Eucal AI 首款产品"
- 产品名称: TierFlow (超大标题 6xl-8xl)
- 副标题: 智能分层推理引擎
- 产品描述: 高性能推理优化平台
- CTA 按钮: 开始免费试用 / 了解产品功能 / 查看文档
- 核心数据: 70%成本降低 / 50ms平均响应 / 99.9%服务可用性
- 滚动指示器

### 2. 产品功能简介 (id="features")
- 标题: TierFlow 核心能力
- 三大功能卡片:
  - 智能分层缓存 (橙色渐变图标)
  - 动态模型路由 (紫色渐变图标)
  - 高可用架构 (绿色渐变图标)
- 卡片样式: 白底圆角卡片 + hover 阴影效果

### 3. 榜单数据区
- 标题: 实时性能监控
- 四个数据卡片: 今日请求量 / 缓存命中率 / 平均延迟 / 成本节省
- 趋势指示: 上升/下降箭头 + 百分比
- 榜单表格占位区: 模型性能排行榜 (待填充数据)

### 4. 快速开始 (id="quickstart")
- 深色背景 (bg-gray-900)
- 标题: 5分钟接入 TierFlow
- 左侧: 代码示例展示
- 右侧: 三步接入流程 (获取API Key / 安装SDK / 开始调用)

### 5. 底部 CTA
- 白底设计
- 标题: 准备好体验 TierFlow 了吗？
- 两个按钮: 免费开始使用 / 联系销售团队

## 配色方案
- **主色调**: 深色按钮 bg-gray-900
- **强调色**: primary-600 (橙色/暖色调)
- **背景**: 白色 / gray-50 / gray-900 (深色区块)
- **文字**: gray-900 (标题) / gray-600 (正文) / gray-500 (次要)

## 字体规范
- **标题**: font-bold, tracking-tight, leading-none
- **Hero 标题**: text-6xl 到 text-8xl
- **副标题**: text-2xl 到 text-4xl
- **正文**: text-lg / text-xl

## 组件样式规范
- **按钮**:
  - 主按钮: bg-gray-900 + rounded-full + px-8 py-4
  - 次按钮: bg-gray-100 / border-2 border-gray-200
- **卡片**: rounded-3xl + bg-white + border border-gray-100 + hover:shadow-xl
- **图标容器**: rounded-2xl + 渐变背景 + shadow-lg
- **标签**: rounded-full + px-4 py-1.5 + bg-primary-100 text-primary-700

## 待办事项
- [ ] 填充榜单数据区的实际性能数据
- [ ] 添加产品展示图或示意图
- [ ] 完善 Products.vue 页面
- [ ] 完善 About.vue 页面
- [ ] 配置后端 API 接口

## 开发服务器
- **地址**: http://localhost:5173
- **热更新**: 已启用

## 环境变量配置 (.env.example)
```bash
# API 基础地址（开发时使用代理，生产环境配置实际域名）
VITE_API_BASE_URL=/api/v1

# 公司名称
VITE_COMPANY_NAME=Eucal AI
```

## 路由结构
| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home.vue | 首页 |
| `/about` | About.vue | 关于我们 |
| `/products` | Products.vue | 产品服务列表 |
| `/products/:id` | ProductDetail.vue | 产品详情页 |
| `/news` | News.vue | 新闻动态列表 |
| `/news/:id` | NewsDetail.vue | 新闻详情页 |
| `/platform` | Platform.vue | 开放平台 |
| `/login` | Login.vue | 用户登录 |
| `/*` | NotFound.vue | 404 页面 |

**路由特性**:
- 使用 `createWebHistory` 模式
- 动态页面标题: `{pageTitle} - {companyName}`
- 切换页面自动滚动到顶部

## Tailwind CSS 配置
```javascript
// 自定义颜色
primary: {
  50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa',
  300: '#fdba74', 400: '#fb923c', 500: '#f97316',
  600: '#ea580c', 700: '#c2410c', 800: '#9a3412',
  900: '#7c2d12',
}

// 字体配置
fontFamily: {
  sans: ['MiSans', 'PingFang SC', 'PingFang HK', 'Microsoft Yahei', 'Arial', 'sans-serif'],
}

// 自定义字号
display-1: ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
display-2: ['3.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
display-3: ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
```

## API 架构

### 前端 API 配置 (`src/api/index.ts`)
- 基础 URL: `/api/v1` (可通过环境变量配置)
- 超时时间: 10秒
- 请求/响应拦截器已配置
- 统一的错误处理机制

### API 模块
```typescript
// src/api/news.ts - 新闻相关 API
fetchNewsList(params?: NewsListParams)  // 获取新闻列表
fetchNewsDetail(id: number)             // 获取新闻详情

// src/api/products.ts - 产品相关 API
fetchProductList()                      // 获取产品列表
fetchProductDetail(id: number)          // 获取产品详情
```

## Pinia Store 架构

### Store 结构
```
src/stores/
├── index.ts          # Pinia 实例创建和导出
└── modules/
    ├── app.ts        # 应用全局状态
    ├── news.ts       # 新闻状态管理
    └── products.ts   # 产品状态管理
```

### 状态设计模式 (以 news.ts 为例)
```typescript
// State
const newsList = ref<NewsItem[]>([])
const currentNews = ref<NewsItem | null>(null)
const total = ref(0)
const loading = ref(false)

// Getters (computed)
const allNews = computed(() => newsList.value)
const latestNews = computed(() => newsList.value.slice(0, 3))

// Actions
async function loadNewsList(params?: NewsListParams)
async function loadNewsDetail(id: number)
function clearCurrentNews()
```

## TypeScript 类型定义

### 核心类型 (`src/types/index.ts`)
```typescript
// 通用响应类型
interface ApiResponse<T = unknown> {
  code: string
  message: string
  data: T
}

// 列表响应类型
interface ListResponse<T> extends ApiResponse<T[]> {
  total: number
  page?: number
  page_size?: number
}

// 新闻类型
interface NewsItem {
  id: number
  title: string
  summary?: string
  content?: string
  cover_image?: string
  author?: string
  category?: string
  is_published: boolean
  created_at: string
  view_count: number
}

// 产品类型 (已扩展营销字段)
interface ProductItem {
  id: number
  name: string
  short_description?: string
  full_description?: string
  image?: string
  icon?: string
  features?: string[]
  category?: string
  is_active: boolean
  sort_order: number
  created_at: string
  // 营销相关字段 (新增)
  tagline?: string              // 产品标语
  highlights?: ProductHighlight[]  // 产品亮点
  use_cases?: UseCase[]         // 使用场景
  testimonials?: Testimonial[]  // 客户评价
  pricing?: PricingInfo         // 价格方案
  faqs?: FAQ[]                  // 常见问题
  stats?: ProductStat[]         // 数据统计
  related_products?: number[]   // 相关产品ID
}

// 新增类型定义
interface ProductHighlight {
  id: string
  title: string
  description: string
  icon?: string
}

interface UseCase {
  id: string
  title: string
  description: string
  benefits: string[]
  image?: string
}

interface Testimonial {
  id: string
  content: string
  author: string
  company: string
}

interface PricingInfo {
  description: string
  plans?: PricingPlan[]
  contact_sales?: boolean
}

interface PricingPlan {
  id: string
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  is_recommended?: boolean
}
```

## 后端架构 (FastAPI)

### 目录结构
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI 应用入口
│   ├── config.py         # 配置管理
│   ├── api/              # API 路由
│   │   └── v1/
│   │       └── router.py
│   ├── core/             # 核心模块
│   ├── models/           # 数据模型
│   ├── services/         # 业务逻辑
│   └── utils/            # 工具函数
├── pyproject.toml        # UV 项目配置
└── Dockerfile
```

### 后端配置 (`app/config.py`)
- 项目名称: 示例科技有限公司
- API 版本前缀: `/api/v1`
- CORS 已配置允许前端跨域访问
- 健康检查端点: `/health`

## Docker 部署

### docker-compose.yml 服务
- **frontend**: Node.js 18 + Vite 构建
- **backend**: Python 3.10 + FastAPI
- **nginx**: 反向代理配置

### 构建命令
```bash
# 启动所有服务
docker-compose up -d

# 仅构建前端
docker-compose build frontend

# 仅构建后端
docker-compose build backend
```

## 开发工作流

### 常用命令
```bash
# 前端开发
pnpm dev           # 启动开发服务器
pnpm build         # 生产构建
pnpm lint          # ESLint 检查
pnpm format        # Prettier 格式化

# 后端开发 (待补充)
```

### Git 工作流
- **主分支**: master (位于 `f:\Eucal_AI\frontend\`)
- **功能分支**: feature/ui-design (位于 `f:\Eucal_AI\frontend\.worktrees\feature-ui-design\`)
- 使用 Git Worktree 进行并行开发

## 依赖版本信息

### 前端核心依赖
| 依赖 | 版本 | 说明 |
|------|------|------|
| vue | ^3.4.15 | 渐进式框架 |
| vue-router | ^4.2.5 | 官方路由 |
| pinia | ^2.1.7 | 状态管理 |
| axios | ^1.6.7 | HTTP 客户端 |
| @vueuse/core | ^10.7.2 | Vue 组合式工具集 |

### 前端开发依赖
| 依赖 | 版本 | 说明 |
|------|------|------|
| vite | ^5.0.12 | 构建工具 |
| typescript | ~5.3.3 | 类型系统 |
| tailwindcss | ^3.4.1 | 原子 CSS 框架 |
| eslint | ^8.56.0 | 代码检查 |
| prettier | ^3.2.4 | 代码格式化 |

### Node.js 环境要求
- Node.js: >= 18.0.0
- PNPM: >= 8.0.0 (packageManager: pnpm@8.14.0)

## 图标使用规范

### 图标来源
- 使用 Heroicons (Outline 风格)
- 内联 SVG，不引入额外图标库依赖

### 图标尺寸规范
| 场景 | 尺寸 |
|------|------|
| 按钮图标 | w-4 h-4 |
| 卡片图标 | w-6 h-6 |
| 导航图标 | w-5 h-5 |
| 特色图标 | w-12 h-12 |

### 图标样式
- 默认使用 stroke="currentColor" 支持颜色继承
- 渐变图标容器: rounded-xl + 渐变背景 + shadow-lg

## 响应式设计

### 断点设置 (Tailwind 默认)
| 断点 | 宽度 | 说明 |
|------|------|------|
| sm | 640px | 小屏手机横屏 |
| md | 768px | 平板竖屏 |
| lg | 1024px | 平板横屏/小笔记本 |
| xl | 1280px | 桌面显示器 |
| 2xl | 1536px | 大屏幕显示器 |

### 响应式模式
- **Mobile First**: 默认样式为移动端，向上覆盖
- **容器宽度**: container-custom (自定义容器类)
- **布局切换**: grid-cols-1 → md:grid-cols-2/3

## 页面详细结构

### About.vue (关于我们页面)
- Hero 区域: 公司使命和愿景
- 核心优势: 6个特色卡片展示
- 发展历程: 时间线布局
- 团队介绍: 创始人/核心团队
- 联系我们: 联系表单和信息

### Products.vue (产品服务页面)
- 产品概览: TierFlow 产品卡片
- 产品特性: 6个核心能力展示
- 技术优势: 对比表格/数据展示
- 应用场景: 行业解决方案
- CTA 区域: 试用和咨询入口

### ProductDetail.vue (产品详情页) - 已重构为简约专业风格
- **Hero 区域**: 纯白背景 + 简洁标题 + 边框分隔
- **核心数据**: 4 格数据展示 (成本/延迟/可用性/命中率)
- **核心能力**: 4 项能力两列布局 (图标+标题+描述)
- **使用场景**: 左右图文交替布局，灰色背景区分
- **客户评价**: 简洁引用样式，左侧边框装饰
- **价格方案**: 3 档定价卡片，推荐版边框高亮
- **FAQ**: 手风琴折叠，底部边框分隔
- **CTA 区块**: 深色背景 + 简洁双按钮
- **产品名称**: TierFlow (智能分层推理引擎)
- **设计风格**: 简约专业，灰白主色调，减少圆角和阴影

### News.vue (新闻动态页面)
- 新闻列表: 卡片式布局
- 分类筛选: 按分类查看
- 分页功能: 加载更多/分页

### NewsDetail.vue (新闻详情页)
- 文章头部: 标题 + 元信息
- 文章内容: 富文本渲染
- 分享功能: 社交媒体分享
- 相关推荐: 底部相关文章

### Login.vue (登录页面)
- 登录表单: 邮箱 + 密码
- 表单验证: 基础校验
- 样式: 居中卡片 + 简洁设计

## 静态资源

### 资源目录
```
public/
└── (静态资源如 favicon、logo 等)

src/assets/
├── images/       # 图片资源
├── styles/       # 全局样式
└── fonts/        # 字体文件
```

### 图片规范 (待确定)
- Logo: SVG 格式
- 产品图: WebP/PNG，支持响应式
- 图标: SVG，支持主题色

## 编码规范

### Vue 组件规范
- 使用 `<script setup>` 语法
- 组件名使用 PascalCase
- Props 定义类型和默认值
- 使用 TypeScript 类型注解

### CSS/Tailwind 规范
- 优先使用 Tailwind 工具类
- 复杂样式使用 `@apply` 抽取
- 颜色使用配置值 (primary-500 等)
- 间距遵循 4px 基准 (1 = 0.25rem)

### TypeScript 规范
- 严格类型检查
- 接口定义使用 I 前缀 (可选)
- 避免使用 any 类型
- 导出类型到 types/index.ts

## 性能优化

### 已实施
- 路由懒加载 (动态导入)
- 组件按需加载
- 图片懒加载 (待添加)

### 待实施
- 静态资源 CDN 配置
- 构建优化 (代码分割)
- Gzip/Brotli 压缩
- 缓存策略配置

## 待办事项 (更新)

### 高优先级
- [x] ~~填充榜单数据区的实际性能数据~~ (ProductDetail 已添加 stats 字段)
- [x] ~~添加产品展示图或示意图~~ (使用 Heroicons 图标代替)
- [x] ~~重构 ProductDetail.vue 为营销风格~~ (已完成 Minimax 风格)
- [ ] 完成 Products.vue 页面内容填充
- [ ] 完成 About.vue 页面内容填充
- [ ] 配置后端 API 接口 (新闻/产品数据)

### 中优先级
- [ ] 添加页面加载动画/过渡效果
- [ ] 实现移动端导航抽屉
- [ ] 添加表单验证和提交反馈
- [ ] SEO 优化 (meta 标签、结构化数据)

### 低优先级
- [ ] 深色模式支持
- [ ] 多语言国际化
- [ ] 性能监控接入
- [ ] 埋点统计分析
