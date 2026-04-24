#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

IMAGE_NAME="eucal-frontend-zh"
IMAGE_TAG="latest"
CONTAINER_NAME="eucal_frontend_zh"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; }

check_prerequisites() {
    command -v docker >/dev/null 2>&1 || { error "docker 未安装"; exit 1; }
    docker compose version >/dev/null 2>&1 || { error "docker compose 未安装"; exit 1; }

    if [ ! -f .env ]; then
        warn ".env 文件不存在，从 .env.example 复制..."
        cp .env.example .env
        info "已创建 .env，请根据实际环境编辑后重新运行"
        exit 1
    fi
}

ensure_network() {
    if ! docker network inspect eucal_network >/dev/null 2>&1; then
        info "创建 Docker 网络 eucal_network..."
        docker network create eucal_network
    fi
}

load_env() {
    if [ -f .env ]; then
        set -a
        # shellcheck disable=SC1091
        source .env
        set +a
    fi
}

case "${1:-help}" in
    build)
        check_prerequisites
        ensure_network
        info "构建前端镜像..."
        docker compose build --no-cache
        info "构建完成: ${IMAGE_NAME}:${IMAGE_TAG}"
        ;;
    up)
        check_prerequisites
        ensure_network
        info "构建并启动前端服务..."
        docker compose up -d --build
        info "服务已启动，等待健康检查..."
        sleep 5
        docker compose ps
        ;;
    down)
        info "停止前端服务..."
        docker compose down
        info "服务已停止"
        ;;
    restart)
        info "重启前端服务..."
        docker compose restart
        docker compose ps
        ;;
    logs)
        docker compose logs -f --tail=100
        ;;
    status)
        docker compose ps
        echo ""
        info "健康检查:"
        docker inspect "$CONTAINER_NAME" --format='{{.State.Health.Status}}' 2>/dev/null || echo "容器未运行"
        ;;
    export)
        check_prerequisites
        ensure_network
        info "构建镜像..."
        docker compose build
        EXPORT_FILE="${IMAGE_NAME}-$(date +%Y%m%d%H%M%S).tar.gz"
        info "导出镜像: ${EXPORT_FILE}"
        docker save "${IMAGE_NAME}:${IMAGE_TAG}" | gzip > "$EXPORT_FILE"
        info "导出完成: $(du -h "$EXPORT_FILE" | cut -f1)"
        info "在目标机器上加载: docker load < ${EXPORT_FILE}"
        ;;
    push)
        check_prerequisites
        load_env
        if [ -z "${REGISTRY_URL:-}" ]; then
            error "REGISTRY_URL 未配置，请在 .env 中设置"
            error "示例: REGISTRY_URL=registry.example.com/eucal"
            exit 1
        fi
        REMOTE_TAG="${REGISTRY_URL}/${IMAGE_NAME}:${IMAGE_TAG}"
        info "构建镜像..."
        docker compose build
        info "标记镜像: ${REMOTE_TAG}"
        docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "$REMOTE_TAG"
        info "推送到 Registry..."
        docker push "$REMOTE_TAG"
        info "推送完成: ${REMOTE_TAG}"
        ;;
    help|*)
        echo "Eucal AI 中文前端部署工具"
        echo ""
        echo "用法: $0 <命令>"
        echo ""
        echo "命令:"
        echo "  build    构建 Docker 镜像（不启动）"
        echo "  up       构建并启动服务"
        echo "  down     停止并移除容器"
        echo "  restart  重启服务"
        echo "  logs     查看实时日志"
        echo "  status   查看服务状态"
        echo "  export   构建并导出镜像为 tar.gz 文件"
        echo "  push     构建并推送镜像到 Registry"
        echo "  help     显示此帮助信息"
        ;;
esac
