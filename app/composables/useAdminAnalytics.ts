import type { IBaseResponse } from "@/types";

export interface IPeriodMetric {
  total: number;
  today: number;
  last_7d: number;
  last_30d: number;
  prev_30d: number;
  /** Прирост за 30 дней к предыдущим 30 дням, % */
  growth_30d: number | null;
}

export interface IAdsSummary extends IPeriodMetric {
  by_status: Record<string, number>;
}

export interface IViewsSummary extends IPeriodMetric {
  unique_visitors_30d: number;
  bot_views_30d: number;
  /** Доля ботов среди всех обращений к карточкам, % */
  bot_share_30d: number;
}

export interface IActivityItem {
  type: "ad_created" | "ad_sold" | "user_registered";
  user_id: number | null;
  user_name: string;
  ad_id: number | null;
  ad_title: string | null;
  ad_alias: string | null;
  created_at: string;
}

export interface ITrackingState {
  first_event_at: string | null;
  /** Сколько дней уже собираются чистые просмотры */
  days_collected: number;
  /** Сумма исторического счётчика ad.views_count (со старым бот-трафиком) */
  ad_counter_total: number;
}

export interface IDashboardAnalytics {
  users: IPeriodMetric;
  ads: IAdsSummary;
  views: IViewsSummary;
  favorites: { total: number; last_30d: number };
  activity: IActivityItem[];
  tracking: ITrackingState;
}

export interface IViewsDailyPoint {
  date: string;
  views: number;
  bots: number;
  visitors: number;
}

export interface IViewsBySource {
  source: string;
  label: string;
  views: number;
  visitors: number;
  share: number;
}

export interface IViewsReport {
  range: { from: string; to: string; days: number; timezone: string };
  totals: {
    hits: number;
    counted: number;
    bots: number;
    duplicates: number;
    owner_views: number;
    staff_views: number;
    unique_visitors: number;
    ads_viewed: number;
    bot_share: number;
  };
  daily: IViewsDailyPoint[];
  by_source: IViewsBySource[];
  by_bot: Array<{ bot: string; hits: number }>;
  top_ads: Array<{
    ad_id: number;
    title: string;
    alias: string;
    price: string;
    currency: string;
    status: string;
    views: number;
    visitors: number;
  }>;
  top_referrers: Array<{ host: string; views: number }>;
  hourly: Array<{ hour: number; views: number }>;
}

export const useAdminAnalytics = () => {
  const { $api } = useNuxtApp();

  const loading = ref(false);
  const dashboard = ref<IDashboardAnalytics | null>(null);
  const viewsReport = ref<IViewsReport | null>(null);

  /** Сводка для главной страницы админки */
  const fetchDashboard = async () => {
    loading.value = true;
    try {
      const result = await $api<IBaseResponse<IDashboardAnalytics>>(
        "/admin/analytics/dashboard"
      );
      dashboard.value = result.data ?? null;
      return result.data;
    } catch (error) {
      ElMessage.error(getErrorMessage(error));
      return null;
    } finally {
      loading.value = false;
    }
  };

  /** Детальный отчёт по просмотрам за период */
  const fetchViewsReport = async (days = 30) => {
    loading.value = true;
    try {
      const result = await $api<IBaseResponse<IViewsReport>>(
        `/admin/analytics/views?days=${days}`
      );
      viewsReport.value = result.data ?? null;
      return result.data;
    } catch (error) {
      ElMessage.error(getErrorMessage(error));
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    dashboard,
    viewsReport,
    fetchDashboard,
    fetchViewsReport,
  };
};
