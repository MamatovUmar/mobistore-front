<script setup lang="ts">
import { Close, Document, Monitor, Iphone } from "@element-plus/icons-vue";
import type { IApplication, ApplicationStatus } from "@/types/application";
import {
  APPLICATION_STATUS_MAP,
  APPLICATION_TYPE_MAP,
} from "@/types/application";

const props = defineProps<{
  modelValue: boolean;
  application: IApplication | null;
  actionLoading?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "status-change": [app: IApplication, status: ApplicationStatus];
  delete: [app: IApplication];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

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

const statusOptions: { label: string; value: ApplicationStatus }[] = [
  { label: "Новая", value: "new" },
  { label: "В работе", value: "in_progress" },
  { label: "Выполнена", value: "done" },
  { label: "Отклонена", value: "rejected" },
];

const getDeviceIcon = (deviceType: string) => {
  switch (deviceType) {
    case "mobile":
      return Iphone;
    case "tablet":
      return Iphone;
    default:
      return Monitor;
  }
};
</script>

<template>
  <el-drawer
    v-model="visible"
    size="500px"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
  >
    <template #header>
      <div class="drawer-header">
        <h3 class="drawer-title">Заявка #{{ application?.id }}</h3>
        <el-button :icon="Close" text circle @click="visible = false" />
      </div>
    </template>

    <div v-if="application" class="drawer-content">
      <!-- Status & Type -->
      <div class="info-section">
        <div class="status-row">
          <el-tag
            :type="APPLICATION_STATUS_MAP[application.status]?.type || 'info'"
            size="large"
          >
            {{
              APPLICATION_STATUS_MAP[application.status]?.label ||
              application.status
            }}
          </el-tag>
          <el-tag size="large" effect="plain">
            {{ APPLICATION_TYPE_MAP[application.type] || application.type }}
          </el-tag>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="info-section">
        <h4 class="section-title">Контактные данные</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Имя</span>
            <span class="info-value">{{ application.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email</span>
            <a
              :href="`mailto:${application.email}`"
              class="info-value info-link"
            >
              {{ application.email }}
            </a>
          </div>
          <div v-if="application.phone" class="info-item">
            <span class="info-label">Телефон</span>
            <a :href="`tel:${application.phone}`" class="info-value info-link">
              {{ application.phone }}
            </a>
          </div>
        </div>
      </div>

      <!-- Message -->
      <div class="info-section">
        <h4 class="section-title">Сообщение</h4>
        <div class="message-box">
          {{ application.message }}
        </div>
      </div>

      <!-- File -->
      <div v-if="application.file_url" class="info-section">
        <h4 class="section-title">Прикреплённый файл</h4>
        <a :href="application.file_url" target="_blank" class="file-link">
          <el-icon><Document /></el-icon>
          <span>Скачать файл</span>
        </a>
      </div>

      <!-- Technical Info -->
      <div class="info-section">
        <h4 class="section-title">Техническая информация</h4>
        <div class="tech-info">
          <div class="tech-item">
            <el-icon :size="16"
              ><component :is="getDeviceIcon(application.device_type)"
            /></el-icon>
            <span
              >{{ application.browser }} / {{ application.device_type }}</span
            >
          </div>
          <div class="tech-item small">
            <span class="tech-label">IP:</span>
            <span>{{ application.ip }}</span>
          </div>
          <div class="tech-item small">
            <span class="tech-label">User Agent:</span>
            <span class="ua-text">{{ application.user_agent }}</span>
          </div>
        </div>
      </div>

      <!-- Dates -->
      <div class="info-section">
        <h4 class="section-title">Даты</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Создана</span>
            <span class="info-value">{{
              formatDateTime(application.created_at)
            }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Обновлена</span>
            <span class="info-value">{{
              formatDateTime(application.updated_at)
            }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions-section">
        <h4 class="section-title">Изменить статус</h4>
        <div class="status-buttons">
          <el-button
            v-for="status in statusOptions"
            :key="status.value"
            :type="application.status === status.value ? 'primary' : 'default'"
            :disabled="actionLoading"
            size="small"
            @click="$emit('status-change', application, status.value)"
          >
            {{ status.label }}
          </el-button>
        </div>
      </div>

      <div class="danger-section">
        <el-button
          type="danger"
          :loading="actionLoading"
          @click="$emit('delete', application)"
        >
          Удалить заявку
        </el-button>
      </div>
    </div>

    <div v-else class="drawer-empty">
      <el-empty description="Заявка не найдена" />
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.drawer-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
}

.drawer-content {
  padding: 0 4px;
}

.info-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px 0;
}

.status-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.info-grid {
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
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

.info-link {
  color: var(--color-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.message-box {
  background: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-primary);
  white-space: pre-wrap;
  word-break: break-word;
}

.file-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  color: var(--color-primary);
  text-decoration: none;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: var(--el-fill-color);
  }
}

.tech-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);

  &.small {
    font-size: 12px;
  }
}

.tech-label {
  font-weight: 500;
  min-width: 80px;
}

.ua-text {
  word-break: break-all;
  line-height: 1.4;
}

.actions-section {
  margin-bottom: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-light);
}

.status-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.danger-section {
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-light);
}

.drawer-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
</style>
