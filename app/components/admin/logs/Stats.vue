<script setup lang="ts">
import { View, Warning, CircleCheck, Clock } from "@element-plus/icons-vue";
import type { ILogStats } from "~/composables/useLogs";

defineProps<{
  stats: ILogStats | null;
}>();
</script>

<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon">
        <el-icon :size="24"><View /></el-icon>
      </div>
      <div class="stat-content">
        <span class="stat-value">{{ stats?.total ?? 0 }}</span>
        <span class="stat-label">Всего логов</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon--error">
        <el-icon :size="24"><Warning /></el-icon>
      </div>
      <div class="stat-content">
        <span class="stat-value">{{ stats?.by_type?.error ?? 0 }}</span>
        <span class="stat-label">Ошибок</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon--pending">
        <el-icon :size="24"><Clock /></el-icon>
      </div>
      <div class="stat-content">
        <span class="stat-value">{{ stats?.by_status?.pending ?? 0 }}</span>
        <span class="stat-label">Ожидает</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon--today">
        <el-icon :size="24"><CircleCheck /></el-icon>
      </div>
      <div class="stat-content">
        <span class="stat-value">{{ stats?.today ?? 0 }}</span>
        <span class="stat-label">Сегодня</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;

  &--error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  &--pending {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
  }

  &--today {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
  }
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-secondary);
}
</style>
