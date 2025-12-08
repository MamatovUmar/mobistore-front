<script setup lang="ts">
import { CircleCheck, CircleClose, Loading } from "@element-plus/icons-vue";

definePageMeta({
  layout: "empty",
});

const { $api } = useNuxtApp();
const route = useRoute();

const status = ref<"loading" | "success" | "error">("loading");
const errorMessage = ref("");

const verifyEmail = async () => {
  const { email, code } = route.query;

  if (!email || !code) {
    status.value = "error";
    errorMessage.value = "Неверная ссылка для верификации";
    return;
  }

  try {
    await $api("/auth/verify-email", {
      method: "POST",
      body: {
        email: email as string,
        code: code as string,
      },
    });

    status.value = "success";

    setTimeout(() => {
      navigateTo("/login");
    }, 2000);
  } catch (error: any) {
    status.value = "error";
    errorMessage.value =
      error?.data?.message || "Ошибка при верификации email";
  }
};

onMounted(() => {
  verifyEmail();
});
</script>

<template>
  <div class="verify-page">
    <div class="verify-card">
      <!-- Loading state -->
      <div v-if="status === 'loading'" class="verify-content">
        <div class="icon-wrapper loading">
          <el-icon :size="64" class="spin">
            <Loading />
          </el-icon>
        </div>
        <h1 class="verify-title">Подтверждение email</h1>
        <p class="verify-text">Пожалуйста, подождите...</p>
      </div>

      <!-- Success state -->
      <div v-else-if="status === 'success'" class="verify-content">
        <div class="icon-wrapper success">
          <el-icon :size="64">
            <CircleCheck />
          </el-icon>
        </div>
        <h1 class="verify-title">Email подтверждён!</h1>
        <p class="verify-text">
          Ваш email успешно подтверждён. Перенаправляем на страницу входа...
        </p>
      </div>

      <!-- Error state -->
      <div v-else-if="status === 'error'" class="verify-content">
        <div class="icon-wrapper error">
          <el-icon :size="64">
            <CircleClose />
          </el-icon>
        </div>
        <h1 class="verify-title">Ошибка верификации</h1>
        <p class="verify-text">{{ errorMessage }}</p>
        <NuxtLink to="/login" class="back-button">
          <el-button type="primary" size="large"> Перейти к входу </el-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.verify-page {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.verify-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 48px;
  animation: slideIn 0.5s ease-out;
  width: 420px;
  max-width: 100%;
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

.verify-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;

  &.loading {
    background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
    color: #667eea;
  }

  &.success {
    background: linear-gradient(135deg, #10b98120 0%, #059f6820 100%);
    color: #10b981;
  }

  &.error {
    background: linear-gradient(135deg, #ef444420 0%, #dc262620 100%);
    color: #ef4444;
  }
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.verify-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
}

.verify-text {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.back-button {
  text-decoration: none;

  :deep(.el-button) {
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 10px;
    padding: 0 32px;
  }
}
</style>