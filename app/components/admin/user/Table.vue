<script setup lang="ts">
import {
  View,
  Edit,
  Loading,
  CircleCheck,
  CircleClose,
} from "@element-plus/icons-vue";
import type { IAdminUser } from "@/types/admin-user";
import type { IPagination } from "@/types";

defineProps<{
  users: IAdminUser[];
  pagination: IPagination | null;
  loading: boolean;
  page: number;
  limit: number;
}>();

const emit = defineEmits<{
  "update:page": [value: number];
  "update:limit": [value: number];
  "row-click": [user: IAdminUser];
  edit: [user: IAdminUser];
}>();

const formatDate = (date: string | null) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

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

const getUserInitials = (user: IAdminUser) => {
  const first = user.first_name?.charAt(0) || "";
  const last = user.last_name?.charAt(0) || "";
  return (first + last).toUpperCase() || user.email.charAt(0).toUpperCase();
};
</script>

<template>
  <el-card class="users-table-card">
    <div v-if="loading && !users.length" class="loading-state">
      <el-icon class="loading-icon" :size="32"><Loading /></el-icon>
      <span>Загрузка данных...</span>
    </div>

    <el-table
      v-else
      :data="users"
      stripe
      class="users-table"
      @row-click="(row: IAdminUser) => $emit('row-click', row)"
    >
      <el-table-column prop="id" label="ID" width="70" />

      <el-table-column prop="name" label="Пользователь" min-width="220">
        <template #default="{ row }">
          <div class="user-cell">
            <el-avatar
              v-if="row.avatar"
              :src="row.avatar"
              :size="40"
              class="user-avatar"
            />
            <el-avatar v-else :size="40" class="user-avatar user-avatar--default">
              {{ getUserInitials(row) }}
            </el-avatar>
            <div class="user-info">
              <span class="user-name">
                {{ row.first_name }} {{ row.last_name }}
              </span>
              <span class="user-email">{{ row.email }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="phone_number" label="Телефон" width="150">
        <template #default="{ row }">
          <span class="phone-cell">{{ row.phone_number || "—" }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="is_verified" label="Верификация" width="120" align="center">
        <template #default="{ row }">
          <el-tag
            :type="row.is_verified ? 'success' : 'info'"
            size="small"
            effect="light"
          >
            <el-icon class="tag-icon">
              <CircleCheck v-if="row.is_verified" />
              <CircleClose v-else />
            </el-icon>
            {{ row.is_verified ? "Да" : "Нет" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="is_ban" label="Статус" width="130">
        <template #default="{ row }">
          <el-tag
            :type="row.is_ban ? 'danger' : 'success'"
            size="small"
          >
            {{ row.is_ban ? "Забанен" : "Активен" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="last_entered_at" label="Последний вход" width="160">
        <template #default="{ row }">
          <span class="date-cell">{{ formatDateTime(row.last_entered_at) }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="created_at" label="Регистрация" width="120">
        <template #default="{ row }">
          <span class="date-cell">{{ formatDate(row.created_at) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Действия" width="120" fixed="right">
        <template #default="{ row }">
          <div class="actions-cell" @click.stop>
            <el-button-group>
              <el-tooltip content="Просмотр" placement="top">
                <el-button :icon="View" text @click="$emit('row-click', row)" />
              </el-tooltip>
              <el-tooltip content="Редактировать" placement="top">
                <el-button :icon="Edit" text @click="$emit('edit', row)" />
              </el-tooltip>
            </el-button-group>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="!loading && !users.length" class="empty-state">
      <el-empty description="Пользователи не найдены" />
    </div>

    <div v-if="pagination && users.length" class="table-pagination">
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
.users-table-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.users-table {
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

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  flex-shrink: 0;

  &--default {
    background: var(--color-primary);
    color: white;
    font-weight: 600;
    font-size: 14px;
  }
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 12px;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.phone-cell {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.tag-icon {
  margin-right: 4px;
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
