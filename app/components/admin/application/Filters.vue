<script setup lang="ts">
import type {
  IApplicationFilters,
  ApplicationStatus,
  ApplicationType,
} from "@/types/application";

const props = defineProps<{
  modelValue: IApplicationFilters;
  visible: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: IApplicationFilters];
  apply: [];
  reset: [];
}>();

const statusOptions: { label: string; value: ApplicationStatus }[] = [
  { label: "Новая", value: "new" },
  { label: "В работе", value: "in_progress" },
  { label: "Выполнена", value: "done" },
  { label: "Отклонена", value: "rejected" },
];

const typeOptions: { label: string; value: ApplicationType }[] = [
  { label: "Общий", value: "general" },
  { label: "Вопрос", value: "question" },
  { label: "Жалоба", value: "complaint" },
  { label: "Тех. вопрос", value: "technical" },
  { label: "Партнёрство", value: "partnership" },
  { label: "Другое", value: "other" },
];

const sortByOptions = [
  { label: "Дата создания", value: "created_at" },
  { label: "Дата обновления", value: "updated_at" },
];

const sortOrderOptions = [
  { label: "По убыванию", value: "desc" },
  { label: "По возрастанию", value: "asc" },
];

const updateFilter = <K extends keyof IApplicationFilters>(
  key: K,
  value: IApplicationFilters[K]
) => {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
};
</script>

<template>
  <Transition name="collapse">
    <div v-if="visible" class="filters-panel">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :md="6">
          <div class="filter-item">
            <label class="filter-label">Статус</label>
            <el-select
              :model-value="modelValue.status"
              placeholder="Все статусы"
              clearable
              style="width: 100%"
              @update:model-value="updateFilter('status', $event)"
            >
              <el-option
                v-for="option in statusOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6">
          <div class="filter-item">
            <label class="filter-label">Тип заявки</label>
            <el-select
              :model-value="modelValue.type"
              placeholder="Все типы"
              clearable
              style="width: 100%"
              @update:model-value="updateFilter('type', $event)"
            >
              <el-option
                v-for="option in typeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6">
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

        <el-col :xs="24" :sm="12" :md="6">
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
