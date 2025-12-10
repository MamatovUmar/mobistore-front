// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['@/assets/styles/main.scss'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@element-plus/nuxt',
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    public: {
      apiUrl: '' // переопределяется через NUXT_PUBLIC_API_URL
    }
  },
  // Конфигурация SSR
  ssr: true,

  // SEO и производительность
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'format-detection', content: 'telephone=no' }
      ]
    }
  },

  // Настройки Element Plus для SSR
  elementPlus: {
    importStyle: 'scss',
  },

  // Экспериментальные функции для улучшения производительности
  experimental: {
    payloadExtraction: false,
  },

  // Настройки рендеринга
  routeRules: {
    '/': { prerender: true }, // Пререндер главной страницы
  }
})