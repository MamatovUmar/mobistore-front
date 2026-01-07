<script setup lang="ts">
import { ref, reactive } from "vue";
import { User, Lock, ArrowLeft } from "@element-plus/icons-vue";
import type { IAuthResponse } from "~/types/auth";
import { useRootStore } from "~/store/root";
import { useCookie } from "#app";

definePageMeta({
  layout: "empty",
  middleware: "guest",
});

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: t("auth.login.metaTitle"),
  description: t("auth.login.metaDesc"),
  ogTitle: t("auth.login.metaTitle"),
  ogDescription: t("auth.login.metaDesc"),
  robots: "noindex, nofollow",
});

const { $api } = useNuxtApp();
const rootStore = useRootStore();
const tokenCookie = useCookie("token");

const formRef = ref();

const form = reactive({
  email: "",
  password: "",
});

const rules = computed(() => ({
  email: [
    {
      required: true,
      type: "email" as const,
      message: t("auth.common.validation.email"),
      trigger: ["blur", "change"],
    },
  ],
  password: [
    {
      required: true,
      message: t("auth.common.validation.password"),
      trigger: "blur",
    },
    {
      min: 6,
      message: t("auth.common.validation.passwordMin"),
      trigger: ["blur", "change"],
    },
  ],
}));

const loading = ref(false);

const login = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        const res = await $api<IAuthResponse>("/auth/login", {
          method: "POST",
          body: form
        });

        rootStore.user = res.data?.user;
        tokenCookie.value = res.data?.token;
        navigateTo(localePath('/'))
      } catch (error: any) {
        const message = error?.response?._data?.message || t("auth.login.error");
        ElMessage.error(message);
      } finally {
        loading.value = false;
      }
    }
  });
};

</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <NuxtLink :to="localePath('/')" class="back-link">
        <el-icon :size="18">
          <ArrowLeft />
        </el-icon>
      </NuxtLink>

      <div class="login-header">
        <div class="logo-section">
          <h1 class="login-title">{{ t('auth.login.title') }}</h1>
          <p class="login-subtitle">{{ t('auth.login.subtitle') }}</p>
        </div>
      </div>

      <div class="login-form">
        <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="login">
          <el-form-item prop="email">
            <label class="form-label">{{ t('auth.common.email') }}</label>
            <el-input
              v-model="form.email"
              :placeholder="t('auth.common.emailPlaceholder')"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>

          <el-form-item prop="password">
            <label class="form-label">{{ t('auth.common.password') }}</label>
            <el-input
              v-model="form.password"
              type="password"
              :placeholder="t('auth.common.passwordPlaceholder')"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <div class="form-options">
            <NuxtLink :to="localePath('/auth/forgot-password')" class="forgot-link">
              {{ t('auth.login.forgotPassword') }}
            </NuxtLink>
          </div>

          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="loading"
            native-type="submit"
          >
            {{ t('auth.common.login') }}
          </el-button>
        </el-form>

        <div class="divider">
          <span>{{ t('auth.common.orLoginWith') }}</span>
        </div>

        <AuthGoogleButton />

        <div class="register-prompt">
          <span>{{ t('auth.common.noAccount') }}</span>
          <NuxtLink :to="localePath('/signup')" class="register-link">
            {{ t('auth.common.signup') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 30px;
  animation: slideIn 0.5s ease-out;
  width: 400px;
  position: relative;

  @media (max-width: 968px) {
    padding: 32px 24px;
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

.login-header {
  margin-bottom: 32px;
  text-align: center;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.login-subtitle {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin: 0;
}

.login-form {
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  :deep(.el-checkbox__label) {
    font-size: 14px;
    color: var(--color-text-secondary);
  }
}

.forgot-link {
  font-size: 14px;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;

  &:hover {
    color: var(--color-primary-hover);
  }
}

.login-button {
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
}

.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: calc(50% - 30px);
    height: 1px;
    background: var(--color-border);
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  span {
    background: white;
    padding: 0 12px;
    color: var(--color-text-secondary);
    font-size: 14px;
  }
}

.register-prompt {
  text-align: center;
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-top: 20px;

  span {
    margin-right: 6px;
  }
}

.register-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;

  &:hover {
    color: var(--color-primary-hover);
  }
}

.info-section {
  color: white;
  animation: fadeIn 0.8s ease-out;

  @media (max-width: 968px) {
    display: none;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.info-title {
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.info-text {
  font-size: 18px;
  line-height: 1.6;
  margin: 0 0 32px 0;
  opacity: 0.95;
}

.info-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;

  .feature-icon {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    backdrop-filter: blur(10px);
  }
}
</style>
