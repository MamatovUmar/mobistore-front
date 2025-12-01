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

const { $api } = useNuxtApp();
const rootStore = useRootStore();
const tokenCookie = useCookie("token");

const formRef = ref();

const form = reactive({
  email: "",
  password: "",
  first_name: "",
  last_name: "",
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
  password: [
    {
      required: true,
      message: "Пожалуйста, введите пароль",
      trigger: "blur",
    },
    {
      min: 6,
      message: "Пароль должен содержать минимум 6 символов",
      trigger: ["blur", "change"],
    },
  ],
  first_name: [
    {
      required: true,
      message: "Пожалуйста, введите имя",
      trigger: "blur",
    },
  ]
};

const loading = ref(false);

const register = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        const res = await $api<IAuthResponse>("/register", {
          method: "POST",
          body: form
        });

        rootStore.user = res.data?.user;
        tokenCookie.value = res.data?.token;
        ElMessage({
          message: "Вы успешно зарегистрировались",
          type: "success",
        });
        navigateTo('/')
      } catch (error) {
        ElMessage({
          message: "Произошла ошибка при регистрации",
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
  <div class="signup-page">
    <div class="signup-card">
      <NuxtLink to="/" class="back-link">
        <el-icon :size="18">
          <ArrowLeft />
        </el-icon>
      </NuxtLink>

      <div class="signup-header">
        <div class="logo-section">
          <h1 class="signup-title">Создать аккаунт</h1>
          <p class="signup-subtitle">Присоединяйтесь к SmartMarket</p>
        </div>
      </div>

      <div class="signup-form">
        <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="register">
          <div class="name-row">
            <el-form-item prop="first_name">
              <label class="form-label">Имя</label>
              <el-input
                v-model="form.first_name"
                placeholder="Введите имя"
                size="large"
              />
            </el-form-item>

            <el-form-item>
              <label class="form-label">Фамилия</label>
              <el-input
                v-model="form.last_name"
                placeholder="Введите фамилию"
                size="large"
              />
            </el-form-item>
          </div>

          <el-form-item prop="email">
            <label class="form-label">Email</label>
            <el-input
              v-model="form.email"
              placeholder="Введите ваш email"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>

          <el-form-item prop="password">
            <label class="form-label">Пароль</label>
            <el-input
              v-model="form.password"
              type="password"
              placeholder="Введите пароль"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <el-button
            type="primary"
            size="large"
            class="signup-button"
            :loading="loading"
            native-type="submit"
          >
            Зарегистрироваться
          </el-button>
        </el-form>

        <div class="divider">
          <span>или зарегистрируйтесь с помощью</span>
        </div>

        <AuthGoogleButton />

        <div class="login-prompt">
          <span>Уже есть аккаунт?</span>
          <NuxtLink to="/login" class="login-link">
            Войти
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.signup-page {
  min-height: 100dvh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signup-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 30px;
  animation: slideIn 0.5s ease-out;
  width: 480px;
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

.signup-header {
  margin-bottom: 32px;
  text-align: center;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.signup-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.signup-subtitle {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin: 0;
}

.signup-form {
  .form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary);
  }

  .name-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-input) {
    --el-input-border-radius: 10px;
  }
}

.signup-button {
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

.login-prompt {
  text-align: center;
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-top: 20px;

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