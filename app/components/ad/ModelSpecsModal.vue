<script setup lang="ts">
import type { IModel } from "~/types/model";
import type { IBrand } from "~/types/brand";

defineProps<{
  modelVisible: boolean;
  modelData: IModel;
  brand: IBrand;
}>();

const emit = defineEmits(["update:modelVisible"]);
const { t } = useI18n();

const isFull = ref(false);

const handleClose = () => {
  emit("update:modelVisible", false);
};

onMounted(() => {
  if (window.innerWidth < 768) {
    isFull.value = true;
  }
  window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
      isFull.value = true;
    } else {
      isFull.value = false;
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", () => {});
});
</script>

<template>
  <el-dialog
    :model-value="modelVisible"
    :close-on-click-modal="true"
    :fullscreen="isFull"
    style="width: 100%; max-width: 800px"
    class="specs-dialog"
    @update:model-value="handleClose"
  >
    <template #header>
      <div class="modal-header">
        <div class="header-content">
          <h2 class="model-name">{{ modelData.name }}</h2>
        </div>
      </div>
    </template>

    <div class="specs-modal">
      <!-- Общая информация -->
      <div class="spec-group">
        <h3 class="spec-group-title">{{ t('listingDetails.specs.general') }}</h3>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.model') }}</span>
          <span class="spec-value">{{ modelData.name }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.brand') }}</span>
          <span class="spec-value">{{ brand.name }}</span>
        </div>
        <div v-if="modelData?.launch?.announced" class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.announceDate') }}</span>
          <span class="spec-value">{{ modelData?.launch?.announced }}</span>
        </div>
        <div v-if="modelData?.launch?.released" class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.releaseDate') }}</span>
          <span class="spec-value">{{ modelData?.launch?.released }}</span>
        </div>
        <div v-if="modelData?.colors?.length" class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.colors') }}</span>
          <span class="spec-value">{{ modelData?.colors?.join(", ") }}</span>
        </div>
      </div>

      <!-- Корпус -->
      <div v-if="modelData.body" class="spec-group">
        <h3 class="spec-group-title">{{ t('listingDetails.specs.body') }}</h3>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.dimensions') }}</span>
          <span class="spec-value">{{ modelData.body.dimensions }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.weight') }}</span>
          <span class="spec-value">{{ modelData.body.weight }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.materials') }}</span>
          <span class="spec-value">{{ modelData?.body?.build }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.sim') }}</span>
          <span class="spec-value">{{ modelData.body.sim }}</span>
        </div>
      </div>

      <!-- Дисплей -->
      <div class="spec-group" v-if="modelData.display">
        <h3 class="spec-group-title">{{ t('listingDetails.specs.display') }}</h3>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.type') }}</span>
          <span class="spec-value">{{ modelData.display.type }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.size') }}</span>
          <span class="spec-value">{{ modelData.display.size }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.resolution') }}</span>
          <span class="spec-value">{{ modelData.display.resolution }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.protection') }}</span>
          <span class="spec-value">{{ modelData.display.protection }}</span>
        </div>
      </div>

      <!-- Платформа -->
      <div v-if="modelData?.platform" class="spec-group">
        <h3 class="spec-group-title">{{ t('listingDetails.specs.platform') }}</h3>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.os') }}</span>
          <span class="spec-value">{{ modelData?.platform?.os }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.chipset') }}</span>
          <span class="spec-value">{{ modelData?.platform?.chipset }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.cpu') }}</span>
          <span class="spec-value">{{ modelData?.platform?.cpu }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.gpu') }}</span>
          <span class="spec-value">{{ modelData?.platform?.gpu }}</span>
        </div>
      </div>

      <!-- Память -->
      <div v-if="modelData?.memory" class="spec-group">
        <h3 class="spec-group-title">{{ t('listingDetails.specs.memory') }}</h3>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.cardSlot') }}</span>
          <span class="spec-value">{{ modelData?.memory?.cardSlot }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.internal') }}</span>
          <span class="spec-value">{{ modelData?.memory?.internal }}</span>
        </div>
      </div>

      <!-- Основная камера -->
      <div v-if="modelData?.cameras?.mainCamera" class="spec-group">
        <h3 class="spec-group-title">{{ t('listingDetails.specs.mainCamera') }}</h3>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.type') }}</span>
          <span class="spec-value">{{
            modelData?.cameras?.mainCamera?.type
          }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.cameras') }}</span>
          <div class="spec-list">
            <div
              v-for="(camera, index) in modelData?.cameras?.mainCamera
                ?.cameraSpecs"
              :key="index"
            >
              {{ camera }}
            </div>
          </div>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.features') }}</span>
          <div class="spec-list">
            <div
              v-for="(feature, index) in modelData?.cameras?.mainCamera
                ?.features"
              :key="index"
            >
              {{ feature }}
            </div>
          </div>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.video') }}</span>
          <div class="spec-list">
            <div
              v-for="(video, index) in modelData?.cameras?.mainCamera?.video"
              :key="index"
            >
              {{ video }}
            </div>
          </div>
        </div>
      </div>

      <!-- Фронтальная камера -->
      <div v-if="modelData?.cameras?.selfieCamera" class="spec-group">
        <h3 class="spec-group-title">{{ t('listingDetails.specs.selfieCamera') }}</h3>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.type') }}</span>
          <span class="spec-value">{{
            modelData?.cameras?.selfieCamera?.type
          }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.cameras') }}</span>
          <div class="spec-list">
            <div
              v-for="(camera, index) in modelData?.cameras?.selfieCamera
                ?.cameraSpecs"
              :key="index"
            >
              {{ camera }}
            </div>
          </div>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.features') }}</span>
          <div class="spec-list">
            <div
              v-for="(feature, index) in modelData?.cameras?.selfieCamera
                ?.features"
              :key="index"
            >
              {{ feature }}
            </div>
          </div>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.video') }}</span>
          <div class="spec-list">
            <div
              v-for="(video, index) in modelData?.cameras?.selfieCamera?.video"
              :key="index"
            >
              {{ video }}
            </div>
          </div>
        </div>
      </div>

      <!-- Батарея -->
      <div v-if="modelData?.battery" class="spec-group">
        <h3 class="spec-group-title">{{ t('listingDetails.specs.battery') }}</h3>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.type') }}</span>
          <span class="spec-value">{{ modelData?.battery?.type }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.charging') }}</span>
          <div class="spec-list">
            <div
              v-for="(charging, index) in modelData?.battery?.charging"
              :key="index"
            >
              {{ charging }}
            </div>
          </div>
        </div>
      </div>

      <!-- Связь -->
      <div v-if="modelData?.comms" class="spec-group">
        <h3 class="spec-group-title">{{ t('listingDetails.specs.comms') }}</h3>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.wifi') }}</span>
          <span class="spec-value">{{ modelData?.comms?.wlan }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.bluetooth') }}</span>
          <span class="spec-value">{{ modelData?.comms?.bluetooth }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.gps') }}</span>
          <span class="spec-value">{{ modelData?.comms?.positioning }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.nfc') }}</span>
          <span class="spec-value">{{ modelData?.comms?.nfc }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.radio') }}</span>
          <span class="spec-value">{{ modelData?.comms?.radio }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.usb') }}</span>
          <span class="spec-value">{{ modelData?.comms?.usb }}</span>
        </div>
      </div>

      <!-- Сеть -->
      <div v-if="modelData?.network" class="spec-group">
        <h3 class="spec-group-title">{{ t('listingDetails.specs.network') }}</h3>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.tech') }}</span>
          <span class="spec-value">{{ modelData?.network?.technology }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.bands2g') }}</span>
          <span class="spec-value">{{ modelData?.network?.["2g"] }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.bands3g') }}</span>
          <span class="spec-value">{{ modelData?.network?.["3g"] }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.bands4g') }}</span>
          <span class="spec-value">{{ modelData?.network?.["4g"] }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.bands5g') }}</span>
          <span class="spec-value">{{ modelData?.network?.["5g"] }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.speed') }}</span>
          <span class="spec-value">{{ modelData?.network?.speed }}</span>
        </div>
      </div>

      <!-- Сенсоры -->
      <div v-if="modelData?.features" class="spec-group">
        <h3 class="spec-group-title">{{ t('listingDetails.specs.sensors') }}</h3>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.sensorsLabel') }}</span>
          <span class="spec-value">{{ modelData?.features?.sensors }}</span>
        </div>
      </div>

      <!-- Звук -->
      <div v-if="modelData?.sound" class="spec-group">
        <h3 class="spec-group-title">{{ t('listingDetails.specs.sound') }}</h3>
        <div class="spec-row">
          <span class="spec-label">{{ t('listingDetails.specs.loudspeaker') }}</span>
          <span class="spec-value">{{ modelData?.sound?.loudspeaker }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end pl-16 pr-16 pb-16">
        <el-button @click="handleClose">{{ t('listingDetails.close') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.specs-dialog {
  padding: 0 !important;
  .el-dialog__body {
    height: calc(100% - 182px) !important;
  }
}
</style>

<style lang="scss" scoped>
:deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 0;
  margin: 0;
  border-bottom: 1px solid var(--color-border-light);
}

:deep(.el-dialog__body) {
  padding: 0;
  height: calc(100% - 200px);
}

:deep(.el-dialog__footer) {
  padding: 20px 32px;
  border-top: 1px solid var(--color-border-light);
  background: var(--color-bg-secondary);
}

.modal-header {
  padding: 20px 20px 0;
  background: var(--color-bg-primary);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 6px 14px;
  background: var(--color-primary);
  color: white;
  border-radius: 6px;
}

.model-name {
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.specs-modal {
  max-height: 65vh;
  overflow-y: auto;
  padding: 20px;
  background: var(--color-bg-secondary);
  height: -webkit-fill-available;

  /* Кастомный скроллбар */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border-medium);
    border-radius: 4px;

    &:hover {
      background: var(--color-border-dark);
    }
  }
}

.spec-group {
  margin-bottom: 28px;
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 10px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:last-child {
    margin-bottom: 0;
  }
}

.spec-group-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-primary);
  display: flex;
  align-items: center;
  gap: 10px;

  &:before {
    content: "";
    width: 4px;
    height: 20px;
    background: var(--color-primary);
    border-radius: 2px;
  }
}

.spec-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
  padding: 14px 0;
  align-items: start;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border-light);
  }
}

.spec-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.spec-value {
  font-size: 14px;
  color: var(--color-text-primary);
  line-height: 1.7;
  font-weight: 500;
}

.spec-list {
  font-size: 14px;
  color: var(--color-text-primary);
  line-height: 1.8;

  div {
    padding: 6px 0 6px 20px;
    position: relative;
    background: var(--color-bg-secondary);
    margin-bottom: 6px;
    border-radius: 6px;
    padding: 8px 12px 8px 28px;

    &:before {
      content: "✓";
      position: absolute;
      left: 10px;
      color: var(--color-primary);
      font-weight: bold;
      font-size: 14px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 95% !important;
    margin: 20px auto;
  }

  .modal-header {
    padding: 24px 20px 20px;
  }

  .brand-badge {
    font-size: 11px;
    padding: 5px 12px;
  }

  .model-name {
    font-size: 22px;
  }

  .header-divider {
    width: 50px;
    height: 2px;
  }

  .specs-modal {
    padding: 20px 16px;
    max-height: 100%;
  }

  .spec-group {
    padding: 16px;
  }

  .spec-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .spec-label {
    font-size: 12px;
  }
}
</style>
