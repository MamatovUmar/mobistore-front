<script setup lang="ts">
import { Refresh, Download, Loading, Search } from "@element-plus/icons-vue";
import type { IRate } from "~/composables/useRates";

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

useSeoMeta({
  title: "Курсы валют — Админ MobiStore",
  robots: "noindex, nofollow",
});

const { loading, syncing, rates, fetchLatestRates, syncRates, formatRate, formatDiff } = useRates();

const searchQuery = ref("");

const filteredRates = computed(() => {
  if (!searchQuery.value.trim()) {
    return rates.value;
  }

  const query = searchQuery.value.toLowerCase();
  return rates.value.filter((rate) =>
    rate.ccy.toLowerCase().includes(query) ||
    rate.name_ru.toLowerCase().includes(query) ||
    rate.name_en.toLowerCase().includes(query) ||
    rate.name_uz.toLowerCase().includes(query)
  );
});

const handleSync = async () => {
  try {
    await ElMessageBox.confirm(
      "Вы уверены, что хотите принудительно синхронизировать курсы валют с ЦБ Узбекистана?",
      "Подтверждение",
      {
        confirmButtonText: "Синхронизировать",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );

    await syncRates();
  } catch {
    // User cancelled
  }
};

const handleRefresh = async () => {
  await fetchLatestRates();
  ElMessage.success("Данные обновлены");
};

const getDiffType = (diff: number) => {
  if (diff > 0) return "success";
  if (diff < 0) return "danger";
  return "info";
};

const getRowClassName = ({ row }: { row: IRate }) => {
  if (row.diff > 0) return "rate-up";
  if (row.diff < 0) return "rate-down";
  return "";
};

onMounted(() => {
  fetchLatestRates();
});
</script>

<template>
  <div class="admin-rates">
    <div class="page-header">
      <div>
        <h1 class="page-title">Курсы валют</h1>
        <p class="page-subtitle">
          Курсы Центрального банка Узбекистана
        </p>
      </div>
      <div class="header-actions">
        <el-button :icon="Refresh" :loading="loading" @click="handleRefresh">
          Обновить
        </el-button>
        <el-button
          type="primary"
          :icon="Download"
          :loading="syncing"
          @click="handleSync"
        >
          Синхронизировать
        </el-button>
      </div>
    </div>

    <div class="page-toolbar">
      <el-input
        v-model="searchQuery"
        :prefix-icon="Search"
        placeholder="Поиск по коду или названию валюты..."
        clearable
        style="max-width: 400px"
      />
      <div class="toolbar-info">
        <span v-if="searchQuery && filteredRates.length !== rates.length">
          Найдено: {{ filteredRates.length }} из {{ rates.length }}
        </span>
        <span v-else-if="rates.length">
          Всего: {{ rates.length }}
        </span>
      </div>
    </div>

    <div v-if="loading && !rates.length" class="loading-state">
      <el-icon class="loading-icon" :size="32"><Loading /></el-icon>
      <span>Загрузка курсов валют...</span>
    </div>

    <div v-else-if="!rates.length" class="empty-state">
      <el-empty description="Нет данных о курсах валют">
        <el-button type="primary" @click="handleSync">
          Синхронизировать курсы
        </el-button>
      </el-empty>
    </div>

    <div v-else-if="searchQuery && !filteredRates.length" class="empty-state">
      <el-empty description="Ничего не найдено">
        <el-button @click="searchQuery = ''">Сбросить поиск</el-button>
      </el-empty>
    </div>

    <el-table
      v-else
      :data="filteredRates"
      :row-class-name="getRowClassName"
      stripe
      style="width: 100%"
    >
      <el-table-column prop="ccy" label="Валюта" width="100" fixed>
        <template #default="{ row }">
          <div class="currency-cell">
            <strong>{{ row.ccy }}</strong>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="name_ru" label="Название" min-width="200">
        <template #default="{ row }">
          <div class="name-cell">
            <div class="name-primary">{{ row.name_ru }}</div>
            <div class="name-secondary">{{ row.name_en }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="nominal" label="Номинал" width="100" align="center" />

      <el-table-column prop="rate" label="Курс" width="140" align="right">
        <template #default="{ row }">
          <div class="rate-cell">
            <strong>{{ formatRate(row.rate) }}</strong>
            <span class="rate-currency">сум</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="diff" label="Изменение" width="140" align="right">
        <template #default="{ row }">
          <el-tag :type="getDiffType(row.diff)" effect="plain" size="small">
            {{ formatDiff(row.diff) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="code" label="Код" width="100" align="center" />

      <el-table-column prop="date" label="Дата" width="120" align="center" />
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.admin-rates {
  max-width: 1400px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;

    .el-button {
      flex: 1;
    }
  }
}

.page-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.toolbar-info {
  font-size: 14px;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: var(--color-text-secondary);
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.currency-cell {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-primary);
}

.name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name-primary {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.name-secondary {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.rate-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;

  strong {
    font-size: 15px;
    color: var(--color-text-primary);
  }
}

.rate-currency {
  font-size: 11px;
  color: var(--color-text-muted);
}

:deep(.el-table) {
  .rate-up {
    background-color: rgba(103, 194, 58, 0.03);
  }

  .rate-down {
    background-color: rgba(245, 108, 108, 0.03);
  }

  .el-table__row:hover {
    .rate-up {
      background-color: rgba(103, 194, 58, 0.06);
    }

    .rate-down {
      background-color: rgba(245, 108, 108, 0.06);
    }
  }
}
</style>
