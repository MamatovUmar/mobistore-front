<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import type { IAdminUserFilters } from "@/types/admin-user";

const props = defineProps<{
  modelValue: IAdminUserFilters;
  visible: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: IAdminUserFilters];
  apply: [];
  reset: [];
}>();

const filters = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const banOptions = [
  { value: "", label: "Все" },
  { value: "true", label: "Забаненные" },
  { value: "false", label: "Активные" },
];

const verifiedOptions = [
  { value: "", label: "Все" },
  { value: "true", label: "Верифицированные" },
  { value: "false", label: "Не верифицированные" },
];

const banValue = computed({
  get: () => {
    if (filters.value.is_ban === null) return "";
    return String(filters.value.is_ban);
  },
  set: (val: string) => {
    if (val === "") {
      filters.value.is_ban = null;
    } else {
      filters.value.is_ban = val === "true";
    }
  },
});

const verifiedValue = computed({
  get: () => {
    if (filters.value.is_verified === null) return "";
    return String(filters.value.is_verified);
  },
  set: (val: string) => {
    if (val === "") {
      filters.value.is_verified = null;
    } else {
      filters.value.is_verified = val === "true";
    }
  },
});

const sortOptions = [
  { value: "created_at", label: "Дате регистрации" },
  { value: "updated_at", label: "Дате обновления" },
  { value: "last_entered_at", label: "Последнему входу" },
  { value: "first_name", label: "Имени" },
];

const sortOrderOptions = [
  { value: "desc", label: "По убыванию" },
  { value: "asc", label: "По возрастанию" },
];
</script>

<template>
  <Transition name="slide-down">
    <el-card v-if="visible" class="filters-card">
      <div class="filters-grid">
        <div class="filter-item filter-item--search">
          <label class="filter-label">Поиск</label>
          <el-input
            v-model="filters.search"
            placeholder="Поиск по имени, email, телефону..."
            :prefix-icon="Search"
            clearable
            @keyup.enter="$emit('apply')"
          />
        </div>

        <div class="filter-item">
          <label class="filter-label">Статус бана</label>
          <el-select
            v-model="banValue"
            placeholder="Выберите статус"
            clearable
          >
            <el-option
              v-for="option in banOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>

        <div class="filter-item">
          <label class="filter-label">Верификация</label>
          <el-select
            v-model="verifiedValue"
            placeholder="Выберите статус"
            clearable
          >
            <el-option
              v-for="option in verifiedOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>

        <div class="filter-item">
          <label class="filter-label">Сортировка</label>
          <el-select v-model="filters.sortBy" placeholder="Сортировать по">
            <el-option
              v-for="option in sortOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>

        <div class="filter-item">
          <label class="filter-label">Порядок</label>
          <el-select v-model="filters.sortOrder" placeholder="Порядок">
            <el-option
              v-for="option in sortOrderOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>
      </div>

      <div class="filters-actions">
        <el-button @click="$emit('reset')">Сбросить</el-button>
        <el-button type="primary" @click="$emit('apply')">Применить</el-button>
      </div>
    </el-card>
  </Transition>
</template>

<style lang="scss" scoped>
.filters-card {
  margin-bottom: 20px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &--search {
    grid-column: span 2;

    @media (max-width: 600px) {
      grid-column: span 1;
    }
  }

  :deep(.el-select),
  :deep(.el-input) {
    width: 100%;
  }
}

.filter-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.filters-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-light);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
