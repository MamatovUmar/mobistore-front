<script setup lang="ts">
import { ref } from "vue";
import ModelSpecsModal from "./ModelSpecsModal.vue";

// Пример данных модели - в реальном приложении придут из API
const modelData = ref({
  id: 3,
  name: "Apple iPhone 16 Pro Max",
  brand: {
    id: 6,
    name: "Apple",
  },
  battery: {
    type: "Li-Ion 4685 mAh",
    charging: [
      "Wired, PD2.0, 50% in 30 min",
      "25W wireless (MagSafe), 15W wireless (China only)",
      "15W wireless (Qi2)",
      "4.5W reverse wired",
    ],
  },
  platform: {
    os: "iOS 18, upgradable to iOS 18.4",
    chipset: "Apple A18 Pro (3 nm)",
    cpu: "Hexa-core (2x4.05 GHz + 4x2.42 GHz)",
    gpu: "Apple GPU (6-core graphics)",
  },
  display: {
    type: "LTPO Super Retina XDR OLED, 120Hz, HDR10, Dolby Vision",
    size: "6.9 inches",
    resolution: "1320 x 2868 pixels (~460 ppi density)",
    protection: "Ceramic Shield glass (2024 gen)",
  },
  memory: {
    cardSlot: "No",
    internal: "256GB 8GB RAM, 512GB 8GB RAM, 1TB 8GB RAM",
  },
  cameras: {
    mainCamera: {
      type: "triple",
      cameraSpecs: [
        '48 MP, f/1.8, 24mm (wide)',
        '12 MP, f/2.8, 120mm (periscope telephoto)',
        '48 MP, f/2.2, 13mm (ultrawide)',
      ],
    },
  },
});

const showModelSpecs = ref(false);

const openModelSpecs = () => {
  showModelSpecs.value = true;
};

// Основные характеристики для отображения на странице
const mainSpecs = [
  {
    label: "Процессор",
    value: modelData.value.platform?.chipset || "—",
  },
  {
    label: "Операционная система",
    value: modelData.value.platform?.os || "—",
  },
  {
    label: "Память",
    value: modelData.value.memory?.internal || "—",
  },
  {
    label: "Экран",
    value: modelData.value.display?.size || "—",
  },
  {
    label: "Тип экрана",
    value: modelData.value.display?.type || "—",
  },
  {
    label: "Батарея",
    value: modelData.value.battery?.type || "—",
  },
];
</script>

<template>
  <div class="specs-section">
    <div class="specs-header">
      <h2 class="section-title">Характеристики</h2>
      <el-button type="info" plain @click="openModelSpecs">
        Полные характеристики модели
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
      v-model:model-visible="showModelSpecs"
      :model-data="modelData"
    />
  </div>
</template>

<style lang="scss" scoped>
.specs-section {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 28px;
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
