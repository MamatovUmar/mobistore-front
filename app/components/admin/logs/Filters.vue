<script setup lang="ts">
import type { LogType, LogStatus } from "~/composables/useLogs";

interface Filters {
  type?: LogType;
  status?: LogStatus;
  user_id?: number;
  from_date?: string;
  to_date?: string;
}

const props = defineProps<{
  modelValue: Filters;
  visible: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: Filters];
  "update:visible": [value: boolean];
  apply: [];
  reset: [];
}>();

const filters = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const dateRange = ref<[Date, Date] | null>(null);

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

watch(dateRange, (val) => {
  if (val && val.length === 2) {
    emit("update:modelValue", {
      ...props.modelValue,
      from_date: val[0].toISOString().split("T")[0],
      to_date: val[1].toISOString().split("T")[0],
    });
  } else {
    emit("update:modelValue", {
      ...props.modelValue,
      from_date: undefined,
      to_date: undefined,
    });
  }
});

const handleReset = () => {
  dateRange.value = null;
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
              v-model="filters.type"
              placeholder="Все типы"
              clearable
              class="filter-select"
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
              v-model="filters.status"
              placeholder="Все статусы"
              clearable
              class="filter-select"
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
              v-model.number="filters.user_id"
              placeholder="ID"
              clearable
              class="filter-input"
            />
          </div>
          <div class="filter-item">
            <label class="filter-label">Период</label>
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
