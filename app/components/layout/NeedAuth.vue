<script setup lang="ts">
import { Lock } from "@element-plus/icons-vue";

const model = defineModel<boolean>({ default: false });
</script>

<template>
  <el-dialog
    :model-value="model"
    :show-close="false"
    :close-on-click-modal="false"
    :align-center="true"
    :width="450"
    class="need-auth-dialog"
  >
    <div class="need-auth-content">
      <div class="need-auth-icon">
        <el-icon :size="32">
          <Lock />
        </el-icon>
      </div>
      <div class="need-auth-title">Для этого действия нужно авторизоваться</div>
      <p class="need-auth-text">
        Пожалуйста, авторизуйтесь, чтобы продолжить использование всех
        возможностей сервиса.
      </p>
    </div>
    <template #footer>
      <div class="need-auth-actions">
        <el-button size="large" @click="model = false">Позже</el-button>
        <el-button type="primary" size="large" @click="navigateTo('/login')">
          Войти
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.need-auth-dialog {
  max-width: 320px;
  width: calc(100% - 32px);
  border-radius: 16px;

  :deep(.el-dialog__header) {
    text-align: center;
    margin-bottom: 4px;
    padding-bottom: 8px;
  }

  :deep(.el-dialog__title) {
    width: 100%;
    text-align: center;
  }

  :deep(.el-dialog__body) {
    padding: 16px 20px 10px;
  }
}

.need-auth-title {
  text-align: center;
  font-size: 22px;
  margin-top: 15px;
}

.need-auth-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.need-auth-icon {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  background: var(--el-color-primary-light-9, #ecf5ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  position: relative;
}

.need-auth-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--el-text-color-regular, #606266);
}

.need-auth-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

@media (max-width: 480px) {
  .need-auth-dialog {
    border-radius: 12px;
  }
}
</style>
