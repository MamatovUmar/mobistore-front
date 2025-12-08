<script setup lang="ts">
import {
  Message,
  Phone,
  ChatDotRound,
  Location,
  CircleCheck,
  CircleClose,
  Key,
  Lock,
  Unlock,
  Edit,
  Loading,
} from "@element-plus/icons-vue";
import type { IAdminUser } from "@/types/admin-user";

const props = defineProps<{
  modelValue: boolean;
  user: IAdminUser | null;
  loading?: boolean;
  actionLoading?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  edit: [user: IAdminUser];
  "generate-password": [user: IAdminUser];
  ban: [user: IAdminUser];
  unban: [user: IAdminUser];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

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

const getUserInitials = (user: IAdminUser) => {
  const first = user.first_name?.charAt(0) || "";
  const last = user.last_name?.charAt(0) || "";
  return (first + last).toUpperCase() || user.email.charAt(0).toUpperCase();
};

const getFullName = (user: IAdminUser) => {
  const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  return name || "Без имени";
};

const getLocation = (user: IAdminUser) => {
  const parts = [];
  if (user.region?.name_ru) parts.push(user.region.name_ru);
  if (user.city?.name_ru) parts.push(user.city.name_ru);
  return parts.join(", ") || "Не указано";
};
</script>

<template>
  <el-drawer
    v-model="visible"
    title="Информация о пользователе"
    direction="rtl"
    size="500px"
    class="user-drawer"
  >
    <template v-if="user">
      <div class="user-detail">
        <!-- Header -->
        <div class="detail-header">
          <el-avatar
            v-if="user.avatar"
            :src="user.avatar"
            :size="80"
            class="user-avatar"
          />
          <el-avatar v-else :size="80" class="user-avatar user-avatar--default">
            {{ getUserInitials(user) }}
          </el-avatar>

          <div class="header-info">
            <h2 class="user-name">{{ getFullName(user) }}</h2>
            <span class="user-id">#{{ user.id }}</span>
          </div>

          <div class="header-badges">
            <el-tag
              :type="user.is_ban ? 'danger' : 'success'"
              size="large"
            >
              {{ user.is_ban ? "Забанен" : "Активен" }}
            </el-tag>
            <el-tag
              :type="user.is_verified ? 'success' : 'info'"
              size="large"
              effect="light"
            >
              {{ user.is_verified ? "Верифицирован" : "Не верифицирован" }}
            </el-tag>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="detail-section">
          <h4 class="section-title">Контактная информация</h4>
          <div class="info-list">
            <div class="info-item">
              <el-icon class="info-icon"><Message /></el-icon>
              <div class="info-content">
                <span class="info-label">Email</span>
                <span class="info-value">{{ user.email }}</span>
              </div>
            </div>

            <div class="info-item">
              <el-icon class="info-icon"><Phone /></el-icon>
              <div class="info-content">
                <span class="info-label">Телефон</span>
                <span class="info-value">{{ user.phone_number || "Не указан" }}</span>
              </div>
            </div>

            <div class="info-item">
              <el-icon class="info-icon"><ChatDotRound /></el-icon>
              <div class="info-content">
                <span class="info-label">Telegram</span>
                <span class="info-value">{{ user.telegram || "Не указан" }}</span>
              </div>
            </div>

            <div class="info-item">
              <el-icon class="info-icon"><Location /></el-icon>
              <div class="info-content">
                <span class="info-label">Местоположение</span>
                <span class="info-value">{{ getLocation(user) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Info -->
        <div class="detail-section">
          <h4 class="section-title">Статус</h4>
          <div class="status-grid">
            <div class="status-item">
              <el-icon :class="['status-icon', user.is_verified ? 'status-icon--success' : 'status-icon--muted']">
                <CircleCheck v-if="user.is_verified" />
                <CircleClose v-else />
              </el-icon>
              <div class="status-content">
                <span class="status-label">Верификация</span>
                <span class="status-value">{{ user.is_verified ? "Подтверждён" : "Не подтверждён" }}</span>
              </div>
            </div>

            <div class="status-item">
              <el-icon :class="['status-icon', user.is_ban ? 'status-icon--danger' : 'status-icon--success']">
                <Lock v-if="user.is_ban" />
                <Unlock v-else />
              </el-icon>
              <div class="status-content">
                <span class="status-label">Доступ</span>
                <span class="status-value">{{ user.is_ban ? "Заблокирован" : "Разрешён" }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Dates -->
        <div class="detail-section">
          <h4 class="section-title">Даты</h4>
          <div class="dates-grid">
            <div class="date-item">
              <span class="date-label">Регистрация</span>
              <span class="date-value">{{ formatDate(user.created_at) }}</span>
            </div>
            <div class="date-item">
              <span class="date-label">Обновлено</span>
              <span class="date-value">{{ formatDate(user.updated_at) }}</span>
            </div>
            <div class="date-item date-item--full">
              <span class="date-label">Последний вход</span>
              <span class="date-value">{{ formatDateTime(user.last_entered_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="detail-actions">
          <el-button
            :icon="Edit"
            @click="$emit('edit', user)"
          >
            Редактировать
          </el-button>

          <el-button
            :icon="Key"
            type="warning"
            :loading="actionLoading"
            @click="$emit('generate-password', user)"
          >
            Сгенерировать пароль
          </el-button>

          <el-button
            v-if="!user.is_ban"
            :icon="Lock"
            type="danger"
            :loading="actionLoading"
            @click="$emit('ban', user)"
          >
            Забанить
          </el-button>

          <el-button
            v-else
            :icon="Unlock"
            type="success"
            :loading="actionLoading"
            @click="$emit('unban', user)"
          >
            Разбанить
          </el-button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="loading-state">
        <el-icon class="is-loading" :size="32"><Loading /></el-icon>
        <span>Загрузка...</span>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
.user-drawer {
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 20px 24px;
    border-bottom: 1px solid var(--color-border-light);
  }

  :deep(.el-drawer__body) {
    padding: 0;
    overflow-y: auto;
  }
}

.user-detail {
  padding: 24px;
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

// Header
.detail-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border-light);
}

.user-avatar {
  margin-bottom: 16px;

  &--default {
    background: var(--color-primary);
    color: white;
    font-weight: 600;
    font-size: 28px;
  }
}

.header-info {
  margin-bottom: 12px;
}

.user-name {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}

.user-id {
  font-size: 14px;
  color: var(--color-text-muted);
}

.header-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

// Sections
.detail-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

// Info List
.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: var(--color-bg-secondary);
  border-radius: 10px;
}

.info-icon {
  font-size: 18px;
  color: var(--color-primary);
  margin-top: 2px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.info-value {
  font-size: 14px;
  color: var(--color-text-primary);
  font-weight: 500;
}

// Status Grid
.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--color-bg-secondary);
  border-radius: 10px;
}

.status-icon {
  font-size: 24px;

  &--success {
    color: var(--el-color-success);
  }

  &--danger {
    color: var(--el-color-danger);
  }

  &--muted {
    color: var(--color-text-muted);
  }
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.status-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.status-value {
  font-size: 14px;
  color: var(--color-text-primary);
  font-weight: 500;
}

// Dates Grid
.dates-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.date-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  background: var(--color-bg-secondary);
  border-radius: 10px;

  &--full {
    grid-column: span 2;
  }
}

.date-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.date-value {
  font-size: 14px;
  color: var(--color-text-primary);
  font-weight: 500;
}

// Actions
.detail-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-light);

  .el-button {
    width: 100%;
    margin-left: 0;
  }
}
</style>
