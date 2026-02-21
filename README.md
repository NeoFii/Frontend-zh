# Eucal AI 官网前端

基于 Vue 3 + Vite + TypeScript 构建的现代化前端应用。

## 技术栈

- **Vue 3**: 渐进式 JavaScript 框架（Composition API）
- **Vue Router 4**: 客户端路由
- **Pinia**: 状态管理
- **Vite**: 下一代前端构建工具
- **TypeScript**: 类型安全
- **Tailwind CSS**: 原子化 CSS 框架
- **Axios**: HTTP 客户端

## 快速开始

### 1. 安装 PNPM（如果尚未安装）

```bash
npm install -g pnpm
```

### 2. 安装依赖

```bash
cd frontend
pnpm install
```

### 3. 运行开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173

### 4. 构建生产版本

```bash
pnpm build
```

构建产物位于 `dist/` 目录

## 项目结构

```
frontend/
├── src/
│   ├── main.ts           # 应用入口
│   ├── App.vue           # 根组件
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理
│   ├── components/       # 组件
│   │   ├── common/       # 通用组件
│   │   ├── layout/       # 布局组件
│   │   └── sections/     # 页面区块
│   ├── views/            # 页面视图
│   ├── composables/      # 组合式函数
│   ├── api/              # API 请求封装
│   ├── assets/           # 静态资源
│   └── types/            # TypeScript 类型
├── public/               # 公共资源
└── vite.config.ts        # Vite 配置
```

## 开发规范

```bash
# 代码格式化
pnpm format

# ESLint 检查
pnpm lint
```

## 环境变量

创建 `.env.local` 文件：

```
# API 基础地址
VITE_API_BASE_URL=http://localhost:8000/api/v1
```
