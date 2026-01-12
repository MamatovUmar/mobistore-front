import type { IAuthResponse, TelegramUser } from "~/types/auth";

export const useAuthApi = () => {
  const { $api } = useNuxtApp();

  const telegramLogin = async (telegramData: TelegramUser) => {
    return await $api<IAuthResponse>("/auth/telegram", {
      method: "POST",
      body: telegramData,
    });
  };

  return {
    telegramLogin,
  };
};
