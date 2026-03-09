# eucalAI_frontend_zh 修改规划

基于审计报告，按优先级分为 **5 个阶段**，共 **18 项修改任务**。
每个任务标注了涉及文件、修改内容和预估影响范围。

---

## 阶段一：P0 紧急修复（安全 + 功能性 Bug）

### 任务 1：修复 CSS 类名错误（14 处）

**问题**: `editor-not-allowed` 和 `editor-pointer` 不是有效的 Tailwind 类名，应为 `cursor-not-allowed` 和 `cursor-pointer`。

**修改方式**: 全局替换

| 查找 | 替换为 |
|------|--------|
| `disabled:editor-not-allowed` | `disabled:cursor-not-allowed` |
| `editor-pointer` | `cursor-pointer` |

**涉及文件（13 个）**:
- `src/app/(dynamic)/forgot-password/page.tsx` (2 处)
- `src/app/(static)/about/news/NewsGrid.tsx` (1 处)
- `src/app/console/api/get-api/page.tsx` (1 处)
- `src/app/console/api/third-party-api/page.tsx` (1 处)
- `src/app/console/usage/record/page.tsx` (1 处)
- `src/components/console/ConsoleHeader.tsx` (1 处)
- `src/components/login/CodeCountdown.tsx` (1 处)
- `src/components/login/LoginForm.tsx` (1 处)
- `src/components/model/ModelCard.tsx` (1 处)
- `src/components/model/ModelCardV2.tsx` (1 处)
- `src/components/register/CodeCountdown.tsx` (1 处)
- `src/components/register/RegisterForm.tsx` (1 处)

---

### 任务 2：补全 i18n 缺失的错误提示 key

**问题**: `src/lib/error.ts` 引用了 12 个 `errors.*` 的翻译 key，但 `zh.json` 中只有 `notFound`/`notFoundDesc` 等页面级 key，缺失全部 API 错误提示。

**修改文件**: `src/messages/zh.json`

**在 `errors` 节点下新增**:
```json
{
  "errors": {
    "networkError": "网络请求失败，请检查网络连接",
    "timeoutError": "请求超时，请稍后重试",
    "operationFailed": "操作失败，请稍后重试",
    "unauthorized": "登录已过期，请重新登录",
    "forbidden": "没有权限执行此操作",
    "badRequest": "请求参数错误",
    "validationFailed": "数据验证失败，请检查输入",
    "serverError": "服务器内部错误",
    "badGateway": "网关错误，请稍后重试",
    "serviceUnavailable": "服务暂时不可用，请稍后重试",
    ... (保留原有 key)
  }
}
```

---

### 任务 3：修复 Dockerfile 缺少 NEXT_STANDALONE 环境变量

**问题**: `next.config.mjs` 依赖 `NEXT_STANDALONE=true` 启用 standalone 输出，但 Dockerfile builder 阶段未设置。

**修改文件**: `deploy/Dockerfile`

**修改内容**: 在 builder 阶段的 `RUN pnpm build` 之前添加：
```dockerfile
ENV NEXT_STANDALONE=true
```

---

### 任务 4：修复 docker-compose 健康检查命令

**问题**: `docker-compose.yml` 使用 `curl`，但 `node:20-alpine` 无 `curl`。

**修改文件**: `deploy/docker-compose.yml`

**修改内容**:
```yaml
# 改前
test: ["CMD", "curl", "-f", "http://localhost/health"]
# 改后
test: ["CMD", "wget", "-qO-", "http://localhost:3000/"]
```

---

## 阶段二：P1 安全加固 + 性能优化

### 任务 5：API Key 管理迁移——标记 localStorage 为临时方案

**问题**: `get-api/page.tsx` 和 `third-party-api/page.tsx` 将 API Key 明文存储在 localStorage。

**目标**: 完整修复需要后端 API 支持，当前先做最小化改进。

**修改文件**:
- `src/app/console/api/get-api/page.tsx`
- `src/app/console/api/third-party-api/page.tsx`

**修改内容**:
1. 在文件顶部添加 `// TODO: [SECURITY] API Key 应通过后端 API 管理，当前 localStorage 为临时方案` 注释
2. `get-api/page.tsx`: 前端不应生成 API Key（`generateApiKey`），这应该是后端的职责。标记 `generateApiKey` 为临时 Mock 实现
3. `third-party-api/page.tsx`: 添加注释说明需后端 API 存储第三方密钥

> 💡 **后续需要后端配合**:
> - 新增 `POST /api/v1/platform/api-keys` 创建密钥接口
> - 新增 `GET /api/v1/platform/api-keys` 获取密钥列表（返回脱敏值）
> - 新增 `DELETE /api/v1/platform/api-keys/:id` 删除密钥
> - 新增 `POST /api/v1/platform/third-party-keys` 存储第三方密钥
> （这些接口在 `src/lib/api/platform.ts` 中已有类型定义骨架，前端只需替换调用方式）

