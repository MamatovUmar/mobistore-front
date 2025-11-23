<script setup lang="ts">
import FilterForm from "@/components/results/FilterForm.vue";
import AdCard from "@/components/AdCard.vue";
import JsonLd from "@/components/JsonLd.vue";
import AdCardSkeleton from "@/components/skeletons/AdCardSkeleton.vue";
import FilterFormSkeleton from "@/components/skeletons/FilterFormSkeleton.vue";
import type { IBaseResponse } from "~/types";
import type { IAdsResponse } from "~/types/ads";
import { Search } from "@element-plus/icons-vue";

const route = useRoute();
const { $api } = useNuxtApp();

// SEO Meta (будут генерироваться на основе серверных данных)
const title = ref('');
const description = ref('');
const keywords = ref('');
const pageParams = reactive({
  page: 1,
  limit: 12
});

// Функция для генерации SEO заголовка на основе серверных данных
const generateSeoTitle = () => {
  const query = route.query;
  const currentFilters = filters.value;
  
  let seoTitle = 'Поиск смартфонов';
  
  if (currentFilters?.brand?.name) {
    seoTitle += ` ${currentFilters.brand.name}`;
  }
  
  if (currentFilters?.region?.name_ru) {
    seoTitle += ` в ${currentFilters.region.name_ru}`;
  } else if (currentFilters?.city?.name_ru) {
    seoTitle += ` в ${currentFilters.city.name_ru}`;
  }
  
  if (query.state === 'new') {
    seoTitle += ' (новые)';
  } else if (query.state === 'used') {
    seoTitle += ' (б/у)';
  }
  
  seoTitle += ' | Smart Market';
  return seoTitle;
};

// Функция для генерации SEO описания
const generateSeoDescription = () => {
  const query = route.query;
  const currentFilters = filters.value;
  
  let desc = 'Найдите ';
  
  if (query.state === 'new') {
    desc += 'новые ';
  } else if (query.state === 'used') {
    desc += 'б/у ';
  }
  
  desc += 'смартфоны';
  
  if (currentFilters?.brand?.name) {
    desc += ` ${currentFilters.brand.name}`;
  }
  
  if (currentFilters?.model?.name) {
    desc += ` ${currentFilters.model.name}`;
  }
  
  if (currentFilters?.region?.name_ru) {
    desc += ` в ${currentFilters.region.name_ru}`;
  } else if (currentFilters?.city?.name_ru) {
    desc += ` в ${currentFilters.city.name_ru}`;
  }
  
  if (query.minPrice || query.maxPrice) {
    const min = query.minPrice ? Number(query.minPrice).toLocaleString('ru-RU') : '';
    const max = query.maxPrice ? Number(query.maxPrice).toLocaleString('ru-RU') : '';
    if (min && max) {
      desc += ` по цене от ${min} до ${max} сум`;
    } else if (min) {
      desc += ` от ${min} сум`;
    } else if (max) {
      desc += ` до ${max} сум`;
    }
  }
  
  desc += '. Большой выбор с гарантией и доставкой по всему Узбекистану.';
  return desc;
};

// Обновляем SEO при изменении данных
const updateSeo = () => {
  const currentFilters = filters.value;
  const query = route.query;
  
  title.value = generateSeoTitle();
  description.value = generateSeoDescription();
  
  // Обновляем keywords на основе серверных данных
  const kw = ['смартфоны Узбекистан', 'купить телефон', 'Smart Market'];
  
  if (currentFilters?.brand?.name) {
    kw.push(`${currentFilters.brand.name} смартфоны`, `${currentFilters.brand.name} телефон`);
  }
  
  if (currentFilters?.model?.name) {
    kw.push(`${currentFilters.model.name}`, `купить ${currentFilters.model.name}`);
  }
  
  if (query.state === 'new') {
    kw.push('новые смартфоны', 'новые телефоны');
  } else if (query.state === 'used') {
    kw.push('б/у смартфоны', 'вторичные телефоны');
  }
  
  if (currentFilters?.region?.name_ru) {
    kw.push(`смартфоны ${currentFilters.region.name_ru}`, `телефоны ${currentFilters.region.name_ru}`);
  }
  
  if (currentFilters?.city?.name_ru) {
    kw.push(`смартфоны ${currentFilters.city.name_ru}`, `телефоны ${currentFilters.city.name_ru}`);
  }
  
  keywords.value = kw.join(', ');
};

// Используем useAsyncData для SSR загрузки данных
// Ключ зависит от query параметров для правильной работы кэширования
const queryKey = computed(() => `ads-${JSON.stringify(route.query)}`);

