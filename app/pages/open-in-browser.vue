<script setup lang="ts">
const route = useRoute();

const redirectParam = computed(() => {
  const value = route.query.redirect;
  if (typeof value !== "string") return "/";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
});

const absoluteUrl = computed(() => {
  if (import.meta.server) return "";
  const base = window.location.origin;
  return `${base}${redirectParam.value}`;
});

const openExternal = () => {
  if (import.meta.server) return;

  const url = absoluteUrl.value;

  const opened = window.open(url, "_blank", "noopener,noreferrer");

  if (!opened) {
    window.location.href = url;
  }
};
</script>

<template>
  <div class="open-in-browser">
    <div class="open-in-browser__card">
      <h1 class="open-in-browser__title">Откройте сайт в браузере</h1>
      <p class="open-in-browser__text">
        Встроенный браузер Telegram может блокировать авторизацию через Google.
      </p>

      <el-button type="primary" size="large" class="open-in-browser__btn" @click="openExternal">
        Открыть в браузере
      </el-button>

      <p class="open-in-browser__hint">
        Если кнопка не сработала, нажмите в Telegram меню (три точки) и выберите «Открыть в браузере».
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.open-in-browser {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  &__card {
    width: 100%;
    max-width: 440px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    padding: 28px;
    text-align: center;
  }

  &__title {
    margin: 0 0 12px 0;
    font-size: 22px;
    font-weight: 700;
    color: var(--color-text-primary);
  }

  &__text {
    margin: 0 0 20px 0;
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  &__btn {
    width: 100%;
    font-weight: 600;
    border-radius: 10px;
  }

  &__hint {
    margin: 16px 0 0 0;
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }
}
</style>
