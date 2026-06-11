<script setup lang="ts">
import { ref, computed } from "vue";
import { ArrowRight, Iphone } from "@element-plus/icons-vue";
import type { IModel } from "~/types/model";
import type { IBrand } from "~/types/brand";

const { model, brand } = defineProps<{
  model: IModel;
  brand?: IBrand;
}>();

const emit = defineEmits<{
  open: [];
}>();

const { t } = useI18n();
const config = useRuntimeConfig();

const imgError = ref(false);

const imageUrl = computed(() =>
  model.image ? `${config.public.apiUrl}${model.image}` : null
);

// Категории-тизеры — намёк на то, что внутри полных характеристик
const teasers = computed(() => [
  t("listingDetails.specs.screen"),
  t("listingDetails.specs.cameras"),
  t("listingDetails.specs.processor"),
  t("listingDetails.specs.battery"),
]);
</script>

<template>
  <div class="specs-card">
    <div class="specs-card__head">
      <div class="specs-card__thumb">
        <el-image
          v-if="imageUrl && !imgError"
          :src="imageUrl"
          fit="contain"
          class="specs-card__img"
          @error="imgError = true"
        />
        <el-icon v-else :size="28"><Iphone /></el-icon>
      </div>
      <div class="specs-card__title">
        <span class="specs-card__label">{{
          t("listingDetails.specsCard.label")
        }}</span>
        <span class="specs-card__name">
          {{ brand?.name ? `${brand.name} ` : "" }}{{ model.name }}
        </span>
      </div>
    </div>

    <div class="specs-card__teasers">
      <span v-for="item in teasers" :key="item" class="specs-card__chip">
        {{ item }}
      </span>
    </div>

    <el-button
      type="primary"
      size="large"
      class="specs-card__cta"
      @click="emit('open')"
    >
      {{ t("listingDetails.specsCard.cta") }}
      <el-icon class="specs-card__cta-icon"><ArrowRight /></el-icon>
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.specs-card {
  background: var(--color-bg-primary);
  border: 2px solid var(--color-primary);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.specs-card__head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.specs-card__thumb {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  overflow: hidden;
}

.specs-card__img {
  width: 48px;
  height: 48px;
}

.specs-card__title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.specs-card__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
}

.specs-card__name {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.specs-card__teasers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.specs-card__chip {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  border-radius: 8px;
  padding: 5px 10px;
}

.specs-card__cta {
  width: 100%;
}

.specs-card__cta-icon {
  margin-left: 6px;
}
</style>
