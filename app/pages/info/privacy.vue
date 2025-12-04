<script setup lang="ts">
const lastUpdated = "04.12.2025";

const sections = [
  {
    title: "1. Определения",
    paragraphs: [
      "«Администрация», «мы», «MobiStore» — команда, управляющая платформой MobiStore.",
      "«Пользователь» — лицо, использующее сайт или приложение.",
      "«Персональные данные» — любая информация, позволяющая идентифицировать пользователя.",
    ],
  },
  {
    title: "2. Какие данные мы собираем",
    subSections: [
      {
        title: "2.1. Данные, предоставляемые пользователем",
        paragraphs: ["При регистрации, авторизации и использовании сервиса:"],
        list: [
          "имя пользователя;",
          "email;",
          "пароль (в зашифрованном виде);",
          "Google ID — при авторизации через Google OAuth;",
          "Telegram данные (если в будущем будет включена авторизация через Telegram WebApp);",
          "номер телефона (если указан в объявлении);",
          "ссылка на Telegram;",
          "аватар;",
          "предпочитаемый язык интерфейса.",
        ],
      },
      {
        title: "2.2. Данные, собираемые автоматически",
        paragraphs: ["При посещении сайта:"],
        list: [
          "IP-адрес;",
          "данные браузера и устройства;",
          "cookies;",
          "дата и время посещений;",
          "статистика действий (просмотры объявлений, клики и т.д.).",
        ],
      },
      {
        title: "2.3. Данные, связанные с объявлениями",
        paragraphs: ["При создании объявлений:"],
        list: [
          "фотографии товара;",
          "описание устройства и его характеристики;",
          "регион и город;",
          "бренд и модель;",
          "цена и валюта;",
          "состояние устройства;",
          "контактные данные продавца.",
        ],
      },
      {
        title: "2.4. Данные переписки",
        paragraphs: ["При использовании встроенного чата:"],
        list: [
          "сообщения между покупателями и продавцами;",
          "время отправки и получения;",
          "ID участников диалога.",
        ],
      },
      {
        title: "2.5. Данные формы обратной связи",
        paragraphs: [
          "Через страницу /info/contacts пользователь может отправлять:",
        ],
        list: [
          "имя;",
          "email или номер телефона;",
          "текст обращения;",
          "вложения (если форма позволяет);",
          "техническую информацию (IP, время отправки, браузер — для защиты от спама).",
        ],
        note: "Эти данные используются исключительно для ответа на обращение пользователя.",
      },
    ],
  },
  {
    title: "3. Как мы используем данные",
    paragraphs: ["Мы обрабатываем данные для:"],
    list: [
      "регистрации и авторизации пользователей;",
      "отображения профиля и контактных данных продавца;",
      "создания, публикации, редактирования и удаления объявлений;",
      "функционирования чата;",
      "связи с пользователями по их обращениям (в т.ч. через /info/contacts);",
      "отправки сервисных уведомлений;",
      "аналитики и улучшения работы сервиса;",
      "защиты от спама, мошенничества и нарушений правил.",
    ],
  },
  {
    title: "4. Передача данных третьим лицам",
    paragraphs: [
      "Мы не передаём и не продаём персональные данные третьим лицам, за исключением следующих случаев:",
    ],
    list: [
      "Google — при авторизации через Google OAuth;",
      "Telegram — при активации WebApp авторизации;",
      "Почтовый сервис Timeweb — для отправки писем подтверждения;",
      "Хостинг-провайдеры — для обеспечения работы сайта и хранения файлов;",
      "Государственные органы — при наличии законного требования.",
    ],
    note: "Мы не используем данные пользователей в коммерческих целях и не передаем их рекламным компаниям.",
  },
  {
    title: "5. Cookies и аналитика",
    paragraphs: ["Мы используем cookies для:"],
    list: [
      "сохранения настроек пользователя;",
      "поддержки авторизации;",
      "анализа посещаемости сайта;",
      "защиты от мошеннических действий.",
    ],
    note: "Пользователь может отключить cookies в браузере, но часть функций сервиса может работать некорректно.",
  },
  {
    title: "6. Хранение и защита данных",
    paragraphs: ["Мы применяем современные технические меры безопасности:"],
    list: [
      "шифрование паролей (bcrypt);",
      "безопасное соединение HTTPS;",
      "защита от подбора пароля и DDOS (rate limiting);",
      "хранение данных на защищённых серверах;",
      "контроль доступа к базе данных;",
      "регулярный мониторинг подозрительной активности.",
    ],
  },
  {
    title: "7. Срок хранения данных",
    paragraphs: [
      "Мы храним персональные данные до тех пор, пока пользователь продолжает использовать сервис, или в течение сроков, установленных законодательством.",
      "Удаление аккаунта пользователем пока недоступно, но появится в будущих обновлениях.",
    ],
  },
  {
    title: "8. Права пользователя",
    paragraphs: ["Пользователь имеет право:"],
    list: [
      "получать информацию о том, какие данные собираются;",
      "запрашивать исправление данных;",
      "ограничивать использование своих контактных данных;",
      "отказываться от рассылок;",
      "направлять жалобы и вопросы через форму обратной связи /info/contacts.",
    ],
  },
  {
    title: "9. Данные детей",
    paragraphs: [
      "Мы не собираем данные детей младше 16 лет.",
      "Если данные несовершеннолетнего были переданы ошибочно — сообщите нам, и мы удалим их.",
    ],
  },
  {
    title: "10. Обновления политики",
    paragraphs: [
      "Мы можем обновлять Политику конфиденциальности.",
      "Актуальная версия всегда доступна на сайте.",
    ],
  },
  {
    title: "11. Контакты",
    paragraphs: [
      "По любым вопросам, связанным с конфиденциальностью и обработкой персональных данных, пользователь может обратиться через форму обратной связи.",
    ],
    link: {
      text: "Форма обратной связи",
      url: "/info/contacts",
    },
    note: "Этот способ является основным и приоритетным для обращений.",
  },
];

