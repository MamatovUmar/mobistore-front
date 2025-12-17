<script setup lang="ts">
import { UploadFilled } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import BrandAutocomplete from "~/components/autocompletes/BrandAutocomplete.vue";
import ModelAutocomplete from "~/components/autocompletes/ModelAutocomplete.vue";
import RegionAutocomplete from "~/components/autocompletes/RegionAutocomplete.vue";
import CityAutocomplete from "~/components/autocompletes/CityAutocomplete.vue";
import PhoneNumber from "~/components/form/PhoneNumber.vue";
import TelegramLink from "~/components/form/TelegramLink.vue";
import type { IListing, IListingForm } from "~/types/ads";
import { ListingStatus, ImageFolder, EntityType } from "~/types/ads";
import type { IBaseResponse } from "~/types/index";
import type { IModel } from "~/types/model";
import { useRootStore } from "~/store/root";

useSeoMeta({
  title: "Подать объявление — MobiStore",
  description: "Разместите бесплатное объявление о продаже смартфона на MobiStore. Быстрая продажа, тысячи покупателей, удобная форма размещения.",
  ogTitle: "Подать объявление — MobiStore",
  ogDescription: "Продайте свой смартфон быстро и выгодно на MobiStore",
});

const { $api } = useNuxtApp();
const root = useRootStore();

const loading = ref(false);
const fileList = ref<any[]>([]);
const formRef = ref<FormInstance>();
const colors = ref<string[]>([]);

