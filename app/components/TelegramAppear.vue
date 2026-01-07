<script setup lang="ts">

defineProps<{ value?: string | null }>()

const { t } = useI18n();

</script>

<template>
  <a v-if="value" class="telegram-link" :href="`https://t.me/${value?.replace('@', '')}`" target="_blank">
    {{ value }}
  </a>
  <span v-else>{{ t('telegram.notSpecified') }}</span>
</template>

<style lang="scss" scoped>
.telegram-link {
  color: var(--el-color-primary);
}
</style>