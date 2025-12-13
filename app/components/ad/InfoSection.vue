<script setup lang="ts">
import type { IListing } from "~/types/ads";

const { listing } = defineProps<{
  listing: IListing;
}>();
</script>

<template>
  <div class="description-section">
    <h2 class="section-title">Описание</h2>
    <ClientOnly>
      <p class="description-text" v-html="listing.description"></p>
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
.description-section {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-top: 20px;
  word-break: break-all;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  margin-top: 10px;
  color: var(--color-text-primary);
}

.description-text,
.description-text * {
  color: var(--color-text-secondary) !important;
  font-size: 16px;
  line-height: 1.8;
}
</style>
