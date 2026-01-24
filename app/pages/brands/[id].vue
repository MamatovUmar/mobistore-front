<script setup lang="ts">
import type { IModelListResponse } from "~/types/model";
import type { IBaseResponse } from "~/types";

const { $api } = useNuxtApp();
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const config = useRuntimeConfig();

const brandAlias = computed(() => route.params.id as string);
const currentPage = ref(1);
const pageSize = ref(20);
const baseUrl = config.public.apiUrl;

// Загружаем данные о бренде
const { data: brandData } = await useAsyncData(
  `brand-${brandAlias.value}`,
  async () => {
    try {
      const res = await $api<IBaseResponse<any>>(`/brands/alias/${brandAlias.value}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching brand:", error);
      return null;
    }
  }
);

const brand = computed(() => brandData.value);
const brandName = computed(() => brand.value?.name || brandAlias.value);

const { data, error } = await useAsyncData(
  `brand-models-${brandAlias.value}`,
  async () => {
    try {
      const res = await $api<IBaseResponse<IModelListResponse>>(
        `/models/brand/alias/${brandAlias.value}`,
        {
          params: {
            page: currentPage.value,
            limit: pageSize.value,
          },
        }
      );
      return res.data || { models: [], pagination: { total: 0, page: 1, limit: 20, pages: 0 } };
    } catch (error) {
      console.error("Error fetching brand models:", error);
      return { models: [], pagination: { total: 0, page: 1, limit: 20, pages: 0 } };
    }
  },
  {
    watch: [currentPage],
  }
);

const models = computed(() => data.value?.models || []);
const pagination = computed(() => data.value?.pagination);

const handlePageChange = (page: number) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

useSeoMeta({
  title: () => `${brandName.value} - ${t('brandModels.seo.title')}`,
  description: () => t('brandModels.seo.description', { brand: brandName.value }),
  ogTitle: () => `${brandName.value} - ${t('brandModels.seo.ogTitle')}`,
  ogDescription: () => t('brandModels.seo.ogDescription', { brand: brandName.value }),
});
</script>

<template>
  <div class="brand-models">
    <div class="brand-models__container">
      <div class="brand-models__header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="localePath('/')">
            {{ t('brandModels.breadcrumbs.home') }}
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="localePath('/brands')">
            {{ t('brandModels.breadcrumbs.brands') }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ brandName }}</el-breadcrumb-item>
        </el-breadcrumb>

        <h1 class="brand-models__title">{{ brandName }}</h1>
        <p v-if="pagination" class="brand-models__subtitle">
          {{ pagination.total }} {{ t('brandModels.modelsCount') }}
        </p>
      </div>

      <div v-if="error" class="brand-models__error">
        <el-alert
          type="error"
          :title="t('brandModels.error')"
          show-icon
        />
      </div>

      <div v-else-if="models.length === 0" class="brand-models__empty">
        <el-empty :description="t('brandModels.noModels')" />
      </div>

      <div v-else class="brand-models__grid">
        <NuxtLink
          v-for="model in models"
          :key="model.id"
          :to="localePath(`/search?brandId=${brand?.id}&modelId=${model.id}`)"
          class="model-card"
        >
          <div class="model-card__image">
            <img
              :src="`${baseUrl}${model.image}`"
              :alt="model.name"
              @error="(e) => (e.target as HTMLImageElement).src = '/no-image.png'"
            >
          </div>
          <div class="model-card__content">
            <h3 class="model-card__name">{{ model.name }}</h3>
          </div>
        </NuxtLink>
      </div>

      <div v-if="pagination && pagination.pages > 1" class="brand-models__pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="pagination.total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.brand-models {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
  padding: 40px 0;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__header {
    margin-bottom: 40px;
  }

  &__title {
    font-size: 48px;
    font-weight: 800;
    color: #0f172a;
    margin: 24px 0 12px;
    letter-spacing: -0.02em;
  }

  &__subtitle {
    font-size: 18px;
    color: #64748b;
  }

  &__error {
    max-width: 600px;
    margin: 40px auto;
  }

  &__empty {
    padding: 80px 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
  }

  &__pagination {
    display: flex;
    justify-content: center;
    padding: 40px 0;
  }
}

.model-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    border-color: #3b82f6;
  }

  &__image {
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    padding: 20px;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  &__content {
    padding: 16px;
    text-align: center;
  }

  &__name {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
    line-height: 1.4;
  }
}

@media (max-width: 768px) {
  .brand-models {
    padding: 24px 0;

    &__title {
      font-size: 32px;
    }

    &__subtitle {
      font-size: 16px;
    }

    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 16px;
    }
  }

  .model-card {
    &__image {
      padding: 12px;
    }

    &__content {
      padding: 12px;
    }

    &__name {
      font-size: 14px;
    }
  }
}
</style>