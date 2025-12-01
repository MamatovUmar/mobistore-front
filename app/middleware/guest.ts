export default defineNuxtRouteMiddleware(() => {
  const tokenCookie = useCookie("token");

  if (tokenCookie.value) {
    return navigateTo("/");
  }
});
