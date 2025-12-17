<script setup lang="ts">
import { Document } from "@element-plus/icons-vue";
import MyListingCard from "@/components/account/MyListingCard.vue";
import MyListingCardSkeleton from "@/components/account/MyListingCardSkeleton.vue";
import type { IListing, IAdsResponse } from "~/types/ads";
import type { IBaseResponse, IPagination } from "~/types";
import { ListingStatus } from "~/types/ads";

useSeoMeta({
  title: "Мои объявления — MobiStore",
  robots: "noindex, nofollow",
});

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

            <!-- Фильтр по статусу -->
            <div class="status-filter">
              <!-- Desktop: Кнопки-пилюли -->
              <div class="filter-buttons">
                <button
                  v-for="status in statuses"
                  :key="status.value"
                  class="filter-btn"
                  :class="{ active: activeTab === status.value }"
                  @click="activeTab = status.value"
                >
                  {{ status.label }}
                </button>
              </div>

              <!-- Mobile: Dropdown -->
              <el-select
                v-model="activeTab"
                class="filter-select"
                placeholder="Выберите статус"
              >
                <el-option
                  v-for="status in statuses"
                  :key="status.value"
                  :label="status.label"
                  :value="status.value"
                />
              </el-select>
            </div>

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

  @media (max-width: 768px) {
    padding: 20px 0;
  }

  @media (max-width: 480px) {
    padding: 16px 0;
  }

  .page-header {
    margin-bottom: 32px;

    @media (max-width: 640px) {
      margin-bottom: 24px;
    }

    @media (max-width: 480px) {
      margin-bottom: 20px;
    }
  }

  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--color-text-primary);

    @media (max-width: 640px) {
      font-size: 24px;
    }

    @media (max-width: 480px) {
      font-size: 22px;
    }
  }

  .account-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 24px;
    align-items: start;

    @media (max-width: 968px) {
      grid-template-columns: 240px 1fr;
      gap: 20px;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  /* === КОНТЕНТ === */
  .account-content {
    display: flex;
    flex-direction: column;
    gap: 24px;

    @media (max-width: 640px) {
      gap: 16px;
    }
  }

  /* === СЕКЦИЯ ОБЪЯВЛЕНИЙ === */
  .listings-section {
    background: var(--color-bg-primary);
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

    @media (max-width: 768px) {
      padding: 20px;
      border-radius: 10px;
    }

    @media (max-width: 480px) {
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
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
      margin-bottom: 20px;
    }
  }

  .section-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text-primary);

    @media (max-width: 640px) {
      font-size: 18px;
    }

    @media (max-width: 480px) {
      font-size: 17px;
    }
  }

  /* === ФИЛЬТР ПО СТАТУСУ === */
  .status-filter {
    margin-bottom: 24px;

    @media (max-width: 640px) {
      margin-bottom: 16px;
    }
  }

  .filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    @media (max-width: 640px) {
      display: none;
    }
  }

  .filter-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 500;
    color: #4b5563;
    background: #f3f4f6;
    border: 1px solid transparent;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      background: #e5e7eb;
      color: #1f2937;
    }

    &.active {
      background: var(--el-color-primary);
      color: #fff;
      border-color: var(--el-color-primary);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }

    @media (max-width: 768px) {
      padding: 8px 14px;
      font-size: 13px;
    }
  }

  .filter-select {
    display: none;
    width: 100%;

    @media (max-width: 640px) {
      display: block;
    }

    :deep(.el-input__wrapper) {
      border-radius: 10px;
      padding: 4px 12px;
      box-shadow: 0 0 0 1px #e5e7eb inset;

      &:hover {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }

    :deep(.el-input__inner) {
      font-weight: 500;
    }
  }

  /* === СПИСОК ОБЪЯВЛЕНИЙ === */
  .listings-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }

    @media (max-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    @media (max-width: 520px) {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }

  /* === ПАГИНАЦИЯ === */
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;

    @media (max-width: 640px) {
      margin-top: 24px;
      padding-top: 20px;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    @media (max-width: 480px) {
      margin-top: 20px;
      padding-top: 16px;
    }

    :deep(.el-pagination) {
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;

      @media (max-width: 480px) {
        gap: 4px;
      }

      .btn-prev,
      .btn-next {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        transition: all 0.2s ease;

        @media (max-width: 480px) {
          min-width: 32px;
          height: 32px;
          border-radius: 6px;
        }

        &:hover:not(:disabled) {
          color: var(--el-color-primary);
          border-color: var(--el-color-primary);
          transform: translateY(-1px);
        }
      }

      .el-pager {
        @media (max-width: 480px) {
          margin: 0 4px;
        }

        li {
          border-radius: 8px;
          margin: 0 4px;
          transition: all 0.2s ease;

          @media (max-width: 480px) {
            min-width: 32px;
            height: 32px;
            line-height: 32px;
            margin: 0 2px;
            border-radius: 6px;
            font-size: 13px;
          }

          &.is-active {
            background: var(--el-color-primary);
            color: #fff;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
          }

          &:hover:not(.is-active) {
            color: var(--el-color-primary);
            background: rgba(59, 130, 246, 0.08);
          }
        }
      }

      .el-pagination__total {
        color: #6b7280;
        font-weight: 500;

        @media (max-width: 640px) {
          order: 1;
          width: 100%;
          text-align: center;
          margin-top: 8px;
          font-size: 13px;
        }
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

    @media (max-width: 640px) {
      padding: 48px 24px;
    }

    @media (max-width: 480px) {
      padding: 40px 20px;
    }
  }

  .empty-icon {
    font-size: 64px;
    color: var(--color-text-muted);
    margin-bottom: 16px;
    opacity: 0.6;

    @media (max-width: 640px) {
      font-size: 56px;
      margin-bottom: 14px;
    }

    @media (max-width: 480px) {
      font-size: 48px;
      margin-bottom: 12px;
    }
  }

  .empty-text {
    font-size: 16px;
    color: var(--color-text-secondary);
    margin-bottom: 24px;
    line-height: 1.5;

    @media (max-width: 640px) {
      font-size: 15px;
      margin-bottom: 20px;
    }

    @media (max-width: 480px) {
      font-size: 14px;
      margin-bottom: 16px;
    }
  }
}
</style>
