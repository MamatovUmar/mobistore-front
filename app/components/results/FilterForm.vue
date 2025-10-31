<script setup lang="ts">
import { reactive } from "vue";

const filters = reactive({
  region: "",
  city: "",
  brand: "",
  model: "",
  condition: "",
  priceRange: [0, 50000000],
  ram: "",
  storage: "",
  color: "",
  year: "",
  barter: false,
});

const formatPrice = (value) => {
  return new Intl.NumberFormat("ru-RU").format(value);
};

const resetFilters = () => {
  filters.region = "";
  filters.city = "";
  filters.brand = "";
  filters.model = "";
  filters.condition = "";
  filters.priceRange = [0, 50000000];
  filters.ram = "";
  filters.storage = "";
  filters.color = "";
  filters.year = "";
  filters.barter = false;
};
</script>

<template>
  <aside class="filter-sidebar">
    <div class="filter-header">
      <h3>Фильтры</h3>
      <el-button link type="primary" @click="resetFilters">
        Сбросить все
      </el-button>
    </div>

    <el-form :model="filters" label-position="top" size="default">
      <!-- Локация -->
      <div class="filter-section">
        <h3 class="filter-section-title">Локация</h3>

        <el-form-item label="Область">
          <el-select
            v-model="filters.region"
            placeholder="Выберите область"
            clearable
          >
            <el-option label="Все области" value="" />
            <el-option label="Ташкент" value="tashkent" />
            <el-option label="Самарканд" value="samarkand" />
            <el-option label="Бухара" value="bukhara" />
            <el-option label="Андижан" value="andijan" />
            <el-option label="Наманган" value="namangan" />
            <el-option label="Фергана" value="fergana" />
          </el-select>
        </el-form-item>

        <el-form-item label="Город">
          <el-select
            v-model="filters.city"
            placeholder="Выберите город"
            clearable
          >
            <el-option label="Все города" value="" />
            <el-option label="Ташкент" value="tashkent" />
            <el-option label="Самарканд" value="samarkand" />
            <el-option label="Бухара" value="bukhara" />
            <el-option label="Андижан" value="andijan" />
          </el-select>
        </el-form-item>
      </div>

      <!-- Характеристики -->
      <div class="filter-section">
        <h3 class="filter-section-title">Характеристики</h3>

        <el-form-item label="Бренд">
          <el-select
            v-model="filters.brand"
            placeholder="Выберите бренд"
            clearable
          >
            <el-option label="Все бренды" value="" />
            <el-option label="Samsung" value="samsung" />
            <el-option label="Apple" value="apple" />
            <el-option label="Xiaomi" value="xiaomi" />
            <el-option label="Huawei" value="huawei" />
            <el-option label="Oppo" value="oppo" />
            <el-option label="Vivo" value="vivo" />
            <el-option label="Realme" value="realme" />
            <el-option label="Honor" value="honor" />
          </el-select>
        </el-form-item>

        <el-form-item label="Модель">
          <el-select
            v-model="filters.model"
            placeholder="Выберите модель"
            clearable
          >
            <el-option label="Любая модель" value="" />
            <el-option label="iPhone 14" value="iphone-14" />
            <el-option label="iPhone 15" value="iphone-15" />
            <el-option label="iPhone 15 Pro" value="iphone-15-pro" />
            <el-option label="iPhone 16" value="iphone-16" />
            <el-option label="Galaxy S24" value="galaxy-s24" />
            <el-option label="Xiaomi 14" value="xiaomi-14" />
          </el-select>
        </el-form-item>

        <el-form-item label="Состояние">
          <el-select
            v-model="filters.condition"
            placeholder="Выберите состояние"
            clearable
          >
            <el-option label="Любое" value="" />
            <el-option label="Новый" value="new" />
            <el-option label="Б/У" value="used" />
            <el-option label="Восстановленный" value="refurbished" />
          </el-select>
        </el-form-item>

        <el-form-item label="Оперативная память (RAM)">
          <el-select v-model="filters.ram" placeholder="Выберите RAM" clearable>
            <el-option label="Любой объем" value="" />
            <el-option label="4 GB" value="4" />
            <el-option label="6 GB" value="6" />
            <el-option label="8 GB" value="8" />
            <el-option label="12 GB" value="12" />
            <el-option label="16 GB" value="16" />
          </el-select>
        </el-form-item>

        <el-form-item label="Встроенная память">
          <el-select
            v-model="filters.storage"
            placeholder="Выберите память"
            clearable
          >
            <el-option label="Любой объем" value="" />
            <el-option label="64 GB" value="64" />
            <el-option label="128 GB" value="128" />
            <el-option label="256 GB" value="256" />
            <el-option label="512 GB" value="512" />
            <el-option label="1 TB" value="1024" />
          </el-select>
        </el-form-item>
      </div>

      <!-- Цена -->
      <div class="filter-section">
        <h3 class="filter-section-title">Цена, сум</h3>

        <div class="price-slider">
          <div class="price-values">
            <span class="price-value">
              {{ formatPrice(filters.priceRange[0]) }}
            </span>
            <span class="price-separator">—</span>
            <span class="price-value">
              {{ formatPrice(filters.priceRange[1]) }}
            </span>
          </div>

          <el-slider
            v-model="filters.priceRange"
            :min="0"
            :max="50000000"
            :step="100000"
            range
            :show-tooltip="false"
          />
        </div>
      </div>

      <!-- Дополнительные опции -->
      <div class="filter-section">
        <h3 class="filter-section-title">Дополнительно</h3>

        <el-checkbox v-model="filters.barter" size="large">
          Возможен бартер
        </el-checkbox>
      </div>
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
  top: 20px;
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

.price-values {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
  padding: 8px 12px;
  background: var(--color-bg-secondary);
  border-radius: 8px;

  .price-value {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .price-separator {
    font-size: 12px;
    color: var(--color-text-secondary);
    font-weight: 400;
  }
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
  .filter-sidebar {
    padding: 16px;
  }

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
