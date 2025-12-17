// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['@/assets/styles/main.scss'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],
  runtimeConfig: {
    public: {
      apiUrl: '' // переопределяется через NUXT_PUBLIC_API_URL
    }
  },
  // Конфигурация SSR
  ssr: true,

  i18n: {
    defaultLocale: 'ru',
    locales: [
      { code: 'uz', language: 'uz-UZ', name: 'O`zbekcha', file: 'uz.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' }
    ],
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'locale'
    },
    baseUrl: 'https://mobistore.uz'
  },

  // SEO и производительность
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ]
    }
  },

  // Настройки Element Plus для SSR
  elementPlus: {
    importStyle: 'scss',
  },

  // Оптимизация шрифтов
  fonts: {
    families: [
      {
        name: 'Inter',
        provider: 'google',
        weights: [500, 600, 700, 800],
        display: 'swap',
      }
    ],
    defaults: {
      weights: [500, 600, 700, 800],
      preload: true,
    }
  },

  // Экспериментальные функции для улучшения производительности
  experimental: {
    payloadExtraction: false,
  },

  // Настройки рендеринга
  routeRules: {
    '/': { prerender: false },
  }
})