<script setup lang="ts">
import { ref } from "vue";
import ModelSpecsModal from "./ModelSpecsModal.vue";
import type { IListing } from '~/types/ads';

const { listing } = defineProps<{
  listing: IListing;
}>();

const { t } = useI18n();

// Пример данных модели - в реальном приложении придут из API
const modelData = computed(() => listing.model);

const showModelSpecs = ref(false);

const openModelSpecs = () => {
  showModelSpecs.value = true;
};

// Формируем значение памяти
const memoryValue = computed(() => {
  // Если есть storage или ram в объявлении, показываем их
  if (listing.storage || listing.ram) {
    const parts = [];
    if (listing.storage) parts.push(`${listing.storage} ГБ`);
    if (listing.ram) parts.push(`${listing.ram} ГБ RAM`);
    return parts.join(' / ');
  }
  // Иначе показываем данные из модели
  return modelData.value?.memory?.internal || "—";
});

// Основные характеристики для отображения на странице
const mainSpecs = computed(() => [
  {
    label: t("listingDetails.specs.color"),
    value: listing?.color || "—",
  },
  {
    label: t("listingDetails.specs.os"),
    value: listing?.ram || "—",
  },
  {
    label: t("listingDetails.specs.memory"),
    value: memoryValue.value,
  },
  {
    label: t("listingDetails.specs.screen"),
    value: modelData.value?.display?.size || "—",
  },
  {
    label: t("listingDetails.specs.screenType"),
    value: modelData.value?.display?.type || "—",
  },
  {
    label: t("listingDetails.specs.battery"),
    value: modelData.value?.battery?.type || "—",
  },
]);
</script>

<template>
  <div v-if="listing" class="specs-section">
    <div class="specs-header">
      <h2 class="section-title">{{ t('listingDetails.characteristics') }}</h2>
      <el-button type="info" plain @click="openModelSpecs">
        {{ t('listingDetails.fullCharacteristics') }}
      </el-button>
    </div>

    <div class="specs-grid">
      <div v-for="spec in mainSpecs" :key="spec.label" class="spec-item">
        <div class="spec-label">{{ spec.label }}</div>
        <div class="spec-value">{{ spec.value }}</div>
      </div>
    </div>

    <!-- Модалка с полными характеристиками -->
    <ModelSpecsModal
      v-if="modelData && listing.brand"
      v-model:model-visible="showModelSpecs"
      :model-data="modelData"
      :brand="listing.brand"
    />
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
