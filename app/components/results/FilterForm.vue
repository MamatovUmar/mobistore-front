<script setup lang="ts">
import RegionAutocompletes from "@/components/autocompletes/RegionAutocomplete.vue";
import CityAutocompletes from "@/components/autocompletes/CityAutocomplete.vue";
import BrandAutocomplete from "@/components/autocompletes/BrandAutocomplete.vue";
import ModelAutocomplete from "@/components/autocompletes/ModelAutocomplete.vue";
import type { IAdsResponse, IResultFilterForm } from "~/types/ads";

const props = defineProps<{ defaults?: IAdsResponse["filters"] }>();

const route = useRoute();
const router = useRouter();

// Вычисляем min/max цены из props.defaults или query
const minPrice = computed(
  () => props?.defaults?.minPrice || Number(route.query?.minPrice || 0)
);
const maxPrice = computed(
  () => props?.defaults?.maxPrice || Number(route.query?.maxPrice || 50000000)
);

// Инициализируем фильтры сразу с данными из route.query для SSR
const query = route.query as Record<string, any>;
const filters = reactive<IResultFilterForm>({
  page: 1,
  limit: 10,
  regionId: query?.regionId ? Number(query.regionId) : undefined,
  cityId: query?.cityId ? Number(query.cityId) : undefined,
  brandId: query?.brandId ? Number(query.brandId) : undefined,
  modelId: query?.modelId ? Number(query.modelId) : undefined,
  state: query?.state,
  priceRange: [minPrice.value, maxPrice.value],
  ram: query?.ram ? Number(query.ram) : undefined,
  storage: query?.storage ? Number(query.storage) : undefined,
  allowTradeIn: query.allowTradeIn === "true",
  sortBy: query?.sortBy || "updated_at",
  sortOrder: query?.sortOrder || "desc",
});

const formatPrice = (val: number | undefined) => {
  const value = val ?? 0;
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const resetFilters = () => {
  // Сбрасываем все значения фильтров
  filters.regionId = undefined;
  filters.cityId = undefined;
  filters.brandId = undefined;
  filters.modelId = undefined;
  filters.state = undefined;
  filters.priceRange = [minPrice.value, maxPrice.value];
  filters.ram = undefined;
  filters.storage = undefined;
  filters.allowTradeIn = false;
  filters.sortBy = "updated_at";
  filters.sortOrder = "desc";
};

let timer: ReturnType<typeof setTimeout>;

watch(
  filters,
  () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      // Формируем query параметры, исключая пустые значения
      const query: Record<string, string> = {};

      if (filters.regionId) query.regionId = String(filters.regionId);
      if (filters.cityId) query.cityId = String(filters.cityId);
      if (filters.brandId) query.brandId = String(filters.brandId);
      if (filters.modelId) query.modelId = String(filters.modelId);
      if (filters.state) query.state = filters.state;
      if (filters.ram) query.ram = String(filters.ram);
      if (filters.storage) query.storage = String(filters.storage);
      if (filters.allowTradeIn) query.allowTradeIn = "true";
      if (filters.sortBy) query.sortBy = filters.sortBy;
      if (filters.sortOrder) query.sortOrder = filters.sortOrder;
      if (filters.priceRange?.[0])
        query.minPrice = String(filters.priceRange[0]);
      if (filters.priceRange?.[1])
        query.maxPrice = String(filters.priceRange[1]);

      router.replace({
        path: "/search",
        query,
      });
    }, 500);
  },
  { deep: true }
);

watch(
  () => filters.brandId,
  () => {
    filters.modelId = undefined;
  }
);

watch(
  () => filters.regionId,
  () => {
    filters.cityId = undefined;
  }
);

// Обновляем priceRange когда меняются minPrice/maxPrice из props
watch(
  [minPrice, maxPrice],
  ([newMin, newMax]) => {
    if (newMin !== filters.priceRange[0] || newMax !== filters.priceRange[1]) {
      filters.priceRange = [newMin, newMax];
    }
  },
  { immediate: true }
);
</script>

