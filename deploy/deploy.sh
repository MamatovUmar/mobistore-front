#!/bin/bash
set -e

# ============================================
# Blue-Green Deployment Script
# ============================================
# Usage: ./deploy.sh [dev|prod]
# ============================================

ENV="${1:-prod}"

if [ "$ENV" = "dev" ]; then
    IMAGE="ghcr.io/mamatovumar/mobistore-front:dev"
    BLUE_PORT=3000
    GREEN_PORT=3003
    NGINX_UPSTREAM="/etc/nginx/conf.d/mobistore-dev-upstream.conf"
    CONTAINER_PREFIX="mobistore_front_dev"
    PUBLIC_DIR="/var/www/mobistore/front-dev/public"
else
    IMAGE="ghcr.io/mamatovumar/mobistore-front:latest"
    BLUE_PORT=3001
    GREEN_PORT=3002
    NGINX_UPSTREAM="/etc/nginx/conf.d/mobistore-prod-upstream.conf"
    CONTAINER_PREFIX="mobistore_front_prod"
    PUBLIC_DIR="/var/www/mobistore/front/public"
fi

echo "🚀 Deploying $ENV environment..."
echo "📦 Image: $IMAGE"

# Определяем текущий активный порт из Nginx upstream
if [ -f "$NGINX_UPSTREAM" ]; then
    CURRENT_PORT=$(grep -oP 'server 127.0.0.1:\K\d+' "$NGINX_UPSTREAM" 2>/dev/null || echo "$BLUE_PORT")
else
    CURRENT_PORT=$BLUE_PORT
fi

# Выбираем новый порт и имена контейнеров
if [ "$CURRENT_PORT" = "$BLUE_PORT" ]; then
    NEW_PORT=$GREEN_PORT
    OLD_CONTAINER="${CONTAINER_PREFIX}_blue"
    NEW_CONTAINER="${CONTAINER_PREFIX}_green"
else
    NEW_PORT=$BLUE_PORT
    OLD_CONTAINER="${CONTAINER_PREFIX}_green"
    NEW_CONTAINER="${CONTAINER_PREFIX}_blue"
fi

echo "🔄 Switching: port $CURRENT_PORT → $NEW_PORT"

# Pull нового образа
echo "📥 Pulling image..."
docker pull "$IMAGE"

# Останавливаем контейнер на новом порту если есть (от предыдущего неудачного деплоя)
docker stop "$NEW_CONTAINER" 2>/dev/null || true
docker rm "$NEW_CONTAINER" 2>/dev/null || true

# Запуск нового контейнера
echo "🐳 Starting new container on port $NEW_PORT..."
docker run -d \
    --name "$NEW_CONTAINER" \
    --restart unless-stopped \
    -p "$NEW_PORT:3000" \
    -v "$PUBLIC_DIR:/app/public:ro" \
    "$IMAGE"

# Health check (ждём до 60 сек)
echo "🩺 Running health check..."
HEALTHY=false
for i in {1..12}; do
    if curl -sf "http://127.0.0.1:$NEW_PORT/" > /dev/null 2>&1; then
        echo "✅ Health check passed!"
        HEALTHY=true
        break
    fi
    echo "⏳ Waiting for health check... ($i/12)"
    sleep 5
done

if [ "$HEALTHY" = false ]; then
    echo "❌ Health check failed! Rolling back..."
    docker stop "$NEW_CONTAINER" 2>/dev/null || true
    docker rm "$NEW_CONTAINER" 2>/dev/null || true
    exit 1
fi

# Переключение Nginx upstream
echo "🔀 Switching Nginx to port $NEW_PORT..."
echo "upstream mobistore_${ENV}_front { server 127.0.0.1:$NEW_PORT; }" | sudo tee "$NGINX_UPSTREAM" > /dev/null

# Проверка и перезагрузка Nginx
sudo nginx -t
sudo nginx -s reload

echo "✅ Nginx switched to port $NEW_PORT"

# Остановка старого контейнера
echo "🛑 Stopping old container..."
docker stop "$OLD_CONTAINER" 2>/dev/null || true
docker rm "$OLD_CONTAINER" 2>/dev/null || true

# Удаление старых образов
docker image prune -f

echo ""
echo "🎉 $ENV Deploy complete! Zero downtime achieved."
echo "📊 Active container: $NEW_CONTAINER on port $NEW_PORT"