const { data: adsData, pending: loading, error: _error } = await useAsyncData(
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
    watch: [queryKey]
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
      page: page.toString()
    }
  });
  
  // Прокрутка наверх при смене страницы
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Сброс страницы на первую при изменении других query параметров (фильтров)
watch(() => {
  const { page, ...otherParams } = route.query;
  return JSON.stringify(otherParams);
}, () => {
  if (route.query.page && route.query.page !== '1') {
    const router = useRouter();
    router.push({
      query: {
        ...route.query,
        page: undefined
      }
    });
  }
});

// Инициализируем SEO с дефолтными значениями
title.value = 'Поиск смартфонов в Узбекистане | Smart Market';
description.value = 'Найдите лучшие смартфоны по выгодным ценам в Узбекистане. Большой выбор новых и б/у устройств.';
keywords.value = 'смартфоны Узбекистан, купить телефон, Smart Market';

// Обновляем SEO когда данные загрузятся с сервера
watch(filters, () => {
  if (filters.value) {
    updateSeo();
  }
}, { immediate: true });

// Используем useSeoMeta для динамического SEO
useSeoMeta({
  title: () => title.value,
  description: () => description.value,
  keywords: () => keywords.value,
  ogTitle: () => title.value,
  ogDescription: () => description.value,
  ogType: 'website',
  ogUrl: () => `https://smartmarket.uz${route.fullPath}`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => title.value,
  twitterDescription: () => description.value,
});

// Структурированные данные (JSON-LD)
const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'SearchResultsPage',
  name: title.value,
  description: description.value,
  url: `https://smartmarket.uz${route.fullPath}`,
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: ads.value.length,
    itemListElement: ads.value.map((ad, index) => ({
      '@type': 'Product',
      position: index + 1,
      name: ad.title,
      description: ad.description,
      offers: {
        '@type': 'Offer',
        price: ad.price,
        priceCurrency: 'UZS',
        availability: ad.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
      },
      image: ad.images?.[0]?.url,
      brand: ad.brand?.name
    }))
  }
}));

// Включаем SSR для этой страницы
definePageMeta({
  ssr: true
});

</script>

<template>
  <main class="results-page">
    <!-- Структурированные данные для SEO -->
    <JsonLd :json="jsonLd" />
    
    <!-- Хлебные крошки с микроразметкой -->
    <div class="breadcrumbs" itemscope itemtype="https://schema.org/BreadcrumbList">
      <div class="container">
        <el-breadcrumb>
          <el-breadcrumb-item to="/" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <span itemprop="name">Главная</span>
            <meta itemprop="position" content="1">
          </el-breadcrumb-item>
          <el-breadcrumb-item itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <span itemprop="name">Результаты поиска</span>
            <meta itemprop="position" content="2">
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <div class="filter-form">
      <div class="container">
        <div class="filter-form__inner">
          <aside class="filters-section" role="complementary" aria-label="Фильтры поиска">
            <ClientOnly>
              <FilterForm :defaults="filters" />
              <template #fallback>
                <FilterFormSkeleton />
              </template>
            </ClientOnly>
          </aside>

          <section class="results-section" role="main" aria-label="Результаты поиска">
            <!-- Скелетоны при загрузке -->
            <div v-if="loading" class="results-grid">
              <AdCardSkeleton v-for="i in 12" :key="`skeleton-${i}`" />
            </div>
            
            <!-- Результаты поиска -->
            <div v-else-if="ads.length > 0">
              <div class="results-grid">
                <AdCard 
                  v-for="ad in ads" 
                  :key="ad.id" 
                  :listing="ad"
                  :itemscope="true"
                  itemtype="https://schema.org/Product"
                />
              </div>
              
              <!-- Пагинация -->
              <div v-if="pagination && pagination.pages > 1" class="pagination-container">
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
                <h2 class="no-results-title">Ничего не найдено</h2>
                <p class="no-results-text">Попробуйте изменить параметры поиска или сбросить фильтры</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
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
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
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

@media (max-width: 768px) {
  .results-page {
    .filter-form {
      padding: 24px 0 40px;
    }

    .filter-form__inner {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    .filters-section {
      position: static;
    }
    
    .results-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }
    
    .pagination-container {
      padding: 16px 0;
      
      :deep(.el-pagination) {
        justify-content: center;
        flex-wrap: wrap;
      }
    }
  }
}

@media (max-width: 480px) {
  .results-page {
    .results-grid {
      grid-template-columns: 1fr;
    }
    
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
</style>
