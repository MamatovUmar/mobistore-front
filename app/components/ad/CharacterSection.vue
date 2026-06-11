<script setup lang="ts">
import { Tickets } from "@element-plus/icons-vue";
import type { IListing } from '~/types/ads';

const { listing } = defineProps<{
  listing: IListing;
}>();

const emit = defineEmits<{
  "open-specs": [];
}>();

const { t } = useI18n();

const modelData = computed(() => listing.model);

// Основные характеристики для отображения на странице
const mainSpecs = computed(() => [
  {
    label: t("listingDetails.specs.color"),
    value: listing?.color || "—",
  },
  {
    label: t("listingDetails.specs.ram"),
    value: listing?.ram ? `${listing.ram} ${listing.ram_unit}` : "—",
  },
  {
    label: t("listingDetails.specs.storage"),
    value: listing?.storage ? `${listing.storage} ${listing.storage_unit}` : "—",
  },
  {
    label: t("listingDetails.specs.screen"),
    value: modelData.value?.display_size || "—",
  },
  {
    label: t("listingDetails.specs.screenType"),
    value: modelData.value?.display_type || "—",
  },
  {
    label: t("listingDetails.specs.battery"),
    value: modelData.value?.battery_type || "—",
  },
]);
</script>

<template>
  <div v-if="listing" class="specs-section">
    <div class="specs-header">
      <h2 class="section-title">{{ t('listingDetails.characteristics') }}</h2>
    </div>

    <div class="specs-grid">
      <div v-for="spec in mainSpecs" :key="spec.label" class="spec-item">
        <div class="spec-label">{{ spec.label }}</div>
        <div class="spec-value">{{ spec.value }}</div>
      </div>
    </div>

    <!-- Контекстный переход к полным характеристикам модели -->
    <el-button
      v-if="modelData"
      class="full-specs-btn"
      size="large"
      @click="emit('open-specs')"
    >
      <el-icon class="full-specs-btn__icon"><Tickets /></el-icon>
      {{ t('listingDetails.fullCharacteristics') }}
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.specs-section {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-top: 20px;
}

.specs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary);
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.spec-item {
  padding: 16px;
  background: var(--color-bg-secondary);
  border-radius: 10px;
}

.spec-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.spec-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
}

.full-specs-btn {
  width: 100%;
  margin-top: 20px;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  background: transparent;
  font-weight: 600;

  &:hover,
  &:focus {
    background: var(--color-primary);
    color: var(--color-bg-primary);
    border-color: var(--color-primary);
  }
}

.full-specs-btn__icon {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .specs-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .specs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