---

### 任务 6：精简字体资源（260MB → ≈25MB）

**问题**: `public/fonts/` 包含 otf/ttf/woff/woff2 四种格式 × 10 字重 = 260MB，但 `misans.css` 实际只引用 woff2 格式。

**分析**:
- CSS 引用的字重: 100(Thin), 200(ExtraLight), 300(Light), 400(Normal), 500(Medium), 600(Demibold), 700(Bold), 800(Heavy) — 共 8 个 woff2
- 代码实际使用的 Tailwind 字重: `font-light`(300), `font-normal`(400), `font-medium`(500), `font-semibold`(600), `font-bold`(700) — 共 5 个
- `woff2/` 目录还包含 `MiSans-Regular.woff2` 和 `MiSans-Semibold.woff2`，但 CSS 中未引用（CSS 中 400 对应的是 Normal 而非 Regular）

**修改步骤**:

**Step 1 — 删除未使用的字体格式目录**:
```
删除: public/fonts/misans/MiSans/otf/        (64MB)
删除: public/fonts/misans/MiSans/ttf/        (78MB)
删除: public/fonts/misans/MiSans/woff/       (52MB)
删除: public/fonts/misans/MiSans/可变字体/    (20MB)
删除: public/fonts/misans/*.min.css           (约 500KB，未引用)
删除: public/fonts/MiSans-Regular.woff2       (296KB，根目录冗余文件)
```

**Step 2 — 精简 woff2 目录中未使用的字重**:
```
删除: public/fonts/misans/MiSans/woff2/MiSans-Thin.woff2       (100, 未使用)
删除: public/fonts/misans/MiSans/woff2/MiSans-ExtraLight.woff2 (200, 未使用)
删除: public/fonts/misans/MiSans/woff2/MiSans-Heavy.woff2      (800, 未使用)
删除: public/fonts/misans/MiSans/woff2/MiSans-Regular.woff2    (CSS 未引用，引用的是 Normal)
删除: public/fonts/misans/MiSans/woff2/MiSans-Semibold.woff2   (CSS 未引用，引用的是 Demibold)
```

保留 5 个文件：Light(300), Normal(400), Medium(500), Demibold(600), Bold(700)

**Step 3 — 精简 `misans.css`**，移除 Thin(100)、ExtraLight(200)、Heavy(800) 的 @font-face 声明

**预估效果**: 260MB → ≈25MB

---

### 任务 7：修复 `ListResponse` 类型冲突

**问题**: `src/types/index.ts` 和 `src/types/model.ts` 各定义了不兼容的 `ListResponse`。

**修改方案**:

**`src/types/model.ts`**: 将 `ListResponse` 重命名为 `PagedResponse`（因为它包含 `page`/`page_size` 字段，语义更精确）:
```typescript
export interface PagedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}
```

**`src/lib/api/model.ts`**: 将所有引用 `ListResponse` 改为 `PagedResponse`:
```typescript
import type { ..., PagedResponse } from '@/types/model'
```

**`src/types/index.ts`**: 更新重新导出:
```typescript
export type { ..., PagedResponse } from '@/types/model'
```

同时修复 `ApiResponse.code` 类型：`src/types/index.ts` 中 `code: string` → `code: number`

---

### 任务 8：密码强度文案国际化

**问题**: `src/lib/utils/password.ts` 返回英文 `'Weak'`/`'Fair'`/`'Strong'`/`'Very Strong'`。

**修改文件**: `src/lib/utils/password.ts`

**修改方式**: 将 `text` 字段改为 i18n key，由调用方翻译:
```typescript
// 改前
if (score <= 2) return { level: 1, text: 'Weak', color: 'bg-red-500' }
// 改后
if (score <= 2) return { level: 1, text: 'weak', color: 'bg-red-500' }
```

**新增翻译 key** (`zh.json` → `auth.common`):
```json
{
  "passwordWeak": "弱",
  "passwordFair": "一般",
  "passwordStrong": "强",
  "passwordVeryStrong": "非常强"
}
```

**修改 `PasswordStrength` 组件**: 使用 `t()` 翻译 `text` 字段。

---

## 阶段三：P2 用户体验改进

### 任务 9：修复登录/CTA 按钮打开新标签行为

**问题**: AppHeader 登录按钮和首页 CTA 使用 `window.open(url, '_blank')` 打开新标签页。

**修改文件**:
- `src/components/layout/AppHeader.tsx`
- `src/app/(static)/page.tsx`

**修改内容**:

`AppHeader.tsx` — 将 `handleAuthClick` 改为 `router.push`:
```typescript
// 改前
const handleAuthClick = (e: React.MouseEvent) => {
  e.preventDefault()
  window.open('/login', '_blank')
}
// 改后
import { useRouter } from 'next/navigation'
// ...
const router = useRouter()
const handleAuthClick = () => {
  router.push('/login')
}
```

