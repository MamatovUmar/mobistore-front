<script setup lang="ts">
import { ref, watch } from "vue";
import { Phone } from "@element-plus/icons-vue";

withDefaults(
  defineProps<{
    placeholder?: string;
    size?: "large" | "default" | "small";
  }>(),
  {
    placeholder: "+998 __ ___ __ __",
    size: "large",
  }
);

const model = defineModel<string>();

const displayValue = ref("");

// Форматирование номера для отображения
const formatPhoneNumber = (value: string): string => {
  // Убираем все кроме цифр
  const cleaned = value.replace(/\D/g, "");

  // Убираем префикс 998 если есть
  const withoutPrefix = cleaned.startsWith("998") ? cleaned.slice(3) : cleaned;

  // Ограничиваем 9 цифрами (после +998)
  const limited = withoutPrefix.slice(0, 9);

  // Применяем маску: +998 XX XXX XX XX
  let formatted = "+998";
  if (limited.length > 0) {
    formatted += " " + limited.slice(0, 2);
  }
  if (limited.length > 2) {
    formatted += " " + limited.slice(2, 5);
  }
  if (limited.length > 5) {
    formatted += " " + limited.slice(5, 7);
  }
  if (limited.length > 7) {
    formatted += " " + limited.slice(7, 9);
  }

  return formatted;
};

// Получение чистого номера (только цифры)
const getCleanNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.startsWith("998") ? cleaned.slice(3) : cleaned;
};

const handleInput = (value: string) => {
  // Форматируем введенное значение
  const formatted = formatPhoneNumber(value);
  displayValue.value = formatted;

  // Обновляем model только цифрами (без +998)
  const cleanNumber = getCleanNumber(value);
  model.value = cleanNumber;
};

const handleFocus = () => {
  if (!displayValue.value || displayValue.value === "+998") {
    displayValue.value = "+998 ";
  }
};

// Инициализация значения
watch(
  () => model.value,
  (newValue) => {
    if (newValue) {
      displayValue.value = formatPhoneNumber(newValue);
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
  >
    <template #prefix>
      <el-icon><Phone /></el-icon>
    </template>
  </el-input>
</template>

<style lang="scss" scoped></style>
