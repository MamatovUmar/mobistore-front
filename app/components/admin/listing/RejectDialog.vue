<script setup lang="ts">
import type { IListing } from "@/types/ads";

const props = defineProps<{
  modelValue: boolean;
  ad: IListing | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [reason: string];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const reason = ref("");
const reasonError = ref("");

const quickReasons = [
  "Недостаточное описание товара",
  "Некачественные фотографии",
  "Неверная категория или модель",
  "Подозрительная цена",
  "Нарушение правил площадки",
  "Дубликат объявления",
  "Запрещённый товар",
];

const selectQuickReason = (text: string) => {
  reason.value = text;
  reasonError.value = "";
};

const handleConfirm = () => {
  if (!reason.value.trim()) {
    reasonError.value = "Укажите причину отклонения";
    return;
  }

  if (reason.value.length > 500) {
    reasonError.value = "Причина не должна превышать 500 символов";
    return;
  }

  emit("confirm", reason.value);
};

const handleClose = () => {
  reason.value = "";
  reasonError.value = "";
};

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      handleClose();
    }
  }
);
</script>

<template>
  <el-dialog
    v-model="visible"
    title="Отклонить объявление"
    width="500px"
    :close-on-click-modal="false"
    class="reject-dialog"
    @closed="handleClose"
  >
    <div v-if="ad" class="reject-content">
      <div class="ad-preview">
        <span class="ad-title">{{ ad.title }}</span>
        <span class="ad-id">ID: {{ ad.id }}</span>
      </div>

      <div class="quick-reasons">
        <span class="quick-label">Быстрый выбор:</span>
        <div class="quick-buttons">
          <el-button
            v-for="text in quickReasons"
            :key="text"
            size="small"
            :type="reason === text ? 'primary' : 'default'"
            @click="selectQuickReason(text)"
          >
            {{ text }}
          </el-button>
        </div>
      </div>

      <div class="reason-input">
        <label class="input-label">
          Причина отклонения
          <span class="required">*</span>
        </label>
        <el-input
          v-model="reason"
          type="textarea"
          :rows="4"
          placeholder="Подробно опишите причину отклонения..."
          maxlength="500"
          show-word-limit
          :class="{ 'is-error': reasonError }"
          @input="reasonError = ''"
        />
        <span v-if="reasonError" class="error-message">{{ reasonError }}</span>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">Отмена</el-button>
        <el-button
          type="warning"
          :loading="loading"
          :disabled="!reason.trim()"
          @click="handleConfirm"
        >
          Отклонить
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.reject-dialog {
  :deep(.el-dialog__header) {
    border-bottom: 1px solid var(--color-border-light);
    margin-right: 0;
    padding-bottom: 16px;
  }

  :deep(.el-dialog__body) {
    padding: 24px;
  }
}

.reject-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ad-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-bg-secondary);
  padding: 12px 16px;
  border-radius: 8px;
}

.ad-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.ad-id {
  font-size: 12px;
  color: var(--color-text-muted);
}

.quick-reasons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.quick-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  button {
    margin-left: 0;
  }
}

.reason-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.required {
  color: #ef4444;
}

.is-error {
  :deep(.el-textarea__inner) {
    border-color: #ef4444;
  }
}

.error-message {
  font-size: 12px;
  color: #ef4444;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
