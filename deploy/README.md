# Eucal AI 中文前端 — Docker 部署指南

## 目录

1. [环境要求](#环境要求)
2. [部署架构](#部署架构)
3. [快速开始](#快速开始)
4. [配置说明](#配置说明)
5. [构建与运行](#构建与运行)
6. [与后端同服务器部署](#与后端同服务器部署)
7. [镜像导出与离线部署](#镜像导出与离线部署)
8. [镜像推送到 Registry](#镜像推送到-registry)
9. [健康检查与监控](#健康检查与监控)
10. [更新与回滚](#更新与回滚)
11. [故障排查](#故障排查)
12. [Nginx 反向代理方案（可选）](#nginx-反向代理方案可选)
13. [架构说明](#架构说明)

---

## 环境要求

| 依赖 | 最低版本 | 检查命令 |
|------|---------|---------|
| Docker | 20.10+ | `docker --version` |
| Docker Compose | 2.0+ | `docker compose version` |
| 可用内存 | 1 GB（构建时建议 2 GB+） | `free -h` |

此外，以下后端服务需要提前部署完毕（在另外的节点上）：

| 服务 | 节点 | 默认端口 | 用途 |
|------|------|---------|------|
| user-service | 后端节点 | 8000 | 用户认证、计费、API Key |
| router-service | GPU 节点 | 8003 | API 网关、智能路由 |

> 前端节点与后端/GPU 节点通过**内网 IP** 通信。如果后端尚未部署，前端可以正常构建和启动，但页面功能会因 API 不可达而报错。

## 部署架构

推荐三节点架构，前端节点独立部署，通过内网访问后端服务：

```
┌──────────────────────────────────────────────┐
│          前端节点 (2H2G) — Server A           │
│                                              │
│  ┌──────────────────┐  ┌──────────────────┐  │
│  │  eucal-admin     │  │ eucal-frontend-zh│  │
│  │      :3001       │  │      :3000       │  │
│  └──────────────────┘  └──────────────────┘  │
│  ┌──────────────────────────────────────────┐│
│  │  Nginx (:80/:443)                        ││
│  └──────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
        │                   │
        │ 内网 :8000         │ 内网 :8003
        ▼                   ▼
┌────────────────────┐  ┌────────────────────┐
│  后端节点 (2H4G)    │  │  GPU 节点           │
│  ┌──────────────┐  │  │  ┌──────────────┐  │
│  │ user-service │  │  │  │router-service│  │
│  │    :8000     │  │  │  │   :8003      │  │
│  └──────────────┘  │  │  └──────────────┘  │
│  ┌──────────────┐  │  │  ┌──────────────┐  │
│  │admin-service │  │  │  │  inference   │  │
│  │    :8001     │  │  │  │   :8004      │  │
│  └──────────────┘  │  │  └──────────────┘  │
│  + MySQL + Redis   │  │                    │
└────────────────────┘  └────────────────────┘
```

浏览器访问前端 → Next.js 将 `/api/*` 代理到后端节点的 user-service，`/router-api/*` 代理到 GPU 节点的 router-service。

## 快速开始

```bash
# 1. 进入部署目录
cd deploy

# 2. 创建配置文件
cp .env.example .env

# 3. 编辑 .env —— 必须修改 API_URL 和 ROUTER_API_URL 为实际内网 IP
#    API_URL=http://<BACKEND_IP>:8000
#    ROUTER_API_URL=http://<GPU_IP>:8003
vim .env

# 4. 赋予脚本执行权限（仅首次）
chmod +x deploy.sh

# 5. 一键构建并启动
./deploy.sh up
```

启动后通过 Nginx 域名访问，或临时使用 `http://<前端节点IP>:3000` 测试。端口可通过 `.env` 中的 `FRONTEND_PORT` 修改。

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
| `API_URL` | `http://<BACKEND_IP>:8000` | user-service 内网地址 |
| `ROUTER_API_URL` | `http://<GPU_IP>:8003` | router-service 内网地址 |
| `FRONTEND_PORT` | `3000` | 宿主机映射端口（仅 localhost） |

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

> `deploy.sh` 会自动检查 Docker 是否安装、`.env` 是否存在、`eucal_frontend_network` 网络是否创建。

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

## 三节点架构部署（推荐）

实际生产部署使用三节点架构：

| 节点 | 配置 | 服务 |
|------|------|------|
| 前端节点 | 2H2G | eucal-admin + Frontend-zh + Nginx |
| 后端节点 | 2H4G | MySQL + Redis + admin-service + user-service |
| GPU 节点 | 视模型而定 | router-service + inference-service |

前端容器通过**内网 IP** 访问后端节点的 user-service 和 GPU 节点的 router-service。

### 网络配置

前端节点上有两个前端容器（admin + zh），共用一个本地网络：

```bash
docker network create eucal_frontend_network
```

`docker-compose.yml` 中网络配置：

```yaml
networks:
  eucal_network:
    name: eucal_frontend_network
    external: true
```

> 前端节点不需要也无法加入 `eucal_backend_network`（那是后端节点的内部网络）。跨节点通信必须通过宿主机网卡（即内网 IP）。

### 环境变量

修改 `.env` 中的代理目标，使用各节点的内网 IP：

```bash
# user-service 部署在后端节点
API_URL=http://<BACKEND_IP>:8000

# router-service 部署在 GPU 节点
ROUTER_API_URL=http://<GPU_IP>:8003

# 前端只监听 localhost，由 Nginx 反代
FRONTEND_PORT=3000
```

`docker-compose.yml` 端口绑定改为只监听本机：

```yaml
services:
  frontend:
    ports:
      - "127.0.0.1:${FRONTEND_PORT:-3000}:3000"
```

### 启动顺序

```bash
# 1. 确认后端节点和 GPU 节点的服务已启动
curl -s http://<BACKEND_IP>:8000/api/v1/health
curl -s http://<GPU_IP>:8003/health

# 2. 创建本地网络（如不存在）
docker network create eucal_frontend_network 2>/dev/null || true

# 3. 启动前端
cd deploy
./deploy.sh up
```

### 验证连通性

```bash
# 从前端容器内测试到 user-service
docker exec eucal_frontend_zh wget -qO- http://<BACKEND_IP>:8000/api/v1/health

# 从前端容器内测试到 router-service
docker exec eucal_frontend_zh wget -qO- http://<GPU_IP>:8003/health

# 通过 Next.js 代理访问
curl -s http://127.0.0.1:3000/api/v1/health
curl -s http://127.0.0.1:3000/router-api/health
```

### 防火墙配置（前端节点）

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

> 后端节点和 GPU 节点的防火墙也要相应配置，仅允许前端节点的内网 IP 访问对应端口。详见后端仓库 `DEPLOY.md` 中的"防火墙配置"章节。

### 完整部署流程

后端节点和 GPU 节点的部署见后端仓库的 `DEPLOY.md`，包含：
- 三节点架构图与端口规划
- 后端节点（MySQL + Redis + admin + user）配置
- GPU 节点（router + inference）配置
- 共享密钥管理
- 跨节点防火墙规则
- 内网通信速查表

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
docker network create eucal_frontend_network   # 如果不存在
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
docker network inspect eucal_frontend_network    # 网络不存在？→ docker network create eucal_frontend_network
ss -tlnp | grep 3000                   # 端口被占用？→ 修改 .env 中的 FRONTEND_PORT
cat .env                                # 配置有误？→ 对照 .env.example 检查
```

### 页面打开后 API 报 502/503

```bash
# 确认后端节点和 GPU 节点的服务可达
curl -s http://<BACKEND_IP>:8000/api/v1/health
curl -s http://<GPU_IP>:8003/health

# 确认前端容器内的环境变量指向正确
docker compose exec frontend env | grep -E 'API_URL|ROUTER_API_URL'

# 从前端容器内测试到后端节点的连通性
docker compose exec frontend wget -qO- http://<BACKEND_IP>:8000/api/v1/health || echo "user-service 不可达"
docker compose exec frontend wget -qO- http://<GPU_IP>:8003/health || echo "router-service 不可达"

# 检查防火墙
# 在后端节点：ufw status | grep 8000
# 在 GPU 节点：ufw status | grep 8003
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
   前端节点 (eucal_frontend_network)         后端节点                GPU 节点
┌──────────────────────────────┐    ┌───────────────────┐    ┌──────────────────┐
│                              │    │                   │    │                  │
│ 浏览器 ──► [eucal_frontend_zh]│    │ [user-service     │    │ [router-service  │
│             :3000             │    │   :8000]          │    │   :8003]         │
│              │                │    │                   │    │                  │
│              │ /api/*  ───────┼────┤───►              │    │                  │
│              │                │    │                   │    │                  │
│              │ /router-api/* ─┼────┼──────────────────┼────┼───►              │
│              ▼                │    │                   │    │                  │
└──────────────────────────────┘    └───────────────────┘    └──────────────────┘
       │                              内网 IP                       内网 IP
       │ Docker 网络
       └─► [eucal-admin :3001] (并存，由 Nginx 按域名分发)
```

- 浏览器访问 `/api/*` 和 `/router-api/*` 时，请求发送到前端容器（同源）
- Next.js 通过 `rewrites` 将请求转发到后端节点的 user-service 和 GPU 节点的 router-service
- 跨节点通信通过宿主机网卡（即内网 IP），由防火墙限制只允许前端节点访问
- 前端节点上 admin 和 zh 两个前端共用 `eucal_frontend_network`（无强依赖，独立运行也可）

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
