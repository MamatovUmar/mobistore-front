<script setup lang="ts">
import type { IBrand } from "~/types/brand";
import type { IBaseResponse } from "~/types";
import { Cellphone, Search, ArrowRight } from "@element-plus/icons-vue";

const { $api } = useNuxtApp();
const { t } = useI18n();
const localePath = useLocalePath();

const brands = ref<IBrand[]>([]);
const loading = ref(false);
const searchQuery = ref("");

const { data, error } = await useAsyncData(
  "brands",
  async () => {
    try {
      const res = await $api<IBaseResponse<IBrand[]>>("/brands");
      return res.data || [];
    } catch (error) {
      console.error("Error fetching brands:", error);
      return [];
    }
  },
  {
    default: () => [],
  }
);

brands.value = data.value || [];

const filteredBrands = computed(() => {
  if (!searchQuery.value) {
    return brands.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return brands.value.filter(brand => 
    brand.name.toLowerCase().includes(query)
  );
});

const navigateToBrand = (alias: string) => {
  navigateTo(localePath(`/brands/${alias}`));
};

useSeoMeta({
  title: () => t('brands.seo.title'),
  description: () => t('brands.seo.description'),
  ogTitle: () => t('brands.seo.ogTitle'),
  ogDescription: () => t('brands.seo.ogDescription'),
});
</script>

<template>
  <div class="brands-page">
    <div class="brands-page__container">
      <div class="brands-page__header">
        <h1 class="brands-page__title">{{ t('brands.title') }}</h1>
        <p class="brands-page__subtitle">
          {{ t('brands.subtitle') }}
        </p>
      </div>

      <div class="brands-page__search">
        <el-input
          v-model="searchQuery"
          :placeholder="t('brands.search')"
          size="large"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <div v-if="loading" class="brands-page__loading">
        <el-skeleton :rows="3" animated />
      </div>

      <div v-else-if="error" class="brands-page__error">
        <el-alert
          type="error"
          :title="t('brands.error')"
          show-icon
        />
      </div>

      <div v-else class="brands-page__grid">
        <div
          v-for="brand in filteredBrands"
          :key="brand.id"
          class="brand-card"
          @click="navigateToBrand(brand.alias)"
        >
          <div class="brand-card__inner">
            <div class="brand-card__content">
              <h3 class="brand-card__name">{{ brand.name }}</h3>
              <div class="brand-card__stats">
                <span v-if="brand.devices_count" class="brand-card__count">
                  <el-icon><Cellphone /></el-icon>
                  {{ brand.devices_count }} {{ t('brands.models') }}
                </span>
              </div>
            </div>
            <div class="brand-card__arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <div v-if="filteredBrands.length === 0" class="brands-page__empty">
          <el-empty :description="t('brands.noResults')" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.brands-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
  padding: 40px 0;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__header {
    text-align: center;
    margin-bottom: 48px;
  }

  &__title {
    font-size: 48px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 16px;
    letter-spacing: -0.02em;
  }

  &__subtitle {
    font-size: 18px;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto;
  }

  &__search {
    max-width: 600px;
    margin: 0 auto 40px;
  }

  &__loading {
    padding: 40px 0;
  }

  &__error {
    max-width: 600px;
    margin: 40px auto;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-top: 32px;
  }

  &__empty {
    grid-column: 1 / -1;
    padding: 60px 0;
  }
}

.brand-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #3b82f6;

    .brand-card__arrow {
      transform: translateX(4px);
      color: #3b82f6;
    }

    .brand-card__inner::before {
      opacity: 1;
    }
  }

  &__inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: -24px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 60%;
      background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
      border-radius: 0 4px 4px 0;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  }

  &__content {
    flex: 1;
  }

  &__name {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 12px;
    margin-top: 0;
  }

  &__stats {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__count {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #64748b;

    .el-icon {
      font-size: 16px;
    }
  }

  &__badge {
    margin-top: 12px;
  }

  &__arrow {
    font-size: 24px;
    color: #cbd5e1;
    transition: all 0.3s ease;
  }
}

@media (max-width: 768px) {
  .brands-page {
    padding: 24px 0;

    &__title {
      font-size: 32px;
    }

    &__subtitle {
      font-size: 16px;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .brand-card {
    padding: 20px;

    &__name {
      font-size: 20px;
    }
  }
}
</style>