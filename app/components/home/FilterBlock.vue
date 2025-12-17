<script setup lang="ts">
import { reactive } from "vue";
import RegionAutocomplete from "@/components/autocompletes/RegionAutocomplete.vue";
import CityAutocomplete from "@/components/autocompletes/CityAutocomplete.vue";
import BrandAutocomplete from "@/components/autocompletes/BrandAutocomplete.vue";
import ModelAutocomplete from "@/components/autocompletes/ModelAutocomplete.vue";
import HomeFilterSkeleton from "@/components/skeletons/HomeFilterSkeleton.vue";

const router = useRouter();
const { t } = useI18n();
const localePath = useLocalePath();

const form = reactive<IFilterForm>({
  regionId: undefined,
  cityId: undefined,
  brandId: undefined,
  modelId: undefined,
  state: undefined,
});

function handleSubmit() {
  console.log(form);
  router.push({
    path: localePath("/search"),
    query: form,
  });
}

interface IFilterForm {
  regionId: number | undefined;
  cityId: number | undefined;
  brandId: number | undefined;
  modelId: number | undefined;
  state: number | undefined;
}
</script>

<template>
  <div class="container">
    <div class="filters">
      <ClientOnly>
        <el-form :model="form" label-position="top" size="large">
          <div class="filters-grid">
            <el-form-item :label="t('home.filter.region')" class="filter-item">
              <RegionAutocomplete
                v-model="form.regionId"
                :placeholder="t('home.filter.regionPlaceholder')"
              />
            </el-form-item>

            <el-form-item :label="t('home.filter.city')" class="filter-item">
              <CityAutocomplete
                v-model="form.cityId"
                :region-id="form.regionId"
                :placeholder="t('home.filter.cityPlaceholder')"
              />
            </el-form-item>

            <el-form-item :label="t('home.filter.brand')" class="filter-item">
              <BrandAutocomplete
                v-model="form.brandId"
                :placeholder="t('home.filter.brandPlaceholder')"
              />
            </el-form-item>

            <el-form-item :label="t('home.filter.model')" class="filter-item">
              <ModelAutocomplete
                v-model="form.modelId"
                :brand-id="form.brandId"
                :placeholder="t('home.filter.modelPlaceholder')"
              />
            </el-form-item>

            <el-form-item label=" " class="filter-item filter-item--button">
              <el-button
                type="primary"
                size="large"
                class="search-button"
                @click="handleSubmit"
              >
                {{ t('home.filter.showResults') }}
              </el-button>
            </el-form-item>
          </div>
        </el-form>
        <template #fallback>
          <HomeFilterSkeleton />
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

.filters {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 32px;
  border-radius: 24px;
  margin: -60px auto 0;
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  align-items: flex-end;
}

.filter-item {
  width: 100%;
  margin-bottom: 0;

  :deep(.el-form-item__label) {
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  :deep(.el-select) {
    width: 100%;
  }

  /* Input Styling */
  :deep(.el-input__wrapper) {
    border-radius: 12px;
    box-shadow: none !important;
    background-color: #f1f5f9;
    padding: 8px 16px;
    height: 48px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    border: 1px solid transparent;

    &:hover {
      background-color: #e2e8f0;
    }

    &.is-focus {
      background-color: #ffffff;
      box-shadow: 0 0 0 2px #3b82f6 !important; /* Ring effect */
      border-color: #3b82f6;
    }
  }

  :deep(.el-input__inner) {
    font-weight: 600;
    color: #0f172a;

    &::placeholder {
      color: #94a3b8;
      font-weight: 500;
    }
  }
}

.filter-item--button {
  :deep(.el-form-item__label) {
    opacity: 0;
    pointer-events: none;
    margin-bottom: 8px; /* Match other labels height */
  }
}

.search-button {
  width: 100%;
  height: 40px;
  font-weight: 700;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Responsive */
@media (max-width: 1024px) {
  .filters-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .filter-item--button {
    grid-column: span 3;
  }

  .filters {
    margin-top: 20px; /* Reset negative margin on smaller screens */
  }
}

@media (max-width: 768px) {
  .filters {
    padding: 24px 20px;
    border-radius: 20px;
  }

  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .filter-item--button {
    grid-column: span 2;
  }
}

@media (max-width: 480px) {
  .filters {
    padding: 20px 16px;
    border-radius: 16px;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .filter-item--button {
    grid-column: 1;
  }
}
</style>
