<script setup lang="ts">
import { Document } from "@element-plus/icons-vue";
import MyListingCard from "@/components/account/MyListingCard.vue";

const activeTab = ref("all");

// Моковые данные для объявлений
const listings = [
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
    status: "active",
    views: 245,
    favorites: 12,
    publishedAt: "2024-10-28",
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
    status: "active",
    views: 189,
    favorites: 8,
    publishedAt: "2024-10-25",
  },
  {
    id: 3,
    image: "/images/phone3.png",
    title: "Xiaomi 14 Pro 256GB",
    brand: "Xiaomi",
    model: "14 Pro",
    price: "7 500 000",
    currency: "UZS",
    location: "Samarqand",
    condition: "new",
    status: "draft",
    views: 0,
    favorites: 0,
    publishedAt: "2024-10-29",
  },
];
</script>

<template>
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
          <div class="listings-section">
            <div class="section-header">
              <h2 class="section-title">Мои объявления</h2>
              <el-button type="primary" @click="$router.push('/create')">
                Создать объявление
              </el-button>
            </div>

            <!-- Табы для фильтрации -->
            <el-tabs v-model="activeTab" class="listings-tabs">
              <el-tab-pane label="Все объявления" name="all" />
              <el-tab-pane label="Активные" name="active" />
              <el-tab-pane label="Черновики" name="draft" />
              <el-tab-pane label="Архив" name="archived" />
            </el-tabs>

            <!-- Список объявлений -->
            <div class="listings-list">
              <MyListingCard
                v-for="listing in listings"
                :key="listing.id"
                :listing="listing"
              />
            </div>

            <!-- Пустое состояние -->
            <div v-if="listings.length === 0" class="empty-state">
              <el-icon class="empty-icon"><Document /></el-icon>
              <p class="empty-text">У вас пока нет объявлений</p>
              <el-button type="primary" @click="$router.push('/create')">
                Создать первое объявление
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

  /* === СЕКЦИЯ ОБЪЯВЛЕНИЙ === */
  .listings-section {
    background: var(--color-bg-primary);
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

    @media (max-width: 768px) {
      padding: 20px;
    }
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  }

  .section-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text-primary);
  }

  /* === ТАБЫ === */
  .listings-tabs {
    margin-bottom: 24px;
  }

  /* === СПИСОК ОБЪЯВЛЕНИЙ === */
  .listings-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
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
    font-size: 16px;
    color: var(--color-text-secondary);
    margin-bottom: 24px;
  }
}
</style>
