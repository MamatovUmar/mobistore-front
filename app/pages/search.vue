<script setup lang="ts">
import FilterForm from "@/components/results/FilterForm.vue";
import AdRowCard from "@/components/AdRowCard.vue";
import AdCard from "@/components/AdCard.vue";
import JsonLd from "@/components/JsonLd.vue";
import AdRowCardSkeleton from "@/components/skeletons/AdRowCardSkeleton.vue";
import AdCardSkeleton from "@/components/skeletons/AdCardSkeleton.vue";
import FilterFormSkeleton from "@/components/skeletons/FilterFormSkeleton.vue";
import type { IBaseResponse } from "~/types";
import type { IAdsResponse } from "~/types/ads";
import { Search, Filter } from "@element-plus/icons-vue";

const route = useRoute();
const { $api } = useNuxtApp();
const { t } = useI18n();
const localePath = useLocalePath();

const showMobileFilters = ref(false);

// SEO Meta (будут генерироваться на основе серверных данных)
const title = ref("");
const description = ref("");
const keywords = ref("");
const pageParams = reactive({
  page: 1,
  limit: 12,
});

const { locale } = useI18n();

// Функция для генерации SEO заголовка на основе серверных данных
const generateSeoTitle = () => {
  const query = route.query;
  const currentFilters = filters.value;

  let seoTitle = t("search.title");

  if (currentFilters?.brand?.name) {
    seoTitle += ` ${currentFilters.brand.name}`;
  }

  if (currentFilters?.region) {
    seoTitle += ` ${t('search.seo.in')} ${currentFilters.region[`name_${locale.value}`] || currentFilters.region.name_ru}`;
  } else if (currentFilters?.city) {
    seoTitle += ` ${t('search.seo.in')} ${currentFilters.city[`name_${locale.value}`] || currentFilters.city.name_ru}`;
  }

  if (query.state === "new") {
    seoTitle += ` (${t('search.seo.new')})`;
  } else if (query.state === "used") {
    seoTitle += ` (${t('search.seo.used')})`;
  }

  seoTitle += " | MobiStore";
  return seoTitle;
};

// Функция для генерации SEO описания
const generateSeoDescription = () => {
  const query = route.query;
  const currentFilters = filters.value;

  let desc = t("search.seo.buy") + " ";

  if (query.state === "new") {
    desc += t("search.seo.new") + " ";
  } else if (query.state === "used") {
    desc += t("search.seo.used") + " ";
  }

  desc += t("search.seo.phones");

  if (currentFilters?.brand?.name) {
    desc += ` ${currentFilters.brand.name}`;
  }

  if (currentFilters?.model?.name) {
    desc += ` ${currentFilters.model.name}`;
  }

  if (currentFilters?.region) {
    desc += ` ${t('search.seo.in')} ${currentFilters.region[`name_${locale.value}`] || currentFilters.region.name_ru}`;
  } else if (currentFilters?.city) {
    desc += ` ${t('search.seo.in')} ${currentFilters.city[`name_${locale.value}`] || currentFilters.city.name_ru}`;
  }

  if (query.minPrice || query.maxPrice) {
    const min = query.minPrice
      ? Number(query.minPrice).toLocaleString("ru-RU")
      : "";
    const max = query.maxPrice
      ? Number(query.maxPrice).toLocaleString("ru-RU")
      : "";
    if (min && max) {
      desc += ` ${t('search.filters.price.from')} ${min} ${t('search.filters.price.to')} ${max} ${t('search.filters.price.currency')}`;
    } else if (min) {
      desc += ` ${t('search.filters.price.from')} ${min} ${t('search.filters.price.currency')}`;
    } else if (max) {
      desc += ` ${t('search.filters.price.to')} ${max} ${t('search.filters.price.currency')}`;
    }
  }

  desc += ". " + t("search.seo.defaultDesc");
  return desc;
};

// Обновляем SEO при изменении данных
const updateSeo = () => {
  const currentFilters = filters.value;
  const query = route.query;

  title.value = generateSeoTitle();
  description.value = generateSeoDescription();

  // Обновляем keywords на основе серверных данных
  const kw = [t("search.seo.phones") + " Uzbekistan", t("search.seo.buy"), "MobiStore"];

  if (currentFilters?.brand?.name) {
    kw.push(
      `${currentFilters.brand.name} ${t('search.seo.phones')}`,
      `${currentFilters.brand.name} phone`
    );
  }

  if (currentFilters?.model?.name) {
    kw.push(
      `${currentFilters.model.name}`,
      `${t('search.seo.buy')} ${currentFilters.model.name}`
    );
  }

  if (query.state === "new") {
    kw.push(`${t('search.seo.new')} ${t('search.seo.phones')}`);
  } else if (query.state === "used") {
    kw.push(`${t('search.seo.used')} ${t('search.seo.phones')}`);
  }

  if (currentFilters?.region) {
     const regionName = currentFilters.region[`name_${locale.value}`] || currentFilters.region.name_ru;
    kw.push(
      `${t('search.seo.phones')} ${regionName}`
    );
  }

  if (currentFilters?.city) {
    const cityName = currentFilters.city[`name_${locale.value}`] || currentFilters.city.name_ru;
    kw.push(
      `${t('search.seo.phones')} ${cityName}`
    );
  }

  keywords.value = kw.join(", ");
};

