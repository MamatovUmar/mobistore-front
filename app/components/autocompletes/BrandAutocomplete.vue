<script setup lang="ts">
import { ref, watch } from "vue";
import type { IBrand } from "~/types/brand";
import type { IBaseResponse } from "~/types";

const OTHER_BRAND_VALUE = -1;

interface Props {
  placeholder?: string;
  size?: "large" | "small" | "default";
  initData?: IBrand;
  other?: boolean;
}

const props = defineProps<Props>();

const model = defineModel<number | null>();

const emit = defineEmits<{
  select: [brand: IBrand | null];
  selectOther: [];
}>();

const { $api } = useNuxtApp();
const { t } = useI18n();

const computedPlaceholder = computed(() => props.placeholder ?? t("components.brand.placeholder"));

const loading = ref(false);
const allBrands = ref<IBrand[]>([]);
const searchQuery = ref("");

// Загружаем все бренды
const fetchBrands = async () => {
  loading.value = true;
  try {
    const res = await $api<IBaseResponse<IBrand[]>>("/brands");
    allBrands.value = res.data || [];
  } catch (error) {
    console.error("Error loading brands:", error);
    allBrands.value = [];
  } finally {
    loading.value = false;
  }
};

// Фильтруем бренды на основе поискового запроса
const filteredBrands = computed(() => {
  if (!searchQuery.value.trim()) {
    return allBrands.value;
  }
  
  const query = searchQuery.value.toLowerCase().trim();
  return allBrands.value.filter(brand => 
    brand.name.toLowerCase().includes(query)
  );
});

const handleChange = (value: number | null) => {
  if (value === OTHER_BRAND_VALUE) {
    model.value = null;
    emit("select", null);
    emit("selectOther");
    return;
  }
  const selectedBrand = allBrands.value.find(b => b.id === value);
  if (selectedBrand) {
    emit("select", selectedBrand);
  }
};

// Следим за изменениями initData
watch(() => props.initData, (newData) => {
  if (newData) {
    model.value = newData.id;
  }
}, { immediate: true });

// Загружаем бренды при монтировании
onMounted(() => {
  fetchBrands();
});
</script>

<template>
  <el-select
    v-model="model"
    :placeholder="computedPlaceholder"
    :loading="loading"
    filterable
    clearable
    :size
    :filter-method="(query) => { searchQuery = query; }"
    @change="handleChange"
    @visible-change="(visible) => { if (!visible) searchQuery = ''; }"
  >
    <el-option
      v-for="brand in filteredBrands"
      :key="brand.id"
      :label="brand.name"
      :value="brand.id"
    />
    <el-option
      v-if="searchQuery.trim() && other"
      :key="OTHER_BRAND_VALUE"
      :label="$t('common.other')"
      :value="OTHER_BRAND_VALUE"
      class="other-option"
    />
  </el-select>
</template>

<style lang="scss" scoped>
</style>
