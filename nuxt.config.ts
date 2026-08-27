// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  css: ["@/assets/styles/main.scss"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/image",
    "@element-plus/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/i18n"
  ],
  runtimeConfig: {
    // Общий секрет с API: подтверждает, что заголовки X-Client-* пришли от SSR,
    // а не подделаны снаружи. Задаётся через NUXT_SSR_SHARED_SECRET.
    ssrSharedSecret: "",
    public: {
      apiUrl: "", // переопределяется через NUXT_PUBLIC_API_URL
      telegramBotName: "",
    },
  },
  // Конфигурация SSR
  ssr: true,

  i18n: {
    defaultLocale: "ru",
    locales: [
      { code: "uz", language: "uz-UZ", name: "O`zbekcha", file: "uz.json" },
      { code: "ru", language: "ru-RU", name: "Русский", file: "ru.json" },
    ],
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "locale",
    },
    baseUrl: "https://mobistore.uz",
  },

  // SEO и производительность
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [{ name: "format-detection", content: "telephone=no" }],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
      ],
      script: [
        {
          innerHTML: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(106391123,'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,ecommerce:"dataLayer"});`,
          type: 'text/javascript'
        }
      ],
      noscript: [
        {
          innerHTML: '<div><img src="https://mc.yandex.ru/watch/106391123" style="position:absolute; left:-9999px;" alt="" /></div>'
        }
      ]
    },
  },

  // Настройки Element Plus для SSR
  elementPlus: {
    importStyle: "scss",
  },

  build: {
    transpile: ['element-plus'],
  },

  // Оптимизация шрифтов
  fonts: {
    families: [
      {
        name: "Inter",
        provider: "google",
        weights: [500, 600, 700, 800],
        display: "swap",
      },
    ],
    defaults: {
      weights: [500, 600, 700, 800],
      preload: true,
    },
  },

  // Экспериментальные функции для улучшения производительности
  experimental: {
    payloadExtraction: false,
  },

  // Настройки рендеринга
  routeRules: {
    "/": { prerender: false },
  },

  // Vite конфигурация для dayjs
  vite: {
    optimizeDeps: {
      include: ['dayjs'],
    },
  },
});
