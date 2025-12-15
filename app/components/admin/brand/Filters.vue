<script setup lang="ts">
import type { IBrandFilters } from "@/types/brand";

const props = defineProps<{
  modelValue: IBrandFilters;
  visible: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: IBrandFilters];
  apply: [];
  reset: [];
}>();

const sortByOptions = [
  { label: "Название", value: "name" },
  { label: "ID", value: "id" },
  { label: "Популярность", value: "is_popular" },
];

const sortOrderOptions = [
  { label: "По возрастанию", value: "asc" },
  { label: "По убыванию", value: "desc" },
];

const popularOptions = [
  { label: "Все", value: undefined },
  { label: "Популярные", value: true },
  { label: "Обычные", value: false },
];

const updateFilter = <K extends keyof IBrandFilters>(
  key: K,
  value: IBrandFilters[K]
) => {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
};
</script>

<template>
  <Transition name="collapse">
    <div v-if="visible" class="filters-panel">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :md="8">
          <div class="filter-item">
            <label class="filter-label">Сортировка</label>
            <el-select
              :model-value="modelValue.sortBy"
              style="width: 100%"
              @update:model-value="updateFilter('sortBy', $event)"
            >
              <el-option
                v-for="option in sortByOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8">
          <div class="filter-item">
            <label class="filter-label">Направление</label>
            <el-select
              :model-value="modelValue.sortOrder"
              style="width: 100%"
              @update:model-value="updateFilter('sortOrder', $event)"
            >
              <el-option
                v-for="option in sortOrderOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8">
          <div class="filter-item">
            <label class="filter-label">Популярность</label>
            <el-select
              :model-value="modelValue.is_popular"
              style="width: 100%"
              @update:model-value="updateFilter('is_popular', $event)"
            >
              <el-option
                v-for="option in popularOptions"
                :key="String(option.value)"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
        </el-col>
      </el-row>

      <div class="filters-actions">
        <el-button @click="$emit('reset')">Сбросить</el-button>
        <el-button type="primary" @click="$emit('apply')">Применить</el-button>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.filters-panel {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--el-border-color-light);
}

.filter-item {
  margin-bottom: 16px;
}

.filter-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.filters-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--el-border-color-light);
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 400px;
}
</style>
