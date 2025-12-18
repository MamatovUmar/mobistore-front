<script setup lang="ts">
import { Star } from "@element-plus/icons-vue";

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => t("account.meta.favorites"),
  robots: "noindex, nofollow",
});

const { getProfileFavorites, favorites } = useFavorite();

getProfileFavorites();
</script>

<template>
  <main class="page-account">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ $t("account.title") }}</h1>
      </div>

      <div class="account-layout">
        <!-- Сайдбар с навигацией -->
        <AccountSidebar />

        <!-- Основной контент -->
        <div class="account-content">
          <div class="favorites-section">
            <div class="section-header">
              <div>
                <h2 class="section-title">{{ $t("account.favorites.title") }}</h2>
                <p class="section-subtitle">
                  {{ $t("account.favorites.count", { count: favorites.length }) }}
                </p>
              </div>
            </div>

            <!-- Список избранных -->
            <div class="favorites-grid">
              <AdRowCard
                v-for="favorite in favorites"
                :key="favorite.id"
                :listing="favorite"
                @favorite-changed="getProfileFavorites"
              />
            </div>

            <!-- Пустое состояние -->
            <div v-if="favorites.length === 0" class="empty-state">
              <el-icon class="empty-icon"><Star /></el-icon>
              <p class="empty-text">{{ $t("account.favorites.empty.title") }}</p>
              <p class="empty-description">
                {{ $t("account.favorites.empty.text") }}
              </p>
              <el-button type="primary" @click="$router.push(localePath('/search'))">
                {{ $t("account.favorites.empty.button") }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.page-account {
  min-height: 60vh;
  padding: 40px 0;

  .page-header {
    margin-bottom: 32px;
  }

  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--color-text-primary);
  }

  .account-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 24px;
    align-items: start;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  /* === КОНТЕНТ === */
  .account-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* === СЕКЦИЯ ИЗБРАННОГО === */
  .favorites-section {
    background: var(--color-bg-primary);
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

    @media (max-width: 768px) {
      padding: 20px;
    }
  }

  .section-header {
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 4px;
    margin-top: 0;
  }

  .section-subtitle {
    font-size: 14px;
    color: var(--color-text-secondary);
  }

  /* === СЕТКА ИЗБРАННЫХ === */
  .favorites-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  /* === ПУСТОЕ СОСТОЯНИЕ === */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 32px;
    text-align: center;
  }

  .empty-icon {
    font-size: 64px;
    color: var(--color-text-muted);
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 8px;
  }

  .empty-description {
    font-size: 15px;
    color: var(--color-text-secondary);
    margin-bottom: 24px;
    max-width: 400px;
  }
}
</style>
