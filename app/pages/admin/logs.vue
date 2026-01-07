<script setup lang="ts">
import { Refresh, Filter, Delete } from "@element-plus/icons-vue";
import type { LogStatus, ILog, ILogsFilters, ICleanupPayload } from "~/composables/useLogs";

definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "Логи — Админ MobiStore",
  robots: "noindex, nofollow",
});

const {
  loading,
  logs,
  pagination,
  stats,
  selectedLog,
  fetchLogs,
  fetchStats,
  fetchLogById,
  updateStatus,
  bulkUpdateStatus,
  cleanupLogs,
  refresh,
} = useLogs();

const filters = reactive<ILogsFilters>({
  page: 1,
  limit: 20,
  type: undefined,
  status: undefined,
  user_id: undefined,
  from_date: undefined,
  to_date: undefined,
});

const showFilters = ref(false);
const drawerVisible = ref(false);
const selectedIds = ref<number[]>([]);
const cleanupDialogVisible = ref(false);

const statusOptions: { value: LogStatus; label: string }[] = [
  { value: "pending", label: "Ожидает" },
  { value: "reviewed", label: "Просмотрен" },
  { value: "resolved", label: "Решён" },
  { value: "ignored", label: "Игнорирован" },
];

const getStatusLabel = (status: LogStatus) => {
  const labels: Record<LogStatus, string> = {
    pending: "Ожидает",
    reviewed: "Просмотрен",
    resolved: "Решён",
    ignored: "Игнорирован",
  };
  return labels[status] || status;
};

const fetchData = async () => {
  await fetchLogs(filters);
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

const applyFilters = () => {
  filters.page = 1;
  fetchData();
};

const resetFilters = () => {
  filters.type = undefined;
  filters.status = undefined;
  filters.user_id = undefined;
  filters.from_date = undefined;
  filters.to_date = undefined;
  filters.page = 1;
  fetchData();
};

const viewLog = async (log: ILog) => {
  await fetchLogById(log.id);
  drawerVisible.value = true;
};

const handleStatusChange = async (log: ILog, newStatus: LogStatus) => {
  await updateStatus(log.id, { status: newStatus });
  await fetchStats();
};

const handleDrawerStatusChange = async (newStatus: LogStatus) => {
  if (selectedLog.value) {
    await updateStatus(selectedLog.value.id, { status: newStatus });
    await fetchStats();
  }
};

const handleBulkStatusChange = async (newStatus: LogStatus) => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("Выберите логи для обновления");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `Изменить статус ${selectedIds.value.length} логов на "${getStatusLabel(newStatus)}"?`,
      "Подтверждение",
      {
        confirmButtonText: "Подтвердить",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );

    await bulkUpdateStatus({ ids: selectedIds.value, status: newStatus });
    await refresh(filters);
    selectedIds.value = [];
  } catch {
    // Cancelled
  }
};

const handleSelectionChange = (selection: ILog[]) => {
  selectedIds.value = selection.map((log) => log.id);
};

const handleCleanup = async (payload: ICleanupPayload) => {
  await cleanupLogs(payload);
  cleanupDialogVisible.value = false;
  await refresh(filters);
};

const handleRefresh = async () => {
  await refresh(filters);
  ElMessage.success("Данные обновлены");
};

onMounted(() => {
  refresh(filters);
});
</script>

<template>
  <div class="admin-logs">
    <AdminLogsStats :stats="stats" />

    <div class="page-toolbar">
      <div class="toolbar-left">
        <el-button
          :icon="Filter"
          :type="showFilters ? 'primary' : 'default'"
          @click="showFilters = !showFilters"
        >
          Фильтры
        </el-button>

        <el-dropdown
          v-if="selectedIds.length > 0"
          trigger="click"
          @command="handleBulkStatusChange"
        >
          <el-button type="primary">
            Действия ({{ selectedIds.length }})
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="option in statusOptions"
                :key="option.value"
                :command="option.value"
              >
                {{ option.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="toolbar-right">
        <el-button :icon="Refresh" :loading="loading" @click="handleRefresh">
          Обновить
        </el-button>
        <el-button type="danger" :icon="Delete" @click="cleanupDialogVisible = true">
          Очистка
        </el-button>
      </div>
    </div>

    <AdminLogsFilters
      v-model="filters"
      :visible="showFilters"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <AdminLogsTable
      :logs="logs"
      :pagination="pagination"
      :loading="loading"
      :page="filters.page ?? 1"
      :limit="filters.limit ?? 20"
      @update:page="handlePageChange"
      @update:limit="handleSizeChange"
      @row-click="viewLog"
      @selection-change="handleSelectionChange"
      @status-change="handleStatusChange"
    />

    <AdminLogsDetailDrawer
      v-model="drawerVisible"
      :log="selectedLog"
      @status-change="handleDrawerStatusChange"
    />

    <AdminLogsCleanupDialog
      v-model="cleanupDialogVisible"
      @cleanup="handleCleanup"
    />
  </div>
</template>

<style lang="scss" scoped>
.admin-logs {
  max-width: 1400px;
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
</style>
