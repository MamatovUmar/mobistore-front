<script setup lang="ts">
import { Star } from "@element-plus/icons-vue";
import FavoriteCard from "@/components/account/FavoriteCard.vue";

definePageMeta({
  layout: false,
});

// Моковые данные для избранных объявлений
const favorites = [
  {
    id: 1,
    image: "/images/phone1.png",
    title: "iPhone 16 Pro Max 256GB",
    brand: "Apple",
    model: "iPhone 16 Pro Max",
    price: "15 000 000",
    currency: "UZS",
    location: "Toshkent",
    condition: "new",
    seller: "Магазин iStore",
    addedAt: "2024-10-28",
  },
  {
    id: 2,
    image: "/images/phone2.png",
    title: "Samsung Galaxy S24 Ultra 512GB",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    price: "12 500 000",
    currency: "UZS",
    location: "Toshkent",
    condition: "used",
    seller: "Частное лицо",
    addedAt: "2024-10-26",
  },
  {
    id: 3,
    image: "/images/phone3.png",
    title: "Xiaomi 14 Pro 256GB Black",
    brand: "Xiaomi",
    model: "14 Pro",
    price: "7 500 000",
    currency: "UZS",
    location: "Samarqand",
    condition: "new",
    seller: "Mi Store",
    addedAt: "2024-10-25",
  },
  {
    id: 4,
    image: "/images/phone4.png",
    title: "iPhone 15 Pro 128GB Blue Titanium",
    brand: "Apple",
    model: "iPhone 15 Pro",
    price: "13 000 000",
    currency: "UZS",
    location: "Bukhara",
    condition: "restored",
    seller: "TechMarket",
    addedAt: "2024-10-24",
  },
];
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <main class="page-account">
        <div class="container">
          <div class="page-header">
            <h1 class="page-title">Мой аккаунт</h1>
          </div>

          <div class="account-layout">
            <!-- Сайдбар с навигацией -->
            <AccountSidebar />

            <!-- Основной контент -->
            <div class="account-content">
              <div class="favorites-section">
                <div class="section-header">
                  <div>
                    <h2 class="section-title">Избранные объявления</h2>
                    <p class="section-subtitle">{{ favorites.length }} объявлений</p>
                  </div>
                </div>

                <!-- Список избранных -->
                <div class="favorites-grid">
                  <FavoriteCard
                    v-for="favorite in favorites"
                    :key="favorite.id"
                    :favorite="favorite"
                  />
                </div>

                <!-- Пустое состояние -->
                <div v-if="favorites.length === 0" class="empty-state">
                  <el-icon class="empty-icon"><Star /></el-icon>
                  <p class="empty-text">У вас пока нет избранных объявлений</p>
                  <p class="empty-description">
                    Добавляйте понравившиеся объявления в избранное, чтобы не потерять их
                  </p>
                  <el-button type="primary" @click="$router.push('/')">
                    Перейти к объявлениям
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </NuxtLayout>
  </div>
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
  }

  .section-subtitle {
    font-size: 14px;
    color: var(--color-text-secondary);
  }

  /* === СЕТКА ИЗБРАННЫХ === */
  .favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
