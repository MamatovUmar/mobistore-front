<script setup lang="ts">
import { UploadFilled, Delete } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import BrandAutocomplete from "~/components/autocompletes/BrandAutocomplete.vue";
import ModelAutocomplete from "~/components/autocompletes/ModelAutocomplete.vue";
import RegionAutocomplete from "~/components/autocompletes/RegionAutocomplete.vue";
import CityAutocomplete from "~/components/autocompletes/CityAutocomplete.vue";
import PhoneNumber from "~/components/form/PhoneNumber.vue";
import TelegramLink from "~/components/form/TelegramLink.vue";
import type { IListing, IListingForm, IImage } from "~/types/ads";
import { ListingStatus, ImageFolder, EntityType } from "~/types/ads";
import type { IBaseResponse } from "~/types/index";
import type { IModel } from "~/types/model";
import EditListingSkeleton from "~/components/skeletons/EditListingSkeleton.vue";

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => t("account.meta.editListing"),
  robots: "noindex, nofollow",
});

const { $api } = useNuxtApp();
const route = useRoute();
const adId = computed(() => Number(route.params.id));

const loading = ref(false);
const loadingData = ref(true);
const fileList = ref<any[]>([]);
const existingImages = ref<IImage[]>([]);
const formRef = ref<FormInstance>();
const colors = ref<string[]>();

const isCustomBrand = ref(false);
const isCustomModel = ref(false);

const validateImages = (rule: any, value: any, callback: any) => {
  if (fileList.value.length === 0 && existingImages.value.length === 0) {
    callback(new Error(t("account.editListing.validation.images")));
  } else {
    callback();
  }
};

const validateBrand = (rule: any, value: any, callback: any) => {
  if (!form.brand_id && !form.custom_brand) {
    callback(new Error(t("account.editListing.validation.brand")));
  } else {
    callback();
  }
};

const validateModel = (rule: any, value: any, callback: any) => {
  if (!form.model_id && !form.custom_model) {
    callback(new Error(t("account.editListing.validation.model")));
  } else {
    callback();
  }
};

const rules = computed<FormRules<IListingForm & { images?: any }>>(() => ({
  title: [{ required: true, message: t("account.editListing.validation.title"), trigger: "blur" }],
  description: [
    { required: true, message: t("account.editListing.validation.description"), trigger: "blur" },
  ],
  region_id: [
    { required: true, message: t("account.editListing.validation.region"), trigger: "change" },
  ],
  city_id: [{ required: true, message: t("account.editListing.validation.city"), trigger: "change" }],
  brand_id: [{ validator: validateBrand, trigger: "change" }],
  custom_brand: [{ validator: validateBrand, trigger: "blur" }],
  model_id: [{ validator: validateModel, trigger: "change" }],
  custom_model: [{ validator: validateModel, trigger: "blur" }],
  price: [{ required: true, message: t("account.editListing.validation.price"), trigger: "blur" }],
  images: [{ validator: validateImages, trigger: "change" }],
  state: [{ required: true, message: t("account.editListing.validation.condition"), trigger: "change" }],
}));

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
  custom_brand: null,
  custom_model: null,
  storage_unit: "",
  ram_unit: ""
});

// Загрузка данных объявления
const fetchAd = catcher(
  async () => {
    loadingData.value = true;
    const response = await $api<IBaseResponse<IListing>>(`/ads/${adId.value}`);

    if (response?.status && response.data) {
      const ad = response.data;

      // Заполняем форму данными
      form.title = ad.title;
      form.description = ad.description;
      form.region_id = ad.region_id;
      form.city_id = ad.city_id;
      form.brand_id = ad.brand_id;
      form.model_id = ad.model_id;
      form.custom_brand = ad.custom_brand;
      form.custom_model = ad.custom_model;

      // Определяем режим кастомных полей
      if (ad.custom_brand) {
        isCustomBrand.value = true;
        isCustomModel.value = true;
      } else if (ad.custom_model) {
        isCustomModel.value = true;
      }
      form.price = ad.price;
      form.currency = ad.currency;
      form.state = ad.state;
      form.allow_trade_in = ad.allow_trade_in;
      form.color = ad.color;
      form.storage = ad.storage;
      form.ram = ad.ram;
      form.phone_number = ad.phone_number;
      form.telegram_link = ad.telegram_link || "";
      form.show_phone = ad.show_phone;
      form.status = ad.status;

      // Загружаем существующие изображения
      if (ad.images && ad.images.length > 0) {
        existingImages.value = ad.images;
      }
    }
    loadingData.value = false;
  },
  (e: any) => {
    loadingData.value = false;
    ElMessage.error(t("account.editListing.messages.loadError"));
    console.error("Fetch error:", e);
  }
);

