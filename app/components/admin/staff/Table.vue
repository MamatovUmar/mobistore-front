<script setup lang="ts">
import {
  View,
  Edit,
  Loading,
} from "@element-plus/icons-vue";
import type { IStaffMember } from "@/types/admin-staff";
import type { IPagination } from "@/types";

defineProps<{
  staff: IStaffMember[];
  pagination: IPagination | null;
  loading: boolean;
  page: number;
  limit: number;
}>();

const emit = defineEmits<{
  "update:page": [value: number];
  "update:limit": [value: number];
  "row-click": [staff: IStaffMember];
  edit: [staff: IStaffMember];
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

const getStaffInitials = (member: IStaffMember) => {
  const first = member.first_name?.charAt(0) || "";
  const last = member.last_name?.charAt(0) || "";
  return (first + last).toUpperCase() || member.email.charAt(0).toUpperCase();
};

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    admin: "Администратор",
    moderator: "Модератор",
  };
  return labels[role] || role;
};

const getRoleType = (role: string) => {
  const types: Record<string, "danger" | "warning"> = {
    admin: "danger",
    moderator: "warning",
  };
  return types[role] || "info";
};
</script>

<template>
  <el-card class="staff-table-card">
    <div v-if="loading && !staff.length" class="loading-state">
      <el-icon class="loading-icon" :size="32"><Loading /></el-icon>
      <span>Загрузка данных...</span>
    </div>

    <el-table
      v-else
      :data="staff"
      stripe
      class="staff-table"
      @row-click="(row: IStaffMember) => $emit('row-click', row)"
    >
      <el-table-column prop="id" label="ID" width="70" />

      <el-table-column prop="name" label="Сотрудник" min-width="220">
        <template #default="{ row }">
          <div class="staff-cell">
            <el-avatar
              v-if="row.avatar"
              :src="row.avatar"
              :size="40"
              class="staff-avatar"
            />
            <el-avatar v-else :size="40" class="staff-avatar staff-avatar--default">
              {{ getStaffInitials(row) }}
            </el-avatar>
            <div class="staff-info">
              <span class="staff-name">
                {{ row.first_name }} {{ row.last_name }}
              </span>
              <span class="staff-email">{{ row.email }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="role" label="Роль" width="150">
        <template #default="{ row }">
          <el-tag :type="getRoleType(row.role)" size="default">
            {{ getRoleLabel(row.role) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="phone_number" label="Телефон" width="150">
        <template #default="{ row }">
          <span class="phone-cell">{{ row.phone_number || "—" }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="last_entered_at" label="Последний вход" width="160">
        <template #default="{ row }">
          <span class="date-cell">{{ formatDateTime(row.last_entered_at) }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="created_at" label="Добавлен" width="120">
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

    <div v-if="!loading && !staff.length" class="empty-state">
      <el-empty description="Сотрудники не найдены" />
    </div>

    <div v-if="pagination && staff.length" class="table-pagination">
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
.staff-table-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.staff-table {
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

.staff-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.staff-avatar {
  flex-shrink: 0;

  &--default {
    background: var(--color-primary);
    color: white;
    font-weight: 600;
    font-size: 14px;
  }
}

.staff-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.staff-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.staff-email {
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
