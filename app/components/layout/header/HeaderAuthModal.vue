<script setup lang="ts">
import { Lock } from "@element-plus/icons-vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const router = useRouter();

const handleClose = () => {
  emit("update:modelValue", false);
};

const goToLogin = () => {
  handleClose();
  router.push("/login");
};

const goToSignup = () => {
  handleClose();
  router.push("/signup");
};
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="(val) => emit('update:modelValue', val)"
    width="450px"
    align-center
    append-to-body
    :show-close="false"
  >
    <div class="auth-dialog">
      <div class="dialog-icon">
        <el-icon :size="48"><Lock /></el-icon>
      </div>
      <h3 class="dialog-title">Требуется авторизация</h3>
      <p class="dialog-text">
        Для размещения объявлений необходимо войти в систему или создать новый
        аккаунт.
      </p>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" @click="handleClose">Отмена</el-button>
        <el-button size="large" @click="goToSignup">Регистрация</el-button>
        <el-button type="primary" size="large" @click="goToLogin">
          Войти
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
/* Auth Dialog */
.auth-dialog {
  text-align: center;
  padding: 20px 0;
}

.dialog-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
}

.dialog-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px;
}

.dialog-text {
  font-size: 15px;
  line-height: 1.6;
  color: #64748b;
  margin: 0;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
