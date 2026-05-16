# Eucal AI 中文前端 - 多阶段构建

# 阶段 1: 安装依赖
FROM node:20-alpine AS deps
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm config set registry https://registry.npmmirror.com && \
    pnpm install --frozen-lockfile --prod=false

# 阶段 2: 构建应用
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL=/api/v1
ARG NEXT_PUBLIC_COMPANY_NAME=Eucal AI
ARG NEXT_PUBLIC_IMAGE_HOSTS=eucal.ai,www.eucal.ai,neofii.fun
ARG NEXT_PUBLIC_ROUTER_API_BASE_URL=/router-api/api/v1
ARG NEXT_PUBLIC_ROUTER_OPENAI_BASE_URL=/router-api/v1
ARG NEXT_PUBLIC_MODEL_CATALOG_API_BASE_URL=

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_COMPANY_NAME=$NEXT_PUBLIC_COMPANY_NAME
ENV NEXT_PUBLIC_IMAGE_HOSTS=$NEXT_PUBLIC_IMAGE_HOSTS
ENV NEXT_PUBLIC_ROUTER_API_BASE_URL=$NEXT_PUBLIC_ROUTER_API_BASE_URL
ENV NEXT_PUBLIC_ROUTER_OPENAI_BASE_URL=$NEXT_PUBLIC_ROUTER_OPENAI_BASE_URL
ENV NEXT_PUBLIC_MODEL_CATALOG_API_BASE_URL=$NEXT_PUBLIC_MODEL_CATALOG_API_BASE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_STANDALONE=true

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# 阶段 3: 生产运行
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV API_URL=http://127.0.0.1:8000
ENV ROUTER_API_URL=http://127.0.0.1:8003

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "server.js"]