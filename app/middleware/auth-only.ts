export default defineNuxtRouteMiddleware(() => {
  const tokenCookie = useCookie("token");
  const localePath = useLocalePath();

  if (!tokenCookie.value) {
    return navigateTo(localePath("/login"));
  }
});
