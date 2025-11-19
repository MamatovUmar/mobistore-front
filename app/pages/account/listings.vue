<script setup lang="ts">
import { Document } from "@element-plus/icons-vue";
import MyListingCard from "@/components/account/MyListingCard.vue";
import MyListingCardSkeleton from "@/components/account/MyListingCardSkeleton.vue";
import type { IListing, IAdsResponse } from "~/types/ads";
import type { IBaseResponse, IPagination } from "~/types";
import { ListingStatus } from "~/types/ads";

const { $api } = useNuxtApp();

const activeTab = ref("all");
const listings = ref<IListing[]>([]);
const pagination = ref<IPagination>({
  total: 0,
  page: 1,
  limit: 10,
  pages: 0,
});
const loading = ref(false);
const params = reactive({
  status: "all",
  page: 1,
  limit: 5,
});

const statuses = [
  { value: "all", label: "Все" },
  { value: ListingStatus.ACTIVE, label: "Активные" },
  { value: ListingStatus.DRAFT, label: "Черновики" },
  { value: ListingStatus.ARCHIVED, label: "Архив" },
  { value: ListingStatus.MODERATION, label: "На модерации" },
  { value: ListingStatus.REJECTED, label: "Отклонено" },
];

const getMyListings = catcher(
  async () => {
    loading.value = true;
    const result = await $api<IBaseResponse<IAdsResponse>>("/ads/my", {
      params: {
        ...params,
        status: params.status === "all" ? undefined : params.status,
      },
    });
    listings.value = result.data?.ads || [];
    pagination.value = result.data?.pagination || pagination.value;
    loading.value = false;
  },
  () => {
    loading.value = false;
  }
);

const handlePageChange = (page: number) => {
  params.page = page;
  getMyListings();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

watch(activeTab, () => {
  params.status = activeTab.value;
  params.page = 1;
  getMyListings();
});

getMyListings();
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
            <h2 class="section-title">Мои объявления</h2>

            <!-- Табы для фильтрации -->
            <el-tabs v-model="activeTab" class="listings-tabs">
              <el-tab-pane
                v-for="status in statuses"
                :key="status.value"
                :label="status.label"
                :name="status.value"
              />
            </el-tabs>

            <!-- Список объявлений -->
            <div v-if="loading" class="listings-list">
              <MyListingCardSkeleton v-for="i in params.limit" :key="i" />
            </div>

            <template v-else>
              <div v-if="listings.length > 0" class="listings-list">
                <MyListingCard
                  v-for="listing in listings"
                  :key="listing.id"
                  :listing="listing"
                  @status-change="getMyListings"
                />
              </div>

              <!-- Пагинация -->
              <div v-if="pagination.pages > 1" class="pagination-wrapper">
                <el-pagination
                  v-model:current-page="pagination.page"
                  :page-size="pagination.limit"
                  :total="pagination.total"
                  :page-count="pagination.pages"
                  layout="prev, pager, next, total"
                  background
                  @current-change="handlePageChange"
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
            </template>
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

  /* === ПАГИНАЦИЯ === */
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;

    :deep(.el-pagination) {
      .btn-prev,
      .btn-next {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;

        &:hover:not(:disabled) {
          color: var(--el-color-primary);
          border-color: var(--el-color-primary);
        }
      }

      .el-pager {
        li {
          border-radius: 8px;
          margin: 0 4px;

          &.is-active {
            background: var(--el-color-primary);
            color: #fff;
          }

          &:hover:not(.is-active) {
            color: var(--el-color-primary);
          }
        }
      }

      .el-pagination__total {
        color: #6b7280;
        font-weight: 500;
      }
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
    font-size: 16px;
    color: var(--color-text-secondary);
    margin-bottom: 24px;
  }
}
</style>
