import { useRootStore } from "~/store/root";

export default defineNuxtPlugin({
  name: "auth",
  parallel: true,
  async setup() {
    const rootStore = useRootStore();
    const tokenCookie = useCookie("token");

    // Загружаем пользователя только если есть токен
    // Это выполнится как на сервере (SSR), так и на клиенте
    if (tokenCookie.value) {
      try {
        await rootStore.fetchUser();
      } catch (error) {
        // Если токен невалидный, очищаем cookie
        console.error("Failed to fetch user:", error);
        tokenCookie.value = null;
      }
    }
  },
});
