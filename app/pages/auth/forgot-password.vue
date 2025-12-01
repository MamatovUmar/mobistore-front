<script setup lang="ts">
import { ref, reactive } from "vue";
import { Message, ArrowLeft } from "@element-plus/icons-vue";

definePageMeta({
  layout: "empty",
  middleware: "guest",
});

const { $api } = useNuxtApp();

const formRef = ref();
const emailSent = ref(false);

const form = reactive({
  email: "",
});

const rules = {
  email: [
    {
      required: true,
      type: "email" as const,
      message: "Пожалуйста, введите корректный email",
      trigger: ["blur", "change"],
    },
  ],
};

const loading = ref(false);

const sendResetLink = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        await $api("/forgot-password", {
          method: "POST",
          body: { email: form.email },
        });

        emailSent.value = true;
        ElMessage({
          message: "Ссылка для восстановления пароля отправлена на вашу почту",
          type: "success",
        });
      } catch {
        ElMessage({
          message: "Не удалось отправить письмо. Проверьте email и попробуйте снова",
          type: "error",
        });
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<template>
  <div class="forgot-page">
    <div class="forgot-card">
      <NuxtLink to="/login" class="back-link">
        <el-icon :size="18">
          <ArrowLeft />
        </el-icon>
      </NuxtLink>

      <div class="forgot-header">
        <div class="logo-section">
          <div class="icon-wrapper">
            <el-icon :size="32" color="#667eea">
              <Message />
            </el-icon>
          </div>
          <h1 class="forgot-title">Забыли пароль?</h1>
          <p class="forgot-subtitle">
            {{ emailSent 
              ? 'Проверьте свою почту' 
              : 'Введите email, и мы отправим ссылку для восстановления' 
            }}
          </p>
        </div>
      </div>

      <div v-if="!emailSent" class="forgot-form">
        <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="sendResetLink">
          <el-form-item prop="email">
            <label class="form-label">Email</label>
            <el-input
              v-model="form.email"
              placeholder="Введите ваш email"
              size="large"
              :prefix-icon="Message"
            />
          </el-form-item>

          <el-button
            type="primary"
            size="large"
            class="submit-button"
            :loading="loading"
            native-type="submit"
          >
            Отправить ссылку
          </el-button>
        </el-form>
      </div>

      <div v-else class="success-content">
        <div class="success-icon">
          <el-icon :size="48" color="#10b981">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </el-icon>
        </div>
        <p class="success-text">
          Мы отправили письмо на <strong>{{ form.email }}</strong>. 
          Перейдите по ссылке в письме для сброса пароля.
        </p>
        <el-button
          type="primary"
          size="large"
          class="submit-button"
          @click="emailSent = false"
        >
          Отправить повторно
        </el-button>
      </div>

      <div class="login-prompt">
        <span>Вспомнили пароль?</span>
        <NuxtLink to="/login" class="login-link">
          Войти
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.forgot-page {
  min-height: 100dvh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forgot-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 30px;
  animation: slideIn 0.5s ease-out;
  width: 400px;
  position: relative;

  @media (max-width: 968px) {
    padding: 32px 24px;
    width: 100%;
  }
}

.back-link {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  border-radius: 50%;
  transition: all 0.3s;
  text-decoration: none;

  &:hover {
    color: var(--color-primary);
    background: rgba(59, 130, 246, 0.1);
    transform: translateX(-2px);
  }
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

.forgot-header {
  margin-bottom: 32px;
  text-align: center;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.forgot-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.forgot-subtitle {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 280px;
  line-height: 1.5;
}

.forgot-form {
  .form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary);
  }

  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-input) {
    --el-input-border-radius: 10px;
  }
}

.submit-button {
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  margin-bottom: 24px;
}

.success-content {
  text-align: center;
  padding: 20px 0;
  margin-top: 20px;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.success-text {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;

  strong {
    color: var(--color-text-primary);
  }
}

.login-prompt {
  text-align: center;
  font-size: 14px;
  color: var(--color-text-secondary);

  span {
    margin-right: 6px;
  }
}

.login-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;

  &:hover {
    color: var(--color-primary-hover);
  }
}
</style>
