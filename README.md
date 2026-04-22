# Eucal AI 前端

Eucal AI 统一大模型 API 网关的中文前端，基于 Next.js 14 App Router 构建。

## 技术栈

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS 3.4
- Zustand (认证状态) + SWR (服务端数据)
- Axios + 双 Token 认证 (access token 内存 / refresh token httpOnly cookie)
- ECharts + Chart.js (数据可视化)
- Jest + Testing Library + Playwright (测试)
- pnpm (包管理)

## 项目结构

```
src/
  app/
    (static)/       # 公开页面：首页、模型、价格、关于、生态、法律条款
    (dynamic)/      # 认证页面：登录、注册、忘记密码、模型详情
    console/        # 控制台：用量、API Key、余额、充值、账单
  components/
    ui/             # 通用组件：PageHero、Modal、Pagination、ErrorBanner 等
    console/        # 控制台组件：Header、Sidebar
    layout/         # 布局组件：AppHeader、AppFooter、SiteLayout
    login/          # 登录相关
    register/       # 注册相关
    model/          # 模型卡片、筛选
  hooks/            # useUser、useRouterKeys、useRouterUsage
  lib/
    api/            # API 客户端：auth、router、testing-model
  stores/           # Zustand auth store
  types/            # TypeScript 类型定义
```

## 本地启动

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 1. 克隆仓库

```bash
git clone git@github.com:NeoFii/Frontend-zh.git
cd Frontend-zh
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

根据实际后端地址修改 `.env`：

```env
# 主 API（认证、用户）
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
API_URL=http://127.0.0.1:8000

# Router API（API Key、计费、用量）
NEXT_PUBLIC_ROUTER_API_BASE_URL=http://localhost:8003/api/v1
ROUTER_API_URL=http://127.0.0.1:8003

# 模型目录 API
NEXT_PUBLIC_TESTING_API_URL=http://localhost:8002
```

### 4. 启动开发服务器

```bash
pnpm dev
```

浏览器打开 http://localhost:3000

### 5. 构建与生产运行

```bash
pnpm build
pnpm start
```

## 其他命令

```bash
pnpm lint          # ESLint 检查
pnpm test          # 运行测试
```

## Docker 部署

```bash
cd deploy
docker compose up -d
```

部署配置位于 `deploy/` 目录，包含 Dockerfile、docker-compose.yml 和 Nginx 配置。
