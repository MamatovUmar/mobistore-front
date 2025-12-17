<script setup lang="ts">
import {
  Refresh,
  Plus,
  Search,
  Delete,
  RefreshRight,
} from "@element-plus/icons-vue";
import BrandAutocomplete from "~/components/autocompletes/BrandAutocomplete.vue";
import type {
  ParserStatus,
  IParserFilters,
  IParserRecord,
} from "~/composables/useAdminParser";

definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "Парсер — Админ MobiStore",
  robots: "noindex, nofollow",
});

const {
  loading,
  records,
  pagination,
  stats,
  fetchRecords,
  createRecord,
  retryRecord,
  deleteRecord,
  refresh,
} = useAdminParser();

const filters = reactive<IParserFilters>({
  page: 1,
  limit: 20,
  status: undefined,
  brandId: undefined,
  search: "",
  sortBy: "created_at",
  sortOrder: "desc",
});

const addDialogVisible = ref(false);
const addForm = reactive({
  name: "",
  brand_id: undefined as number | undefined,
});
const addFormLoading = ref(false);

const statusOptions: {
  value: ParserStatus;
  label: string;
  type: "info" | "warning" | "success" | "danger";
}[] = [
  { value: "new", label: "Новая", type: "info" },
  { value: "processing", label: "В обработке", type: "warning" },
  { value: "completed", label: "Завершена", type: "success" },
  { value: "failed", label: "Ошибка", type: "danger" },
];

const getStatusType = (status: ParserStatus) => {
  const option = statusOptions.find((o) => o.value === status);
  return option?.type || "info";
};

const getStatusLabel = (status: ParserStatus) => {
  const option = statusOptions.find((o) => o.value === status);
  return option?.label || status;
};

const fetchData = async () => {
  await fetchRecords(filters);
};

const handlePageChange = (page: number) => {
  filters.page = page;
  fetchData();
};

const handleSizeChange = (size: number) => {
  filters.limit = size;
  filters.page = 1;
  fetchData();
};

const handleSearch = () => {
  filters.page = 1;
  fetchData();
};

const handleStatusFilter = (status: ParserStatus | undefined) => {
  filters.status = status;
  filters.page = 1;
  fetchData();
};

const handleBrandFilter = (brandId: number | undefined) => {
  filters.brandId = brandId;
  filters.page = 1;
  fetchData();
};

const handleRefresh = async () => {
  await refresh(filters);
  ElMessage.success("Данные обновлены");
};

const openAddDialog = () => {
  addForm.name = "";
  addForm.brand_id = undefined;
  addDialogVisible.value = true;
};

const handleAdd = async () => {
  if (!addForm.name.trim()) {
    ElMessage.warning("Введите название модели");
    return;
  }
  if (!addForm.brand_id) {
    ElMessage.warning("Выберите бренд");
    return;
  }

  addFormLoading.value = true;
  try {
    const result = await createRecord({
      name: addForm.name.trim(),
      brand_id: addForm.brand_id,
    });
    if (result) {
      addDialogVisible.value = false;
      await refresh(filters);
    }
  } finally {
    addFormLoading.value = false;
  }
};

const handleRetry = async (record: IParserRecord) => {
  try {
    await ElMessageBox.confirm(
      `Повторить обработку модели "${record.name}"?`,
      "Подтверждение",
      {
        confirmButtonText: "Повторить",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );
    await retryRecord(record.id);
    await refresh(filters);
  } catch {
    // Cancelled
  }
};

const handleDelete = async (record: IParserRecord) => {
  try {
    await ElMessageBox.confirm(
      `Удалить запись "${record.name}" из очереди?`,
      "Подтверждение удаления",
      {
        confirmButtonText: "Удалить",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );
    await deleteRecord(record.id);
    await refresh(filters);
  } catch {
    // Cancelled
  }
};

onMounted(async () => {
  await refresh(filters);
});
</script>

<template>
  <div class="admin-parser">
    <div class="page-header">
      <h1 class="page-title">AI Парсер моделей</h1>
      <p class="page-description">
        Очередь автоматического парсинга моделей через AI
      </p>
    </div>

    <div v-if="stats" class="stats-cards">
      <div class="stat-card stat-card--new">
        <div class="stat-value">{{ stats.new }}</div>
        <div class="stat-label">Новые</div>
      </div>
      <div class="stat-card stat-card--processing">
        <div class="stat-value">{{ stats.processing }}</div>
        <div class="stat-label">В обработке</div>
      </div>
      <div class="stat-card stat-card--completed">
        <div class="stat-value">{{ stats.completed }}</div>
        <div class="stat-label">Завершены</div>
      </div>
      <div class="stat-card stat-card--failed">
        <div class="stat-value">{{ stats.failed }}</div>
        <div class="stat-label">Ошибки</div>
      </div>
    </div>

    <div class="page-toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="filters.search"
          placeholder="Поиск по названию..."
          :prefix-icon="Search"
          clearable
          style="width: 250px"
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        />

        <el-select
          v-model="filters.status"
          placeholder="Статус"
          clearable
          style="width: 150px"
          @change="handleStatusFilter"
        >
          <el-option
            v-for="option in statusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>

        <brand-autocomplete
          v-model="filters.brandId"
          style="width: 180px"
          placeholder="Бренд"
          @change="handleBrandFilter"
        />
      </div>

      <div class="toolbar-right">
        <el-button :icon="Refresh" :loading="loading" @click="handleRefresh">
          Обновить
        </el-button>
        <el-button type="primary" :icon="Plus" @click="openAddDialog">
          Добавить модель
        </el-button>
      </div>
    </div>

    <el-table v-loading="loading" :data="records" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Название модели" min-width="200" />
      <el-table-column label="Бренд" width="150">
        <template #default="{ row }">
          {{ row.brand?.name || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="Статус" width="130">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Действия" width="140" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'failed'"
            :icon="RefreshRight"
            size="small"
            type="warning"
            circle
            class="mr-10"
            @click="handleRetry(row)"
          />
          <el-button
            :icon="Delete"
            size="small"
            type="danger"
            circle
            @click="handleDelete(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <div v-if="pagination" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="filters.page"
        v-model:page-size="filters.limit"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <el-dialog
      v-model="addDialogVisible"
      title="Добавить модель в очередь"
      width="500px"
    >
      <el-form label-position="top" size="large">
        <el-form-item label="Бренд" required>
          <brand-autocomplete v-model="addForm.brand_id" />
        </el-form-item>
        <el-form-item label="Название модели" required>
          <el-input
            v-model="addForm.name"
            placeholder="Например: iPhone 16 Pro Max"
            maxlength="255"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button class="mr-15" @click="addDialogVisible = false">
          Отмена
        </el-button>
        <el-button type="primary" :loading="addFormLoading" @click="handleAdd">
          Добавить
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.admin-parser {
  max-width: 1400px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--color-text-primary);
}

.page-description {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  padding: 20px;
  text-align: center;

  &--new {
    border-left: 4px solid var(--el-color-info);
  }

  &--processing {
    border-left: 4px solid var(--el-color-warning);
  }

  &--completed {
    border-left: 4px solid var(--el-color-success);
  }

  &--failed {
    border-left: 4px solid var(--el-color-danger);
  }
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.stat-label {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.page-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.error-message {
  color: var(--el-color-danger);
  font-size: 12px;
}

.text-muted {
  color: var(--color-text-secondary);
}

.model-link {
  color: var(--el-color-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .toolbar-left,
  .toolbar-right {
    flex-wrap: wrap;
  }
}
</style>