// Обновление объявления
const updateListing = catcher(
  async () => {
    if (!formRef.value) return;

    const isValid = await formRef.value.validate().catch(() => false);

    if (!isValid) {
      ElMessage.error(t("account.editListing.validation.required"));
      return;
    }

    loading.value = true;
    const response = await $api<IBaseResponse<IListing>>(`/ads/${adId.value}`, {
      method: "PUT",
      body: {
        title: form.title,
        description: form.description,
        region_id: form.region_id,
        city_id: form.city_id,
        brand_id: form.brand_id || null,
        model_id: form.model_id || null,
        custom_brand: form.custom_brand || null,
        custom_model: form.custom_model || null,
        price: Number(form.price),
        currency: form.currency,
        state: form.state,
        status: form.status,
        storage: form.storage,
        ram: form.ram,
        allow_trade_in: form.allow_trade_in,
        color: form.color,
        telegram_link: form.telegram_link,
        phone_number: form.phone_number,
        show_phone: form.show_phone,
      },
    });

    if (response?.status) {
      // Загружаем новые изображения, если есть
      if (fileList.value.length > 0) {
        await saveImages(adId.value);
      }
      ElMessage.success(t("account.editListing.messages.updateSuccess"));
      navigateTo(localePath("/account/listings"));
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

// Сохранение новых изображений
const saveImages = catcher(
  async (entityId: number | undefined) => {
    if (!entityId || fileList.value.length === 0) {
      return;
    }

    const formData = new FormData();

    fileList.value.forEach((file) => {
      formData.append("images", file.raw);
    });

    formData.append("folder", ImageFolder.AD);
    formData.append("entityType", EntityType.AD);
    formData.append("entityId", entityId.toString());

    const response = await $api<IBaseResponse<any>>("/image/upload-multiple", {
      method: "POST",
      body: formData,
    });

    if (response?.status) {
      ElMessage.success(t("account.editListing.messages.imageUploadSuccess"));
    }
  },
  (e: any) => {
    ElMessage.error(t("account.editListing.messages.imageUploadError"));
    console.error("Upload error:", e);
  }
);

// Удаление существующего изображения
const deleteImage = catcher(
  async (imageId: number) => {
    await $api<IBaseResponse<any>>(`/image/${imageId}?folder=ad`, {
      method: "DELETE",
    });

    existingImages.value = existingImages.value.filter(
      (img) => img.id !== imageId
    );
    ElMessage.success(t("account.editListing.messages.imageDeleteSuccess"));
    formRef.value?.validateField("images");
    fetchAd();
  },
  (e: any) => {
    const message = e?.response?._data?.message;
    ElMessage.error(message || t("account.editListing.messages.imageDeleteError"));
    console.error("Delete error:", e);
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

const handleModelSelect = (model: IModel | null) => {
  if (model) {
    colors.value = model.colors || [];
  } else {
    colors.value = [];
  }
};

const handleBrandSelectOther = () => {
  isCustomBrand.value = true;
  isCustomModel.value = true;
  form.brand_id = null;
  form.model_id = null;
  form.custom_brand = null;
  form.custom_model = null;
  colors.value = [];
};

const handleModelSelectOther = () => {
  isCustomModel.value = true;
  form.model_id = null;
  form.custom_model = null;
};

const handleBrandChange = () => {
  if (form.brand_id) {
    isCustomBrand.value = false;
    isCustomModel.value = false;
    form.custom_brand = null;
    form.model_id = null;
    form.custom_model = null;
  }
};

// Загружаем данные при монтировании
fetchAd();
</script>

<template>
  <main class="edit-listing">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ $t("account.editListing.title") }}</h1>
        <p class="page-subtitle">{{ $t("account.editListing.subtitle") }}</p>
      </div>

      <EditListingSkeleton v-if="loadingData" />

      <div v-else class="form-container">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          size="large"
        >
          <div class="form-section">
            <h2 class="section-title">{{ $t("account.editListing.sections.main") }}</h2>

            <el-form-item :label="$t('account.editListing.fields.title')" prop="title">
              <el-input v-model="form.title" :placeholder="$t('account.editListing.placeholders.title')" />
            </el-form-item>

            <el-form-item
              :label="$t('account.editListing.fields.description')"
              prop="description"
              class="quill-form-item"
            >
              <RichTextEditor
                v-model:content="form.description"
                :placeholder="$t('account.editListing.placeholders.description')"
              />
            </el-form-item>
          </div>

          <div class="form-section">
            <h2 class="section-title">{{ $t("account.editListing.sections.specsAndPrice") }}</h2>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item
                  :label="$t('account.editListing.fields.brand')"
                  :prop="isCustomBrand ? 'custom_brand' : 'brand_id'"
                >
                  <BrandAutocomplete
                    v-if="!isCustomBrand"
                    v-model="form.brand_id"
                    :placeholder="$t('createListing.fields.brand.placeholder')"
                    @select="handleBrandChange"
                    @select-other="handleBrandSelectOther"
                  />
                  <div v-else class="custom-input-wrapper">
                    <el-input
                      v-model="form.custom_brand"
                      :placeholder="$t('createListing.fields.brand.customPlaceholder')"
                    />
                    <el-button
                      type="info"
                      link
                      @click="isCustomBrand = false; isCustomModel = false; form.custom_brand = null; form.custom_model = null;"
                    >
                      {{ $t('common.selectFromList') }}
                    </el-button>
                  </div>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item
                  :label="$t('account.editListing.fields.model')"
                  :prop="isCustomModel ? 'custom_model' : 'model_id'"
                >
                  <template v-if="isCustomBrand || isCustomModel">
                    <div class="custom-input-wrapper">
                      <el-input
                        v-model="form.custom_model"
                        :placeholder="$t('createListing.fields.model.customPlaceholder')"
                      />
                      <el-button
                        v-if="!isCustomBrand"
                        type="info"
                        link
                        @click="isCustomModel = false; form.custom_model = null;"
                      >
                        {{ $t('common.selectFromList') }}
                      </el-button>
                    </div>
                  </template>
                  <ModelAutocomplete
                    v-else
                    v-model="form.model_id"
                    :brand-id="form.brand_id"
                    :placeholder="$t('createListing.fields.model.placeholder')"
                    @select="handleModelSelect"
                    @select-other="handleModelSelectOther"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item :label="$t('account.editListing.fields.memory')" prop="storage">
                  <el-select
                    v-model="form.storage"
                    :placeholder="$t('account.editListing.placeholders.memory')"
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
                <el-form-item :label="$t('account.editListing.fields.ram')" prop="ram">
                  <el-select
                    v-model="form.ram"
                    :placeholder="$t('account.editListing.placeholders.ram')"
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
                <el-form-item :label="$t('account.editListing.fields.color')">
                  <el-input
                    v-if="colors?.length === 0"
                    v-model="form.color"
                    :placeholder="$t('account.editListing.placeholders.colorInput')"
                  />
                  <el-select
                    v-else
                    v-model="form.color"
                    :placeholder="$t('account.editListing.placeholders.colorSelect')"
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
                <el-form-item :label="$t('account.editListing.fields.condition')" prop="state">
                  <el-select
                    v-model="form.state"
                    :placeholder="$t('account.editListing.placeholders.condition')"
                  >
                    <el-option :label="$t('account.editListing.conditions.new')" value="new" />
                    <el-option :label="$t('account.editListing.conditions.restored')" value="restored" />
                    <el-option :label="$t('account.editListing.conditions.used')" value="used" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item :label="$t('account.editListing.fields.price')" prop="price">
                  <el-input
                    type="number"
                    v-model="form.price"
                    :placeholder="$t('account.editListing.placeholders.price')"
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item :label="$t('account.editListing.fields.currency')">
                  <el-select
                    v-model="form.currency"
                    :placeholder="$t('account.editListing.placeholders.currency')"
                  >
                    <el-option label="UZS" value="UZS" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item>
              <el-checkbox
                v-model="form.allow_trade_in"
                :label="$t('account.editListing.checkboxes.exchange')"
                border
              />
            </el-form-item>
          </div>

          <div class="form-section">
            <h2 class="section-title">{{ $t("account.editListing.sections.locationAndPhotos") }}</h2>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item :label="$t('account.editListing.fields.region')" prop="region_id">
                  <RegionAutocomplete v-model="form.region_id" />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item :label="$t('account.editListing.fields.city')" prop="city_id">
                  <CityAutocomplete
                    v-model="form.city_id"
                    :region-id="form.region_id"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- Существующие изображения -->
            <el-form-item
              v-if="existingImages.length > 0"
              :label="$t('account.editListing.fields.currentPhotos')"
            >
              <div class="existing-images">
                <div
                  v-for="image in existingImages"
                  :key="image.id"
                  class="existing-image"
                >
                  <img :src="image.url" :alt="image.file_name" />
                  <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    size="small"
                    class="delete-btn"
                    @click="deleteImage(image.id)"
                  />
                </div>
              </div>
            </el-form-item>

            <el-form-item
              :label="$t('account.editListing.fields.addPhotos')"
              prop="images"
            >
              <el-upload
                class="upload-demo"
                drag
                :auto-upload="false"
                :limit="8 - existingImages.length"
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
                accept="image/*"
                multiple
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  {{ $t("account.editListing.upload.dragText") }} <em>{{ $t("account.editListing.upload.clickText") }}</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    {{ $t("account.editListing.upload.tip", { count: 8 - existingImages.length }) }}
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </div>

          <div class="form-section">
            <h2 class="section-title">{{ $t("account.editListing.sections.contacts") }}</h2>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item :label="$t('account.editListing.fields.phone')" prop="phone_number">
                  <PhoneNumber v-model="form.phone_number" />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item :label="$t('account.editListing.fields.telegram')">
                  <TelegramLink v-model="form.telegram_link" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item>
              <el-checkbox
                v-model="form.show_phone"
                :label="$t('account.editListing.checkboxes.showContacts')"
                border
              />
            </el-form-item>
          </div>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-button
                style="width: 100%"
                @click="navigateTo(localePath('/account/listings'))"
              >
                {{ $t("account.editListing.buttons.cancel") }}
              </el-button>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-button
                type="primary"
                style="width: 100%"
                :loading="loading"
                @click="updateListing"
              >
                {{ $t("account.editListing.buttons.save") }}
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
.edit-listing {
  min-height: 60vh;
  padding: 40px 0;

  .page-header {
    text-align: center;
    margin-bottom: 24px;
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

  .upload-demo {
    width: 100%;
  }

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

  // Существующие изображения
  .existing-images {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .existing-image {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #dcdfe6;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .delete-btn {
      position: absolute;
      top: 4px;
      right: 4px;
    }
  }

  .custom-input-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  // Quill Editor стили
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

  :deep(.ql-editor *) {
    font-family: inherit;
  }

  /* === RESPONSIVE === */
  @media (max-width: 768px) {
    padding: 24px 0;

    .page-header {
      margin-bottom: 20px;
    }

    .page-title {
      font-size: 24px;
    }

    .page-subtitle {
      font-size: 14px;
    }

    .form-section {
      padding: 16px;
      border-radius: 10px;
    }

    .section-title {
      font-size: 16px;
    }

    .existing-images {
      gap: 8px;
    }

    .existing-image {
      width: 100px;
      height: 100px;
    }
  }

  @media (max-width: 480px) {
    padding: 16px 0;

    .page-header {
      margin-bottom: 16px;
    }

    .page-title {
      font-size: 22px;
    }

    .form-section {
      padding: 14px;
      margin-bottom: 12px;
    }

    .existing-image {
      width: 80px;
      height: 80px;
    }

    // Stack action buttons with gap
    .el-row {
      row-gap: 12px;
    }
  }
}
</style>
