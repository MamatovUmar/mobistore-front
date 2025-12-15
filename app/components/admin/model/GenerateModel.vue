<template>
  <div>
    <el-button type="primary" size="large" @click="dialogVisible = true">
      Генерировать через Gemini
    </el-button>

    <el-dialog
      v-model="dialogVisible"
      title="Генерация модели через AI"
      width="600px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="140px"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="Название модели" prop="modelName">
          <el-input
            v-model="formData.modelName"
            placeholder="Samsung Galaxy S24 Ultra"
            :disabled="loading"
          />
          <div class="help-text">Введите точное название модели телефона</div>
        </el-form-item>

        <el-form-item label="Бренд" prop="brandId">
          <BrandAutocomplete
            v-model="formData.brandId"
            :disabled="loading"
            placeholder="Выберите бренд"
          />
          <div class="help-text">Выберите производителя телефона</div>
        </el-form-item>

        <el-alert
          v-if="generationError"
          type="error"
          :closable="false"
          show-icon
          style="margin-bottom: 16px"
        >
          {{ generationError }}
        </el-alert>

        <el-alert
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 16px"
        >
          <template #title> AI генерация </template>
          Искусственный интеллект автоматически найдет и заполнит все
          технические характеристики модели
        </el-alert>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel" :disabled="loading">
            Отмена
          </el-button>
          <el-button type="primary" @click="handleGenerate" :loading="loading">
            {{ loading ? "Генерация..." : "Сгенерировать" }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import BrandAutocomplete from "@/components/autocompletes/BrandAutocomplete.vue";

const emit = defineEmits<{
  (e: "success"): void;
}>();

const dialogVisible = ref(false);
const loading = ref(false);
const generationError = ref("");
const formRef = ref<FormInstance>();

const formData = ref({
  modelName: "",
  brandId: undefined as number | undefined,
});

const rules = ref<FormRules>({
  modelName: [
    { required: true, message: "Введите название модели", trigger: "blur" },
    { min: 2, message: "Минимум 2 символа", trigger: "blur" },
  ],
  brandId: [{ required: true, message: "Выберите бренд", trigger: "change" }],
});

const handleCancel = () => {
  if (loading.value) return;
  dialogVisible.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    modelName: "",
    brandId: undefined,
  };
  generationError.value = "";
  formRef.value?.clearValidate();
};

const handleGenerate = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error("Заполните все обязательные поля");
      return;
    }

    loading.value = true;
    generationError.value = "";

    try {
      const { $api } = useNuxtApp();
      await $api("/admin/models/generate-specs", {
        method: "POST",
        body: {
          modelName: formData.value.modelName,
          brandId: formData.value.brandId,
        },
      });

      ElMessage.success("Модель успешно сгенерирована и сохранена!");
      emit("success");
      dialogVisible.value = false;
      resetForm();
    } catch (error: any) {
      console.error("Error generating model:", error);
      generationError.value =
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка при генерации модели. Попробуйте еще раз.";
      ElMessage.error(generationError.value);
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style scoped lang="scss">
.help-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
