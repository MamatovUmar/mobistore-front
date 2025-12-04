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
      } catch {
        // Токен невалидный - очищаем cookie
        tokenCookie.value = null;
      }
    }
  },
});
