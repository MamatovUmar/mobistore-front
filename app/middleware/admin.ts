import { useRootStore } from "~/store/root";

export default defineNuxtRouteMiddleware(() => {
  const tokenCookie = useCookie("token");
  const localePath = useLocalePath();
  const root = useRootStore();

  if (!tokenCookie.value) {
    return navigateTo(localePath("/login"));
  }

  if (!["admin", "moderator"].includes(root.user?.role || "user")) {
    return navigateTo(localePath("/"));
  }
});
