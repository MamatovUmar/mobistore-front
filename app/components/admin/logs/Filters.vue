<script setup lang="ts">
import type { ILogsFilters, LogType, LogStatus } from "~/composables/useLogs";

const props = defineProps<{
  modelValue: ILogsFilters;
  visible: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: ILogsFilters];
  "update:visible": [value: boolean];
  apply: [];
  reset: [];
}>();

const updateFilters = (patch: Partial<ILogsFilters>) => {
  emit("update:modelValue", {
    ...props.modelValue,
    ...patch,
  });
};

const dateRange = computed<[string, string] | null>({
  get: () => {
    if (props.modelValue.from_date && props.modelValue.to_date) {
      return [props.modelValue.from_date, props.modelValue.to_date] as [string, string];
    }
    return null;
  },
  set: (value: [string, string] | null) => {
    if (value && value.length === 2) {
      updateFilters({
        from_date: value[0],
        to_date: value[1],
      });
      return;
    }
    updateFilters({
      from_date: undefined,
      to_date: undefined,
    });
  },
});

const handleTypeChange = (value: LogType | undefined) => {
  updateFilters({ type: value || undefined });
};

const handleStatusChange = (value: LogStatus | undefined) => {
  updateFilters({ status: value || undefined });
};

const handleUserIdChange = (value: string | number) => {
  if (value === "" || value === null || value === undefined) {
    updateFilters({ user_id: undefined });
    return;
  }

  const parsedValue = Number(value);
  updateFilters({ user_id: Number.isNaN(parsedValue) ? undefined : parsedValue });
};
const typeOptions: { value: LogType; label: string }[] = [
  { value: "error", label: "Ошибка" },
  { value: "warning", label: "Предупреждение" },
  { value: "info", label: "Информация" },
  { value: "debug", label: "Отладка" },
];

const statusOptions: { value: LogStatus; label: string }[] = [
  { value: "pending", label: "Ожидает" },
  { value: "reviewed", label: "Просмотрен" },
  { value: "resolved", label: "Решён" },
  { value: "ignored", label: "Игнорирован" },
];

const handleReset = () => {
  emit("reset");
};
</script>

<template>
  <el-collapse-transition>
    <div v-show="visible" class="filters-panel">
      <el-card class="filters-card">
        <div class="filters-grid">
          <div class="filter-item">
            <label class="filter-label">Тип</label>
            <el-select
              :model-value="modelValue.type"
              placeholder="Все типы"
              clearable
              class="filter-select"
              @update:model-value="handleTypeChange"
            >
              <el-option
                v-for="option in typeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
          <div class="filter-item">
            <label class="filter-label">Статус</label>
            <el-select
              :model-value="modelValue.status"
              placeholder="Все статусы"
              clearable
              class="filter-select"
              @update:model-value="handleStatusChange"
            >
              <el-option
                v-for="option in statusOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
          <div class="filter-item">
            <label class="filter-label">ID пользователя</label>
            <el-input
              :model-value="modelValue.user_id"
              placeholder="ID"
              clearable
              class="filter-input"
              @update:model-value="handleUserIdChange"
            />
          </div>
          <div class="filter-item">
            <label class="filter-label">Период</label>
            <ClientOnly>
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="—"
                start-placeholder="Начало"
                end-placeholder="Конец"
                format="DD.MM.YYYY"
                value-format="YYYY-MM-DD"
                class="filter-date"
              />
            </ClientOnly>
          </div>
        </div>
        <div class="filters-actions">
          <el-button @click="handleReset">Сбросить</el-button>
          <el-button type="primary" @click="$emit('apply')">Применить</el-button>
        </div>
      </el-card>
    </div>
  </el-collapse-transition>
</template>

<style lang="scss" scoped>
.filters-panel {
  margin-bottom: 20px;
}

.filters-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.filter-select,
.filter-input,
.filter-date {
  width: 100%;
}

.filters-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-light);
}
</style>
