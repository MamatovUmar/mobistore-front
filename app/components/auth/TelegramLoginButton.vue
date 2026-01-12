<template>
  <div ref="telegramContainer" class="telegram-login-container"></div>
</template>

<style scoped>
.telegram-login-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 12px;
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { TelegramUser } from "~/types/auth";

const props = defineProps<{
  botName: string;
  buttonSize?: "large" | "medium" | "small";
}>();

const emit = defineEmits<{
  auth: [user: TelegramUser];
}>();

const telegramContainer = ref<HTMLDivElement>();

onMounted(() => {
  // Глобальный callback
  (window as any).onTelegramAuth = (user: TelegramUser) => {
    emit("auth", user);
  };

  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.setAttribute("data-telegram-login", props.botName);
  script.setAttribute("data-size", props.buttonSize || "large");
  script.setAttribute("data-onauth", "onTelegramAuth(user)");
  script.setAttribute("data-request-access", "write");
  script.setAttribute("data-radius", "10");
  script.async = true;

  telegramContainer.value?.appendChild(script);
});

onUnmounted(() => {
  delete (window as any).onTelegramAuth;
});
</script>
