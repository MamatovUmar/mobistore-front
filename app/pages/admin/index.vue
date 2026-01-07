<script setup lang="ts">
import { markRaw } from "vue";
import { User, Document, TrendCharts, View } from "@element-plus/icons-vue";

definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "Админ панель — MobiStore",
  robots: "noindex, nofollow",
});

const stats = ref([
  {
    title: "Пользователи",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: markRaw(User),
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.1)",
  },
  {
    title: "Объявления",
    value: "5,678",
    change: "+8%",
    trend: "up",
    icon: markRaw(Document),
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.1)",
  },
  {
    title: "Просмотры",
    value: "45.2K",
    change: "+24%",
    trend: "up",
    icon: markRaw(View),
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.1)",
  },
  {
    title: "Активность",
    value: "89%",
    change: "-2%",
    trend: "down",
    icon: markRaw(TrendCharts),
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.1)",
  },
]);

const recentActivity = ref([
  {
    id: 1,
    user: "Иван Петров",
    action: "создал объявление",
    target: "iPhone 15 Pro Max",
    time: "5 минут назад",
  },
  {
    id: 2,
    user: "Мария Сидорова",
    action: "зарегистрировался",
    target: "",
    time: "12 минут назад",
  },
  {
    id: 3,
    user: "Алексей Козлов",
    action: "обновил объявление",
    target: "Samsung Galaxy S24",
    time: "25 минут назад",
  },
  {
    id: 4,
    user: "Елена Новикова",
    action: "удалил объявление",
    target: "Xiaomi 14",
    time: "1 час назад",
  },
  {
    id: 5,
    user: "Дмитрий Волков",
    action: "создал объявление",
    target: "Google Pixel 8",
    time: "2 часа назад",
  },
]);
</script>

<template>
  <div class="admin-dashboard">
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.title" class="stat-card">
        <div class="stat-icon" :style="{ background: stat.bgColor }">
          <el-icon :size="24" :style="{ color: stat.color }">
            <component :is="stat.icon" />
          </el-icon>
        </div>
        <div class="stat-content">
          <span class="stat-title">{{ stat.title }}</span>
          <span class="stat-value">{{ stat.value }}</span>
          <span
            class="stat-change"
            :class="{
              'stat-change--up': stat.trend === 'up',
              'stat-change--down': stat.trend === 'down',
            }"
          >
            {{ stat.change }} за месяц
          </span>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <el-card class="activity-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">Последняя активность</span>
            <el-button text type="primary">Все логи</el-button>
          </div>
        </template>

        <div class="activity-list">
          <div
            v-for="item in recentActivity"
            :key="item.id"
            class="activity-item"
          >
            <el-avatar :size="40" class="activity-avatar">
              {{ item.user.charAt(0) }}
            </el-avatar>
            <div class="activity-content">
              <p class="activity-text">
                <strong>{{ item.user }}</strong>
                {{ item.action }}
                <span v-if="item.target" class="activity-target">{{
                  item.target
                }}</span>
              </p>
              <span class="activity-time">{{ item.time }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="quick-actions-card">
        <template #header>
          <span class="card-title">Быстрые действия</span>
        </template>

        <div class="quick-actions">
          <el-button type="primary" size="large" class="action-btn">
            <el-icon><User /></el-icon>
            Добавить пользователя
          </el-button>
          <el-button size="large" class="action-btn">
            <el-icon><Document /></el-icon>
            Модерация объявлений
          </el-button>
          <el-button size="large" class="action-btn">
            <el-icon><TrendCharts /></el-icon>
            Просмотр отчётов
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-dashboard {
  max-width: 1400px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 1200px) {
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
  align-items: flex-start;
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
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-title {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.stat-change {
  font-size: 13px;

  &--up {
    color: var(--color-success);
  }

  &--down {
    color: var(--color-danger);
  }
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.activity-card,
.quick-actions-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.activity-avatar {
  background: var(--color-primary);
  color: white;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 4px;
  font-size: 14px;
  color: var(--color-text-primary);
  line-height: 1.4;

  strong {
    font-weight: 600;
  }
}

.activity-target {
  color: var(--color-primary);
  font-weight: 500;
}

.activity-time {
  font-size: 12px;
  color: var(--color-text-muted);
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  button {
    margin-left: 0;
  }
}

.action-btn {
  justify-content: flex-start;
  height: 48px;
  font-weight: 500;
  margin-left: 0;

  .el-icon {
    margin-right: 8px;
  }
}
</style>
