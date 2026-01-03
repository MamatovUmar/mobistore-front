<script setup lang="ts">
import { ref, watch } from "vue";
import type { IModel, IModelResponse } from "~/types/model";
import type { IBaseResponse } from "~/types";

const OTHER_MODEL_VALUE = -1;

interface Props {
  placeholder?: string;
  brandId?: number | null;
  initData?: IModel;
  other?: boolean;
}

const props = defineProps<Props>();

const model = defineModel<number | null>();

const emit = defineEmits<{
  select: [model: IModel | null];
  selectOther: [];
}>();

const { $api } = useNuxtApp();
const { t } = useI18n();

const computedPlaceholder = computed(() => props.placeholder ?? t("components.model.placeholder"));

const loading = ref(false);
// Инициализируем список моделей с initData для SSR
const models = ref<IModel[]>(props.initData ? [props.initData] : []);
const searchQuery = ref("");

const remoteSearch = async (query: string) => {
  searchQuery.value = query;
  if (!query || query.trim() === "") {
    // При пустом поиске сохраняем только initData
    models.value = props.initData ? [props.initData] : [];
    return;
  }

  loading.value = true;
  try {
    let url = `/models/search?q=${query}&limit=20`;
    if (props.brandId) {
      url += `&brandId=${props.brandId}`;
    }
    
    const res = await $api<IBaseResponse<IModelResponse>>(url);
    const loadedModels = res.data?.models || [];
    
    // Сохраняем initData в списке если оно есть и не входит в загруженные модели
    if (props.initData && !loadedModels.find(m => m.id === props.initData!.id)) {
      models.value = [props.initData, ...loadedModels];
    } else {
      models.value = loadedModels;
    }
  } catch (error) {
    console.error("Error searching models:", error);
    // Сохраняем initData даже при ошибке
    models.value = props.initData ? [props.initData] : [];
  } finally {
    loading.value = false;
  }
};

const handleChange = (value: number | null) => {
  if (value === OTHER_MODEL_VALUE) {
    model.value = null;
    emit("select", null);
    emit("selectOther");
    return;
  }
  const selectedModel = models.value.find(m => m.id === value);
  if (selectedModel) {
    emit("select", selectedModel);
  }
};

// Сброс модели при изменении бренда
watch(() => props.brandId, (newBrandId, oldBrandId) => {
  // Сбрасываем модель только если бренд действительно изменился (не первая загрузка)
  if (oldBrandId !== undefined && newBrandId !== oldBrandId) {
    model.value = undefined;
    models.value = [];
  }
});

// Следим за изменениями initData
watch(() => props.initData, (newData) => {
  if (newData) {
    // Добавляем initData в список если его там нет
    if (!models.value.find(m => m.id === newData.id)) {
      models.value = [newData, ...models.value];
    }
    model.value = newData.id;
  }
}, { immediate: true });
</script>

<template>
  <el-select
    v-model="model"
    :placeholder="computedPlaceholder"
    :loading="loading"
    :disabled="!brandId"
    filterable
    reserve-keyword
    remote
    clearable
    :remote-method="remoteSearch"
    size="large"
    @change="handleChange"
  >
    <el-option
      v-for="modelItem in models"
      :key="modelItem.id"
      :label="modelItem.name"
      :value="modelItem.id"
    >
      <div class="model-option">
        <span class="model-name">{{ modelItem.name }}</span>
        <span class="model-brand">{{ modelItem.brand?.name }}</span>
      </div>
    </el-option>
    <el-option
      v-if="searchQuery.trim() && other"
      :key="OTHER_MODEL_VALUE"
      :label="$t('common.other')"
      :value="OTHER_MODEL_VALUE"
      class="other-option"
    />
  </el-select>
</template>

<style lang="scss" scoped>
.model-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .model-name {
    font-weight: 500;
    color: var(--color-text-primary);
  }
  
  .model-brand {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin-left: 8px;
  }
}
</style>
