<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Lock, ArrowLeft } from "@element-plus/icons-vue";

definePageMeta({
  layout: "empty",
});

const { $api } = useNuxtApp();
const route = useRoute();

const formRef = ref();
const resetSuccess = ref(false);
const invalidLink = ref(false);

const form = reactive({
  email: "",
  code: "",
  new_password: "",
  confirm_password: "",
});

const validateConfirmPassword = (rule: any, value: string, callback: (error?: Error) => void) => {
  if (value !== form.new_password) {
    callback(new Error("Пароли не совпадают"));
  } else {
    callback();
  }
};

const rules = {
  new_password: [
    {
      required: true,
      message: "Пожалуйста, введите новый пароль",
      trigger: "blur",
    },
    {
      min: 6,
      message: "Пароль должен содержать минимум 6 символов",
      trigger: ["blur", "change"],
    },
  ],
  confirm_password: [
    {
      required: true,
      message: "Пожалуйста, подтвердите пароль",
      trigger: "blur",
    },
    {
      validator: validateConfirmPassword,
      trigger: ["blur", "change"],
    },
  ],
};

const loading = ref(false);

onMounted(() => {
  const email = route.query.email as string;
  const code = route.query.code as string;

  if (!email || !code) {
    invalidLink.value = true;
    return;
  }

  form.email = email;
  form.code = code;
});

const resetPassword = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        await $api("/reset-password", {
          method: "POST",
          body: {
            email: form.email,
            code: form.code,
            new_password: form.new_password,
          },
        });

        resetSuccess.value = true;
        ElMessage({
          message: "Пароль успешно изменён",
          type: "success",
        });
      } catch {
        ElMessage({
          message: "Не удалось сбросить пароль. Попробуйте запросить ссылку заново",
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
  <div class="reset-page">
    <div class="reset-card">
      <NuxtLink to="/login" class="back-link">
        <el-icon :size="18">
          <ArrowLeft />
        </el-icon>
      </NuxtLink>

      <!-- Invalid Link State -->
      <div v-if="invalidLink" class="invalid-content">
        <div class="invalid-icon">
          <el-icon :size="48" color="#ef4444">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </el-icon>
        </div>
        <h1 class="reset-title">Недействительная ссылка</h1>
        <p class="reset-subtitle">
          Ссылка для сброса пароля недействительна или устарела
        </p>
        <NuxtLink to="/forgot-password">
          <el-button type="primary" size="large" class="submit-button">
            Запросить новую ссылку
          </el-button>
        </NuxtLink>
      </div>

      <!-- Success State -->
      <div v-else-if="resetSuccess" class="success-content">
        <div class="success-icon">
          <el-icon :size="48" color="#10b981">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </el-icon>
        </div>
        <h1 class="reset-title">Пароль изменён!</h1>
        <p class="reset-subtitle">
          Ваш пароль был успешно изменён. Теперь вы можете войти с новым паролем.
        </p>
        <NuxtLink to="/login">
          <el-button type="primary" size="large" class="submit-button">
            Войти в аккаунт
          </el-button>
        </NuxtLink>
      </div>

      <!-- Reset Form -->
      <template v-else>
        <div class="reset-header">
          <div class="logo-section">
            <div class="icon-wrapper">
              <el-icon :size="32" color="#667eea">
                <Lock />
              </el-icon>
            </div>
            <h1 class="reset-title">Новый пароль</h1>
            <p class="reset-subtitle">
              Введите новый пароль для вашего аккаунта
            </p>
          </div>
        </div>

        <div class="reset-form">
          <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="resetPassword">
            <el-form-item prop="new_password">
              <label class="form-label">Новый пароль</label>
              <el-input
                v-model="form.new_password"
                type="password"
                placeholder="Введите новый пароль"
                size="large"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item prop="confirm_password">
              <label class="form-label">Подтвердите пароль</label>
              <el-input
                v-model="form.confirm_password"
                type="password"
                placeholder="Повторите пароль"
                size="large"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-button
              type="primary"
              size="large"
              class="submit-button"
              :loading="loading"
              native-type="submit"
            >
              Сохранить пароль
            </el-button>
          </el-form>
        </div>

        <div class="login-prompt">
          <span>Вспомнили пароль?</span>
          <NuxtLink to="/login" class="login-link">
            Войти
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.reset-page {
  min-height: 100dvh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reset-card {
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

.reset-header {
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

.reset-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.reset-subtitle {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 280px;
  line-height: 1.5;
}

.reset-form {
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
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  margin-bottom: 24px;
}

.success-content,
.invalid-content {
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

.invalid-icon {
  width: 80px;
  height: 80px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
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
