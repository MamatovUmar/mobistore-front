import { detectViewSource, type ViewSource } from "~/utils/view-source";

/**
 * Запоминает, с какой страницы пользователь ушёл на карточку объявления.
 * Значение уходит в API заголовком X-View-Source (см. plugins/api.ts) и
 * позволяет в админке видеть, откуда реально приходят просмотры:
 * с главной, из поиска, со страницы бренда и т.д.
 */
export default defineNuxtPlugin(() => {
  const router = useRouter();
  const viewSource = useState<ViewSource | null>("view-source", () => null);

  router.beforeEach((to, from) => {
    if (from?.path && from.path !== to.path) {
      viewSource.value = detectViewSource(from.path);
    }
  });
});
