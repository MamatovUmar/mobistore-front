<script setup lang="ts">
import type { IModel } from '~/types/model';
import type { IBrand } from '~/types/brand';

defineProps<{
  modelVisible: boolean;
  modelData: IModel;
  brand: IBrand;
}>();

const emit = defineEmits(["update:modelVisible"]);

const handleClose = () => {
  emit("update:modelVisible", false);
};
</script>

<template>
  <el-dialog
    :model-value="modelVisible"
    width="950px"
    :close-on-click-modal="true"
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
        <h3 class="spec-group-title">Общая информация</h3>
        <div class="spec-row">
          <span class="spec-label">Модель</span>
          <span class="spec-value">{{ modelData.name }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Бренд</span>
          <span class="spec-value">{{ brand.name }}</span>
        </div>
        <div v-if="modelData?.launch?.announced" class="spec-row">
          <span class="spec-label">Дата анонса</span>
          <span class="spec-value">{{ modelData?.launch?.announced }}</span>
        </div>
        <div v-if="modelData?.launch?.released" class="spec-row">
          <span class="spec-label">Дата выхода</span>
          <span class="spec-value">{{ modelData?.launch?.released }}</span>
        </div>
        <div v-if="modelData?.colors?.length" class="spec-row">
          <span class="spec-label">Доступные цвета</span>
          <span class="spec-value">{{ modelData?.colors?.join(", ") }}</span>
        </div>
      </div>

      <!-- Корпус -->
      <div v-if="modelData.body" class="spec-group">
        <h3 class="spec-group-title">Корпус</h3>
        <div class="spec-row">
          <span class="spec-label">Размеры</span>
          <span class="spec-value">{{ modelData.body.dimensions }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Вес</span>
          <span class="spec-value">{{ modelData.body.weight }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Материалы</span>
          <span class="spec-value">{{ modelData?.body?.build }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">SIM</span>
          <span class="spec-value">{{ modelData.body.sim }}</span>
        </div>
      </div>

      <!-- Дисплей -->
      <div class="spec-group" v-if="modelData.display">
        <h3 class="spec-group-title">Дисплей</h3>
        <div class="spec-row">
          <span class="spec-label">Тип</span>
          <span class="spec-value">{{ modelData.display.type }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Размер</span>
          <span class="spec-value">{{ modelData.display.size }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Разрешение</span>
          <span class="spec-value">{{ modelData.display.resolution }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Защита</span>
          <span class="spec-value">{{ modelData.display.protection }}</span>
        </div>
      </div>

      <!-- Платформа -->
      <div v-if="modelData?.platform" class="spec-group">
        <h3 class="spec-group-title">Платформа</h3>
        <div class="spec-row">
          <span class="spec-label">Операционная система</span>
          <span class="spec-value">{{ modelData?.platform?.os }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Чипсет</span>
          <span class="spec-value">{{ modelData?.platform?.chipset }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Процессор</span>
          <span class="spec-value">{{ modelData?.platform?.cpu }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Графический процессор</span>
          <span class="spec-value">{{ modelData?.platform?.gpu }}</span>
        </div>
      </div>

      <!-- Память -->
      <div v-if="modelData?.memory" class="spec-group">
        <h3 class="spec-group-title">Память</h3>
        <div class="spec-row">
          <span class="spec-label">Слот для карты</span>
          <span class="spec-value">{{ modelData?.memory?.cardSlot }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Встроенная память</span>
          <span class="spec-value">{{ modelData?.memory?.internal }}</span>
        </div>
      </div>

      <!-- Основная камера -->
      <div v-if="modelData?.cameras?.mainCamera" class="spec-group">
        <h3 class="spec-group-title">Основная камера</h3>
        <div class="spec-row">
          <span class="spec-label">Тип</span>
          <span class="spec-value">{{ modelData?.cameras?.mainCamera?.type }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Камеры</span>
          <div class="spec-list">
            <div v-for="(camera, index) in modelData?.cameras?.mainCamera?.cameraSpecs" :key="index">
              {{ camera }}
            </div>
          </div>
        </div>
        <div class="spec-row">
          <span class="spec-label">Функции</span>
          <div class="spec-list">
            <div v-for="(feature, index) in modelData?.cameras?.mainCamera?.features" :key="index">
              {{ feature }}
            </div>
          </div>
        </div>
        <div class="spec-row">
          <span class="spec-label">Видео</span>
          <div class="spec-list">
            <div v-for="(video, index) in modelData?.cameras?.mainCamera?.video" :key="index">
              {{ video }}
            </div>
          </div>
        </div>
      </div>

      <!-- Фронтальная камера -->
      <div v-if="modelData?.cameras?.selfieCamera" class="spec-group">
        <h3 class="spec-group-title">Фронтальная камера</h3>
        <div class="spec-row">
          <span class="spec-label">Тип</span>
          <span class="spec-value">{{ modelData?.cameras?.selfieCamera?.type }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Камеры</span>
          <div class="spec-list">
            <div v-for="(camera, index) in modelData?.cameras?.selfieCamera?.cameraSpecs" :key="index">
              {{ camera }}
            </div>
          </div>
        </div>
        <div class="spec-row">
          <span class="spec-label">Функции</span>
          <div class="spec-list">
            <div v-for="(feature, index) in modelData?.cameras?.selfieCamera?.features" :key="index">
              {{ feature }}
            </div>
          </div>
        </div>
        <div class="spec-row">
          <span class="spec-label">Видео</span>
          <div class="spec-list">
            <div v-for="(video, index) in modelData?.cameras?.selfieCamera?.video" :key="index">
              {{ video }}
            </div>
          </div>
        </div>
      </div>

      <!-- Батарея -->
      <div v-if="modelData?.battery" class="spec-group">
        <h3 class="spec-group-title">Батарея</h3>
        <div class="spec-row">
          <span class="spec-label">Тип</span>
          <span class="spec-value">{{ modelData?.battery?.type }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Зарядка</span>
          <div class="spec-list">
            <div v-for="(charging, index) in modelData?.battery?.charging" :key="index">
              {{ charging }}
            </div>
          </div>
        </div>
      </div>

      <!-- Связь -->
      <div v-if="modelData?.comms" class="spec-group">
        <h3 class="spec-group-title">Связь и коммуникации</h3>
        <div class="spec-row">
          <span class="spec-label">Wi-Fi</span>
          <span class="spec-value">{{ modelData?.comms?.wlan }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Bluetooth</span>
          <span class="spec-value">{{ modelData?.comms?.bluetooth }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">GPS</span>
          <span class="spec-value">{{ modelData?.comms?.positioning }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">NFC</span>
          <span class="spec-value">{{ modelData?.comms?.nfc }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Радио</span>
          <span class="spec-value">{{ modelData?.comms?.radio }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">USB</span>
          <span class="spec-value">{{ modelData?.comms?.usb }}</span>
        </div>
      </div>

      <!-- Сеть -->
      <div v-if="modelData?.network" class="spec-group">
        <h3 class="spec-group-title">Сеть</h3>
        <div class="spec-row">
          <span class="spec-label">Технологии</span>
          <span class="spec-value">{{ modelData?.network?.technology }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">2G диапазоны</span>
          <span class="spec-value">{{ modelData?.network?.["2g"] }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">3G диапазоны</span>
          <span class="spec-value">{{ modelData?.network?.["3g"] }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">4G диапазоны</span>
          <span class="spec-value">{{ modelData?.network?.["4g"] }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">5G диапазоны</span>
          <span class="spec-value">{{ modelData?.network?.["5g"] }}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label">Скорость</span>
          <span class="spec-value">{{ modelData?.network?.speed }}</span>
        </div>
      </div>

      <!-- Сенсоры -->
      <div v-if="modelData?.features" class="spec-group">
        <h3 class="spec-group-title">Сенсоры и функции</h3>
        <div class="spec-row">
          <span class="spec-label">Сенсоры</span>
          <span class="spec-value">{{ modelData?.features?.sensors }}</span>
        </div>
      </div>

      <!-- Звук -->
      <div v-if="modelData?.sound" class="spec-group">
        <h3 class="spec-group-title">Звук</h3>
        <div class="spec-row">
          <span class="spec-label">Громкоговоритель</span>
          <span class="spec-value">{{ modelData?.sound?.loudspeaker }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">Закрыть</el-button>
    </template>
  </el-dialog>
</template>

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
    max-height: 60vh;
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
