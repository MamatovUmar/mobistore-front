<script setup lang="ts">
import { Loading } from "@element-plus/icons-vue";
import type { ILog, LogType, LogStatus } from "~/composables/useLogs";
import type { IPagination } from "~/types";

defineProps<{
  logs: ILog[];
  pagination: IPagination | null;
  loading: boolean;
  page: number;
  limit: number;
}>();

const emit = defineEmits<{
  "update:page": [value: number];
  "update:limit": [value: number];
  "row-click": [log: ILog];
  "selection-change": [selection: ILog[]];
  "status-change": [log: ILog, status: LogStatus];
}>();

const statusOptions: { value: LogStatus; label: string }[] = [
  { value: "pending", label: "Ожидает" },
  { value: "reviewed", label: "Просмотрен" },
  { value: "resolved", label: "Решён" },
  { value: "ignored", label: "Игнорирован" },
];

const getTypeColor = (type: LogType) => {
  const colors: Record<LogType, string> = {
    error: "danger",
    warning: "warning",
    info: "primary",
    debug: "info",
  };
  return colors[type] || "info";
};

const getTypeLabel = (type: LogType) => {
  const labels: Record<LogType, string> = {
    error: "Ошибка",
    warning: "Предупреждение",
    info: "Информация",
    debug: "Отладка",
  };
  return labels[type] || type;
};

const getStatusColor = (status: LogStatus) => {
  const colors: Record<LogStatus, string> = {
    pending: "warning",
    reviewed: "primary",
    resolved: "success",
    ignored: "info",
  };
  return colors[status] || "info";
};

const getStatusLabel = (status: LogStatus) => {
  const labels: Record<LogStatus, string> = {
    pending: "Ожидает",
    reviewed: "Просмотрен",
    resolved: "Решён",
    ignored: "Игнорирован",
  };
  return labels[status] || status;
};

const getMethodColor = (method: string | null) => {
  if (!method) return "info";
  const colors: Record<string, string> = {
    GET: "success",
    POST: "primary",
    PUT: "warning",
    PATCH: "warning",
    DELETE: "danger",
  };
  return colors[method] || "info";
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handlePageChange = (page: number) => {
  emit("update:page", page);
};

const handleSizeChange = (size: number) => {
  emit("update:limit", size);
};
</script>

<template>
  <el-card class="logs-table-card">
    <div v-if="loading && !logs.length" class="loading-state">
      <el-icon class="loading-icon" :size="32"><Loading /></el-icon>
      <span>Загрузка данных...</span>
    </div>

    <el-table
      v-else
      :data="logs"
      stripe
      class="logs-table"
      @selection-change="(selection: ILog[]) => $emit('selection-change', selection)"
      @row-click="(row: ILog) => $emit('row-click', row)"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="type" label="Тип" width="130">
        <template #default="{ row }">
          <el-tag :type="getTypeColor(row.type)" size="small">
            {{ getTypeLabel(row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="message" label="Сообщение" min-width="250">
        <template #default="{ row }">
          <span class="message-cell">{{ row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="method" label="Метод" width="90">
        <template #default="{ row }">
          <el-tag v-if="row.method" :type="getMethodColor(row.method)" size="small">
            {{ row.method }}
          </el-tag>
          <span v-else class="text-muted">—</span>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="Путь" min-width="150">
        <template #default="{ row }">
          <code v-if="row.path" class="path-cell">{{ row.path }}</code>
          <span v-else class="text-muted">—</span>
        </template>
      </el-table-column>
      <el-table-column prop="status_code" label="Код" width="80" align="center">
        <template #default="{ row }">
          <span v-if="row.status_code" :class="['status-code', { error: row.status_code >= 400 }]">
            {{ row.status_code }}
          </span>
          <span v-else class="text-muted">—</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Статус" width="130">
        <template #default="{ row }">
          <el-dropdown trigger="click" @command="(cmd: LogStatus) => $emit('status-change', row, cmd)">
            <el-tag
              :type="getStatusColor(row.status)"
              size="small"
              class="status-tag"
              @click.stop
            >
              {{ getStatusLabel(row.status) }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-tag>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="option in statusOptions"
                  :key="option.value"
                  :command="option.value"
                  :disabled="row.status === option.value"
                >
                  {{ option.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="Дата" width="150">
        <template #default="{ row }">
          <span class="date-cell">{{ formatDate(row.created_at) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="table-pagination">
      <el-pagination
        :current-page="page"
        :page-size="limit"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination?.total ?? 0"
        layout="total, sizes, prev, pager, next"
        background
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </el-card>
</template>

<style lang="scss">
.logs-table-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.logs-table {
  width: 100%;

  :deep(.el-table__row) {
    cursor: pointer;

    &:hover {
      background-color: var(--el-table-row-hover-bg-color);
    }
  }
}

.loading-state {
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.message-cell {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 13px;
  line-height: 1.4;
}

.path-cell {
  font-family: "SF Mono", Monaco, Consolas, monospace;
  font-size: 12px;
  color: var(--color-primary);
  background: rgba(59, 130, 246, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-code {
  font-weight: 600;
  font-size: 13px;

  &.error {
    color: #ef4444;
  }
}

.status-tag {
  cursor: pointer;
  .el-tag__content {
    display: flex;
    align-items: center;
  }

  .el-icon--right {
    margin-left: 4px;
    font-size: 10px;
  }
}

.date-cell {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.text-muted {
  color: var(--color-text-muted);
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}
</style>
