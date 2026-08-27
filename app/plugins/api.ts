import type { ViewSource } from "~/utils/view-source";

/** Идентификатор посетителя живёт год — по нему дедуплицируются просмотры */
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const generateVisitorId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
};

/** Запросы карточки объявления — только к ним цепляем аналитические заголовки */
const isAdDetailRequest = (url: string): boolean =>
  /\/ads\/alias\/[^/]+$/.test(url) || /\/ads\/\d+$/.test(url);

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const tokenCookie = useCookie("token");
  const currency = useCookie("currency", { default: () => "UZS" });
  const localePath = useLocalePath();

  // Идентификатор посетителя для аналитики просмотров (не персональные данные)
  const visitorId = useCookie("vid", {
    maxAge: VISITOR_COOKIE_MAX_AGE,
    sameSite: "lax",
    path: "/",
  });
  if (!visitorId.value) {
    visitorId.value = generateVisitorId();
  }

  // Источник перехода: заполняется роутером при клиентской навигации
  const viewSource = useState<ViewSource | null>("view-source", () => null);

  // Карточка рендерится на сервере, поэтому в API приходит запрос от контейнера
  // фронта. Пробрасываем настоящие данные клиента, иначе бэкенд считает такой
  // запрос ботом и не засчитывает просмотр.
  const ssrHeaders = import.meta.server
    ? useRequestHeaders(["user-agent", "referer", "x-forwarded-for", "x-real-ip"])
    : null;

  const api = $fetch.create({
    baseURL: config.public.apiUrl,
    onRequest({ request, options }) {
      const token = tokenCookie.value;
      if (token) {
        options.headers.set("Authorization", `Bearer ${token}`);
      }
      options.headers.set("Accept-currency", currency.value);

      const url = typeof request === "string" ? request : request.url;
      if (!isAdDetailRequest(url)) return;

      if (visitorId.value) {
        options.headers.set("X-Visitor-Id", visitorId.value);
      }

      // При SSR (первый заход) источник определяет бэкенд по реферуру:
      // здесь известна только текущая страница, а не та, с которой пришли.
      if (viewSource.value) {
        options.headers.set("X-View-Source", viewSource.value);
      }

      if (ssrHeaders) {
        const ssrSecret = config.ssrSharedSecret;
        if (ssrSecret) {
          options.headers.set("X-SSR-Secret", ssrSecret);
        }
        const clientIp =
          ssrHeaders["x-forwarded-for"]?.split(",")[0]?.trim() ||
          ssrHeaders["x-real-ip"];
        if (clientIp) options.headers.set("X-Client-Ip", clientIp);
        if (ssrHeaders["user-agent"]) {
          options.headers.set("X-Client-User-Agent", ssrHeaders["user-agent"]);
        }
        if (ssrHeaders.referer) {
          options.headers.set("X-Client-Referer", ssrHeaders.referer);
        }
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        tokenCookie.value = undefined;
        await nuxtApp.runWithContext(() => navigateTo(localePath("/login")));
      } else if (response.status === 403) {
        tokenCookie.value = undefined;
        await nuxtApp.runWithContext(() => navigateTo(localePath("/")));
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