// Используем useAsyncData для SSR загрузки данных
// Ключ зависит от query параметров для правильной работы кэширования
const queryKey = computed(() => `ads-${JSON.stringify(route.query)}`);

const {
  data: adsData,
  pending: loading,
  error: _error,
} = await useAsyncData(
  queryKey,
  () => {
    const { priceRange, page, ...rest } = route.query;
    const currentPage = page ? Number(page) : 1;

    return $api<IBaseResponse<IAdsResponse>>(`/ads`, {
      params: {
        ...rest,
        page: currentPage,
        limit: pageParams.limit,
        minPrice: priceRange?.[0],
        maxPrice: priceRange?.[1],
      },
    });
  },
  {
    watch: [queryKey],
  }
);

// Реактивные данные из asyncData
const ads = computed(() => adsData.value?.data?.ads ?? []);
const filters = computed(() => adsData.value?.data?.filters);
const pagination = computed(() => adsData.value?.data?.pagination);

// Текущая страница из route.query
const currentPage = computed(() => {
  return route.query.page ? Number(route.query.page) : 1;
});

// Обработчик смены страницы
const handlePageChange = (page: number) => {
  const router = useRouter();
  router.push({
    query: {
      ...route.query,
      page: page.toString(),
    },
  });

  // Прокрутка наверх при смене страницы
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// Сброс страницы на первую при изменении других query параметров (фильтров)
watch(
  () => {
    const { page, ...otherParams } = route.query;
    return JSON.stringify(otherParams);
  },
  () => {
    if (route.query.page && route.query.page !== "1") {
      const router = useRouter();
      router.push({
        query: {
          ...route.query,
          page: undefined,
        },
      });
    }
  }
);

// Инициализируем SEO с дефолтными значениями
title.value = t("search.seo.defaultTitle");
description.value = t("search.seo.defaultDesc");
keywords.value = "smartphones Uzbekistan, buy phone, MobiStore";

// Обновляем SEO когда данные загрузятся с сервера
watch(
  [filters, () => locale.value],
  () => {
    if (filters.value) {
      updateSeo();
    }
  },
  { immediate: true }
);

// Используем useSeoMeta для динамического SEO
useSeoMeta({
  title: () => title.value,
  description: () => description.value,
  keywords: () => keywords.value,
  ogTitle: () => title.value,
  ogDescription: () => description.value,
  ogImage: "/result.png",
  ogImageHeight: 630,
  ogImageWidth: 1200,
  ogType: "website",
  ogUrl: () => `https://mobistore.uz${route.fullPath}`,
  twitterCard: "summary_large_image",
  twitterTitle: () => title.value,
  twitterDescription: () => description.value,
});

// Структурированные данные (JSON-LD)
const jsonLd = computed(() => ({
  "@context": "https://schema.org",
  "@type": "SearchResultsPage",
  name: title.value,
  description: description.value,
  url: `https://mobistore.uz${route.fullPath}`,
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: ads.value.length,
    itemListElement: ads.value.map((ad, index) => ({
      "@type": "Product",
      position: index + 1,
      name: ad.title,
      description: ad.description,
      offers: {
        "@type": "Offer",
        price: ad.price,
        priceCurrency: "UZS",
        availability:
          ad.status === "active"
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      },
      image: ad.images?.[0]?.url,
      brand: ad.brand?.name,
    })),
  },
}));

// Включаем SSR для этой страницы
definePageMeta({
  ssr: true,
});
</script>

