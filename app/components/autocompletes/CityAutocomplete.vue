<script setup lang="ts">
import { ref, watch } from "vue";
import type { ICity, ICityResponse } from "~/types/place";
import type { IBaseResponse } from "~/types";

interface Props {
  placeholder?: string;
  regionId?: number;
  initData?: ICity;
}

const props = defineProps<Props>();

const model = defineModel<number>();

const emit = defineEmits<{
  select: [city: ICity];
}>();

const { $api } = useNuxtApp();
const { locale, t } = useI18n();

const computedPlaceholder = computed(() => props.placeholder ?? t("components.city.placeholder"));

const loading = ref(false);
// Инициализируем список городов с initData для SSR
const cities = ref<ICity[]>(props.initData ? [props.initData] : []);

const remoteSearch = async () => {
  if (!props.regionId) {
    cities.value = [];
    return;
  }

  loading.value = true;
  try {
    const url = `/places/regions/${props.regionId}/cities`;
    
    const res = await $api<IBaseResponse<ICityResponse>>(url);
    const loadedCities = res.data?.cities || [];
    
    // Сохраняем initData в списке если оно есть и не входит в загруженные города
    if (props.initData && !loadedCities.find(c => c.id === props.initData!.id)) {
      cities.value = [props.initData, ...loadedCities];
    } else {
      cities.value = loadedCities;
    }
  } catch (error) {
    console.error("Error searching cities:", error);
    // Сохраняем initData даже при ошибке
    cities.value = props.initData ? [props.initData] : [];
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

// Следим за изменениями initData
watch(() => props.initData, (newData) => {
  if (newData) {
    // Добавляем initData в список если его там нет
    if (!cities.value.find(c => c.id === newData.id)) {
      cities.value = [newData, ...cities.value];
    }
    model.value = newData.id;
  }
}, { immediate: true });

// Сброс города при изменении региона
watch(() => props.regionId, (newRegionId, oldRegionId) => {
  // Сбрасываем город только если регион действительно изменился (не первая загрузка)
  if (oldRegionId !== undefined && newRegionId !== oldRegionId) {
    model.value = undefined;
    cities.value = [];
  }
  if (newRegionId) {
    remoteSearch();
  }
}, { immediate: true });
</script>

<template>
  <el-select
    v-model="model"
    :placeholder="computedPlaceholder"
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
      :label="city[`name_${locale}`]"
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