`page.tsx` — 同理修改 `handleCtaClick`:
```typescript
// 改前
window.open(targetUrl, '_blank')
// 改后
router.push(targetUrl)
```

---

### 任务 10：修复 Footer 隐私政策/服务条款链接

**问题**: `AppFooter.tsx` 中隐私政策和服务条款链接为 `href="#"`。

**修改文件**: `src/components/layout/AppFooter.tsx`

**修改内容**:
```tsx
// 改前
<a href="#" className="...">{t('privacy')}</a>
<a href="#" className="...">{t('terms')}</a>
// 改后
<Link href="/privacy" className="...">{t('privacy')}</Link>
<Link href="/agreement" className="...">{t('terms')}</Link>
```

（项目中已存在 `src/app/(static)/privacy/page.tsx` 和 `src/app/(static)/agreement/page.tsx`）

---

### 任务 11：修复 container-custom 在小屏的内边距

**问题**: `.container-custom` 固定 `px-[60px]`，在移动端内容区被严重压缩。

**修改文件**: `src/app/globals.css`

**修改内容**:
```css
/* 改前 */
.container-custom {
  @apply max-w-[1920px] mx-auto px-[60px];
}
/* 改后 */
.container-custom {
  @apply max-w-[1920px] mx-auto px-4 sm:px-8 md:px-[60px];
}
```

---

### 任务 12：补充缺失的静态资源文件

**问题**: `layout.tsx` 引用了 `/og-image.png`、`/apple-touch-icon.png`、`logo.png`，但文件不存在。

**修改方式**: 需要设计团队提供以下文件，放入 `public/` 目录：
- `public/og-image.png` — 1200×630px，社交分享预览图
- `public/apple-touch-icon.png` — 180×180px
- `public/logo.png` — 公司 Logo

**临时方案**: 若无设计资源，可先用 SVG favicon 生成 PNG 占位文件，或移除 metadata 中对不存在文件的引用。

---

### 任务 13：添加 robots.txt 和 sitemap

**新建文件**: `public/robots.txt`
```
User-agent: *
Allow: /
Sitemap: https://eucal.ai/sitemap.xml
```

**新建文件**: `src/app/sitemap.ts`（Next.js 内置 sitemap 生成）
```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://eucal.ai', lastModified: new Date(), priority: 1.0 },
    { url: 'https://eucal.ai/model', lastModified: new Date(), priority: 0.8 },
    { url: 'https://eucal.ai/price', lastModified: new Date(), priority: 0.7 },
    { url: 'https://eucal.ai/about', lastModified: new Date(), priority: 0.6 },
    { url: 'https://eucal.ai/products/tierflow', lastModified: new Date(), priority: 0.7 },
    { url: 'https://eucal.ai/ecosystem', lastModified: new Date(), priority: 0.5 },
  ]
}
```

---

## 阶段四：P3 代码质量与可维护性

### 任务 14：合并重复的 CodeCountdown 组件

**问题**: `src/components/login/CodeCountdown.tsx` 和 `src/components/register/CodeCountdown.tsx` 仅 `useTranslation` 的 namespace 不同（`auth.login` vs `auth.register`），其余完全相同。

**修改方案**:

1. **新建** `src/components/ui/CodeCountdown.tsx` — 接受 `namespace` 或 `labels` 参数:
```typescript
interface CodeCountdownProps {
  initialCountdown?: number
  onSendCode: () => Promise<void>
  disabled?: boolean
  sendingText?: string   // 自定义"发送中"文案
  getCodeText?: string   // 自定义"获取验证码"文案
}
```

2. **删除** `src/components/login/CodeCountdown.tsx`
3. **删除** `src/components/register/CodeCountdown.tsx`
4. **更新** `LoginForm.tsx` 和 `RegisterForm.tsx` 的 import 路径和传参
5. **更新** `src/components/login/index.ts` 和 `src/components/register/index.ts`

---

### 任务 15：合并重复的 LoginError / RegisterError 组件

**问题**: `LoginError` 支持 `error` + `successMessage`，`RegisterError` 仅支持 `error`。

**修改方案**:

1. **新建** `src/components/ui/FormAlert.tsx`:
```typescript
interface FormAlertProps {
  error?: string
  success?: string
}
```

2. **删除** `src/components/login/LoginError.tsx`
3. **删除** `src/components/register/RegisterError.tsx`
4. **更新** `LoginForm.tsx` 和 `RegisterForm.tsx` 的 import
5. **更新** `src/components/login/index.ts` 和 `src/components/register/index.ts`

---

### 任务 16：消除 useTranslation / getTranslation 代码重复

