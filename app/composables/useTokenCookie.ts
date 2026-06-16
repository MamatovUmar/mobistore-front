const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 дней

/**
 * Cookie с JWT-токеном. Единая точка записи токена:
 * везде используем этот composable вместо useCookie("token", ...),
 * чтобы флаги secure/sameSite не расходились между местами записи.
 */
export const useTokenCookie = () =>
  useCookie<string | null | undefined>("token", {
    maxAge: TOKEN_MAX_AGE,
    // secure-cookie не работает по http://localhost в Safari, поэтому только вне dev
    secure: !import.meta.dev,
    sameSite: "lax",
  });
