<script setup lang="ts">
import { ListingStatus, type IListing } from "@/types/ads";
import { useAds } from "@/composables/useAds";

const props = defineProps<{
  modelValue: boolean;
  ad: IListing | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [status: ListingStatus, reason?: string];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const { getStatusLabel, getStatusType } = useAds();

const selectedStatus = ref<ListingStatus | "">("");
const reason = ref("");

const statusOptions = [
  { value: ListingStatus.DRAFT, label: "Черновик", description: "Объявление скрыто, пользователь может редактировать" },
  { value: ListingStatus.ACTIVE, label: "Активно", description: "Объявление видно всем пользователям" },
  { value: ListingStatus.SOLD, label: "Продано", description: "Товар продан, объявление неактивно" },
  { value: ListingStatus.ARCHIVED, label: "Архив", description: "Объявление в архиве пользователя" },
  { value: ListingStatus.MODERATION, label: "На модерации", description: "Отправлено на повторную модерацию" },
  { value: ListingStatus.REJECTED, label: "Отклонено", description: "Объявление отклонено модератором" },
];

const needsReason = computed(() => {
  return selectedStatus.value === ListingStatus.REJECTED;
});

const canConfirm = computed(() => {
  if (!selectedStatus.value) return false;
  if (needsReason.value && !reason.value.trim()) return false;
  return selectedStatus.value !== props.ad?.status;
});

const handleConfirm = () => {
  if (!selectedStatus.value) return;
  emit("confirm", selectedStatus.value, reason.value || undefined);
};

const handleClose = () => {
  selectedStatus.value = "";
  reason.value = "";
};

watch(
  () => props.ad,
  (ad) => {
    if (ad) {
      selectedStatus.value = ad.status;
    }
  },
  { immediate: true }
);

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      handleClose();
    } else if (props.ad) {
      selectedStatus.value = props.ad.status;
    }
  }
);
</script>

<template>
  <el-dialog
    v-model="visible"
    title="Изменить статус"
    width="500px"
    :close-on-click-modal="false"
    class="status-dialog"
    @closed="handleClose"
  >
    <div v-if="ad" class="status-content">
      <div class="ad-preview">
        <span class="ad-title">{{ ad.title }}</span>
        <el-tag :type="getStatusType(ad.status)" size="small">
          {{ getStatusLabel(ad.status) }}
        </el-tag>
      </div>

      <div class="status-options">
        <label class="options-label">Выберите новый статус:</label>
        <div class="options-list">
          <div
            v-for="option in statusOptions"
            :key="option.value"
            :class="[
              'status-option',
              {
                active: selectedStatus === option.value,
                current: ad.status === option.value
              }
            ]"
            @click="selectedStatus = option.value"
          >
            <div class="option-header">
              <el-tag :type="getStatusType(option.value)" size="small">
                {{ option.label }}
              </el-tag>
              <span v-if="ad.status === option.value" class="current-badge">
                Текущий
              </span>
            </div>
            <span class="option-description">{{ option.description }}</span>
          </div>
        </div>
      </div>

      <div v-if="needsReason" class="reason-section">
        <label class="input-label">
          Причина отклонения
          <span class="required">*</span>
        </label>
        <el-input
          v-model="reason"
          type="textarea"
          :rows="3"
          placeholder="Укажите причину отклонения..."
          maxlength="500"
          show-word-limit
        />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">Отмена</el-button>
        <el-button
          type="primary"
          :loading="loading"
          :disabled="!canConfirm"
          @click="handleConfirm"
        >
          Изменить статус
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.status-dialog {
  :deep(.el-dialog__header) {
    border-bottom: 1px solid var(--color-border-light);
    margin-right: 0;
    padding-bottom: 16px;
  }

  :deep(.el-dialog__body) {
    padding: 24px;
  }
}

.status-content {
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
  flex: 1;
  margin-right: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.options-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-option {
  padding: 12px 16px;
  border: 2px solid var(--color-border-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 6px;

  &:hover:not(.current) {
    border-color: var(--color-primary-light);
    background: rgba(59, 130, 246, 0.02);
  }

  &.active {
    border-color: var(--color-primary);
    background: rgba(59, 130, 246, 0.05);
  }

  &.current {
    opacity: 0.6;
    cursor: default;
  }
}

.option-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-badge {
  font-size: 11px;
  color: var(--color-text-muted);
  background: var(--color-bg-secondary);
  padding: 2px 8px;
  border-radius: 4px;
}

.option-description {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.reason-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-light);
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.required {
  color: #ef4444;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
