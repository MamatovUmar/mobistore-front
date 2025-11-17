<script setup lang="ts">
import { ref, watch } from "vue";

withDefaults(
  defineProps<{
    placeholder?: string;
    size?: "large" | "default" | "small";
  }>(),
  {
    placeholder: "@username",
    size: "large",
  }
);

const model = defineModel<string>();

const displayValue = ref("");

// Форматирование username для отображения
const formatUsername = (value: string): string => {
  // Убираем все кроме букв, цифр и подчеркивания
  let cleaned = value.replace(/[^a-zA-Z0-9_]/g, "");
  
  // Ограничиваем 32 символами (максимальная длина username в Telegram)
  cleaned = cleaned.slice(0, 32);
  
  // Добавляем @ если есть текст
  return cleaned ? `@${cleaned}` : "";
};

const handleInput = (value: string) => {
  // Форматируем введенное значение
  const formatted = formatUsername(value);
  displayValue.value = formatted;
  
  // Обновляем model с отформатированным username
  model.value = formatted;
};

const handleFocus = () => {
  if (!displayValue.value) {
    displayValue.value = "@";
  }
};

const handleBlur = () => {
  if (displayValue.value === "@") {
    displayValue.value = "";
  }
};

// Инициализация значения
watch(
  () => model.value,
  (newValue) => {
    if (newValue) {
      displayValue.value = formatUsername(newValue);
    } else {
      displayValue.value = "";
    }
  },
  { immediate: true }
);
</script>

<template>
  <el-input
    :model-value="displayValue"
    :placeholder="placeholder"
    :size="size"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>

<style lang="scss" scoped>
</style>