const validateImages = (rule: any, value: any, callback: any) => {
  if (fileList.value.length === 0) {
    callback(new Error("Загрузите хотя бы одну фотографию"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules<IListingForm & { images?: any }>>({
  title: [{ required: true, message: "Введите название", trigger: "blur" }],
  description: [
    { required: true, message: "Введите описание", trigger: "blur" },
  ],
  region_id: [
    { required: true, message: "Выберите регион", trigger: "change" },
  ],
  city_id: [{ required: true, message: "Выберите город", trigger: "change" }],
  brand_id: [{ required: true, message: "Выберите бренд", trigger: "change" }],
  model_id: [{ required: true, message: "Выберите модель", trigger: "change" }],
  price: [{ required: true, message: "Введите цену", trigger: "blur" }],
  images: [{ validator: validateImages, trigger: "change" }],
  state: [{ required: true, message: "Выберите состояние", trigger: "change" }],
});

const form = reactive<IListingForm & { images?: any }>({
  title: "",
  description: "",
  region_id: undefined,
  city_id: undefined,
  brand_id: undefined,
  model_id: undefined,
  price: undefined,
  currency: "UZS",
  state: undefined,
  allow_trade_in: false,
  color: "",
  storage: undefined,
  ram: undefined,
  phone_number: "",
  telegram_link: "",
  show_phone: true,
  status: ListingStatus.ACTIVE,
  images: [],
});

const createListing = catcher(
  async () => {
    if (!formRef.value) return;

    const isValid = await formRef.value.validate().catch(() => false);

    if (!isValid) {
      ElMessage.error("Заполните все обязательные поля");
      return;
    }

    loading.value = true;
    const response = await $api<IBaseResponse<IListing>>("/ads", {
      method: "POST",
      body: {
        ...form,
        price: Number(form.price),
      },
    });
    if (response?.status) {
      ElMessage.success("Объявление создано успешно");
      await saveImages(response.data?.id);
      navigateTo(`/${response.data?.alias}`);
    }
    loading.value = false;
  },
  (e: any) => {
    loading.value = false;
    const details = e?.response?._data?.details ?? [];
    details?.forEach((detail: any) => {
      ElMessage.error(detail.errors?.join("\n"));
    });
  }
);

const saveImages = catcher(
  async (entityId: number | undefined) => {
    if (!entityId || fileList.value.length === 0) {
      return;
    }

    const formData = new FormData();

    // Добавляем все файлы
    fileList.value.forEach((file) => {
      formData.append("images", file.raw);
    });

    // Добавляем метаданные
    formData.append("folder", ImageFolder.AD);
    formData.append("entityType", EntityType.AD);
    formData.append("entityId", entityId.toString());

    await $api<IBaseResponse<any>>("/image/upload-multiple", {
      method: "POST",
      body: formData,
    });
  },
  (e: any) => {
    ElMessage.error("Ошибка при загрузке изображений");
    console.error("Upload error:", e);
  }
);

const handleFileChange = (file: any, fileListData: any[]) => {
  fileList.value = fileListData;
  form.images = fileListData;
  formRef.value?.validateField("images");
};

const handleFileRemove = (file: any, fileListData: any[]) => {
  fileList.value = fileListData;
  form.images = fileListData;
  formRef.value?.validateField("images");
};

const handleModelSelect = (model: IModel) => {
  console.log(model);
  colors.value = model.colors;
};

onMounted(() => {
  if (root.user) {
    form.phone_number = root.user.phone_number || "";
    form.telegram_link = root.user.telegram || "";
    form.show_phone = root.user.show_contacts || false;
  }
});
</script>

<template>
  <main class="page-create">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Подать объявление</h1>
        <p class="page-subtitle">Заполните информацию о вашем устройстве</p>
      </div>

      <div class="form-container">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          size="large"
        >
          <div class="form-section">
            <h2 class="section-title">Основная информация</h2>

            <el-form-item label="Название" prop="title">
              <el-input v-model="form.title" placeholder="Введите название" />
            </el-form-item>

            <el-form-item
              label="Описание"
              prop="description"
              class="quill-form-item"
            >
              <RichTextEditor
                v-model:content="form.description"
                placeholder="Введите описание"
              />
            </el-form-item>
          </div>

          <div class="form-section">
            <h2 class="section-title">Характеристики и цена</h2>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="Бренд" prop="brand_id">
                  <BrandAutocomplete v-model="form.brand_id" />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="Модель" prop="model_id">
                  <ModelAutocomplete
                    v-model="form.model_id"
                    :brand-id="form.brand_id"
                    @select="handleModelSelect"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Память" prop="storage">
                  <el-select
                    v-model="form.storage"
                    placeholder="Выберите память"
                  >
                    <el-option
                      v-for="storage in [4, 8, 16, 32, 64, 128, 256, 512, 1024]"
                      :key="storage"
                      :label="storage + 'GB'"
                      :value="storage"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Оперативка" prop="ram">
                  <el-select
                    v-model="form.ram"
                    placeholder="Выберите оперативку"
                  >
                    <el-option
                      v-for="ram in 36"
                      :key="ram"
                      :label="ram + 'GB'"
                      :value="ram"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Цвет">
                  <el-input
                    v-if="colors.length === 0"
                    v-model="form.color"
                    placeholder="Введите цвет"
                  />
                  <el-select
                    v-else
                    v-model="form.color"
                    placeholder="Выберите цвет"
                  >
                    <el-option
                      v-for="color in colors"
                      :key="color"
                      :label="color"
                      :value="color"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Состояние" prop="state">
                  <el-select
                    v-model="form.state"
                    placeholder="Выберите состояние"
                  >
                    <el-option label="Новый" value="new" />
                    <el-option label="Восстановлен" value="restored" />
                    <el-option label="Б/У" value="used" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Цена" prop="price">
                  <el-input
                    type="number"
                    v-model="form.price"
                    placeholder="Введите цену"
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Валюта">
                  <el-select
                    v-model="form.currency"
                    placeholder="Выберите валюту"
                  >
                    <el-option label="UZS" value="UZS" />
                    <!-- <el-option label="USD" value="USD" /> -->
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item>
              <el-checkbox
                v-model="form.allow_trade_in"
                label="Возможен обмен"
                border
              />
            </el-form-item>
          </div>

          <div class="form-section">
            <h2 class="section-title">Местоположение и фото</h2>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="Регион" prop="region_id">
                  <RegionAutocomplete v-model="form.region_id" />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="Город" prop="city_id">
                  <CityAutocomplete
                    v-model="form.city_id"
                    :region-id="form.region_id"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="Фотографии (макс. 8)" prop="images">
              <el-upload
                class="upload-demo"
                drag
                :auto-upload="false"
                :limit="8"
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
                accept="image/*"
                multiple
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  Перетащите файлы сюда или <em>нажмите для загрузки</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    Поддерживаемые форматы: jpg, png (макс. 8 файлов)
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </div>

          <div class="form-section">
            <h2 class="section-title">Контакты</h2>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="Телефон" prop="phone_number">
                  <PhoneNumber v-model="form.phone_number" />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="Telegram">
                  <TelegramLink v-model="form.telegram_link" />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item>
                  <el-checkbox
                    v-model="form.show_phone"
                    border
                    label="Показывать контакты"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-button
                type="primary"
                style="width: 100%"
                :loading="loading"
                @click="createListing"
              >
                Предварительный просмотр
              </el-button>
            </el-col>
          </el-row>
          <br />
          <br />
        </el-form>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.page-create {
  min-height: 60vh;
  .page-header {
    text-align: center;
    margin-bottom: 24px;
    margin-top: 40px;
  }
  .upload-demo {
    width: 100%;
  }

  .page-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--color-text-primary);
  }

  .page-subtitle {
    font-size: 15px;
    color: var(--color-text-secondary);
  }

  .form-container {
    max-width: 900px;
    margin: 0 auto;
  }

  /* === ФОРМА === */
  .form-section {
    background: var(--color-bg-primary);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  .section-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 16px;
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* === QUILL EDITOR === */
  .quill-form-item {
    :deep(.el-form-item__content) {
      line-height: normal;
    }
  }

  :deep(.ql-container) {
    min-height: 150px;
    font-size: 14px;
    border-radius: 0 0 4px 4px;
    border: 1px solid #dcdfe6;
    border-top: none;
    font-family: inherit;
  }

  :deep(.ql-toolbar) {
    border-radius: 4px 4px 0 0;
    background: #f5f7fa;
    border: 1px solid #dcdfe6;
    font-family: inherit;
  }

  :deep(.ql-editor) {
    min-height: 150px;
    line-height: 1.5;
    white-space: normal;
    word-wrap: break-word;
    font-family: inherit;
  }

  :deep(.ql-editor p) {
    margin: 0;
    padding: 0;
    line-height: 1.5;
  }

  :deep(.ql-editor.ql-blank::before) {
    color: #a8abb2;
    font-style: normal;
  }

  :deep(.quill-editor) {
    width: 100%;
  }

  /* === RESPONSIVE === */
  @media (max-width: 768px) {
    .page-header {
      margin-top: 24px;
      margin-bottom: 20px;
    }

    .page-title {
      font-size: 24px;
    }

    .form-section {
      padding: 16px;
    }

    .container {
      padding: 0 16px;
    }
  }
}
</style>
