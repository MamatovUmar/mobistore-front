<script setup lang="ts">
import { onMounted } from "vue";
import { usePlacesStore } from "~/store/places";
import type { IRegion } from "~/types/place";

interface Props {
  placeholder?: string;
}

withDefaults(defineProps<Props>(), {
  placeholder: "Выберите регион",
});

const model = defineModel<number>();

const emit = defineEmits<{
  select: [region: IRegion];
}>();

const placesStore = usePlacesStore();

const handleChange = (value: number) => {
  const selectedRegion = placesStore.regions.find(r => r.id === value);
  if (selectedRegion) {
    emit("select", selectedRegion);
  }
};

// Загружаем регионы при монтировании компонента
onMounted(() => {
  placesStore.fetchRegions();
});
</script>

<template>
  <el-select
    v-model="model"
    :placeholder="placeholder"
    :loading="placesStore.regionsLoading"
    filterable
    clearable
    size="large"
    @change="handleChange"
  >
    <el-option
      v-for="region in placesStore.regions"
      :key="region.id"
      :label="region.name_ru"
      :value="region.id"
    />
  </el-select>
</template>

<style lang="scss" scoped>
</style>