**问题**: `src/hooks/useTranslation.ts`（客户端 Hook）和 `src/lib/translations.ts`（服务端函数）逻辑完全相同。

**修改方案**:

1. **新建** `src/lib/i18n-core.ts` — 提取共享的纯函数:
```typescript
import messages from '@/messages/zh.json'

export function getNestedValue(obj: unknown, keys: string[]): string | undefined { ... }

export function createTranslator(namespace?: string) {
  const t = (key: string, params?: Record<string, string | number>): string => { ... }
  return { t }
}
```

2. **简化** `src/hooks/useTranslation.ts`:
```typescript
import { createTranslator } from '@/lib/i18n-core'
export function useTranslation(namespace?: string) {
  return createTranslator(namespace)
}
```

3. **简化** `src/lib/translations.ts`:
```typescript
import { createTranslator } from '@/lib/i18n-core'
export const getTranslation = createTranslator
```

---

### 任务 17：补充 .env.example 中缺失的环境变量说明

**修改文件**: `.env.example`

**修改内容**:
```bash
# API 基础地址（前端请求路径前缀）
NEXT_PUBLIC_API_BASE_URL=/api/v1

# 公司名称
NEXT_PUBLIC_COMPANY_NAME=Eucal AI

# Testing 服务 API 地址（模型性能测试模块）
NEXT_PUBLIC_TESTING_API_URL=http://localhost:8002

# API 代理目标地址（仅 next.config.mjs rewrites 使用）
# 本地开发: http://127.0.0.1:8000
# Docker: http://backend:8000
API_URL=http://127.0.0.1:8000

# 启用 standalone 输出（Docker 构建时设为 true）
# NEXT_STANDALONE=true
```

---

## 阶段五：长期优化（可排入迭代计划）

### 任务 18：后续优化事项（不阻塞发布）

以下事项需要更大范围的重构或跨团队协调，建议排入后续迭代：

| # | 事项 | 说明 |
|---|------|------|
| 18a | **首页 SSR 拆分** | 将 `(static)/page.tsx` 的静态内容拆为 Server Component，仅交互部分保留 `'use client'`，提升 SEO |
| 18b | **Console 响应式** | 为 `console/layout.tsx` 添加移动端抽屉式侧边栏，替换固定 `ml-64` |
| 18c | **测试补全** | 为 LoginForm、RegisterForm 添加组件测试；为 Token 刷新逻辑添加单元测试；启用 Playwright E2E |
| 18d | **echarts 按需加载** | 使用 `dynamic(() => import('echarts-for-react'), { ssr: false })` 避免 ~1MB bundle 开销 |
| 18e | **Middleware Token 验证** | 在中间件中解码 JWT 验证过期时间，而非仅检查 cookie 是否非空 |
| 18f | **CSP / 安全头** | 在 Nginx 或 `next.config.mjs` headers 中配置 Content-Security-Policy |
| 18g | **models.ts 迁移** | 将 `src/data/models.ts` 的硬编码模型数据迁移到后端 API 或 CMS |

---

## 执行顺序与依赖关系

```
阶段一 (P0) ─ 无依赖，可立即并行执行
  ├── 任务 1 (CSS 类名修复)        ← 独立，5 分钟
  ├── 任务 2 (i18n key 补全)       ← 独立，5 分钟
  ├── 任务 3 (Dockerfile 修复)     ← 独立，1 分钟
  └── 任务 4 (compose 健康检查)    ← 独立，1 分钟

阶段二 (P1) ─ 任务 5 需后端配合
  ├── 任务 5 (API Key 安全标记)    ← 独立，10 分钟（完整修复需后端）
  ├── 任务 6 (字体精简)            ← 独立，15 分钟
  ├── 任务 7 (类型冲突修复)        ← 独立，10 分钟
  └── 任务 8 (密码强度 i18n)       ← 依赖任务 2（zh.json 修改）

阶段三 (P2) ─ 用户体验
  ├── 任务 9 (按钮行为修复)        ← 独立，5 分钟
  ├── 任务 10 (Footer 链接)        ← 独立，3 分钟
  ├── 任务 11 (响应式内边距)       ← 独立，2 分钟
  ├── 任务 12 (静态资源)           ← 需设计资源
  └── 任务 13 (robots + sitemap)   ← 独立，10 分钟

阶段四 (P3) ─ 代码质量
  ├── 任务 14 (合并 CodeCountdown) ← 独立，15 分钟
  ├── 任务 15 (合并 Error 组件)    ← 独立，10 分钟
  ├── 任务 16 (合并 i18n 工具)     ← 独立，10 分钟
  └── 任务 17 (env.example)        ← 独立，3 分钟

阶段五 ─ 排入迭代
  └── 任务 18a-18g
```

**预估总工时**: 阶段一至四约 **2-3 小时**（不含任务 12 的设计资源等待时间和任务 5 的后端开发）。
