<script setup lang="ts">
import { markRaw } from "vue";
import {
  User,
  Document,
  TrendCharts,
  View,
  Star,
  Refresh,
} from "@element-plus/icons-vue";
import type { IActivityItem } from "~/composables/useAdminAnalytics";

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

useSeoMeta({
  title: "Админ панель — MobiStore",
  robots: "noindex, nofollow",
});

const {
  dashboard,
  viewsReport,
  loading,
  fetchDashboard,
  fetchViewsReport,
} = useAdminAnalytics();

const load = async () => {
  await Promise.all([fetchDashboard(), fetchViewsReport(14)]);
};

await useAsyncData("admin-dashboard", async () => {
  await load();
  return true;
});

const formatNumber = (value?: number | null): string =>
  (value ?? 0).toLocaleString("ru-RU");

const formatChange = (value: number | null | undefined): string | null => {
  if (value === null || value === undefined) return null;
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}% за 30 дней`;
};

const stats = computed(() => {
  const data = dashboard.value;

  return [
    {
      title: "Пользователи",
      value: formatNumber(data?.users.total),
      change: formatChange(data?.users.growth_30d ?? null),
      trend: (data?.users.growth_30d ?? 0) >= 0 ? "up" : "down",
      hint: `+${formatNumber(data?.users.last_30d)} за месяц`,
      icon: markRaw(User),
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      title: "Объявления",
      value: formatNumber(data?.ads.total),
      change: formatChange(data?.ads.growth_30d ?? null),
      trend: (data?.ads.growth_30d ?? 0) >= 0 ? "up" : "down",
      hint: `${formatNumber(data?.ads.by_status?.active)} активных`,
      icon: markRaw(Document),
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      title: "Просмотры за 30 дней",
      value: formatNumber(data?.views.last_30d),
      change: formatChange(data?.views.growth_30d ?? null),
      trend: (data?.views.growth_30d ?? 0) >= 0 ? "up" : "down",
      hint: `${formatNumber(data?.views.unique_visitors_30d)} уникальных посетителей`,
      icon: markRaw(View),
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      title: "В избранном",
      value: formatNumber(data?.favorites.total),
      change: null,
      trend: "up",
      hint: `+${formatNumber(data?.favorites.last_30d)} за месяц`,
      icon: markRaw(Star),
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
  ];
});

/** Показатели «сегодня» — короткая строка под карточками */
const todayLine = computed(() => {
  const data = dashboard.value;
  if (!data) return [];

  return [
    { label: "Просмотров сегодня", value: formatNumber(data.views.today) },
    { label: "Новых объявлений", value: formatNumber(data.ads.today) },
    { label: "Регистраций", value: formatNumber(data.users.today) },
    {
      label: "Доля ботов (30 дн.)",
      value: `${data.views.bot_share_30d}%`,
    },
  ];
});

const chartSeries = computed(() => {
  const daily = viewsReport.value?.daily ?? [];
  return [
    {
      name: "Просмотры людьми",
      color: "#3b82f6",
      values: daily.map((point) => point.views),
      fill: true,
    },
    {
      name: "Обращения ботов",
      color: "#f59e0b",
      values: daily.map((point) => point.bots),
    },
  ];
});

const chartLabels = computed(() =>
  (viewsReport.value?.daily ?? []).map((point) => point.date)
);

const sourceItems = computed(() =>
  (viewsReport.value?.by_source ?? []).slice(0, 6).map((item) => ({
    label: item.label,
    value: item.views,
    hint: `${item.share}%`,
  }))
);

const statusItems = computed(() => {
  const byStatus = dashboard.value?.ads.by_status ?? {};
  const labels: Record<string, string> = {
    active: "Активные",
    moderation: "На модерации",
    draft: "Черновики",
    sold: "Проданные",
    archived: "В архиве",
    rejected: "Отклонённые",
  };

  return Object.entries(labels)
    .map(([key, label]) => ({ label, value: byStatus[key] ?? 0 }))
    .filter((item) => item.value > 0);
});

/** Предупреждение, пока новый трекинг собрал мало данных */
const trackingNotice = computed(() => {
  const tracking = dashboard.value?.tracking;
  if (!tracking || !tracking.first_event_at) {
    return "Чистый учёт просмотров ещё не собрал ни одного события. Цифры появятся после первых заходов на карточки.";
  }
  if (tracking.days_collected < 30) {
    return `Чистый учёт просмотров работает ${tracking.days_collected} дн. — данные за месяц ещё неполные. Счётчик на карточках (${formatNumber(tracking.ad_counter_total)}) включает исторический бот-трафик.`;
  }
  return null;
});

const activityText = (item: IActivityItem): string => {
  if (item.type === "user_registered") return "зарегистрировался";
  if (item.type === "ad_sold") return "продал объявление";
  return "создал объявление";
};

const formatRelativeTime = (value: string): string => {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diffMs / 60000);

  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин. назад`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ч. назад`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days} дн. назад`;

  return new Date(value).toLocaleDateString("ru-RU");
};

