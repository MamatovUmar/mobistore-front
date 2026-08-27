<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

useSeoMeta({
  title: "Аналитика просмотров — MobiStore",
  robots: "noindex, nofollow",
});

const { viewsReport, loading, fetchViewsReport } = useAdminAnalytics();

const period = ref(30);
const periodOptions = [
  { label: "7 дней", value: 7 },
  { label: "30 дней", value: 30 },
  { label: "90 дней", value: 90 },
  { label: "Год", value: 365 },
];

await useAsyncData("admin-views-report", () => fetchViewsReport(period.value));

watch(period, (days) => {
  fetchViewsReport(days);
});

const formatNumber = (value?: number | null): string =>
  (value ?? 0).toLocaleString("ru-RU");

const totals = computed(() => viewsReport.value?.totals);

/** Карточки-итоги вверху страницы */
const summary = computed(() => {
  const data = totals.value;
  if (!data) return [];

  return [
    {
      title: "Просмотры людьми",
      value: formatNumber(data.counted),
      hint: "засчитано в счётчик объявлений",
      accent: "#3b82f6",
    },
    {
      title: "Уникальных посетителей",
      value: formatNumber(data.unique_visitors),
      hint: `просмотрено объявлений: ${formatNumber(data.ads_viewed)}`,
      accent: "#10b981",
    },
    {
      title: "Обращений ботов",
      value: formatNumber(data.bots),
      hint: `${data.bot_share}% от всех обращений`,
      accent: "#f59e0b",
    },
    {
      title: "Отсеяно повторов",
      value: formatNumber(data.duplicates),
      hint: `владелец: ${formatNumber(data.owner_views)}, персонал: ${formatNumber(data.staff_views)}`,
      accent: "#8b5cf6",
    },
  ];
});

const chartLabels = computed(() =>
  (viewsReport.value?.daily ?? []).map((point) => point.date)
);

const dailySeries = computed(() => {
  const daily = viewsReport.value?.daily ?? [];
  return [
    {
      name: "Просмотры людьми",
      color: "#3b82f6",
      values: daily.map((point) => point.views),
      fill: true,
    },
    {
      name: "Уникальные посетители",
      color: "#10b981",
      values: daily.map((point) => point.visitors),
    },
    {
      name: "Обращения ботов",
      color: "#f59e0b",
      values: daily.map((point) => point.bots),
    },
  ];
});

const hourlySeries = computed(() => [
  {
    name: "Просмотры по часам",
    color: "#8b5cf6",
    values: (viewsReport.value?.hourly ?? []).map((point) => point.views),
    fill: true,
  },
]);

const hourlyLabels = computed(() =>
  (viewsReport.value?.hourly ?? []).map((point) => `${point.hour}:00`)
);

const sourceItems = computed(() =>
  (viewsReport.value?.by_source ?? []).map((item) => ({
    label: item.label,
    value: item.views,
    hint: `${item.share}% · ${formatNumber(item.visitors)} чел.`,
  }))
);

const botItems = computed(() =>
  (viewsReport.value?.by_bot ?? []).map((item) => ({
    label: item.bot,
    value: item.hits,
  }))
);

const referrerItems = computed(() =>
  (viewsReport.value?.top_referrers ?? []).map((item) => ({
    label: item.host,
    value: item.views,
  }))
);

const statusLabels: Record<string, string> = {
  active: "Активно",
  moderation: "На модерации",
  draft: "Черновик",
  sold: "Продано",
  archived: "В архиве",
  rejected: "Отклонено",
};

/**
 * Доля источников словами — прямой ответ на вопрос «ходят ли люди в поиск
 * или смотрят только то, что на главной».
 */
const sourceVerdict = computed(() => {
  const sources = viewsReport.value?.by_source ?? [];
  if (!sources.length) return null;

  const home = sources.find((item) => item.source === "home")?.share ?? 0;
  const search = sources.find((item) => item.source === "search")?.share ?? 0;

  return { home, search };
});
</script>

