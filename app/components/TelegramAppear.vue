<script setup lang="ts">

const props = defineProps<{ value?: string | null }>()

</script>

<template>
  <a v-if="value" class="telegram-link" :href="`https://t.me/${value?.replace('@', '')}`" target="_blank">
    {{ value }}
  </a>
  <span v-else>Не указан</span>
</template>

<style lang="scss" scoped>
.telegram-link {
  color: var(--el-color-primary);
}
</style>