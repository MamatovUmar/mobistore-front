# syntax=docker/dockerfile:1

# ---------- BUILD STAGE ----------
FROM node:22-slim AS builder

WORKDIR /app

# Build-time переменная для API URL
ARG NUXT_PUBLIC_API_URL
ENV NUXT_PUBLIC_API_URL=${NUXT_PUBLIC_API_URL}

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

ENV NODE_ENV=production

# Nitro output самодостаточен
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
