# Eucal AI 中文前端 — Docker 部署指南

## 目录

1. [环境要求](#环境要求)
2. [快速开始](#快速开始)
3. [配置说明](#配置说明)
4. [构建与运行](#构建与运行)
5. [镜像导出与离线部署](#镜像导出与离线部署)
6. [镜像推送到 Registry](#镜像推送到-registry)
7. [健康检查与监控](#健康检查与监控)
8. [更新与回滚](#更新与回滚)
9. [故障排查](#故障排查)
10. [Nginx 反向代理方案（可选）](#nginx-反向代理方案可选)
11. [架构说明](#架构说明)

---

## 环境要求

| 依赖 | 最低版本 | 检查命令 |
|------|---------|---------|
| Docker | 20.10+ | `docker --version` |
| Docker Compose | 2.0+ | `docker compose version` |
| 可用内存 | 1 GB（构建时建议 2 GB+） | `free -h` |

此外，以下后端服务需要提前部署并加入 `eucal_network` Docker 网络：

| 服务 | 默认容器名 | 默认端口 | 用途 |
|------|-----------|---------|------|
| 主后端 API | `eucal_backend` | 8000 | 用户认证、模型目录等 |
| Router API | `eucal_router` | 8003 | API Key、计费、用量等 |

> 如果后端尚未部署，前端可以正常构建和启动，但页面功能会因 API 不可达而报错。

## 快速开始

```bash
# 1. 进入部署目录
cd deploy

# 2. 创建配置文件
cp .env.example .env

# 3. 编辑 .env —— 至少确认 API_URL 和 ROUTER_API_URL 指向正确的后端地址
#    如果后端也在同一台机器的 Docker 中运行，默认值即可
vim .env

# 4. 赋予脚本执行权限（仅首次）
chmod +x deploy.sh

# 5. 一键构建并启动
./deploy.sh up
```

启动后访问 `http://<服务器IP>:3000` 即可看到页面。端口可通过 `.env` 中的 `FRONTEND_PORT` 修改。

## 配置说明

所有配置集中在 `.env` 文件中。变量分为两类：

### 构建时变量（修改后需重新构建镜像）

这些 `NEXT_PUBLIC_*` 变量会在构建时写入客户端 JS，修改后必须 `./deploy.sh up` 重新构建才能生效。

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `NEXT_PUBLIC_API_BASE_URL` | `/api/v1` | 浏览器端 API 路径前缀 |
| `NEXT_PUBLIC_COMPANY_NAME` | `Eucal AI` | 公司名称（页面标题/页脚） |
| `NEXT_PUBLIC_IMAGE_HOSTS` | `eucal.ai,...` | 远程图片域名白名单（逗号分隔） |
| `NEXT_PUBLIC_ROUTER_API_BASE_URL` | `/router-api/api/v1` | Router API 浏览器端路径 |
| `NEXT_PUBLIC_ROUTER_OPENAI_BASE_URL` | `/router-api/v1` | OpenAI 兼容接口路径 |
| `NEXT_PUBLIC_MODEL_CATALOG_API_BASE_URL` | 空 | 模型目录 API（留空使用默认） |

> 大多数场景下这些值不需要修改，浏览器通过同源路径访问，由 Next.js 在服务端转发。

### 运行时变量（修改后重启容器即可）

这些变量控制 Next.js 服务端将请求转发到哪个后端，修改后 `docker compose restart` 即可生效。

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `API_URL` | `http://eucal_backend:8000` | 主后端 API 地址（Docker 网络中用容器名） |
| `ROUTER_API_URL` | `http://eucal_router:8003` | Router API 地址 |
| `FRONTEND_PORT` | `3000` | 宿主机对外暴露端口 |

### 镜像分发配置（可选）

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `REGISTRY_URL` | 空 | Docker Registry 地址，用于 `./deploy.sh push` |

## 构建与运行

### 使用部署脚本（推荐）

```bash
./deploy.sh build     # 仅构建镜像（不启动）
./deploy.sh up        # 构建并启动（首次部署用这个）
./deploy.sh down      # 停止并移除容器
./deploy.sh restart   # 重启服务（改了运行时变量后用这个）
./deploy.sh logs      # 查看实时日志（Ctrl+C 退出）
./deploy.sh status    # 查看服务状态和健康检查结果
./deploy.sh export    # 构建并导出镜像为 tar.gz（用于离线部署）
./deploy.sh push      # 构建并推送镜像到 Registry
```

> `deploy.sh` 会自动检查 Docker 是否安装、`.env` 是否存在、`eucal_network` 网络是否创建。

### 使用 docker compose（等效命令）

```bash
docker compose up -d --build    # 构建并启动
docker compose down             # 停止
docker compose logs -f          # 查看日志
docker compose ps               # 查看状态
```

### 自定义构建参数

如需为不同环境定制构建时变量：

```bash
# 方式 1: 编辑 .env 文件后构建（推荐）
vim .env
./deploy.sh up

# 方式 2: 命令行临时覆盖（不修改 .env）
NEXT_PUBLIC_COMPANY_NAME="My Company" docker compose up -d --build
```

## 镜像导出与离线部署

适用于目标服务器无法访问外网或 Docker Registry 的场景。

### 在构建机器上导出

```bash
./deploy.sh export
# 输出示例: eucal-frontend-zh-20260424153000.tar.gz (~150MB)
```

### 在目标机器上部署

```bash
# 1. 将导出文件和 deploy 目录传输到目标机器
scp eucal-frontend-zh-*.tar.gz user@target:/opt/eucal/
scp -r deploy/ user@target:/opt/eucal/deploy/

# 2. 在目标机器上操作
ssh user@target
cd /opt/eucal/deploy

# 3. 加载镜像
docker load < ../eucal-frontend-zh-*.tar.gz

# 4. 创建配置并启动
cp .env.example .env
vim .env                          # 修改 API_URL、ROUTER_API_URL 等
docker network create eucal_network   # 如果不存在
docker compose up -d              # 无需 --build，直接使用已加载的镜像
```

## 镜像推送到 Registry

```bash
# 1. 在 .env 中配置 Registry 地址
# REGISTRY_URL=registry.example.com/eucal

# 2. 登录 Registry（如需要）
docker login registry.example.com

# 3. 构建并推送
./deploy.sh push
```

在目标机器上拉取：

```bash
docker pull registry.example.com/eucal/eucal-frontend-zh:latest
docker compose up -d
```

## 健康检查与监控

容器内置了健康检查（每 30 秒检测一次）：

```bash
# 查看健康状态
docker inspect eucal_frontend_zh --format='{{.State.Health.Status}}'

# HTTP 健康检查
curl http://localhost:3000/
```

## 更新与回滚

### 更新

```bash
git pull
./deploy.sh up
```

### 回滚到上一版本

```bash
# 停止当前版本
docker compose down

# 切换到之前的代码版本
git checkout <previous-commit>

# 重新构建并启动
./deploy.sh up
```

## 故障排查

### 容器无法启动

```bash
# 查看容器日志
docker compose logs frontend

# 检查常见原因
docker network inspect eucal_network    # 网络不存在？→ docker network create eucal_network
ss -tlnp | grep 3000                   # 端口被占用？→ 修改 .env 中的 FRONTEND_PORT
cat .env                                # 配置有误？→ 对照 .env.example 检查
```

### 页面打开后 API 报 502/503

```bash
# 确认后端容器在同一网络中运行
docker network inspect eucal_network | grep -A2 'eucal_backend\|eucal_router'

# 确认前端容器内的环境变量指向正确
docker compose exec frontend env | grep -E 'API_URL|ROUTER_API_URL'

# 从前端容器内测试后端连通性
docker compose exec frontend wget -qO- http://eucal_backend:8000/api/health || echo "后端不可达"
```

### 构建失败

```bash
# 清理缓存重新构建
docker compose build --no-cache

# 如果报 pnpm-lock.yaml 不一致，在项目根目录执行
pnpm install --frozen-lockfile
```

### 容器被 OOM Kill

在 `docker-compose.yml` 中调整内存限制：

```yaml
deploy:
  resources:
    limits:
      memory: 1G    # 从默认 512M 提升
```

## Nginx 反向代理方案（可选）

默认部署方案使用 Next.js standalone 内置的代理功能，无需 nginx。

如果需要在前端容器前方添加 nginx（用于 TLS 终止、静态资源缓存、负载均衡等），可参考本目录下的 `nginx.conf` 和 `default.conf`。使用时需要在 `docker-compose.yml` 中额外定义 nginx 服务并挂载这两个配置文件。

## 架构说明

```
                        Docker 网络: eucal_network
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   浏览器 ──► [eucal_frontend_zh:3000]                       │
│                  │                  │                        │
│                  │ /api/*           │ /router-api/*          │
│                  ▼                  ▼                        │
│          [eucal_backend:8000]  [eucal_router:8003]           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- 浏览器访问 `/api/*` 和 `/router-api/*` 时，请求发送到前端容器（同源）
- Next.js 通过 `rewrites` 将请求转发到对应的后端服务
- 所有容器通过 `eucal_network` 互通，使用容器名作为主机名

## deploy 目录结构

```
deploy/
├── Dockerfile           # 多阶段构建（deps → builder → runner）
├── docker-compose.yml   # 编排配置
├── deploy.sh            # 部署脚本（build/up/down/export/push 等）
├── .env.example         # 环境变量模板（复制为 .env 使用）
├── nginx.conf           # [可选] Nginx 主配置
├── default.conf         # [可选] Nginx server 块配置
└── README.md            # 本文档
```
