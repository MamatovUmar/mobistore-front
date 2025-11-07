<script setup lang="ts">
import { ref, watch } from "vue";
import type { ICity, ICityResponse } from "~/types/place";
import type { IBaseResponse } from "~/types";

interface Props {
  placeholder?: string;
  regionId?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Введите название города",
});

const model = defineModel<number>();

const emit = defineEmits<{
  select: [city: ICity];
}>();

const { $api } = useNuxtApp();

const loading = ref(false);
const cities = ref<ICity[]>([]);

const remoteSearch = async () => {
  if (!props.regionId) {
    cities.value = [];
    return;
  }

  loading.value = true;
  try {
    const url = `/places/regions/${props.regionId}/cities`;
    
    const res = await $api<IBaseResponse<ICityResponse>>(url);
    cities.value = res.data?.cities || [];
  } catch (error) {
    console.error("Error searching cities:", error);
    cities.value = [];
  } finally {
    loading.value = false;
  }
};

const handleChange = (value: number) => {
  const selectedCity = cities.value.find(c => c.id === value);
  if (selectedCity) {
    emit("select", selectedCity);
  }
};

// Сброс города при изменении региона
watch(() => props.regionId, () => {
  model.value = undefined;
  cities.value = [];
  remoteSearch();
});


onMounted(() => {
  remoteSearch();
});
</script>

<template>
  <el-select
    v-model="model"
    :placeholder="placeholder"
    :loading="loading"
    :disabled="!regionId"
    filterable
    reserve-keyword
    clearable
    size="large"
    @change="handleChange"
  >
    <el-option
      v-for="city in cities"
      :key="city.id"
      :label="city.name_ru"
      :value="city.id"
    />
  </el-select>
</template>

<style lang="scss" scoped>
.city-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .city-name {
    font-weight: 500;
    color: var(--color-text-primary);
  }
  
  .city-name-uz {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin-left: 8px;
  }
}
</style>