<template>
  <div ref="telegramContainer" class="telegram-login-container"></div>
</template>

<style scoped>
.telegram-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  background-color: #54a9eb; /* Telegram Blue */
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  transition: background-color 0.2s;
}

:deep(iframe) {
  opacity: 1;
  pointer-events: auto;
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { TelegramUser } from "~/types/auth";
import { useRootStore } from "~/store/root";
import { useCookie } from "#app";
import { useAuthApi } from "~/composables/useAuthApi";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const rootStore = useRootStore();
const tokenCookie = useCookie("token");
const { telegramLogin } = useAuthApi();

const botName = config.public.telegramBotName;
const telegramContainer = ref<HTMLDivElement>();

onMounted(() => {
  // Глобальный callback
  (window as any).onTelegramAuth = async (user: TelegramUser) => {
    try {
      const res = await telegramLogin(user);
      rootStore.user = res.data?.user;
      tokenCookie.value = res.data?.token;
      navigateTo(localePath("/"));
    } catch (error: any) {
      const message = error?.response?._data?.message || t("auth.login.error");
      ElMessage.error(message);
    }
  };

  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.setAttribute("data-telegram-login", botName);
  script.setAttribute("data-size", "large");
  script.setAttribute("data-onauth", "onTelegramAuth(user)");
  script.setAttribute("data-request-access", "write");
  script.setAttribute("data-radius", "10");
  script.setAttribute("data-userpic", "false");
  script.async = true;

  telegramContainer.value?.appendChild(script);
});

onUnmounted(() => {
  delete (window as any).onTelegramAuth;
});
</script>
