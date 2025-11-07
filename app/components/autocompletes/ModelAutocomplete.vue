<script setup lang="ts">
import { ref, watch } from "vue";
import type { IModel, IModelResponse } from "~/types/model";
import type { IBaseResponse } from "~/types";

interface Props {
  placeholder?: string;
  brandId?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Введите название модели",
});

const model = defineModel<number>();

const emit = defineEmits<{
  select: [model: IModel];
}>();

const { $api } = useNuxtApp();

const loading = ref(false);
const models = ref<IModel[]>([]);

const remoteSearch = async (query: string) => {
  if (!query || query.trim() === "") {
    models.value = [];
    return;
  }

  loading.value = true;
  try {
    let url = `/models/search?q=${query}&limit=20`;
    if (props.brandId) {
      url += `&brandId=${props.brandId}`;
    }
    
    const res = await $api<IBaseResponse<IModelResponse>>(url);
    models.value = res.data?.models || [];
  } catch (error) {
    console.error("Error searching models:", error);
    models.value = [];
  } finally {
    loading.value = false;
  }
};

const handleChange = (value: number) => {
  const selectedModel = models.value.find(m => m.id === value);
  if (selectedModel) {
    emit("select", selectedModel);
  }
};

// Сброс модели при изменении бренда
watch(() => props.brandId, () => {
  model.value = undefined;
  models.value = [];
});
</script>

<template>
  <el-select
    v-model="model"
    :placeholder="placeholder"
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
