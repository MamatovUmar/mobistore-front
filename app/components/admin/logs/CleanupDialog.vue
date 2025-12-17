<script setup lang="ts">
import type { LogType, LogStatus, ICleanupPayload } from "~/composables/useLogs";

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

const form = reactive({
  before_date: "",
  type: undefined as LogType | undefined,
  status: undefined as LogStatus | undefined,
});

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

const handleCleanup = async () => {
  if (!form.before_date) {
    ElMessage.warning("Укажите дату");
    return;
  }

  try {
    await ElMessageBox.confirm(
      "Вы уверены, что хотите удалить логи? Это действие необратимо.",
      "Внимание",
      {
        confirmButtonText: "Удалить",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );

    emit("cleanup", {
      before_date: form.before_date,
      type: form.type,
      status: form.status,
    });

    form.before_date = "";
    form.type = undefined;
    form.status = undefined;
  } catch {
    // Cancelled
  }
};

const handleClose = () => {
  visible.value = false;
  form.before_date = "";
  form.type = undefined;
  form.status = undefined;
};
</script>

<template>
  <el-dialog v-model="visible" title="Очистка логов" width="450px" @close="handleClose">
    <el-form label-position="top">
      <el-form-item label="Удалить логи до даты" required>
        <!-- <el-date-picker
          v-model="form.before_date"
          type="datetime"
          placeholder="Выберите дату"
          format="DD.MM.YYYY"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        /> -->
      </el-form-item>
      <el-form-item label="Тип (опционально)">
        <el-select v-model="form.type" placeholder="Все типы" clearable style="width: 100%">
          <el-option
            v-for="option in typeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Статус (опционально)">
        <el-select v-model="form.status" placeholder="Все статусы" clearable style="width: 100%">
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
