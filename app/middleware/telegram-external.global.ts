export default defineNuxtRouteMiddleware((to) => {
  const ua = import.meta.server
    ? useRequestHeaders(["user-agent"])["user-agent"] || ""
    : navigator.userAgent || "";

  const isTelegram = /telegram/i.test(ua);

  if (!isTelegram) return;

  if (to.path.includes("/open-in-browser")) return;

  const redirect = encodeURIComponent(to.fullPath);

  const isUzLocale = to.path === "/uz" || to.path.startsWith("/uz/");
  const openPath = isUzLocale ? "/uz/open-in-browser" : "/open-in-browser";

  return navigateTo({ path: openPath, query: { redirect } });
});
