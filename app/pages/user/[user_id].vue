<script setup lang="ts">
import { Document, Grid, List } from "@element-plus/icons-vue";
import type { IUser } from "~/types/user";
import type { IListing, IAdsResponse } from "~/types/ads";
import type { IBaseResponse, IPagination } from "~/types";
import type { IUserContacts } from "~/components/user/UserProfileCard.vue";

const { $api } = useNuxtApp();
const route = useRoute();
const { t, locale } = useI18n();
const localePath = useLocalePath();

const userId = computed(() => route.params.user_id as string);

const viewMode = ref<"grid" | "list">("grid");
const contacts = ref<IUserContacts | null>(null);
const showContacts = ref(false);
const contactsLoading = ref(false);
const listingsParams = reactive({
  page: 1,
  limit: 9,
});

const { data: userResponse, pending: userPending } = await useAsyncData(
  `user-${userId.value}`,
  () => $api<IBaseResponse<IUser>>(`/user/profile/${userId.value}`),
  {
    watch: [userId],
  }
);

const user = computed(() => userResponse.value?.data || null);

const userLocation = computed(() => {
  const region = user.value?.region?.[`name_${locale.value}`] || user.value?.region?.name_ru;
  const city = user.value?.city?.[`name_${locale.value}`] || user.value?.city?.name_ru;
  return [region, city].filter(Boolean).join(", ") || null;
});

const userName = computed(() => {
  if (!user.value) return t("userPage.defaultName");
  return `${user.value.first_name} ${user.value.last_name}`.trim() || t("userPage.defaultName");
});

const { data: listingsResponse, pending: listingsPending } = await useAsyncData(
  `user-listings-${userId.value}-${listingsParams.page}`,
  () =>
    $api<IBaseResponse<IAdsResponse>>(`/ads/user/${userId.value}`, {
      params: { page: listingsParams.page, limit: listingsParams.limit },
    }),
  {
    watch: [userId, () => listingsParams.page],
  }
);

const listings = computed<IListing[]>(() => listingsResponse.value?.data?.ads || []);
const listingsPagination = computed<IPagination>(() => {
  if (listingsResponse.value?.data?.pagination) {
    return listingsResponse.value.data.pagination;
  }
  return {
    total: 0,
    page: listingsParams.page,
    limit: listingsParams.limit,
    pages: 0,
  };
});

const loading = computed(() => userPending.value || listingsPending.value);

