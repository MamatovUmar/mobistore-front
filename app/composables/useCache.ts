import type { IBaseResponse } from "~/types";

export interface ICacheKey {
  name: string;
  label: string;
  ttl: number;
  isPattern: boolean;
}

export interface ICacheStatKey {
  name: string;
  count: number;
  pattern: string;
}

export interface ICacheStats {
  keys: ICacheStatKey[];
  totalKeys: number;
}

export const useCache = () => {
  const { $api } = useNuxtApp();

  const loading = ref(false);
  const cacheKeys = ref<ICacheKey[]>([]);
  const cacheStats = ref<ICacheStats | null>(null);

  const fetchKeys = async () => {
    loading.value = true;
    try {
      const result = await $api<IBaseResponse<ICacheKey[]>>("/cache/keys");
      cacheKeys.value = result.data || [];
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
    } finally {
      loading.value = false;
    }
  };

  const fetchStats = async () => {
    loading.value = true;
    try {
      const result = await $api<IBaseResponse<ICacheStats>>("/cache/stats");
      cacheStats.value = result.data || null;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
    } finally {
      loading.value = false;
    }
  };

  const clearByKey = async (key: string) => {
    try {
      const result = await $api<IBaseResponse<void>>(`/cache/clear/${key}`, {
        method: "DELETE",
      });
      ElMessage.success(result.message || "Кеш успешно очищен");
      await Promise.all([fetchKeys(), fetchStats()]);
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      throw error;
    }
  };

  const clearAll = async () => {
    try {
      const result = await $api<IBaseResponse<void>>("/cache/clear-all", {
        method: "DELETE",
      });
      ElMessage.success(result.message || "Весь кеш успешно очищен");
      await Promise.all([fetchKeys(), fetchStats()]);
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      throw error;
    }
  };

  const refresh = async () => {
    await Promise.all([fetchKeys(), fetchStats()]);
  };

  const formatTTL = (seconds: number): string => {
    if (seconds < 60) return `${seconds} сек`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} мин`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ч`;
    return `${Math.floor(seconds / 86400)} дн`;
  };

  return {
    loading,
    cacheKeys,
    cacheStats,
    fetchKeys,
    fetchStats,
    clearByKey,
    clearAll,
    refresh,
    formatTTL,
  };
};
