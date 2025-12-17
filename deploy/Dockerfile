# syntax=docker/dockerfile:1

# ---------- BUILD STAGE ----------
FROM node:22-slim AS builder

RUN apt-get update && apt-get install -y \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Build-time переменная для API URL
ARG NUXT_PUBLIC_API_URL
ENV NUXT_PUBLIC_API_URL=${NUXT_PUBLIC_API_URL}

# Ограничиваем память Node.js для предотвращения OOM
ENV NODE_OPTIONS="--max-old-space-size=3072"

# Копируем package files и yarn.lock для кэширования
COPY package.json yarn.lock ./

# Mount cache для yarn - ускоряет повторные сборки
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

# Копируем исходники
COPY . .

# Build SSR server с переменной окружения
RUN yarn build

# ---------- PRODUCTION STAGE ----------
FROM node:22-slim AS runner

WORKDIR /app

# Runtime переменная для API URL (должна быть доступна при запуске)
ARG NUXT_PUBLIC_API_URL
ENV NODE_ENV=production
ENV NUXT_PUBLIC_API_URL=${NUXT_PUBLIC_API_URL}

# Nitro output самодостаточен
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
