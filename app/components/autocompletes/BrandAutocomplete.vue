<script setup lang="ts">
import { ref } from "vue";
import type { IBrand } from "~/types/brand";
import type { IBaseResponse } from "~/types";

interface Props {
  placeholder?: string;
}

withDefaults(defineProps<Props>(), {
  placeholder: "Введите название бренда",
});

const model = defineModel<number>();

const emit = defineEmits<{
  select: [brand: IBrand];
}>();

const { $api } = useNuxtApp();

const loading = ref(false);
const brands = ref<IBrand[]>([]);

const remoteSearch = async (query: string) => {
  loading.value = true;
  try {
    const res = await $api<IBaseResponse<IBrand[]>>(`/brands/search?q=${query}`);
    brands.value = res.data || [];
  } catch (error) {
    console.error("Error searching brands:", error);
    brands.value = [];
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
    size="large"
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