useSeoMeta({
  title: "Политика конфиденциальности MobiStore",
  description:
    "Узнайте, как MobiStore собирает, использует и защищает ваши персональные данные.",
  ogTitle: "Политика конфиденциальности MobiStore",
  ogDescription:
    "Узнайте, как MobiStore собирает, использует и защищает ваши персональные данные.",
});
</script>

<template>
  <main class="privacy-page">
    <div class="container">
      <section class="hero-card">
        <p class="eyebrow">Политика конфиденциальности</p>
        <h1>Политика конфиденциальности MobiStore</h1>
        <p class="lead">
          Настоящая Политика конфиденциальности определяет порядок обработки и
          защиты персональных данных пользователей сайта MobiStore и мобильного
          приложения MobiStore.
        </p>
        <div class="hero-meta">
          <div class="badge">Дата последнего обновления: {{ lastUpdated }}</div>
          <div class="summary">
            Используя Сайт или Приложение, вы подтверждаете согласие с данной
            Политикой.
          </div>
        </div>
      </section>

      <section
        v-for="section in sections"
        :key="section.title"
        class="content-card"
      >
        <h3>{{ section.title }}</h3>

        <template v-if="section.subSections">
          <div
            v-for="subSection in section.subSections"
            :key="subSection.title"
            class="sub-section"
          >
            <h4>{{ subSection.title }}</h4>
            <p
              v-for="paragraph in subSection.paragraphs"
              :key="paragraph"
              class="paragraph"
            >
              {{ paragraph }}
            </p>
            <ul v-if="subSection.list" class="bullet-list">
              <li v-for="item in subSection.list" :key="item">
                {{ item }}
              </li>
            </ul>
            <p v-if="subSection.note" class="note">{{ subSection.note }}</p>
          </div>
        </template>

        <template v-else>
          <p
            v-for="paragraph in section.paragraphs"
            :key="paragraph"
            class="paragraph"
          >
            {{ paragraph }}
          </p>

          <ul v-if="section.list" class="bullet-list">
            <li v-for="item in section.list" :key="item">
              {{ item }}
            </li>
          </ul>

          <p v-if="section.note" class="note">{{ section.note }}</p>

          <NuxtLink v-if="section.link" :to="section.link.url" class="cta-link">
            {{ section.link.text }}
          </NuxtLink>
        </template>
      </section>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.privacy-page {
  padding: 48px 0 80px;
  background: var(--color-bg-secondary);
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-card {
  background: linear-gradient(135deg, #1f2937, #111827);
  color: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.3);

  h1 {
    font-size: 32px;
    margin: 12px 0;
  }

  .lead {
    font-size: 16px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 24px;
  }

  .hero-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }

  .badge {
    background: rgba(59, 130, 246, 0.2);
    padding: 6px 14px;
    border-radius: 999px;
    font-weight: 600;
  }

  .summary {
    color: rgba(255, 255, 255, 0.85);
  }
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.content-card {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 15px 40px rgba(15, 23, 42, 0.08);

  h3 {
    font-size: 22px;
    margin-bottom: 16px;
  }
}

.sub-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border-light);

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  h4 {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--color-text-primary);
  }
}

.paragraph {
  margin: 0 0 12px 0;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.bullet-list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    line-height: 1.6;
    color: var(--color-text-secondary);
  }
}

.note {
  margin-top: 16px;
  padding: 12px 16px;
  background: var(--color-bg-secondary);
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
  border-left: 3px solid var(--color-primary);
}

.cta-link {
  display: inline-block;
  margin-top: 16px;
  padding: 10px 20px;
  background: var(--color-primary);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: var(--color-primary-hover);
  }
}

@media (max-width: 640px) {
  .hero-card {
    padding: 24px;

    h1 {
      font-size: 26px;
    }
  }

  .content-card {
    padding: 22px;
  }
}
</style>
