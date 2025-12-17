<script setup lang="ts">
import { watch } from "vue";
import { usePlacesStore } from "~/store/places";
import type { IRegion } from "~/types/place";

interface Props {
  placeholder?: string;
  initData?: IRegion;
}

const props = defineProps<Props>();

const model = defineModel<number>();

const emit = defineEmits<{
  select: [region: IRegion];
}>();

const placesStore = usePlacesStore();
const { locale, t } = useI18n();

const computedPlaceholder = computed(() => props.placeholder ?? t("components.region.placeholder"));

const handleChange = (value: number) => {
  const selectedRegion = placesStore.regions.find(r => r.id === value);
  if (selectedRegion) {
    emit("select", selectedRegion);
  }
};

// Загружаем регионы сразу для SSR
placesStore.fetchRegions();

// Следим за изменениями initData
watch(() => props.initData, (newData) => {
  if (newData) {
    model.value = newData.id;
  }
}, { immediate: true });
</script>

<template>
  <el-select
    v-model="model"
    :placeholder="computedPlaceholder"
    :loading="placesStore.regionsLoading"
    filterable
    clearable
    size="large"
    @change="handleChange"
  >
    <el-option
      v-for="region in placesStore.regions"
      :key="region.id"
      :label="region[`name_${locale}`]"
      :value="region.id"
    />
  </el-select>
</template>

<style lang="scss" scoped>
</style>