<template>
  <main class="results-page">
    <!-- Структурированные данные для SEO -->
    <JsonLd :json="jsonLd" />

    <!-- Хлебные крошки с микроразметкой -->
    <div
      class="breadcrumbs"
      itemscope
      itemtype="https://schema.org/BreadcrumbList"
    >
      <div class="container">
        <el-breadcrumb>
          <el-breadcrumb-item
            :to="localePath('/')"
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem"
          >
            <span itemprop="name">{{ t('search.breadcrumbs.home') }}</span>
            <meta itemprop="position" content="1" />
          </el-breadcrumb-item>
          <el-breadcrumb-item
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem"
          >
            <span itemprop="name">{{ t('search.breadcrumbs.results') }}</span>
            <meta itemprop="position" content="2" />
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <div class="filter-form">
      <div class="container">
        <div class="filter-form__inner">
          <aside
            class="filters-section"
            role="complementary"
            :aria-label="t('search.filters.title')"
          >
            <ClientOnly>
              <FilterForm :defaults="filters" />
              <template #fallback>
                <FilterFormSkeleton />
              </template>
            </ClientOnly>
          </aside>

          <section
            class="results-section"
            role="main"
            :aria-label="t('search.breadcrumbs.results')"
          >
            <!-- Скелетоны при загрузке -->
            <div v-if="loading" class="results-grid">
              <template v-for="i in 6" :key="`skeleton-${i}`">
                <AdRowCardSkeleton class="desktop-only" />
                <AdCardSkeleton class="mobile-only" />
              </template>
            </div>

            <!-- Результаты поиска -->
            <div v-else-if="ads.length > 0">
              <div class="results-grid">
                <template v-for="ad in ads" :key="ad.id">
                  <AdRowCard
                    :listing="ad"
                    :itemscope="true"
                    itemtype="https://schema.org/Product"
                    class="desktop-only"
                  />
                  <AdCard :listing="ad" class="mobile-only" />
                </template>
              </div>

              <!-- Пагинация -->
              <div
                v-if="pagination && pagination.pages > 1"
                class="pagination-container"
              >
                <el-pagination
                  :current-page="currentPage"
                  :page-size="pagination.limit"
                  :total="pagination.total"
                  :page-count="pagination.pages"
                  layout="prev, pager, next"
                  background
                  @current-change="handlePageChange"
                />
              </div>
            </div>

            <!-- Нет результатов -->
            <div v-else class="no-results-container">
              <div class="no-results-content">
                <div class="no-results-icon">
                  <el-icon size="60"><Search /></el-icon>
                </div>
                <h2 class="no-results-title">{{ t('search.noResults.title') }}</h2>
                <p class="no-results-text">
                  {{ t('search.noResults.text') }}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Мобильная кнопка фильтров -->
    <div class="mobile-filter-btn" @click="showMobileFilters = true">
      <el-icon><Filter /></el-icon>
      <span>{{ t('search.filters.title') }}</span>
    </div>

    <!-- Мобильное меню фильтров -->
    <client-only>
      <el-drawer
        v-model="showMobileFilters"
        :title="t('search.filters.title')"
        direction="rtl"
        size="320px"
        class="filter-drawer"
      >
        <FilterForm :defaults="filters" @change="showMobileFilters = false" />
      </el-drawer>
    </client-only>
  </main>
</template>

<style lang="scss" scoped>
.results-page {
  min-height: 60vh;

  .breadcrumbs {
    padding: 20px 0;
    background: var(--color-bg-primary);
    border-bottom: 1px solid var(--color-border-light);
  }

  .filter-form {
    padding: 20px 0 60px;
    background: var(--color-bg-secondary);
    min-height: calc(100vh - 200px);
  }

  .filter-form__inner {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 20px;
    align-items: start;
  }

  .filters-section {
    position: sticky;
    top: 80px;
  }

  .results-section {
    min-height: 400px;
  }

  .results-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 40px;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;

    p {
      margin-top: 16px;
      color: var(--color-text-secondary);
      font-size: 16px;
    }
  }

  .no-results-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 500px;
    padding: 40px 20px;
  }

  .no-results-content {
    text-align: center;
    max-width: 420px;
  }

  .no-results-icon {
    width: 120px;
    height: 120px;
    margin: 0 auto 32px;
    padding: 24px;
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.1) 0%,
      rgba(139, 92, 246, 0.1) 100%
    );
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary);

    svg {
      width: 100%;
      height: 100%;
      opacity: 0.8;
    }
  }

  .no-results-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 12px;
    letter-spacing: -0.5px;
  }

  .no-results-text {
    font-size: 15px;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: 32px;
  }

  .no-results-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
  }

  .mobile-filter-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 100;
    display: none;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    color: white;
    padding: 12px 24px;
    border-radius: 50px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    cursor: pointer;
    transition: transform 0.2s;

    &:active {
      transform: scale(0.95);
    }
  }
}

// Адаптивность
@media (max-width: 1024px) {
  .results-page {
    .filter-form__inner {
      grid-template-columns: 260px 1fr;
      gap: 24px;
    }
  }
}

@media (max-width: 900px) {
  .results-page {
    .mobile-filter-btn {
      display: flex;
    }

    .filter-form {
      padding: 16px 0 60px;
    }

    .filter-form__inner {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .filters-section {
      display: none; /* Hide sidebar filters on tablet/mobile */
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .pagination-container {
      padding: 16px 0;
      margin-bottom: 60px; /* Space for FAB */

      :deep(.el-pagination) {
        justify-content: center;
        flex-wrap: wrap;
      }
    }
  }
}

@media (max-width: 480px) {
  .results-page {
    /* results-grid уже имеет нужные стили (column layout) */

    .pagination-container {
      :deep(.el-pagination) {
        .el-pagination__jump {
          display: none;
        }

        .el-pagination__total {
          margin-left: 0;
        }
      }
    }
  }
}

/* Visibility Helpers */
.mobile-only {
  display: none;
}

@media (max-width: 900px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: block; // Or flex/grid depending on context
  }

  .results-page {
    .results-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      // Override for desktop components if they leak through styles
      .desktop-only {
        display: none;
      }

      // Ensure AdCard fills the grid cell
      .mobile-only {
        display: flex; /* AdCard is flex container usually */
        width: 100%;
        min-width: 0; /* Prevent grid blowout */
      }
    }
  }
}

@media (max-width: 375px) {
  .results-page {
    .results-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
```
