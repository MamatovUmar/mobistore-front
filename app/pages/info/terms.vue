<script setup lang="ts">
const { t, rt } = useI18n();
const i18n = useI18n();

const getList = (key: string): string[] => (i18n as any).tm(key);

const lastUpdated = "04.12.2025";

useSeoMeta({
  title: () => t("terms.seo.title"),
  description: () => t("terms.seo.description"),
  ogTitle: () => t("terms.seo.title"),
  ogDescription: () => t("terms.seo.description"),
});
</script>

<template>
  <main class="terms-page">
    <div class="container">
      <section class="hero-card">
        <p class="eyebrow">{{ t("terms.eyebrow") }}</p>
        <h1>{{ t("terms.title") }}</h1>
        <p class="lead">{{ t("terms.lead") }}</p>
        <div class="hero-meta">
          <div class="badge">{{ t("terms.lastUpdated", { date: lastUpdated }) }}</div>
          <div class="summary">{{ t("terms.consent") }}</div>
        </div>
      </section>

      <section class="content-card">
        <h2>{{ t("terms.intro.title") }}</h2>
        <p class="intro-text">{{ t("terms.intro.text") }}</p>
      </section>

      <!-- 1. Определения -->
      <section class="content-card">
        <h3>{{ t("terms.sections.definitions.title") }}</h3>
        <p v-for="(p, i) in getList('terms.sections.definitions.paragraphs')" :key="i" class="paragraph">{{ rt(p) }}</p>
      </section>

      <!-- 2. Общие положения -->
      <section class="content-card">
        <h3>{{ t("terms.sections.general.title") }}</h3>
        <p v-for="(p, i) in getList('terms.sections.general.paragraphs')" :key="i" class="paragraph">{{ rt(p) }}</p>
      </section>

      <!-- 3. Аккаунт и регистрация -->
      <section class="content-card">
        <h3>{{ t("terms.sections.account.title") }}</h3>
        <p v-for="(p, i) in getList('terms.sections.account.paragraphs')" :key="i" class="paragraph">{{ rt(p) }}</p>
      </section>

      <!-- 4. Размещение объявлений -->
      <section class="content-card">
        <h3>{{ t("terms.sections.listings.title") }}</h3>
        <p class="paragraph">{{ t("terms.sections.listings.intro") }}</p>
        <ul class="bullet-list">
          <li v-for="(item, i) in getList('terms.sections.listings.list')" :key="i">{{ rt(item) }}</li>
        </ul>
      </section>

      <!-- 5. Статусы объявлений -->
      <section class="content-card">
        <h3>{{ t("terms.sections.statuses.title") }}</h3>
        <ul class="bullet-list">
          <li v-for="(item, i) in getList('terms.sections.statuses.list')" :key="i">{{ rt(item) }}</li>
        </ul>
      </section>

      <!-- 6. Изображения -->
      <section class="content-card">
        <h3>{{ t("terms.sections.images.title") }}</h3>
        <p v-for="(p, i) in getList('terms.sections.images.paragraphs')" :key="i" class="paragraph">{{ rt(p) }}</p>
      </section>

      <!-- 7. Чат между покупателем и продавцом -->
      <section class="content-card">
        <h3>{{ t("terms.sections.chat.title") }}</h3>
        <p v-for="(p, i) in getList('terms.sections.chat.paragraphs')" :key="i" class="paragraph">{{ rt(p) }}</p>
      </section>

      <!-- 8. Избранное -->
      <section class="content-card">
        <h3>{{ t("terms.sections.favorites.title") }}</h3>
        <p v-for="(p, i) in getList('terms.sections.favorites.paragraphs')" :key="i" class="paragraph">{{ rt(p) }}</p>
      </section>

      <!-- 9. Запрещённые товары -->
      <section class="content-card">
        <h3>{{ t("terms.sections.prohibited.title") }}</h3>
        <div class="sub-lists">
          <div class="sub-list-card">
            <h4>{{ t("terms.sections.prohibited.fullyProhibited.title") }}</h4>
            <ul class="bullet-list">
              <li v-for="(item, i) in getList('terms.sections.prohibited.fullyProhibited.list')" :key="i">{{ rt(item) }}</li>
            </ul>
          </div>
          <div class="sub-list-card">
            <h4>{{ t("terms.sections.prohibited.conditionallyProhibited.title") }}</h4>
            <ul class="bullet-list">
              <li v-for="(item, i) in getList('terms.sections.prohibited.conditionallyProhibited.list')" :key="i">{{ rt(item) }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 10. Ответственность пользователя -->
      <section class="content-card">
        <h3>{{ t("terms.sections.responsibility.title") }}</h3>
        <p v-for="(p, i) in getList('terms.sections.responsibility.paragraphs')" :key="i" class="paragraph">{{ rt(p) }}</p>
      </section>

      <!-- 11. Ограничение ответственности MobiStore -->
      <section class="content-card">
        <h3>{{ t("terms.sections.liability.title") }}</h3>
        <ul class="bullet-list">
          <li v-for="(item, i) in getList('terms.sections.liability.list')" :key="i">{{ rt(item) }}</li>
        </ul>
      </section>

      <!-- 12. Жалобы -->
      <section class="content-card">
        <h3>{{ t("terms.sections.complaints.title") }}</h3>
        <p v-for="(p, i) in getList('terms.sections.complaints.paragraphs')" :key="i" class="paragraph">{{ rt(p) }}</p>
      </section>

      <!-- 13. Изменения Условий -->
      <section class="content-card">
        <h3>{{ t("terms.sections.changes.title") }}</h3>
        <p v-for="(p, i) in getList('terms.sections.changes.paragraphs')" :key="i" class="paragraph">{{ rt(p) }}</p>
      </section>

      <!-- 14. Применимое право -->
      <section class="content-card">
        <h3>{{ t("terms.sections.law.title") }}</h3>
        <p v-for="(p, i) in getList('terms.sections.law.paragraphs')" :key="i" class="paragraph">{{ rt(p) }}</p>
      </section>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.terms-page {
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

.intro-text {
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-text-secondary);
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

.sub-lists {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.sub-list-card {
  background: var(--color-bg-secondary);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--color-border-light);

  h4 {
    margin-bottom: 12px;
    font-size: 15px;
    font-weight: 600;
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