/**
 * Источники перехода на карточку объявления.
 * Значения синхронизированы с enum ViewSource на бэкенде (ad-view.enum.ts).
 */
export type ViewSource =
  | "home"
  | "search"
  | "brand"
  | "model"
  | "user"
  | "similar"
  | "favorite"
  | "account"
  | "admin";

/**
 * Определяет источник перехода по пути страницы, с которой ушёл пользователь.
 * Локальный префикс (/uz) отбрасывается.
 *
 * Возвращает null, если источник непонятен — тогда заголовок не отправляется
 * и бэкенд определяет источник сам по реферуру.
 */
export const detectViewSource = (path?: string | null): ViewSource | null => {
  if (!path) return null;

  const clean = path.replace(/^\/uz(?=\/|$)/, "") || "/";

  if (clean === "/") return "home";
  if (clean.startsWith("/search")) return "search";
  if (clean.startsWith("/brands")) return "brand";
  if (clean.startsWith("/models")) return "model";
  if (clean.startsWith("/user")) return "user";
  if (clean.startsWith("/admin")) return "admin";
  if (clean.startsWith("/account/favorites")) return "favorite";
  if (clean.startsWith("/account")) return "account";

  // Сервисные страницы источником перехода не считаем
  if (
    clean.startsWith("/auth") ||
    clean.startsWith("/login") ||
    clean.startsWith("/signup") ||
    clean.startsWith("/info") ||
    clean.startsWith("/create") ||
    clean.startsWith("/verify-email")
  ) {
    return null;
  }

  // Остальные одноуровневые пути — это карточки объявлений,
  // значит пользователь пришёл из блока «Похожие объявления»
  if (/^\/[^/]+$/.test(clean)) return "similar";

  return null;
};
