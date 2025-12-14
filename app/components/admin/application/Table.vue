<script setup lang="ts">
import { View, Delete, Loading } from "@element-plus/icons-vue";
import type { IApplication } from "@/types/application";
import {
  APPLICATION_STATUS_MAP,
  APPLICATION_TYPE_MAP,
} from "@/types/application";
import type { IPagination } from "@/types";

defineProps<{
  applications: IApplication[];
  pagination: IPagination | null;
  loading: boolean;
  page: number;
  limit: number;
}>();

const emit = defineEmits<{
  "update:page": [value: number];
  "update:limit": [value: number];
  "row-click": [app: IApplication];
  delete: [app: IApplication];
}>();

const formatDateTime = (date: string | null) => {
  if (!date) return "—";
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

const truncateText = (text: string, maxLength: number = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
</script>

<template>
  <el-card class="applications-table-card">
    <div v-if="loading && !applications.length" class="loading-state">
      <el-icon class="loading-icon" :size="32"><Loading /></el-icon>
      <span>Загрузка данных...</span>
    </div>

    <el-table
      v-else
      :data="applications"
      stripe
      class="applications-table"
      @row-click="(row: IApplication) => $emit('row-click', row)"
    >
      <el-table-column prop="id" label="ID" width="70" />

      <el-table-column prop="type" label="Тип" width="130">
        <template #default="{ row }">
          <el-tag size="small" effect="plain">
            {{ APPLICATION_TYPE_MAP[row.type] || row.type }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="Имя" min-width="150">
        <template #default="{ row }">
          <span class="name-cell">{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="email" label="Email" min-width="180">
        <template #default="{ row }">
          <span class="email-cell">{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="phone" label="Телефон" width="150">
        <template #default="{ row }">
          <span class="phone-cell">{{ row.phone || "—" }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="message" label="Сообщение" min-width="200">
        <template #default="{ row }">
          <el-tooltip
            v-if="row.message.length > 50"
            :content="row.message"
            placement="top"
            :show-after="500"
          >
            <span class="message-cell">{{ truncateText(row.message) }}</span>
          </el-tooltip>
          <span v-else class="message-cell">{{ row.message }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="Статус" width="130" align="center">
        <template #default="{ row }">
          <el-tag
            :type="APPLICATION_STATUS_MAP[row.status]?.type || 'info'"
            size="small"
          >
            {{ APPLICATION_STATUS_MAP[row.status]?.label || row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="created_at" label="Создана" width="150">
        <template #default="{ row }">
          <span class="date-cell">{{ formatDateTime(row.created_at) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Действия" width="100" fixed="right">
        <template #default="{ row }">
          <div class="actions-cell" @click.stop>
            <el-button-group>
              <el-tooltip content="Просмотр" placement="top">
                <el-button :icon="View" text @click="$emit('row-click', row)" />
              </el-tooltip>
              <el-tooltip content="Удалить" placement="top">
                <el-button
                  :icon="Delete"
                  text
                  type="danger"
                  @click="$emit('delete', row)"
                />
              </el-tooltip>
            </el-button-group>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="!loading && !applications.length" class="empty-state">
      <el-empty description="Заявки не найдены" />
    </div>

    <div v-if="pagination && applications.length" class="table-pagination">
      <el-pagination
        :current-page="page"
        :page-size="limit"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next"
        background
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.applications-table-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.applications-table {
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
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  padding: 40px 20px;
}

.name-cell {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.email-cell {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.phone-cell {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.message-cell {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.4;
}

.date-cell {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.actions-cell {
  display: flex;
  align-items: center;
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}
</style>