const refresh = async () => {
  await load();
  ElMessage.success("Данные обновлены");
};
</script>

<template>
  <div v-loading="loading" class="admin-dashboard">
    <el-alert
      v-if="trackingNotice"
      :title="trackingNotice"
      type="info"
      show-icon
      :closable="false"
      class="dashboard-notice"
    />

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
            v-if="stat.change"
            class="stat-change"
            :class="{
              'stat-change--up': stat.trend === 'up',
              'stat-change--down': stat.trend === 'down',
            }"
          >
            {{ stat.change }}
          </span>
          <span class="stat-hint">{{ stat.hint }}</span>
        </div>
      </div>
    </div>

    <div class="today-strip">
      <div v-for="item in todayLine" :key="item.label" class="today-item">
        <span class="today-value">{{ item.value }}</span>
        <span class="today-label">{{ item.label }}</span>
      </div>
      <el-button
        :icon="Refresh"
        text
        class="today-refresh"
        @click="refresh"
      >
        Обновить
      </el-button>
    </div>

    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">Просмотры объявлений за 14 дней</span>
          <NuxtLink to="/admin/analytics" class="card-link">
            Подробная аналитика
          </NuxtLink>
        </div>
      </template>

      <AdminAnalyticsLineChart
        :labels="chartLabels"
        :series="chartSeries"
        unit="просм."
      />
    </el-card>

    <div class="dashboard-content">
      <el-card class="activity-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">Последняя активность</span>
            <NuxtLink to="/admin/logs" class="card-link">Все логи</NuxtLink>
          </div>
        </template>

        <div class="activity-list">
          <p v-if="!dashboard?.activity?.length" class="activity-empty">
            Пока нет событий
          </p>

          <div
            v-for="(item, index) in dashboard?.activity ?? []"
            :key="`${item.type}-${item.ad_id ?? item.user_id}-${index}`"
            class="activity-item"
          >
            <el-avatar :size="40" class="activity-avatar">
              {{ item.user_name.charAt(0) }}
            </el-avatar>
            <div class="activity-content">
              <p class="activity-text">
                <strong>{{ item.user_name }}</strong>
                {{ activityText(item) }}
                <NuxtLink
                  v-if="item.ad_alias"
                  :to="`/${item.ad_alias}`"
                  target="_blank"
                  class="activity-target"
                >
                  {{ item.ad_title }}
                </NuxtLink>
              </p>
              <span class="activity-time">
                {{ formatRelativeTime(item.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </el-card>

      <div class="side-column">
        <el-card class="side-card">
          <template #header>
            <span class="card-title">Откуда приходят просмотры</span>
          </template>
          <AdminAnalyticsBarList
            :items="sourceItems"
            color="#3b82f6"
            empty-text="Данных пока нет"
          />
        </el-card>

        <el-card class="side-card">
          <template #header>
            <span class="card-title">Объявления по статусам</span>
          </template>
          <AdminAnalyticsBarList :items="statusItems" color="#10b981" />
        </el-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-dashboard {
  max-width: 1400px;
}

.dashboard-notice {
  margin-bottom: 20px;
  border-radius: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 16px;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
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
  min-width: 0;
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

.stat-hint {
  font-size: 12px;
  color: var(--color-text-muted);
}

.today-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 28px;
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.today-item {
  display: flex;
  flex-direction: column;
}

.today-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.today-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.today-refresh {
  margin-left: auto;
}

.chart-card,
.activity-card,
.side-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.chart-card {
  margin-bottom: 24px;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;

  @media (max-width: 1023px) {
    grid-template-columns: 1fr;
  }
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.card-link {
  font-size: 13px;
  color: var(--color-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-empty {
  margin: 0;
  padding: 24px 0;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 14px;
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
  min-width: 0;
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
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.activity-time {
  font-size: 12px;
  color: var(--color-text-muted);
}

@media (max-width: 767px) {
  .stat-card {
    padding: 16px;
  }

  .stat-value {
    font-size: 20px;
  }

  .activity-item {
    gap: 10px;
  }
}
</style>
