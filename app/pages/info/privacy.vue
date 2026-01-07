<script setup lang="ts">
const { t, rt } = useI18n();
const localePath = useLocalePath();
const i18n = useI18n();

const getList = (key: string): string[] => (i18n as any).tm(key);

const lastUpdated = "04.12.2025";

useSeoMeta({
  title: () => t("privacy.seo.title"),
  description: () => t("privacy.seo.description"),
  ogTitle: () => t("privacy.seo.title"),
  ogDescription: () => t("privacy.seo.description"),
});
</script>

<template>
  <main class="privacy-page">
    <div class="container">
      <section class="hero-card">
        <p class="eyebrow">{{ t("privacy.eyebrow") }}</p>
        <h1>{{ t("privacy.title") }}</h1>
        <p class="lead">{{ t("privacy.lead") }}</p>
        <div class="hero-meta">
          <div class="badge">{{ t("privacy.lastUpdated", { date: lastUpdated }) }}</div>
          <div class="summary">{{ t("privacy.consent") }}</div>
        </div>
      </section>

      <!-- 1. Определения -->
      <section class="content-card">
        <h3>{{ t("privacy.sections.definitions.title") }}</h3>
        <p v-for="(p, i) in getList('privacy.sections.definitions.paragraphs')" :key="i" class="paragraph">{{ rt(p) }}</p>
      </section>

      <!-- 2. Какие данные мы собираем -->
      <section class="content-card">
        <h3>{{ t("privacy.sections.dataCollection.title") }}</h3>

        <div class="sub-section">
          <h4>{{ t("privacy.sections.dataCollection.userProvided.title") }}</h4>
          <p class="paragraph">{{ t("privacy.sections.dataCollection.userProvided.intro") }}</p>
          <ul class="bullet-list">
            <li v-for="(item, i) in getList('privacy.sections.dataCollection.userProvided.list')" :key="i">{{ rt(item) }}</li>
          </ul>
        </div>

        <div class="sub-section">
          <h4>{{ t("privacy.sections.dataCollection.automatic.title") }}</h4>
          <p class="paragraph">{{ t("privacy.sections.dataCollection.automatic.intro") }}</p>
          <ul class="bullet-list">
            <li v-for="(item, i) in getList('privacy.sections.dataCollection.automatic.list')" :key="i">{{ rt(item) }}</li>
          </ul>
        </div>

        <div class="sub-section">
          <h4>{{ t("privacy.sections.dataCollection.listings.title") }}</h4>
          <p class="paragraph">{{ t("privacy.sections.dataCollection.listings.intro") }}</p>
          <ul class="bullet-list">
            <li v-for="(item, i) in getList('privacy.sections.dataCollection.listings.list')" :key="i">{{ rt(item) }}</li>
          </ul>
        </div>

        <div class="sub-section">
          <h4>{{ t("privacy.sections.dataCollection.chat.title") }}</h4>
          <p class="paragraph">{{ t("privacy.sections.dataCollection.chat.intro") }}</p>
          <ul class="bullet-list">
            <li v-for="(item, i) in getList('privacy.sections.dataCollection.chat.list')" :key="i">{{ rt(item) }}</li>
          </ul>
        </div>

        <div class="sub-section">
          <h4>{{ t("privacy.sections.dataCollection.feedback.title") }}</h4>
          <p class="paragraph">{{ t("privacy.sections.dataCollection.feedback.intro") }}</p>
          <ul class="bullet-list">
            <li v-for="(item, i) in getList('privacy.sections.dataCollection.feedback.list')" :key="i">{{ rt(item) }}</li>
          </ul>
          <p class="note">{{ t("privacy.sections.dataCollection.feedback.note") }}</p>
        </div>
      </section>

      <!-- 3. Как мы используем данные -->
      <section class="content-card">
        <h3>{{ t("privacy.sections.dataUsage.title") }}</h3>
        <p class="paragraph">{{ t("privacy.sections.dataUsage.intro") }}</p>
        <ul class="bullet-list">
          <li v-for="(item, i) in getList('privacy.sections.dataUsage.list')" :key="i">{{ rt(item) }}</li>
        </ul>
      </section>

      <!-- 4. Передача данных третьим лицам -->
      <section class="content-card">
        <h3>{{ t("privacy.sections.thirdParty.title") }}</h3>
        <p class="paragraph">{{ t("privacy.sections.thirdParty.intro") }}</p>
        <ul class="bullet-list">
          <li v-for="(item, i) in getList('privacy.sections.thirdParty.list')" :key="i">{{ rt(item) }}</li>
        </ul>
        <p class="note">{{ t("privacy.sections.thirdParty.note") }}</p>
      </section>

      <!-- 5. Cookies и аналитика -->
      <section class="content-card">
        <h3>{{ t("privacy.sections.cookies.title") }}</h3>
        <p class="paragraph">{{ t("privacy.sections.cookies.intro") }}</p>
        <ul class="bullet-list">
          <li v-for="(item, i) in getList('privacy.sections.cookies.list')" :key="i">{{ rt(item) }}</li>
        </ul>
        <p class="note">{{ t("privacy.sections.cookies.note") }}</p>
      </section>

      <!-- 6. Хранение и защита данных -->
      <section class="content-card">
        <h3>{{ t("privacy.sections.security.title") }}</h3>
        <p class="paragraph">{{ t("privacy.sections.security.intro") }}</p>
        <ul class="bullet-list">
          <li v-for="(item, i) in getList('privacy.sections.security.list')" :key="i">{{ rt(item) }}</li>
        </ul>
      </section>

      <!-- 7. Срок хранения данных -->
      <section class="content-card">
        <h3>{{ t("privacy.sections.retention.title") }}</h3>
        <p v-for="(p, i) in getList('privacy.sections.retention.paragraphs')" :key="i" class="paragraph">{{ rt(p) }}</p>
      </section>

      <!-- 8. Права пользователя -->
      <section class="content-card">
        <h3>{{ t("privacy.sections.rights.title") }}</h3>
        <p class="paragraph">{{ t("privacy.sections.rights.intro") }}</p>
        <ul class="bullet-list">
          <li v-for="(item, i) in getList('privacy.sections.rights.list')" :key="i">{{ rt(item) }}</li>
        </ul>
      </section>

      <!-- 9. Данные детей -->
      <section class="content-card">
        <h3>{{ t("privacy.sections.children.title") }}</h3>
        <p v-for="(p, i) in getList('privacy.sections.children.paragraphs')" :key="i" class="paragraph">{{ rt(p) }}</p>
      </section>

      <!-- 10. Обновления политики -->
      <section class="content-card">
        <h3>{{ t("privacy.sections.updates.title") }}</h3>
        <p v-for="(p, i) in getList('privacy.sections.updates.paragraphs')" :key="i" class="paragraph">{{ rt(p) }}</p>
      </section>

      <!-- 11. Контакты -->
      <section class="content-card">
        <h3>{{ t("privacy.sections.contact.title") }}</h3>
        <p v-for="(p, i) in getList('privacy.sections.contact.paragraphs')" :key="i" class="paragraph">{{ rt(p) }}</p>
        <NuxtLink :to="localePath('/info/contacts')" class="cta-link">
          {{ t("privacy.feedbackForm") }}
        </NuxtLink>
        <p class="note">{{ t("privacy.sections.contact.note") }}</p>
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
