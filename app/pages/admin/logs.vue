<script setup lang="ts">
import { Search, Refresh, Download } from "@element-plus/icons-vue";

definePageMeta({
  layout: "admin",
});

const searchQuery = ref("");
const selectedLevel = ref("");
const dateRange = ref<[Date, Date] | null>(null);
const currentPage = ref(1);
const pageSize = ref(20);

const levelOptions = [
  { label: "Все уровни", value: "" },
  { label: "Info", value: "info" },
  { label: "Warning", value: "warning" },
  { label: "Error", value: "error" },
  { label: "Debug", value: "debug" },
];

const logs = ref([
  {
    id: 1,
    timestamp: "2024-03-15 14:32:15",
    level: "info",
    message: "Пользователь ivan@example.com выполнил вход",
    source: "auth",
    ip: "192.168.1.100",
  },
  {
    id: 2,
    timestamp: "2024-03-15 14:30:45",
    level: "warning",
    message: "Неудачная попытка входа для test@example.com",
    source: "auth",
    ip: "192.168.1.105",
  },
  {
    id: 3,
    timestamp: "2024-03-15 14:28:30",
    level: "error",
    message: "Ошибка подключения к базе данных",
    source: "database",
    ip: "localhost",
  },
  {
    id: 4,
    timestamp: "2024-03-15 14:25:10",
    level: "info",
    message: "Создано новое объявление ID: 1234",
    source: "listings",
    ip: "192.168.1.102",
  },
  {
    id: 5,
    timestamp: "2024-03-15 14:20:00",
    level: "debug",
    message: "Cache hit для ключа: brands_list",
    source: "cache",
    ip: "localhost",
  },
  {
    id: 6,
    timestamp: "2024-03-15 14:15:30",
    level: "info",
    message: "Пользователь maria@example.com обновил профиль",
    source: "users",
    ip: "192.168.1.110",
  },
  {
    id: 7,
    timestamp: "2024-03-15 14:10:20",
    level: "warning",
    message: "Превышен лимит запросов API для IP 192.168.1.120",
    source: "api",
    ip: "192.168.1.120",
  },
  {
    id: 8,
    timestamp: "2024-03-15 14:05:15",
    level: "error",
    message: "Ошибка отправки email на адрес invalid@",
    source: "email",
    ip: "localhost",
  },
]);

const getLevelType = (level: string) => {
  const types: Record<string, string> = {
    info: "info",
    warning: "warning",
    error: "danger",
    debug: "",
  };
  return types[level] || "info";
};

const handleRefresh = () => {
  console.log("Refresh logs");
};

const handleExport = () => {
  console.log("Export logs");
};
</script>

<template>
  <div class="admin-logs">
    <div class="page-toolbar">
      <div class="toolbar-filters">
        <el-input
          v-model="searchQuery"
          placeholder="Поиск в логах..."
          :prefix-icon="Search"
          class="search-input"
          clearable
        />
        <el-select v-model="selectedLevel" placeholder="Уровень" class="level-select">
          <el-option
            v-for="option in levelOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="—"
          start-placeholder="Начало"
          end-placeholder="Конец"
          class="date-picker"
        />
      </div>
      <div class="toolbar-actions">
        <el-button :icon="Refresh" @click="handleRefresh">
          Обновить
        </el-button>
        <el-button :icon="Download" @click="handleExport">
          Экспорт
        </el-button>
      </div>
    </div>

    <el-card class="logs-table-card">
      <el-table :data="logs" stripe style="width: 100%">
        <el-table-column prop="timestamp" label="Время" width="170" />
        <el-table-column prop="level" label="Уровень" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)" size="small">
              {{ row.level.toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="Источник" width="120">
          <template #default="{ row }">
            <el-tag type="info" size="small" effect="plain">
              {{ row.source }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="Сообщение" min-width="300">
          <template #default="{ row }">
            <span class="log-message" :class="`log-message--${row.level}`">
              {{ row.message }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP адрес" width="140" />
      </el-table>

      <div class="table-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[20, 50, 100, 200]"
          :total="500"
          layout="total, sizes, prev, pager, next"
          background
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.admin-logs {
  max-width: 1400px;
}

.page-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.toolbar-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-input {
  width: 280px;
}

.level-select {
  width: 140px;
}

.date-picker {
  width: 280px;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.logs-table-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.log-message {
  font-family: "SF Mono", Monaco, Consolas, monospace;
  font-size: 13px;

  &--error {
    color: var(--color-danger);
  }

  &--warning {
    color: var(--color-warning);
  }
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}

@media (max-width: 768px) {
  .toolbar-filters {
    width: 100%;
  }

  .search-input,
  .level-select,
  .date-picker {
    width: 100%;
  }
}
</style>
