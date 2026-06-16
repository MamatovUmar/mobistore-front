import type { IUser, IUpdateProfilePayload } from "~/types/user";
import { defineStore } from "pinia";
import { ref } from "#imports";
import { catcher } from "~/utils/catcher";
import type { IBaseResponse } from "~/types";
import { getErrorMessage } from "~/utils/error";
import { useLocalePath } from "#i18n";
import type {IRate} from "~/types/rates";

export const useRootStore = defineStore("root", () => {
  const { $api } = useNuxtApp();
  const tokenCookie = useTokenCookie();
  const localePath = useLocalePath();

  const user = ref<IUser>();
  const selectedRate = ref<IRate>()
  const rates = ref<IRate[]>([])
  const selectedCurrency = ref<'USD' | 'UZS'>('UZS')

  const isAdmin = computed(() => user.value?.role === "admin");
  const isModerator = computed(() => user.value?.role === "moderator");

  const setRates = (rate: IRate) => {
    selectedRate.value = rate
    selectedCurrency.value = rate.ccy as 'USD' | 'UZS'
  }

  const resetCurrency = () => {
    selectedRate.value = undefined
    selectedCurrency.value = 'UZS'
  }

  const initCurrencyFromCookie = (code: string | null | undefined) => {
    if (code && code !== 'UZS') {
      const rate = rates.value.find(r => r.ccy === code)
      if (rate) setRates(rate)
    }
  }

  const _toUzs = (amount: number, currency: string): number => {
    if (currency === 'UZS') return amount
    const rateEntry = rates.value.find(r => r.ccy === currency)
    if (!rateEntry) return amount
    const nominal = Number(rateEntry.nominal) || 1
    return amount * (rateEntry.rate / nominal)
  }

  const _fromUzs = (amountUzs: number, currency: string): number => {
    if (currency === 'UZS') return amountUzs
    const rateEntry = rates.value.find(r => r.ccy === currency)
    if (!rateEntry) return amountUzs
    const nominal = Number(rateEntry.nominal) || 1
    return amountUzs / (rateEntry.rate / nominal)
  }

  const convertPrice = (amount: number, fromCurrency: string = 'UZS'): string => {
    const toCurrency = selectedCurrency.value
    if (fromCurrency === toCurrency) {
      return formatCurrency(amount, toCurrency as 'USD' | 'UZS')
    }
    const amountInUzs = _toUzs(amount, fromCurrency)
    const converted = _fromUzs(amountInUzs, toCurrency)
    return formatCurrency(converted, toCurrency as 'USD' | 'UZS')
  }

  const fetchUser = catcher(async (token?: string) => {
    if (token) {
      tokenCookie.value = token;
    }
    const authToken = token || tokenCookie.value;
    if (!authToken) return;

    const { data } = await $api<IBaseResponse<IUser>>("/user/profile", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    user.value = data;
  });

  const updateProfile = catcher(
    async (payload: IUpdateProfilePayload) => {
      const { data } = await $api<IBaseResponse<IUser>>("/user/profile", {
        method: "PUT",
        body: payload,
      });
      user.value = data;
      return data;
    },
    (error: any) => {
      ElMessage.error(getErrorMessage(error));
    }
  );

  const logout = catcher(async () => {
    user.value = undefined;
    tokenCookie.value = undefined;
    navigateTo(localePath("/"));
  });

  return {
    user,
    fetchUser,
    updateProfile,
    logout,
    isAdmin,
    isModerator,
    selectedRate,
    selectedCurrency,
    setRates,
    resetCurrency,
    initCurrencyFromCookie,
    rates,
    convertPrice
  };
});


