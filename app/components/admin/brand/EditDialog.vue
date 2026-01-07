<script setup lang="ts">
import {
  Edit,
  Plus,
  Delete,
  Picture,
  UploadFilled,
} from "@element-plus/icons-vue";
import type { FormInstance, FormRules, UploadFile } from "element-plus";
import type { IBrand, IBrandUpdatePayload } from "@/types/brand";

const props = defineProps<{
  modelValue: boolean;
  brand: IBrand | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submit: [data: IBrandUpdatePayload];
  "upload-logo": [file: File];
  "delete-logo": [];
}>();

const config = useRuntimeConfig();
const formRef = ref<FormInstance>();
const newLogoFile = ref<File | null>(null);
const newLogoPreview = ref<string | null>(null);
const isDragging = ref(false);

const formData = reactive<IBrandUpdatePayload>({
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

const getLogoUrl = (logo: string | null) => {
  if (!logo) return null;
  if (logo.startsWith("http")) return logo;
  return `${config.public.apiBase}${logo}`;
};

const currentLogo = computed(() => {
  if (newLogoPreview.value) return newLogoPreview.value;
  if (props.brand?.logo) return getLogoUrl(props.brand.logo);
  return null;
});

const hasNewLogo = computed(() => !!newLogoFile.value);
const hasExistingLogo = computed(
  () => !!props.brand?.logo && !newLogoFile.value
);

const handleClose = () => {
  emit("update:modelValue", false);
  resetForm();
};

const resetForm = () => {
  newLogoFile.value = null;
  if (newLogoPreview.value) {
    URL.revokeObjectURL(newLogoPreview.value);
    newLogoPreview.value = null;
  }
};

const handleLogoChange = (file: UploadFile) => {
  if (file.raw) {
    newLogoFile.value = file.raw;
    newLogoPreview.value = URL.createObjectURL(file.raw);
  }
};

const handleRemoveNewLogo = () => {
  newLogoFile.value = null;
  if (newLogoPreview.value) {
    URL.revokeObjectURL(newLogoPreview.value);
    newLogoPreview.value = null;
  }
};

const handleDeleteExistingLogo = () => {
  emit("delete-logo");
};

const handleUploadLogo = () => {
  if (newLogoFile.value) {
    emit("upload-logo", newLogoFile.value);
    handleRemoveNewLogo();
  }
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  const file = e.dataTransfer?.files[0];
  if (file && file.type.startsWith("image/")) {
    newLogoFile.value = file;
    newLogoPreview.value = URL.createObjectURL(file);
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate((valid) => {
    if (valid) {
      emit("submit", { ...formData });
    }
  });
};

watch(
  () => props.brand,
  (brand) => {
    if (brand) {
      formData.name = brand.name;
      formData.alias = brand.alias || "";
      formData.is_popular = brand.is_popular;
    }
  },
  { immediate: true }
);

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      resetForm();
    }
  }
);

onUnmounted(() => {
  if (newLogoPreview.value) {
    URL.revokeObjectURL(newLogoPreview.value);
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
          <el-icon :size="24"><Edit /></el-icon>
        </div>
        <div class="header-text">
          <h3 class="header-title">Редактировать бренд</h3>
          <p class="header-subtitle">
            {{ brand?.name || "Изменение данных бренда" }}
          </p>
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
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="logo-header">
          <span class="logo-title">Логотип бренда</span>
        </div>

        <div class="logo-content">
          <!-- Logo Display -->
          <div v-if="currentLogo" class="logo-preview-container">
            <el-image
              :src="currentLogo"
              fit="contain"
              class="logo-image"
              :preview-src-list="[currentLogo]"
              preview-teleported
            >
              <template #error>
                <div class="logo-fallback">
                  <el-icon :size="32"><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div v-if="hasNewLogo" class="new-badge">Новый</div>
          </div>

          <!-- Upload Zone (when no logo) -->
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
                <el-icon :size="36"><UploadFilled /></el-icon>
              </div>
              <div class="upload-text">
                <span class="upload-main">Загрузите логотип</span>
                <span class="upload-hint">Перетащите или кликните</span>
              </div>
            </div>
          </el-upload>

          <!-- Logo Actions -->
          <div class="logo-actions">
            <template v-if="hasNewLogo">
              <el-button type="primary" :icon="Plus" @click="handleUploadLogo">
                Сохранить логотип
              </el-button>
              <el-button @click="handleRemoveNewLogo"> Отменить </el-button>
            </template>
            <template v-else>
              <el-upload
                class="inline-upload"
                :auto-upload="false"
                :show-file-list="false"
                accept="image/*"
                @change="handleLogoChange"
              >
                <el-button :icon="currentLogo ? Edit : Plus">
                  {{ currentLogo ? "Заменить" : "Загрузить" }}
                </el-button>
              </el-upload>
              <el-button
                v-if="hasExistingLogo"
                :icon="Delete"
                type="danger"
                plain
                @click="handleDeleteExistingLogo"
              >
                Удалить
              </el-button>
            </template>
          </div>
        </div>
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
            placeholder="URL-дружественное имя"
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
          {{ loading ? "Сохранение..." : "Сохранить изменения" }}
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
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 8px 16px rgba(245, 158, 11, 0.25);
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

.logo-section {
  margin-bottom: 28px;
  padding: 20px;
  background: var(--color-bg-secondary);
  border-radius: 16px;
  border: 1px solid var(--el-border-color-lighter);
}

.logo-header {
  margin-bottom: 16px;
}

.logo-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.logo-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-preview-container {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.logo-image {
  width: 100%;
  height: 100%;

  :deep(img) {
    padding: 8px;
    object-fit: contain;
  }
}

.logo-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.new-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  padding: 2px 8px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 6px;
  text-transform: uppercase;
}

.logo-uploader {
  width: 100px;
  flex-shrink: 0;

  :deep(.el-upload) {
    width: 100%;
  }

  :deep(.el-upload-dragger) {
    width: 100px;
    height: 100px;
    border-radius: 16px;
    border: 2px dashed var(--el-border-color);
    background: white;
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
  gap: 8px;
  width: 100%;
  height: 100%;

  &.is-dragging {
    background: rgba(59, 130, 246, 0.1);
  }
}

.upload-icon {
  color: var(--el-color-primary);
  opacity: 0.6;
}

.upload-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.upload-main {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.upload-hint {
  font-size: 10px;
  color: var(--color-text-muted);
}

.logo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.inline-upload {
  :deep(.el-upload) {
    display: inline-block;
  }
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
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      border: none;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);

      &:hover {
        background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      }
    }
  }
}
</style>
