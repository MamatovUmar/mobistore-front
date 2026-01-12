<script setup lang="ts">
import { Lock } from "@element-plus/icons-vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const router = useRouter();
const { t } = useI18n();
const localePath = useLocalePath();

const handleClose = () => {
  emit("update:modelValue", false);
};

const goToLogin = () => {
  handleClose();
  router.push(localePath("/login"));
};

const goToSignup = () => {
  handleClose();
  router.push(localePath("/signup"));
};
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="min(450px, 92vw)"
    align-center
    append-to-body
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <div class="auth-dialog">
      <div class="auth-dialog__icon">
        <el-icon :size="48"><Lock /></el-icon>
      </div>
      <h3 class="auth-dialog__title">{{ t('auth.modal.title') }}</h3>
      <p class="auth-dialog__text">
        {{ t('auth.modal.text') }}
      </p>
    </div>
    <template #footer>
      <div class="auth-dialog__footer">
        <el-button size="large" @click="goToSignup">{{ t('auth.common.signup') }}</el-button>
        <el-button type="primary" size="large" @click="goToLogin">
          {{ t('auth.common.login') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.auth-dialog {
  text-align: center;
  padding: 20px 0;

  &__icon {
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

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 12px;
  }

  &__text {
    font-size: 15px;
    line-height: 1.6;
    color: #64748b;
    margin: 0;
  }

  &__footer {
    display: flex;
    justify-content: center;
    gap: 12px;
    button {
      flex: 1;
    }
  }
}

@media (max-width: 480px) {
  .auth-dialog {
    padding: 12px 0;

    &__icon {
      width: 64px;
      height: 64px;
      margin-bottom: 16px;

      :deep(svg) {
        width: 32px;
        height: 32px;
      }
    }

    &__title {
      font-size: 20px;
    }

    &__text {
      font-size: 14px;
    }

    &__footer {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;

      :deep(.el-button) {
        width: 100%;
      }
    }
  }
}
</style>
