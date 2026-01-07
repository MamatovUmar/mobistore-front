<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import type { IModelCreatePayload, IModelImage } from "@/types/model";
import { useAdminBrands } from "@/composables/useAdminBrands";
import ModelImages from "./ModelImages.vue";

const props = defineProps<{
  modelValue: IModelCreatePayload;
  modelId?: number;
  loading?: boolean;
  galleryImages?: IModelImage[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: IModelCreatePayload): void;
  (e: "submit"): void;
  (e: "cancel"): void;
  (e: "upload-images", files: File[]): void;
  (e: "delete-image", id: number): void;
}>();

const formRef = ref<FormInstance>();

// Brands for select
const brandSelect = useAdminBrands();
brandSelect.limit.value = 50;

onMounted(() => {
  brandSelect.fetchBrands();
});

const remoteMethod = (query: string) => {
  brandSelect.filters.value.search = query;
  brandSelect.fetchBrands();
};

// Validation Rules
const rules = reactive<FormRules>({
  name: [{ required: true, message: "Введите название", trigger: "blur" }],
  brand_id: [{ required: true, message: "Выберите бренд", trigger: "change" }],
});

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// Init arrays if missing
const ensureStructure = () => {
  if (!form.value.ram) form.value.ram = [];
  if (!form.value.rom) form.value.rom = [];
  if (!form.value.colors) form.value.colors = [];
};

watch(() => props.modelValue, ensureStructure, { immediate: true });

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit("submit");
    } else {
      console.log("error submit!", fields);
      ElMessage.error("Проверьте правильность заполнения полей");
    }
  });
};
</script>

<template>
  <el-form
    ref="formRef"
    v-loading="loading"
    :model="form"
    :rules="rules"
    label-width="140px"
    label-position="top"
    status-icon
    class="model-form"
  >
    <div class="form-section">
      <!-- Основные поля -->
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="Название" prop="name">
            <el-input v-model="form.name" placeholder="iPhone 15 Pro Max" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Бренд" prop="brand_id">
            <el-select
              v-model="form.brand_id"
              filterable
              remote
              placeholder="Выберите бренд"
              :remote-method="remoteMethod"
              :loading="brandSelect.loading.value"
              style="width: 100%"
            >
              <el-option
                v-for="item in brandSelect.brands.value"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="Alias (slug)" prop="alias">
            <el-input v-model="form.alias" placeholder="iphone-15-pro-max" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="URL источника" prop="url">
            <el-input v-model="form.url" placeholder="https://..." />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Изображение" prop="image">
        <el-input v-model="form.image" placeholder="/uploads/models/..." />
        <div class="help-text">Путь к изображению модели</div>
      </el-form-item>

      <el-form-item label="Описание" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="Описание модели..."
        />
      </el-form-item>

      <!-- Экран -->
      <el-divider content-position="left">Экран</el-divider>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="Тип экрана" prop="display_type">
            <el-input v-model="form.display_type" placeholder="AMOLED, IPS LCD..." />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Размер экрана" prop="display_size">
            <el-input v-model="form.display_size" placeholder="6.7 inches" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- Батарея -->
      <el-form-item label="Тип батареи" prop="battery_type">
        <el-input v-model="form.battery_type" placeholder="Li-Ion 5000 mAh" />
      </el-form-item>

      <!-- RAM -->
      <el-form-item label="Варианты RAM" prop="ram">
        <el-input-tag v-model="form.ram" placeholder="4GB, 6GB, 8GB..." />
      </el-form-item>

      <!-- ROM -->
      <el-form-item label="Варианты ROM" prop="rom">
        <el-input-tag v-model="form.rom" placeholder="64GB, 128GB, 256GB..." />
      </el-form-item>

      <!-- Цвета -->
      <el-form-item label="Цвета" prop="colors">
        <el-input-tag v-model="form.colors" placeholder="Введите цвета" />
      </el-form-item>

      <!-- Specs HTML -->
      <el-form-item label="Спецификации (HTML)" prop="specs">
        <el-input
          v-model="form.specs"
          type="textarea"
          :rows="6"
          placeholder="HTML контент спецификаций..."
        />
      </el-form-item>

      <!-- Parsed -->
      <el-form-item label="Распарсено" prop="parsed">
        <el-switch v-model="form.parsed" />
      </el-form-item>
    </div>

    <div class="form-actions">
      <el-button @click="$emit('cancel')">Отмена</el-button>
      <el-button
        type="primary"
        native-type="submit"
        :loading="loading"
        @click="onSubmit(formRef)"
      >
        {{ modelId ? "Сохранить изменения" : "Создать модель" }}
      </el-button>
    </div>
  </el-form>
</template>

<style scoped lang="scss">
.model-form {
  padding: 0;
}

.form-section {
  padding: 10px 0;
}

.help-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
