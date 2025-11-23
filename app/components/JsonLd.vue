<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  json: Record<string, any>
}

const props = defineProps<Props>()

// Создаем JSON-LD скрипт
const jsonLdScript = computed(() => {
  return JSON.stringify(props.json, null, 2)
})

// Используем useHead для добавления JSON-LD
useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: jsonLdScript.value
    }
  ]
}))

// Следим за изменениями и обновляем head
watch(() => props.json, () => {
  // useHead автоматически обновится при изменении jsonLdScript
}, { deep: true })
</script>

<template>
  <div style="display: none;">
    <!-- Компонент не рендерит ничего видимое, только добавляет JSON-LD в head -->
  </div>
</template>
