<script setup lang="ts">
import {
  Message,
  Phone,
  ChatDotRound,
  Location,
  Edit,
  Switch,
  Loading,
} from "@element-plus/icons-vue";
import type { IStaffMember, UserRole } from "@/types/admin-staff";

const props = defineProps<{
  modelValue: boolean;
  staff: IStaffMember | null;
  loading?: boolean;
  actionLoading?: boolean;
  currentUserId?: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  edit: [staff: IStaffMember];
  "change-role": [staff: IStaffMember, role: UserRole];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const showRoleDialog = ref(false);
const selectedRole = ref<UserRole>("moderator");

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Администратор" },
  { value: "moderator", label: "Модератор" },
  { value: "user", label: "Пользователь (снять права)" },
];

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

const getStaffInitials = (member: IStaffMember) => {
  const first = member.first_name?.charAt(0) || "";
  const last = member.last_name?.charAt(0) || "";
  return (first + last).toUpperCase() || member.email.charAt(0).toUpperCase();
};

const getFullName = (member: IStaffMember) => {
  const name = `${member.first_name || ""} ${member.last_name || ""}`.trim();
  return name || "Без имени";
};

const getLocation = (member: IStaffMember) => {
  const parts = [];
  if (member.region?.name_ru) parts.push(member.region.name_ru);
  if (member.city?.name_ru) parts.push(member.city.name_ru);
  return parts.join(", ") || "Не указано";
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

const isCurrentUser = computed(() => {
  return props.staff?.id === props.currentUserId;
});

const openRoleDialog = () => {
  if (props.staff) {
    selectedRole.value = props.staff.role;
    showRoleDialog.value = true;
  }
};

const confirmRoleChange = () => {
  if (props.staff && selectedRole.value !== props.staff.role) {
    emit("change-role", props.staff, selectedRole.value);
  }
  showRoleDialog.value = false;
};
</script>

<template>
  <el-drawer
    v-model="visible"
    title="Информация о сотруднике"
    direction="rtl"
    size="500px"
    class="staff-drawer"
  >
    <template v-if="staff">
      <div class="staff-detail">
        <!-- Header -->
        <div class="detail-header">
          <el-avatar
            v-if="staff.avatar"
            :src="staff.avatar"
            :size="80"
            class="staff-avatar"
          />
          <el-avatar v-else :size="80" class="staff-avatar staff-avatar--default">
            {{ getStaffInitials(staff) }}
          </el-avatar>

          <div class="header-info">
            <h2 class="staff-name">{{ getFullName(staff) }}</h2>
            <span class="staff-id">#{{ staff.id }}</span>
          </div>

          <div class="header-badges">
            <el-tag :type="getRoleType(staff.role)" size="large">
              {{ getRoleLabel(staff.role) }}
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
                <span class="info-value">{{ staff.email }}</span>
              </div>
            </div>

            <div class="info-item">
              <el-icon class="info-icon"><Phone /></el-icon>
              <div class="info-content">
                <span class="info-label">Телефон</span>
                <span class="info-value">{{ staff.phone_number || "Не указан" }}</span>
              </div>
            </div>

            <div class="info-item">
              <el-icon class="info-icon"><ChatDotRound /></el-icon>
              <div class="info-content">
                <span class="info-label">Telegram</span>
                <span class="info-value">{{ staff.telegram || "Не указан" }}</span>
              </div>
            </div>

            <div class="info-item">
              <el-icon class="info-icon"><Location /></el-icon>
              <div class="info-content">
                <span class="info-label">Местоположение</span>
                <span class="info-value">{{ getLocation(staff) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Dates -->
        <div class="detail-section">
          <h4 class="section-title">Даты</h4>
          <div class="dates-grid">
            <div class="date-item">
              <span class="date-label">Добавлен</span>
              <span class="date-value">{{ formatDate(staff.created_at) }}</span>
            </div>
            <div class="date-item">
              <span class="date-label">Обновлено</span>
              <span class="date-value">{{ formatDate(staff.updated_at) }}</span>
            </div>
            <div class="date-item date-item--full">
              <span class="date-label">Последний вход</span>
              <span class="date-value">{{ formatDateTime(staff.last_entered_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="detail-actions">
          <el-button
            :icon="Edit"
            @click="$emit('edit', staff)"
          >
            Редактировать
          </el-button>

          <el-button
            :icon="Switch"
            type="warning"
            :disabled="isCurrentUser"
            :loading="actionLoading"
            @click="openRoleDialog"
          >
            Изменить роль
          </el-button>

          <p v-if="isCurrentUser" class="self-warning">
            Вы не можете изменить свою роль
          </p>
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

  <!-- Role Change Dialog -->
  <el-dialog
    v-model="showRoleDialog"
    title="Изменение роли"
    width="400px"
    :close-on-click-modal="false"
  >
    <div class="role-dialog-content">
      <p class="role-dialog-text">
        Выберите новую роль для сотрудника <strong>{{ staff?.email }}</strong>
      </p>
      <el-select v-model="selectedRole" placeholder="Выберите роль" class="role-select">
        <el-option
          v-for="option in roleOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <p v-if="selectedRole === 'user'" class="role-warning">
        При выборе роли "Пользователь" сотрудник потеряет доступ к админ-панели
      </p>
    </div>
    <template #footer>
      <el-button @click="showRoleDialog = false">Отмена</el-button>
      <el-button
        type="primary"
        :loading="actionLoading"
        :disabled="selectedRole === staff?.role"
        @click="confirmRoleChange"
      >
        Сохранить
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.staff-drawer {
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

.staff-detail {
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

.staff-avatar {
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

.staff-name {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}

.staff-id {
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

.self-warning {
  font-size: 12px;
  color: var(--color-text-muted);
  text-align: center;
  margin: 0;
}

// Role Dialog
.role-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.role-dialog-text {
  font-size: 14px;
  color: var(--color-text-primary);
  margin: 0;
}

.role-select {
  width: 100%;
}

.role-warning {
  font-size: 13px;
  color: var(--el-color-warning);
  margin: 0;
  padding: 12px;
  background: var(--el-color-warning-light-9);
  border-radius: 8px;
}
</style>
