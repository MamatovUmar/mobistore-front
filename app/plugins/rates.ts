import type { IBaseResponse } from "~/types";
import type { IRate } from "~/types/rates";
import { useRootStore } from "~/store/root";

/**
 * Загружает курсы валют один раз на SSR (и на клиенте при первом заходе),
 * кладёт их в стор и инициализирует выбранную валюту из cookie.
 *
 * Благодаря этому convertPrice корректно работает уже при серверном рендере,
 * а не только после гидрации (раньше курсы тянулись fire-and-forget в AppHeader,
 * из-за чего на SSR и на страницах без хедера цены не конвертировались).
 *
 * Состояние Pinia сериализуется в payload, поэтому на клиенте после гидрации
 * повторного запроса не будет (см. guard ниже).
 */
export default defineNuxtPlugin(async () => {
  const root = useRootStore();

  // На клиенте курсы уже придут из payload после гидрации — не дублируем запрос.
  if (root.rates.length) return;

  const { $api } = useNuxtApp();
  const currencyCookie = useCookie("currency");

  try {
    const res = await $api<IBaseResponse<IRate[]>>("/rates/latest");
    root.rates = res.data || [];
    root.initCurrencyFromCookie(currencyCookie.value);
  } catch (error) {
    // Курсы не критичны для рендера: без них convertPrice вернёт исходную валюту.
    console.error("[rates plugin] не удалось загрузить курсы:", error);
  }
});
