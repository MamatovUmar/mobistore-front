<script setup lang="ts">
import { Plus, Delete, UploadFilled } from "@element-plus/icons-vue";
import type { FormInstance, FormRules, UploadFile } from "element-plus";
import type { IBrandCreatePayload } from "@/types/brand";

const props = defineProps<{
  modelValue: boolean;
  loading: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submit: [data: IBrandCreatePayload, logo?: File];
}>();

const formRef = ref<FormInstance>();
const logoFile = ref<File | null>(null);
const logoPreview = ref<string | null>(null);
const isDragging = ref(false);

const formData = reactive<IBrandCreatePayload>({
  name: "",
  alias: "",
  is_popular: false,
});

const rules: FormRules = {
  name: [
    { required: true, message: "Введите название бренда", trigger: "blur" },
    { min: 1, max: 255, message: "От 1 до 255 символов", trigger: "blur" },
  ],
  alias: [{ max: 255, message: "Максимум 255 символов", trigger: "blur" }],
};

const handleClose = () => {
  emit("update:modelValue", false);
  resetForm();
};

const resetForm = () => {
  formData.name = "";
  formData.alias = "";
  formData.is_popular = false;
  logoFile.value = null;
  logoPreview.value = null;
  formRef.value?.resetFields();
};

const handleLogoChange = (file: UploadFile) => {
  if (file.raw) {
    logoFile.value = file.raw;
    logoPreview.value = URL.createObjectURL(file.raw);
  }
};

const handleRemoveLogo = () => {
  logoFile.value = null;
  if (logoPreview.value) {
    URL.revokeObjectURL(logoPreview.value);
    logoPreview.value = null;
  }
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  const file = e.dataTransfer?.files[0];
  if (file && file.type.startsWith("image/")) {
    logoFile.value = file;
    logoPreview.value = URL.createObjectURL(file);
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate((valid) => {
    if (valid) {
      emit("submit", { ...formData }, logoFile.value || undefined);
    }
  });
};

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      resetForm();
    }
  }
);

onUnmounted(() => {
  if (logoPreview.value) {
    URL.revokeObjectURL(logoPreview.value);
  }
});
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="520px"
    :close-on-click-modal="false"
    :show-close="false"
    class="brand-dialog"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <template #header>
      <div class="dialog-header">
        <div class="header-icon">
          <el-icon :size="24"><Plus /></el-icon>
        </div>
        <div class="header-text">
          <h3 class="header-title">Создать бренд</h3>
          <p class="header-subtitle">Добавьте новый бренд в систему</p>
        </div>
      </div>
    </template>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      class="brand-form"
      @submit.prevent="handleSubmit"
    >
      <!-- Logo Upload Section -->
      <div class="logo-upload-section">
        <div v-if="logoPreview" class="logo-preview-container">
          <img :src="logoPreview" alt="Logo preview" class="preview-image" />
          <div class="preview-overlay">
            <el-button
              class="remove-btn"
              :icon="Delete"
              circle
              type="danger"
              @click="handleRemoveLogo"
            />
          </div>
        </div>
        <el-upload
          v-else
          class="logo-uploader"
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          drag
          @change="handleLogoChange"
        >
          <div
            class="upload-content"
            :class="{ 'is-dragging': isDragging }"
            @dragenter="isDragging = true"
            @dragleave="isDragging = false"
            @drop="handleDrop"
          >
            <div class="upload-icon">
              <el-icon :size="40"><UploadFilled /></el-icon>
            </div>
            <div class="upload-text">
              <span class="upload-main">Загрузите логотип</span>
              <span class="upload-hint"
                >Перетащите или кликните для выбора</span
              >
            </div>
          </div>
        </el-upload>
      </div>

      <!-- Form Fields -->
      <div class="form-fields">
        <el-form-item label="Название бренда" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="Например: Apple, Samsung..."
            size="large"
            maxlength="255"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="Алиас (URL)" prop="alias">
          <el-input
            v-model="formData.alias"
            placeholder="Автоматически из названия, если не указано"
            size="large"
            maxlength="255"
          >
            <template #prefix>
              <span class="alias-prefix">/brands/</span>
            </template>
          </el-input>
        </el-form-item>

        <div class="popular-toggle">
          <div class="toggle-info">
            <span class="toggle-label">Популярный бренд</span>
            <span class="toggle-hint">Отображается на главной странице</span>
          </div>
          <el-switch
            v-model="formData.is_popular"
            size="large"
            active-color="#10b981"
          />
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" @click="handleClose"> Отмена </el-button>
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          @click="handleSubmit"
        >
          <el-icon v-if="!loading" class="mr-2"><Plus /></el-icon>
          {{ loading ? "Создание..." : "Создать бренд" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.brand-dialog {
  :deep(.el-dialog) {
    border-radius: 20px;
    overflow: hidden;
  }

  :deep(.el-dialog__header) {
    padding: 0;
    margin: 0;
  }

  :deep(.el-dialog__body) {
    padding: 0 28px 24px;
  }

  :deep(.el-dialog__footer) {
    padding: 0 28px 28px;
  }
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px 28px 24px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.25);
}

.header-text {
  flex: 1;
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}

.header-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.brand-form {
  padding-top: 24px;
}

.logo-upload-section {
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
}

.logo-preview-container {
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 20px;
  overflow: hidden;
  background: var(--color-bg-secondary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  &:hover .preview-overlay {
    opacity: 1;
  }
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.remove-btn {
  transform: scale(1.2);
}

.logo-uploader {
  width: 140px;

  :deep(.el-upload) {
    width: 100%;
  }

  :deep(.el-upload-dragger) {
    width: 140px;
    height: 140px;
    border-radius: 20px;
    border: 2px dashed var(--el-border-color);
    background: var(--color-bg-secondary);
    transition: all 0.3s ease;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      border-color: var(--el-color-primary);
      background: rgba(59, 130, 246, 0.04);
    }
  }
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 100%;
  padding: 16px;

  &.is-dragging {
    background: rgba(59, 130, 246, 0.1);
  }
}

.upload-icon {
  color: var(--el-color-primary);
  opacity: 0.7;
}

.upload-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.upload-main {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.upload-hint {
  font-size: 11px;
  color: var(--color-text-muted);
  text-align: center;
}

.form-fields {
  :deep(.el-form-item__label) {
    font-weight: 600;
    color: var(--color-text-primary);
    padding-bottom: 8px;
  }

  :deep(.el-input__wrapper) {
    border-radius: 12px;
    box-shadow: 0 0 0 1px var(--el-border-color) inset;
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
    }

    &.is-focus {
      box-shadow: 0 0 0 2px var(--el-color-primary) inset;
    }
  }
}

.alias-prefix {
  color: var(--color-text-muted);
  font-size: 13px;
}

.popular-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 16px;
  border: 1px solid #bbf7d0;
  margin-top: 8px;
}

.toggle-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toggle-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.toggle-hint {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--el-border-color-lighter);

  .el-button {
    border-radius: 12px;
    padding: 12px 24px;
    font-weight: 500;

    &--primary {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border: none;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);

      &:hover {
        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      }
    }
  }
}

.mr-2 {
  margin-right: 8px;
}
</style>
