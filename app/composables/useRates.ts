import { useRootStore } from "~/store/root";
import type { IBaseResponse, ICurrency } from "~/types";
import type { IRate, ISyncResult } from "~/types/rates";

export const useRates = () => {
  const { $api } = useNuxtApp();
  const root = useRootStore();
  const currencyCookie = useCookie('currency');

  const loading = ref(false);
  const syncing = ref(false);
  const rates = ref<IRate[]>([]);
  const currencies = ref<ICurrency[]>([]);

  const fetchLatestRates = async () => {
    loading.value = true;
    try {
      const result = await $api<IBaseResponse<IRate[]>>("/rates/latest");
      rates.value = result.data || [];
      root.rates = rates.value;
      root.initCurrencyFromCookie(currencyCookie.value);
    } catch (error) {
      console.log('Error fetching rates:', error);
    } finally {
      loading.value = false;
    }
  };

  const fetchCurrencies = async () => {
    loading.value = true;
    try {
      const result = await $api<IBaseResponse<ICurrency[]>>("/rates/currencies");
      currencies.value = result.data || [];
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
    } finally {
      loading.value = false;
    }
  };

  const syncRates = async () => {
    syncing.value = true;
    try {
      const result = await $api<IBaseResponse<ISyncResult>>("/rates/sync", {
        method: "POST",
      });
      ElMessage.success(
        result.message || "Курсы валют успешно синхронизированы"
      );
      await fetchLatestRates();
      return result.data;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      throw error;
    } finally {
      syncing.value = false;
    }
  };

  const refresh = async () => {
    await fetchLatestRates();
  };

  const formatRate = (rate: number): string => {
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rate);
  };

  const formatDiff = (diff: number): string => {
    const formatted = new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: "always",
    }).format(diff);
    return formatted;
  };

  return {
    loading,
    syncing,
    rates,
    currencies,
    fetchLatestRates,
    fetchCurrencies,
    syncRates,
    refresh,
    formatRate,
    formatDiff,
  };
};

