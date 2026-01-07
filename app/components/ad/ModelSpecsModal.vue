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
const config = useRuntimeConfig();

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
          <div class="model-image-wrapper">
            <el-image
              class="model-image"
              :preview-src-list="[config.public.apiUrl + modelData.image]"
              :src="config.public.apiUrl + modelData.image"
              fit="contain"
            />
          </div>
          <div class="model-info">
            <span class="brand-badge">{{ brand.name }}</span>
            <h2 class="model-name">{{ modelData.name }}</h2>
          </div>
        </div>
      </div>
    </template>

    <div v-html="modelData.specs"></div>

    <template #footer>
      <div class="flex justify-end pl-16 pr-16 pb-16">
        <el-button @click="handleClose">{{
          t("listingDetails.close")
        }}</el-button>
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

#specs-list {
  padding: 20px;
  background: var(--color-bg-secondary);
  max-height: 65vh;
  overflow-y: auto;

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

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-bottom: 16px;
    background: var(--color-bg-primary);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--color-border-light);

    &:last-child {
      margin-bottom: 0;
    }

    tbody {
      tr {
        transition: background-color 0.2s ease;

        &:hover {
          background: var(--color-bg-hover, rgba(0, 0, 0, 0.02));
        }

        &:not(:last-child) {
          td {
            border-bottom: 1px solid var(--color-border-light);
          }
        }
      }
    }

    th {
      background: var(--color-bg-secondary);
      color: var(--color-text-primary);
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 16px 20px;
      text-align: left;
      vertical-align: top;
      width: 120px;
      min-width: 120px;
      border-right: 1px solid var(--color-border-light);

      &.small-line-height {
        line-height: 1.3;
      }
    }

    td {
      padding: 12px 16px;
      font-size: 14px;
      color: var(--color-text-primary);
      vertical-align: top;

      &.ttl {
        font-weight: 600;
        color: var(--color-text-secondary);
        width: 140px;
        min-width: 140px;
        background: var(--color-bg-secondary);
      }

      &.nfo {
        color: var(--color-text-primary);
        line-height: 1.6;
        font-weight: 500;
      }

      a {
        color: inherit;
        text-decoration: none;
        pointer-events: none;
        cursor: default;
      }
    }

    hr.line {
      border: none;
      height: 1px;
      background: var(--color-border-light);
      margin: 8px 0;
    }

    sup {
      font-size: 10px;
    }
  }

  @media (max-width: 768px) {
    padding: 12px;
    max-height: 100%;

    table {
      display: block;
      margin-bottom: 12px;

      tbody {
        display: block;

        tr {
          &:not(:last-child) {
            td {
              border-bottom: none;
            }
          }
        }
      }

      tr {
        display: flex;
        flex-wrap: wrap;

        &:not(:last-child) {
          border-bottom: 1px solid var(--color-border-light);
        }
      }

      th {
        width: 100%;
        padding: 12px 16px;
        font-size: 12px;
        border-right: none;
      }

      td {
        padding: 10px 12px;

        &.ttl {
          width: 100%;
          background: transparent;
          padding-bottom: 4px;
          font-size: 12px;
        }

        &.nfo {
          width: 100%;
          padding-top: 0;
          padding-bottom: 12px;
        }
      }
    }
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
  padding: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.model-image-wrapper {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: 16px;
  background: var(--color-bg-primary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border-light);
}

.model-image {
  width: 80px;
  height: 80px;
  object-fit: contain;

  :deep(img) {
    object-fit: contain;
  }
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
    padding: 16px;
  }

  .header-content {
    gap: 16px;
  }

  .model-image-wrapper {
    width: 70px;
    height: 70px;
    border-radius: 12px;
  }

  .model-image {
    width: 55px;
    height: 55px;
  }

  .brand-badge {
    font-size: 10px;
    padding: 4px 10px;
  }

  .model-name {
    font-size: 18px;
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
