<script setup lang="ts">
import type { IAdminUser, IAdminUserUpdatePayload } from "@/types/admin-user";
import type { FormInstance, FormRules } from "element-plus";

const props = defineProps<{
  modelValue: boolean;
  user: IAdminUser | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [payload: IAdminUserUpdatePayload];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const formRef = ref<FormInstance>();

const form = ref<IAdminUserUpdatePayload>({
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  telegram: "",
  is_verified: false,
});

const rules: FormRules = {
  first_name: [
    { required: true, message: "Введите имя", trigger: "blur" },
    { min: 2, max: 50, message: "Имя должно быть от 2 до 50 символов", trigger: "blur" },
  ],
  last_name: [
    { required: true, message: "Введите фамилию", trigger: "blur" },
    { min: 2, max: 50, message: "Фамилия должна быть от 2 до 50 символов", trigger: "blur" },
  ],
  email: [
    { required: true, message: "Введите email", trigger: "blur" },
    { type: "email", message: "Введите корректный email", trigger: "blur" },
  ],
  phone_number: [
    { pattern: /^\+?[0-9\s\-()]+$/, message: "Введите корректный номер телефона", trigger: "blur" },
  ],
};

watch(
  () => props.user,
  (user) => {
    if (user) {
      form.value = {
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        telegram: user.telegram || "",
        is_verified: user.is_verified || false,
      };
    }
  },
  { immediate: true }
);

const handleSave = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    emit("save", { ...form.value });
  } catch {
    // Validation failed
  }
};

const handleClose = () => {
  visible.value = false;
  formRef.value?.resetFields();
};
</script>

<template>
  <el-drawer
    v-model="visible"
    title="Редактирование пользователя"
    direction="rtl"
    size="500px"
    class="edit-drawer"
    @close="handleClose"
  >
    <template v-if="user">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="edit-form"
      >
        <el-form-item label="Имя" prop="first_name">
          <el-input
            v-model="form.first_name"
            placeholder="Введите имя"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="Фамилия" prop="last_name">
          <el-input
            v-model="form.last_name"
            placeholder="Введите фамилию"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input
            v-model="form.email"
            placeholder="Введите email"
            type="email"
          />
        </el-form-item>

        <el-form-item label="Телефон" prop="phone_number">
          <el-input
            v-model="form.phone_number"
            placeholder="+998 XX XXX XX XX"
          />
        </el-form-item>

        <el-form-item label="Telegram" prop="telegram">
          <el-input
            v-model="form.telegram"
            placeholder="@username или ссылка"
          />
        </el-form-item>

        <el-form-item label="Верификация" prop="is_verified">
          <el-switch
            v-model="form.is_verified"
            active-text="Верифицирован"
            inactive-text="Не верифицирован"
          />
        </el-form-item>
      </el-form>

      <div class="drawer-footer">
        <el-button @click="handleClose">Отмена</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSave"
        >
          Сохранить
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
.edit-drawer {
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 20px 24px;
    border-bottom: 1px solid var(--color-border-light);
  }

  :deep(.el-drawer__body) {
    padding: 0;
    display: flex;
    flex-direction: column;
  }
}

.edit-form {
  flex: 1;
  padding: 24px;
  overflow-y: auto;

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: var(--color-text-primary);
  }
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
}
</style>