const handlePageChange = (page: number) => {
  listingsParams.page = page;
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const handleShowContacts = async () => {
  if (showContacts.value || contactsLoading.value) return;

  contactsLoading.value = true;
  try {
    const result = await $api<IBaseResponse<IUserContacts>>(`/user/${userId.value}/contacts`);
    contacts.value = result.data || null;
    showContacts.value = true;
  } catch {
    contacts.value = null;
  }
  contactsLoading.value = false;
};

watch(userId, () => {
  listingsParams.page = 1;
  contacts.value = null;
  showContacts.value = false;
});

const seoDescription = computed(() => {
  const name = userName.value;
  const location = userLocation.value ? ` — ${userLocation.value}` : "";
  const total = listingsPagination.value.total;
  const adsText = total ? t('userPage.seo.adsCount', { count: total }) : t("userPage.seo.defaultProfile");
  return t('userPage.seo.description', { name, location, adsText });
});

useSeoMeta({
  title: () => t('userPage.seo.title', { name: userName.value }),
  ogTitle: () => t('userPage.seo.title', { name: userName.value }),
  description: () => seoDescription.value,
  ogDescription: () => seoDescription.value,
});
</script>

<template>
  <main class="user-page">
    <div class="container">
      <!-- Скелетон загрузки -->
      <template v-if="loading">
        <div class="page-layout">
          <div class="sidebar">
            <el-skeleton animated>
              <template #template>
                <div class="skeleton-profile">
                  <el-skeleton-item variant="circle" style="width: 100px; height: 100px" />
                  <el-skeleton-item variant="h1" style="width: 60%; margin-top: 16px" />
                  <el-skeleton-item variant="text" style="width: 40%; margin-top: 8px" />
                  <el-skeleton-item variant="text" style="width: 80%; margin-top: 24px" />
                  <el-skeleton-item variant="text" style="width: 70%; margin-top: 8px" />
                  <el-skeleton-item variant="button" style="width: 100%; height: 48px; margin-top: 24px" />
                </div>
              </template>
            </el-skeleton>
          </div>

          <div class="main-content">
            <div class="section-header skeleton-header">
              <el-skeleton-item variant="h3" style="width: 200px" />
            </div>
            <div class="listings-grid">
              <el-skeleton v-for="i in 6" :key="i" animated>
                <template #template>
                  <div class="skeleton-card">
                    <el-skeleton-item variant="image" style="width: 100%; height: 180px" />
                    <el-skeleton-item variant="text" style="width: 80%; margin-top: 12px" />
                    <el-skeleton-item variant="text" style="width: 50%; margin-top: 8px" />
                  </div>
                </template>
              </el-skeleton>
            </div>
          </div>
        </div>
      </template>

      <!-- Контент страницы -->
      <template v-else>
        <!-- Пользователь не найден -->
        <div v-if="!user" class="not-found">
          <el-icon class="not-found-icon"><Document /></el-icon>
          <h2>{{ t('userPage.notFound.title') }}</h2>
          <p>{{ t('userPage.notFound.text') }}</p>
          <el-button type="primary" @click="$router.push(localePath('/'))">
            {{ t('userPage.notFound.button') }}
          </el-button>
        </div>

        <!-- Профиль и объявления -->
        <div v-else class="page-layout">
          <!-- Сайдбар с профилем -->
          <aside class="sidebar">
            <UserProfileCard
              :user="user"
              :contacts="contacts"
              :show-contacts="showContacts"
              :contacts-loading="contactsLoading"
              @show-contacts="handleShowContacts"
            />
          </aside>

          <!-- Основной контент - объявления -->
          <div class="main-content">
            <div class="section-header">
              <h2 class="section-title">
                {{ t('userPage.listings.title') }}
                <span v-if="listingsPagination.total" class="count">{{ listingsPagination.total }}</span>
              </h2>

              <!-- Переключатель вида -->
              <div class="view-toggle">
                <el-button-group>
                  <el-button
                    :type="viewMode === 'grid' ? 'primary' : 'default'"
                    @click="viewMode = 'grid'"
                  >
                    <el-icon><Grid /></el-icon>
                  </el-button>
                  <el-button
                    :type="viewMode === 'list' ? 'primary' : 'default'"
                    @click="viewMode = 'list'"
                  >
                    <el-icon><List /></el-icon>
                  </el-button>
                </el-button-group>
              </div>
            </div>

            <!-- Сетка объявлений -->
            <div v-if="listings.length > 0" :class="['listings-container', viewMode]">
              <template v-if="viewMode === 'grid'">
                <AdCard v-for="listing in listings" :key="listing.id" :listing="listing" />
              </template>
              <template v-else>
                <AdRowCard v-for="listing in listings" :key="listing.id" :listing="listing" />
              </template>
            </div>

            <!-- Пагинация -->
            <div v-if="listingsPagination.pages > 1" class="pagination-wrapper">
              <el-pagination
                v-model:current-page="listingsPagination.page"
                :page-size="listingsPagination.limit"
                :total="listingsPagination.total"
                :page-count="listingsPagination.pages"
                layout="prev, pager, next"
                background
                @current-change="handlePageChange"
              />
            </div>

            <!-- Пустое состояние -->
            <div v-if="listings.length === 0" class="empty-state">
              <el-icon class="empty-icon"><Document /></el-icon>
              <p class="empty-text">{{ t('userPage.emptyListings') }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.user-page {
  min-height: 60vh;
  padding: 40px 0;
  background: var(--color-bg-secondary);
}

.page-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 32px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 320px 1fr;
    gap: 24px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.sidebar {
  position: sticky;
  top: 20px;

  @media (max-width: 768px) {
    position: static;
  }
}

.main-content {
  min-width: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;

  .count {
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    background: #f1f5f9;
    padding: 4px 12px;
    border-radius: 20px;
  }
}

.view-toggle {
  .el-button-group {
    .el-button {
      padding: 8px 12px;
    }
  }
}

.listings-container {
  &.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  &.list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

// Пагинация
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-light);
}

// Пустое состояние
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
  text-align: center;
  background: var(--color-bg-primary);
  border-radius: 16px;
  border: 1px dashed var(--color-border-light);
}

.empty-icon {
  font-size: 64px;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin: 0;
}

// Не найден
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 32px;
  text-align: center;

  h2 {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 16px 0 8px;
  }

  p {
    font-size: 15px;
    color: var(--color-text-secondary);
    margin-bottom: 24px;
  }
}

.not-found-icon {
  font-size: 80px;
  color: #cbd5e1;
}

// Скелетоны
.skeleton-profile {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.skeleton-header {
  margin-bottom: 24px;
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.skeleton-card {
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 12px;
}
</style>
