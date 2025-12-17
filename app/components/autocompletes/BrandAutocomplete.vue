<script setup lang="ts">
import { ref, watch } from "vue";
import type { IBrand } from "~/types/brand";
import type { IBaseResponse } from "~/types";

interface Props {
  placeholder?: string;
  size?: "large" | "small";
  initData?: IBrand;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Введите название бренда",
});

const model = defineModel<number>();

const emit = defineEmits<{
  select: [brand: IBrand];
}>();

const { $api } = useNuxtApp();

const loading = ref(false);
// Инициализируем список брендов с initData для SSR
const brands = ref<IBrand[]>(props.initData ? [props.initData] : []);

const remoteSearch = async (query: string) => {
  loading.value = true;
  try {
    const res = await $api<IBaseResponse<IBrand[]>>(`/brands/search?q=${query}`);
    const loadedBrands = res.data || [];
    
    // Сохраняем initData в списке если оно есть и не входит в загруженные бренды
    if (props.initData && !loadedBrands.find(b => b.id === props.initData!.id)) {
      brands.value = [props.initData, ...loadedBrands];
    } else {
      brands.value = loadedBrands;
    }
  } catch (error) {
    console.error("Error searching brands:", error);
    // Сохраняем initData даже при ошибке
    brands.value = props.initData ? [props.initData] : [];
  } finally {
    loading.value = false;
  }
};

const handleChange = (value: number) => {
  const selectedBrand = brands.value.find(b => b.id === value);
  if (selectedBrand) {
    emit("select", selectedBrand);
  }
};

// Следим за изменениями initData
watch(() => props.initData, (newData) => {
  if (newData) {
    // Добавляем initData в список если его там нет
    if (!brands.value.find(b => b.id === newData.id)) {
      brands.value = [newData, ...brands.value];
    }
    model.value = newData.id;
  }
}, { immediate: true });
</script>

<template>
  <el-select
    v-model="model"
    :placeholder="placeholder"
    :loading="loading"
    filterable
    reserve-keyword
    remote
    clearable
    :remote-method="remoteSearch"
    :size
    @change="handleChange"
    @focus="remoteSearch('')"
  >
    <el-option
      v-for="brand in brands"
      :key="brand.id"
      :label="brand.name"
      :value="brand.id"
    />
  </el-select>
</template>

<style lang="scss" scoped>
</style>