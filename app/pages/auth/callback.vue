<script setup lang="ts">
import { Loading, CircleCloseFilled } from "@element-plus/icons-vue";
import { useRootStore } from "~/store/root";

definePageMeta({
  layout: "empty",
});

const route = useRoute();
const rootStore = useRootStore();
const tokenCookie = useCookie("token");

const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const token = route.query.token as string;

  if (!token) {
    error.value = "Токен авторизации не найден";
    loading.value = false;
    return;
  }

  try {
    await rootStore.fetchUser(token);
    navigateTo("/");
  } catch (e) {
    console.error(e);
    error.value = "Ошибка авторизации. Попробуйте снова.";
    tokenCookie.value = undefined;
    loading.value = false;
  }
});
</script>

<template>
  <div class="callback-page">
    <div class="callback-card">
      <template v-if="loading && !error">
        <div class="loading-spinner">
          <el-icon class="is-loading" :size="48">
            <Loading />
          </el-icon>
        </div>
        <h2 class="callback-title">Выполняется вход...</h2>
        <p class="callback-text">Пожалуйста, подождите</p>
      </template>

      <template v-else-if="error">
        <div class="error-icon">
          <el-icon :size="48" color="#f56c6c">
            <CircleCloseFilled />
          </el-icon>
        </div>
        <h2 class="callback-title error">Ошибка</h2>
        <p class="callback-text">{{ error }}</p>
        <NuxtLink to="/login" class="back-button">
          <el-button type="primary" size="large">
            Вернуться к входу
          </el-button>
        </NuxtLink>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.callback-page {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.callback-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 48px;
  text-align: center;
  min-width: 320px;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading-spinner {
  margin-bottom: 24px;
  color: var(--color-primary);
}

.error-icon {
  margin-bottom: 24px;
}

.callback-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;

  &.error {
    color: #f56c6c;
  }
}

.callback-text {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin: 0 0 24px 0;
}

.back-button {
  text-decoration: none;

  .el-button {
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    border-radius: 10px;
  }
}
</style>