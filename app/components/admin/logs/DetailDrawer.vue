<script setup lang="ts">
import type { ILog, LogType, LogStatus } from "~/composables/useLogs";

const props = defineProps<{
  modelValue: boolean;
  log: ILog | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "status-change": [status: LogStatus];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const statusOptions: { value: LogStatus; label: string }[] = [
  { value: "pending", label: "Ожидает" },
  { value: "reviewed", label: "Просмотрен" },
  { value: "resolved", label: "Решён" },
  { value: "ignored", label: "Игнорирован" },
];

type TagType = "primary" | "success" | "warning" | "info" | "danger";

const getTypeColor = (type: LogType): TagType => {
  const colors: Record<LogType, TagType> = {
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

const getStatusColor = (status: LogStatus): TagType => {
  const colors: Record<LogStatus, TagType> = {
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

const getMethodColor = (method: string | null): TagType => {
  if (!method) return "info";
  const colors: Record<string, TagType> = {
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
</script>

<template>
  <el-drawer
    v-model="visible"
    title="Детали лога"
    direction="rtl"
    size="550px"
    class="log-drawer"
  >
    <template v-if="log">
      <div class="log-detail">
        <!-- Header info -->
        <div class="detail-header">
          <div class="detail-badges">
            <el-tag :type="getTypeColor(log.type)" size="large">
              {{ getTypeLabel(log.type) }}
            </el-tag>
            <el-tag :type="getStatusColor(log.status)" size="large">
              {{ getStatusLabel(log.status) }}
            </el-tag>
            <el-tag v-if="log.status_code" :type="log.status_code >= 400 ? 'danger' : 'success'" size="large">
              {{ log.status_code }}
            </el-tag>
          </div>
          <span class="detail-id">#{{ log.id }}</span>
        </div>

        <!-- Message -->
        <div class="detail-section">
          <h4 class="detail-title">Сообщение</h4>
          <div class="detail-message">{{ log.message }}</div>
        </div>

        <!-- Request info -->
        <div v-if="log.method || log.path" class="detail-section">
          <h4 class="detail-title">Запрос</h4>
          <div class="detail-request">
            <el-tag v-if="log.method" :type="getMethodColor(log.method)" size="small">
              {{ log.method }}
            </el-tag>
            <code v-if="log.path">{{ log.path }}</code>
          </div>
        </div>

        <!-- Meta info -->
        <div class="detail-section">
          <h4 class="detail-title">Информация</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">IP адрес</span>
              <span class="detail-value">{{ log.ip || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">ID пользователя</span>
              <span class="detail-value">{{ log.user_id || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Создан</span>
              <span class="detail-value">{{ formatDate(log.created_at) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Просмотрен</span>
              <span class="detail-value">
                {{ log.reviewed_at ? formatDate(log.reviewed_at) : '—' }}
              </span>
            </div>
          </div>
        </div>

        <!-- User Agent -->
        <div v-if="log.user_agent" class="detail-section">
          <h4 class="detail-title">User Agent</h4>
          <code class="detail-code">{{ log.user_agent }}</code>
        </div>

        <!-- Stack trace -->
        <div v-if="log.stack" class="detail-section">
          <h4 class="detail-title">Stack Trace</h4>
          <pre class="detail-stack">{{ log.stack }}</pre>
        </div>

        <!-- Headers -->
        <div v-if="log.headers && Object.keys(log.headers).length" class="detail-section">
          <h4 class="detail-title">Заголовки</h4>
          <pre class="detail-json">{{ JSON.stringify(log.headers, null, 2) }}</pre>
        </div>

        <!-- Request Body -->
        <div v-if="log.request_body && Object.keys(log.request_body).length" class="detail-section">
          <h4 class="detail-title">Тело запроса</h4>
          <pre class="detail-json">{{ JSON.stringify(log.request_body, null, 2) }}</pre>
        </div>

        <!-- Metadata -->
        <div v-if="log.metadata && Object.keys(log.metadata).length" class="detail-section">
          <h4 class="detail-title">Метаданные</h4>
          <pre class="detail-json">{{ JSON.stringify(log.metadata, null, 2) }}</pre>
        </div>

        <!-- Notes -->
        <div v-if="log.notes" class="detail-section">
          <h4 class="detail-title">Заметки</h4>
          <div class="detail-notes">{{ log.notes }}</div>
        </div>

        <!-- Status change -->
        <div class="detail-section">
          <h4 class="detail-title">Изменить статус</h4>
          <div class="status-buttons">
            <el-button
              v-for="option in statusOptions"
              :key="option.value"
              :type="log.status === option.value ? 'primary' : 'default'"
              :disabled="log.status === option.value"
              size="small"
              @click="$emit('status-change', option.value)"
            >
              {{ option.label }}
            </el-button>
          </div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
.log-drawer {
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 20px 24px;
    border-bottom: 1px solid var(--color-border-light);
  }

  :deep(.el-drawer__body) {
    padding: 0;
  }
}

.log-detail {
  padding: 24px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.detail-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-id {
  font-size: 14px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.detail-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.detail-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-message {
  font-size: 15px;
  color: var(--color-text-primary);
  line-height: 1.5;
  background: var(--color-bg-secondary);
  padding: 12px 16px;
  border-radius: 8px;
}

.detail-request {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-bg-secondary);
  padding: 12px 16px;
  border-radius: 8px;

  code {
    font-family: "SF Mono", Monaco, Consolas, monospace;
    font-size: 13px;
    color: var(--color-text-primary);
    word-break: break-all;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--color-bg-secondary);
  padding: 12px;
  border-radius: 8px;
}

.detail-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.detail-value {
  font-size: 14px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.detail-code {
  display: block;
  font-family: "SF Mono", Monaco, Consolas, monospace;
  font-size: 12px;
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  padding: 12px 16px;
  border-radius: 8px;
  word-break: break-all;
}

.detail-stack {
  font-family: "SF Mono", Monaco, Consolas, monospace;
  font-size: 11px;
  line-height: 1.5;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
}

.detail-json {
  font-family: "SF Mono", Monaco, Consolas, monospace;
  font-size: 11px;
  line-height: 1.5;
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  max-height: 250px;
  overflow-y: auto;
}

.detail-notes {
  font-size: 14px;
  color: var(--color-text-primary);
  line-height: 1.5;
  background: rgba(59, 130, 246, 0.05);
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 3px solid var(--color-primary);
}

.status-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
