<script setup lang="ts">
import type {
  LogType,
  LogStatus,
  ICleanupPayload,
} from "~/composables/useLogs";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  cleanup: [payload: ICleanupPayload];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const beforeDate = ref<string>("");
const selectedType = ref<LogType | null>(null);
const selectedStatus = ref<LogStatus | null>(null);

const typeOptions: { value: LogType; label: string }[] = [
  { value: "error", label: "Ошибка" },
  { value: "warning", label: "Предупреждение" },
  { value: "info", label: "Информация" },
  { value: "debug", label: "Отладка" },
];

const statusOptions: { value: LogStatus; label: string }[] = [
  { value: "pending", label: "Ожидает" },
  { value: "reviewed", label: "Просмотрен" },
  { value: "resolved", label: "Решён" },
  { value: "ignored", label: "Игнорирован" },
];

const handleTypeChange = (value: LogType | undefined) => {
  console.log("handleTypeChange called with:", value);
  selectedType.value = value || null;
  console.log("selectedType.value set to:", selectedType.value);
};

const handleStatusChange = (value: LogStatus | undefined) => {
  console.log("handleStatusChange called with:", value);
  selectedStatus.value = value || null;
  console.log("selectedStatus.value set to:", selectedStatus.value);
};

const handleCleanup = () => {
  const normalizedBeforeDate = beforeDate.value?.trim();

  if (!normalizedBeforeDate) {
    ElMessage.warning("Укажите дату");
    return;
  }

  const payload: ICleanupPayload = {
    before_date: normalizedBeforeDate,
  };

  if (selectedType.value !== null) {
    payload.type = selectedType.value;
  }
  if (selectedStatus.value !== null) {
    payload.status = selectedStatus.value;
  }

  console.log("CleanupDialog payload before emit:", payload);
  console.log("selectedType.value:", selectedType.value);
  console.log("selectedStatus.value:", selectedStatus.value);

  emit("cleanup", payload);

  beforeDate.value = "";
  selectedType.value = null;
  selectedStatus.value = null;
};

const handleClose = () => {
  visible.value = false;
  beforeDate.value = "";
  selectedType.value = null;
  selectedStatus.value = null;
};
</script>

<template>
  <el-dialog
    v-model="visible"
    title="Очистка логов"
    width="450px"
    @close="handleClose"
  >
    <el-form label-position="top">
      <el-form-item label="Удалить логи до даты" required>
        <el-date-picker
          v-model="beforeDate"
          type="date"
          placeholder="Выберите дату"
          format="DD.MM.YYYY"
          value-format="YYYY-MM-DD"
          clearable
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="Тип (опционально)">
        <el-select
          :model-value="selectedType ?? undefined"
          placeholder="Все типы"
          clearable
          style="width: 100%"
          @update:model-value="handleTypeChange"
        >
          <el-option
            v-for="option in typeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Статус (опционально)">
        <el-select
          :model-value="selectedStatus ?? undefined"
          placeholder="Все статусы"
          clearable
          style="width: 100%"
          @update:model-value="handleStatusChange"
        >
          <el-option
            v-for="option in statusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">Отмена</el-button>
      <el-button type="danger" @click="handleCleanup">Удалить</el-button>
    </template>
  </el-dialog>
</template>