<template>
  <aside class="filter-sidebar">
    <div class="filter-header">
      <h3>Фильтры</h3>
    </div>

    <el-form :model="filters" label-position="top" size="large">
      <el-form-item label="Область">
        <RegionAutocompletes
          v-model="filters.regionId"
          :init-data="defaults?.region"
        />
      </el-form-item>

      <el-form-item label="Город">
        <CityAutocompletes
          v-model="filters.cityId"
          :region-id="filters.regionId"
          :init-data="defaults?.city"
        />
      </el-form-item>

      <el-form-item label="Бренд">
        <BrandAutocomplete
          v-model="filters.brandId"
          :init-data="defaults?.brand"
        />
      </el-form-item>

      <el-form-item label="Модель">
        <ModelAutocomplete
          v-model="filters.modelId"
          :brand-id="filters.brandId"
          :init-data="defaults?.model"
        />
      </el-form-item>

      <el-form-item label="Состояние">
        <el-select v-model="filters.state" placeholder="Все" clearable>
          <el-option label="Новый" value="new" />
          <el-option label="Б/У" value="used" />
          <el-option label="Восстановленный" value="restored" />
        </el-select>
      </el-form-item>

      <el-form-item label="Оперативная память (RAM)">
        <el-select v-model="filters.ram" placeholder="Любой объем" clearable>
          <el-option
            v-for="ram in 36"
            :key="ram"
            :label="ram + 'GB'"
            :value="ram"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Встроенная память">
        <el-select
          v-model="filters.storage"
          placeholder="Любой объем"
          clearable
        >
          <el-option
            v-for="storage in [4, 8, 16, 32, 64, 128, 256, 512, 1024]"
            :key="storage"
            :label="storage + 'GB'"
            :value="storage"
          />
        </el-select>
      </el-form-item>

      <el-checkbox v-model="filters.allowTradeIn" size="large">
        Возможен бартер
      </el-checkbox>

      <div class="price-slider mt-20">
        <div class="price-range-compact">
          <div class="price-field">
            <span class="label">от</span>
            <div class="value-wrapper">
              <span class="amount">{{
                formatPrice(filters.priceRange[0])
              }}</span>
              <span class="currency">сум</span>
            </div>
          </div>
          <div class="divider" />
          <div class="price-field">
            <span class="label">до</span>
            <div class="value-wrapper">
              <span class="amount">{{
                formatPrice(filters.priceRange[1])
              }}</span>
              <span class="currency">сум</span>
            </div>
          </div>
        </div>

        <el-slider
          v-model="filters.priceRange"
          :min="minPrice"
          :max="maxPrice"
          :step="100000"
          range
          :show-tooltip="false"
        />
      </div>

      <el-button
        size="large"
        @click="resetFilters"
        class="mt-20 w-full mobile-clear"
      >
        Очистить фильтры
      </el-button>
    </el-form>
  </aside>
</template>

<style lang="scss" scoped>
.filter-sidebar {
  background: var(--color-bg-primary);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid var(--color-border-light);
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;

  /* Кастомный скроллбар */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-bg-secondary);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border-medium);
    border-radius: 3px;

    &:hover {
      background: var(--color-border-dark);
    }
  }
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--color-border-light);

  h3 {
    font-size: 17px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0;
  }
}

.filter-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border-light);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
}

.filter-section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
}

:deep(.el-form-item) {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

:deep(.el-form-item__label) {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
  line-height: 1.4;
  padding: 0;
}

:deep(.el-select),
:deep(.el-input) {
  width: 100%;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.12);
  }
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.price-slider {
  padding: 4px 0;
}

.price-range-compact {
  display: flex;
  align-items: center;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-border-medium);
  }
}

.price-field {
  flex: 1;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0; /* Prevent overflow */

  .label {
    font-size: 11px;
    color: var(--color-text-secondary);
    margin-bottom: 2px;
    line-height: 1;
  }

  .value-wrapper {
    display: flex;
    align-items: baseline;
    gap: 4px;
    white-space: nowrap;
    overflow: hidden;
  }

  .amount {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .currency {
    font-size: 11px;
    color: var(--color-text-secondary);
    font-weight: 500;
  }
}

.divider {
  width: 1px;
  height: 24px;
  background-color: var(--color-border-light);
}

:deep(.el-slider) {
  margin: 0 4px;
  max-width: 95%;
}

:deep(.el-slider__runway) {
  height: 4px;
  background-color: var(--color-border-light);
  border-radius: 2px;
}

:deep(.el-slider__bar) {
  height: 4px;
  background: var(--color-primary);
  border-radius: 2px;
}

:deep(.el-slider__button) {
  width: 14px;
  height: 14px;
  border: 2px solid var(--color-primary);
  background-color: var(--color-bg-primary);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }
}

:deep(.el-slider__stop) {
  display: none;
}

:deep(.el-checkbox) {
  height: auto;

  .el-checkbox__label {
    font-size: 14px;
    color: var(--color-text-primary);
    font-weight: 500;
  }
}

.results-content {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-border-light);
  min-height: 600px;
}

.results-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--color-border-light);

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0 0 8px 0;
  }

  .results-count {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin: 0;
  }
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.placeholder-text {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--color-text-secondary);
  padding: 60px 0;
  font-size: 16px;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .filter-form__inner {
    grid-template-columns: 260px 1fr;
    gap: 24px;
  }

  .filter-sidebar {
    padding: 20px;
  }

  .results-content {
    padding: 24px;
  }
}

@media (max-width: 900px) {
  .filter-sidebar {
    position: static;
    max-height: none;
    overflow-y: visible;
    border: none;
    padding: 0;
  }
  .filter-header {
    display: none;
  }
}

@media (max-width: 768px) {
  .filter-form {
    padding: 24px 0 40px;
  }

  .filter-form__inner {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .filter-sidebar {
    position: static;
    max-height: none;
  }

  .results-content {
    padding: 20px;
  }

  .results-header h1 {
    font-size: 24px;
  }

  .results-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .results-content {
    padding: 16px;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .price-values {
    padding: 6px 10px;

    .price-value {
      font-size: 12px;
    }

    .price-separator {
      font-size: 11px;
    }
  }

  :deep(.el-slider) {
    padding: 10px 0;
  }
}
</style>