<template>
  <div v-loading="loading" class="admin-analytics">
    <div class="page-head">
      <div>
        <h1 class="page-title">Аналитика просмотров</h1>
        <p class="page-subtitle">
          Считаются только живые просмотры: без ботов, без владельца объявления,
          без админов и без повторных заходов одного посетителя в течение суток.
          <template v-if="viewsReport">
            Часовой пояс отчёта — {{ viewsReport.range.timezone }}.
          </template>
        </p>
      </div>

      <el-radio-group v-model="period" class="period-switch">
        <el-radio-button
          v-for="option in periodOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <div class="summary-grid">
      <div v-for="item in summary" :key="item.title" class="summary-card">
        <span class="summary-title">{{ item.title }}</span>
        <span class="summary-value" :style="{ color: item.accent }">
          {{ item.value }}
        </span>
        <span class="summary-hint">{{ item.hint }}</span>
      </div>
    </div>

    <el-card class="analytics-card">
      <template #header>
        <span class="card-title">Динамика по дням</span>
      </template>
      <AdminAnalyticsLineChart
        :labels="chartLabels"
        :series="dailySeries"
        :height="280"
        unit="просм."
      />
    </el-card>

    <div class="analytics-grid">
      <el-card class="analytics-card">
        <template #header>
          <span class="card-title">Источники переходов на карточки</span>
        </template>

        <el-alert
          v-if="sourceVerdict"
          type="info"
          :closable="false"
          show-icon
          class="verdict"
        >
          С главной — {{ sourceVerdict.home }}% просмотров, из поиска —
          {{ sourceVerdict.search }}%.
        </el-alert>

        <AdminAnalyticsBarList :items="sourceItems" color="#3b82f6" />
      </el-card>

      <el-card class="analytics-card">
        <template #header>
          <span class="card-title">Боты и краулеры</span>
        </template>
        <AdminAnalyticsBarList
          :items="botItems"
          color="#f59e0b"
          empty-text="Ботов за период не зафиксировано"
        />
      </el-card>
    </div>

    <el-card class="analytics-card">
      <template #header>
        <span class="card-title">Активность по часам суток</span>
      </template>
      <AdminAnalyticsLineChart
        :labels="hourlyLabels"
        :series="hourlySeries"
        :height="200"
        unit="просм."
      />
    </el-card>

    <div class="analytics-grid">
      <el-card class="analytics-card analytics-card--wide">
        <template #header>
          <span class="card-title">Топ объявлений по живым просмотрам</span>
        </template>

        <el-table
          :data="viewsReport?.top_ads ?? []"
          size="small"
          empty-text="Нет данных за выбранный период"
        >
          <el-table-column label="Объявление" min-width="240">
            <template #default="{ row }">
              <NuxtLink
                :to="`/${row.alias}`"
                target="_blank"
                class="ad-link"
              >
                {{ row.title }}
              </NuxtLink>
            </template>
          </el-table-column>
          <el-table-column label="Цена" width="120">
            <template #default="{ row }">
              {{ Number(row.price).toLocaleString("ru-RU") }} {{ row.currency }}
            </template>
          </el-table-column>
          <el-table-column label="Статус" width="130">
            <template #default="{ row }">
              {{ statusLabels[row.status] || row.status }}
            </template>
          </el-table-column>
          <el-table-column prop="views" label="Просмотры" width="110" sortable />
          <el-table-column prop="visitors" label="Людей" width="90" sortable />
        </el-table>
      </el-card>

      <el-card class="analytics-card">
        <template #header>
          <span class="card-title">Внешние источники трафика</span>
        </template>
        <AdminAnalyticsBarList
          :items="referrerItems"
          color="#10b981"
          empty-text="Внешних переходов за период не было"
        />
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-analytics {
  max-width: 1400px;
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.page-title {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.page-subtitle {
  margin: 0;
  max-width: 720px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.summary-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px;
  border-radius: 12px;
  background: var(--color-bg-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.summary-title {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.summary-value {
  font-size: 26px;
  font-weight: 700;
}

.summary-hint {
  font-size: 12px;
  color: var(--color-text-muted);
}

.analytics-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 20px;

  @media (max-width: 1023px) {
    grid-template-columns: 1fr;
  }
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.verdict {
  margin-bottom: 16px;
  border-radius: 8px;
}

.ad-link {
  color: var(--color-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
