<script setup lang="ts">
import {
  Document,
  CircleCheck,
  Clock,
  Warning,
  SuccessFilled,
  Box,
} from "@element-plus/icons-vue";
import type { IAdminAdsStats } from "@/composables/useAdminAds";

defineProps<{
  stats: IAdminAdsStats | null;
}>();
</script>

<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon">
        <el-icon :size="24"><Document /></el-icon>
      </div>
      <div class="stat-content">
        <span class="stat-value">{{ stats?.total ?? 0 }}</span>
        <span class="stat-label">Всего объявлений</span>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon stat-icon--success">
        <el-icon :size="24"><CircleCheck /></el-icon>
      </div>
      <div class="stat-content">
        <span class="stat-value">{{ stats?.byStatus?.active ?? 0 }}</span>
        <span class="stat-label">Активных</span>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon stat-icon--warning">
        <el-icon :size="24"><Clock /></el-icon>
      </div>
      <div class="stat-content">
        <span class="stat-value">{{ stats?.byStatus?.moderation ?? 0 }}</span>
        <span class="stat-label">На модерации</span>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon stat-icon--danger">
        <el-icon :size="24"><Warning /></el-icon>
      </div>
      <div class="stat-content">
        <span class="stat-value">{{ stats?.byStatus?.rejected ?? 0 }}</span>
        <span class="stat-label">Отклонено</span>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon stat-icon--info">
        <el-icon :size="24"><Box /></el-icon>
      </div>
      <div class="stat-content">
        <span class="stat-value">{{ stats?.byStatus?.archived ?? 0 }}</span>
        <span class="stat-label">В архиве</span>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon stat-icon--today">
        <el-icon :size="24"><SuccessFilled /></el-icon>
      </div>
      <div class="stat-content">
        <span class="stat-value">{{ stats?.todayPublished ?? 0 }}</span>
        <span class="stat-label">Опубликовано сегодня</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
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
  flex-shrink: 0;

  &--success {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
  }

  &--warning {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
  }

  &--danger {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  &--info {
    background: rgba(107, 114, 128, 0.1);
    color: #6b7280;
  }

  &--today {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
