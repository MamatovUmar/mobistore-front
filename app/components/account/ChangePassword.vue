<script setup lang="ts">
import { Lock } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";

const { $api } = useNuxtApp();

const isChangingPassword = ref(false);
const loading = ref(false);
const formRef = ref<FormInstance>();

interface PasswordForm {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

const form = ref<PasswordForm>({
  old_password: "",
  new_password: "",
  confirm_password: "",
});

const validateConfirmPassword = (rule: any, value: string, callback: (error?: Error) => void) => {
  if (value !== form.value.new_password) {
    callback(new Error("Пароли не совпадают"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules<PasswordForm>>({
  old_password: [
    { required: true, message: "Введите текущий пароль", trigger: "blur" },
  ],
  new_password: [
    { required: true, message: "Введите новый пароль", trigger: "blur" },
    { min: 6, message: "Пароль должен содержать минимум 6 символов", trigger: ["blur", "change"] },
  ],
  confirm_password: [
    { required: true, message: "Подтвердите новый пароль", trigger: "blur" },
    { validator: validateConfirmPassword, trigger: ["blur", "change"] },
  ],
});

const openChangePassword = () => {
  resetForm();
  isChangingPassword.value = true;
};

const cancelChangePassword = () => {
  isChangingPassword.value = false;
  formRef.value?.clearValidate();
};

const resetForm = () => {
  form.value = {
    old_password: "",
    new_password: "",
    confirm_password: "",
  };
};

const savePassword = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;
    try {
      await $api("/user/profile/change-password", {
        method: "POST",
        body: {
          old_password: form.value.old_password,
          new_password: form.value.new_password,
        },
      });

      ElMessage({
        message: "Пароль успешно изменён",
        type: "success",
      });

      isChangingPassword.value = false;
      resetForm();
    } catch {
      ElMessage({
        message: "Не удалось изменить пароль. Проверьте текущий пароль",
        type: "error",
      });
    } finally {
      loading.value = false;
    }
  });
};
</script>

<template>
  <div class="password-section">
    <div class="section-header">
      <h2 class="section-title">Безопасность</h2>
      <el-button
        v-if="!isChangingPassword"
        type="default"
        :icon="Lock"
        @click="openChangePassword"
      >
        Изменить пароль
      </el-button>
    </div>

    <div v-if="!isChangingPassword" class="password-placeholder">
      <p class="placeholder-text">
        Для изменения пароля нажмите кнопку "Изменить пароль"
      </p>
    </div>

    <el-form
      v-else
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      size="large"
    >
      <el-form-item label="Текущий пароль" prop="old_password">
        <el-input
          v-model="form.old_password"
          type="password"
          placeholder="Введите текущий пароль"
          show-password
        />
      </el-form-item>

      <el-form-item label="Новый пароль" prop="new_password">
        <el-input
          v-model="form.new_password"
          type="password"
          placeholder="Введите новый пароль"
          show-password
        />
      </el-form-item>

      <el-form-item label="Подтвердите новый пароль" prop="confirm_password">
        <el-input
          v-model="form.confirm_password"
          type="password"
          placeholder="Повторите новый пароль"
          show-password
        />
      </el-form-item>

      <div class="form-actions">
        <el-button :disabled="loading" @click="cancelChangePassword">
          Отмена
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="savePassword"
        >
          Сохранить пароль
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.password-section {
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 20px;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.password-placeholder {
  padding: 32px;
  text-align: center;
  background: var(--color-bg-secondary);
  border-radius: 8px;
}

.placeholder-text {
  color: var(--color-text-secondary);
  font-size: 15px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;

  @media (max-width: 640px) {
    flex-direction: column;

    .el-button {
      width: 100%;
    }
  }
}
</style>
