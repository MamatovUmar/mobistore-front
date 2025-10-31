<script setup lang="ts">
import { reactive } from "vue";

const form = reactive({
  region: "",
  city: "",
  brand: "",
  model: "",
  condition: "",
});
</script>

<template>
  <div class="container">
    <div class="filters">
      <el-form :model="form" label-position="top" size="large">
        <div class="filters-grid">
          <el-form-item label="Область" class="filter-item">
            <el-select v-model="form.region" placeholder="Выберите область">
              <el-option label="Все области" value="all" />
              <el-option label="Ташкент" value="tashkent" />
              <el-option label="Самарканд" value="samarkand" />
              <el-option label="Бухара" value="bukhara" />
              <el-option label="Андижан" value="andijan" />
              <el-option label="Наманган" value="namangan" />
              <el-option label="Фергана" value="fergana" />
            </el-select>
          </el-form-item>

          <el-form-item label="Город" class="filter-item">
            <el-select v-model="form.city" placeholder="Выберите город">
              <el-option label="Все города" value="all" />
              <el-option label="Ташкент" value="tashkent" />
              <el-option label="Самарканд" value="samarkand" />
              <el-option label="Бухара" value="bukhara" />
              <el-option label="Андижан" value="andijan" />
              <el-option label="Наманган" value="namangan" />
              <el-option label="Фергана" value="fergana" />
            </el-select>
          </el-form-item>

          <el-form-item label="Бренд" class="filter-item">
            <el-select v-model="form.brand" placeholder="Выберите бренд">
              <el-option label="Все бренды" value="all" />
              <el-option label="Samsung" value="samsung" />
              <el-option label="Apple" value="apple" />
              <el-option label="Xiaomi" value="xiaomi" />
              <el-option label="Huawei" value="huawei" />
              <el-option label="Oppo" value="oppo" />
              <el-option label="Vivo" value="vivo" />
            </el-select>
          </el-form-item>

          <el-form-item label="Модель" class="filter-item">
            <el-select v-model="form.model" placeholder="Выберите модель">
              <el-option label="Любая модель" value="all" />
              <el-option label="iPhone 14" value="iphone-14" />
              <el-option label="iPhone 15" value="iphone-15" />
              <el-option label="iPhone 15 Pro" value="iphone-15-pro" />
              <el-option label="iPhone 15 Pro Max" value="iphone-15-pro-max" />
              <el-option label="iPhone 16" value="iphone-16" />
              <el-option label="iPhone 16 Pro" value="iphone-16-pro" />
              <el-option label="iPhone 16 Pro Max" value="iphone-16-pro-max" />
            </el-select>
          </el-form-item>

          <el-form-item label=" " class="filter-item filter-item--button">
            <el-button type="primary" size="large" class="search-button">
              Показать результаты
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filters {
  background: var(--color-bg-primary);
  padding: 32px;
  border-radius: 16px;
  margin: -50px auto 48px;
  max-width: 1200px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--color-border-light);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  align-items: flex-end;
}

.filter-item {
  width: 100%;
  margin-bottom: 0;

  :deep(.el-form-item__label) {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 8px;
    line-height: 1.5;
  }

  :deep(.el-select) {
    width: 100%;
  }

  :deep(.el-input__wrapper) {
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
    }
  }

  :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
}

.filter-item--button {
  :deep(.el-form-item__label) {
    opacity: 0;
    pointer-events: none;
  }
}

.search-button {
  width: 100%;
  height: 40px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
  }

  &:active {
    transform: translateY(0);
  }
}

/* Адаптивность */
@media (max-width: 1024px) {
  .filters-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .filter-item--button {
    grid-column: span 3;
  }

  .search-button {
    max-width: 300px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .filters {
    padding: 24px 20px;
    margin: -40px auto 32px;
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
    border-radius: 12px;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .filter-item--button {
    grid-column: 1;
  }

  .search-button {
    max-width: 100%;
  }
}
</style>
