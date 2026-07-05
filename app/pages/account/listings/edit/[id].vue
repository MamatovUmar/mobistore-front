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

definePageMeta({
  middleware: "auth-only",
});

useSeoMeta({
  title: () => t("account.meta.editListing"),
  robots: "noindex, nofollow",
});

const { $api } = useNuxtApp();
const route = useRoute();
const adId = computed(() => Number(route.params.id));

// Форматирование цены с разделителями тысяч
const formatPrice = (value: string | number | undefined) => {
  if (!value) return '';
  const numValue = String(value).replace(/\D/g, '');
  return numValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const parsePrice = (value: string) => {
  return value.replace(/\s/g, '');
};

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
  title: [
    {
      required: true,
      message: t("account.editListing.validation.title"),
      trigger: "blur",
    },
  ],
  description: [
    {
      required: true,
      message: t("account.editListing.validation.description"),
      trigger: "blur",
    },
  ],
  region_id: [
    {
      required: true,
      message: t("account.editListing.validation.region"),
      trigger: "change",
    },
  ],
  city_id: [
    {
      required: true,
      message: t("account.editListing.validation.city"),
      trigger: "change",
    },
  ],
  brand_id: [{ validator: validateBrand, trigger: "change" }],
  custom_brand: [{ validator: validateBrand, trigger: "blur" }],
  model_id: [{ validator: validateModel, trigger: "change" }],
  custom_model: [{ validator: validateModel, trigger: "blur" }],
  price: [
    {
      required: true,
      message: t("account.editListing.validation.price"),
      trigger: "blur",
    },
  ],
  images: [{ validator: validateImages, trigger: "change" }],
  state: [
    {
      required: true,
      message: t("account.editListing.validation.condition"),
      trigger: "change",
    },
  ],
}));

const form = reactive<IListingForm & { images?: any }>({
  title: "",
  description: "",
  region_id: undefined,
  city_id: undefined,
  brand_id: undefined,
  model_id: undefined,
  custom_brand: null,
  custom_model: null,
  price: undefined,
  currency: "UZS",
  state: undefined,
  allow_trade_in: false,
  color: "",
  storage: undefined,
  storage_unit: "GB",
  ram: undefined,
  ram_unit: "GB",
  phone_number: "",
  telegram_link: "",
  show_phone: true,
  status: ListingStatus.ACTIVE,
  images: [],
});

const originalForm = ref<Partial<IListingForm>>({});

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
      form.storage_unit = ad.storage_unit || "GB";
      form.ram = ad.ram;
      form.ram_unit = ad.ram_unit || "GB";
      form.phone_number = ad.phone_number;
      form.telegram_link = ad.telegram_link || "";
      form.show_phone = ad.show_phone;
      form.status = ad.status;

      // Сохраняем оригинальные данные для отслеживания изменений
      originalForm.value = { ...form };

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

    // Формируем payload только с измененными полями
    const payload: Partial<IListingForm> = {};

    if (form.title !== originalForm.value.title) payload.title = form.title;
    if (form.description !== originalForm.value.description)
      payload.description = form.description;
    if (form.region_id !== originalForm.value.region_id)
      payload.region_id = form.region_id;
    if (form.city_id !== originalForm.value.city_id)
      payload.city_id = form.city_id;
    if (form.price !== originalForm.value.price)
      payload.price = Number(form.price);
    if (form.currency !== originalForm.value.currency)
      payload.currency = form.currency;
    if (form.state !== originalForm.value.state) payload.state = form.state;
    if (form.allow_trade_in !== originalForm.value.allow_trade_in)
      payload.allow_trade_in = form.allow_trade_in;
    if (form.color !== originalForm.value.color) payload.color = form.color;
    if (form.storage !== originalForm.value.storage)
      payload.storage = form.storage;
    if (form.storage_unit !== originalForm.value.storage_unit)
      payload.storage_unit = form.storage_unit;
    if (form.ram !== originalForm.value.ram) payload.ram = form.ram;
    if (form.ram_unit !== originalForm.value.ram_unit)
      payload.ram_unit = form.ram_unit;
    if (form.phone_number !== originalForm.value.phone_number)
      payload.phone_number = form.phone_number;
    if (form.telegram_link !== originalForm.value.telegram_link)
      payload.telegram_link = form.telegram_link;
    if (form.show_phone !== originalForm.value.show_phone)
      payload.show_phone = form.show_phone;

    // Обработка brand_id и custom_brand
    if (form.brand_id !== originalForm.value.brand_id) {
      payload.brand_id = form.brand_id || null;
    }
    if (form.custom_brand !== originalForm.value.custom_brand) {
      payload.custom_brand = form.custom_brand || null;
    }

    // Обработка model_id и custom_model
    if (form.model_id !== originalForm.value.model_id) {
      payload.model_id = form.model_id || null;
    }
    if (form.custom_model !== originalForm.value.custom_model) {
      payload.custom_model = form.custom_model || null;
    }

    const response = await $api<IBaseResponse<IListing>>(`/ads/${adId.value}`, {
      method: "PUT",
      body: payload,
    });

    if (response?.status) {
      // Загружаем новые изображения, если есть
      if (fileList.value.length > 0) {
        const uploaded = await uploadImages(adId.value);
        if (!uploaded) {
          // Оставляем пользователя на странице, чтобы загрузить фото снова
          loading.value = false;
          return;
        }
      }
      ElMessage.success(t("account.editListing.messages.updateSuccess"));
      navigateTo(localePath("/account/listings"));
    }
    loading.value = false;
  },
  (e: any) => {
    loading.value = false;
    ElMessage.error(getErrorMessage(e, t("account.editListing.messages.updateError")));
  }
);

// Загрузка новых изображений (со сжатием). Возвращает true при успехе.
const uploadImages = async (entityId: number | undefined): Promise<boolean> => {
  if (!entityId || fileList.value.length === 0) {
    return true;
  }

  try {
    const formData = new FormData();

    for (const file of fileList.value) {
      const compressed = await compressImage(file.raw);
      formData.append("images", compressed, compressed.name || file.name);
    }

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
    return true;
  } catch (e: any) {
    ElMessage.error(
      getErrorMessage(e, t("account.editListing.messages.imageUploadError"))
    );
    return false;
  }
};

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
    ElMessage.error(
      message || t("account.editListing.messages.imageDeleteError")
    );
    console.error("Delete error:", e);
  }
);

const uploadRef = ref();

const handleFileChange = (file: any, fileListData: any[]) => {
  // Блокируем недопустимые форматы (HEIC и пр.)
  if (file.raw && !isAllowedImage(file.raw)) {
    ElMessage.error(t("createListing.validation.imageFormat"));
    uploadRef.value?.handleRemove(file);
    return;
  }
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
            <h2 class="section-title">
              {{ $t("account.editListing.sections.main") }}
            </h2>

            <el-form-item
              :label="$t('account.editListing.fields.title')"
              prop="title"
            >
              <el-input
                v-model="form.title"
                :placeholder="$t('account.editListing.placeholders.title')"
              />
            </el-form-item>

            <el-form-item
              :label="$t('account.editListing.fields.description')"
              prop="description"
              class="quill-form-item"
            >
              <RichTextEditor
                v-model:content="form.description"
                :placeholder="
                  $t('account.editListing.placeholders.description')
                "
              />
            </el-form-item>
          </div>

          <div class="form-section">
            <h2 class="section-title">
              {{ $t("account.editListing.sections.specsAndPrice") }}
            </h2>

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
                    other
                    @select="handleBrandChange"
                    @select-other="handleBrandSelectOther"
                  />
                  <div v-else class="custom-input-wrapper">
                    <el-input
                      v-model="form.custom_brand"
                      :placeholder="
                        $t('createListing.fields.brand.customPlaceholder')
                      "
                    />
                    <el-button
                      type="info"
                      link
                      @click="
                        isCustomBrand = false;
                        isCustomModel = false;
                        form.custom_brand = null;
                        form.custom_model = null;
                      "
                    >
                      {{ $t("common.selectFromList") }}
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
                        :placeholder="
                          $t('createListing.fields.model.customPlaceholder')
                        "
                      />
                      <el-button
                        v-if="!isCustomBrand"
                        type="info"
                        link
                        @click="
                          isCustomModel = false;
                          form.custom_model = null;
                        "
                      >
                        {{ $t("common.selectFromList") }}
                      </el-button>
                    </div>
                  </template>
                  <ModelAutocomplete
                    v-else
                    v-model="form.model_id"
                    :brand-id="form.brand_id"
                    :placeholder="$t('createListing.fields.model.placeholder')"
                    other
                    @select="handleModelSelect"
                    @select-other="handleModelSelectOther"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item
                  :label="$t('createListing.fields.memory.label')"
                  prop="storage"
                >
                  <el-input
                    v-model.number="form.storage"
                    style="max-width: 600px"
                    :placeholder="$t('createListing.fields.memory.placeholder')"
                    type="number"
                  >
                    <template #append>
                      <el-select
                        v-model="form.storage_unit"
                        style="width: 80px"
                      >
                        <el-option label="MB" value="MB" />
                        <el-option label="GB" value="GB" />
                        <el-option label="TB" value="TB" />
                      </el-select>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item
                  :label="$t('createListing.fields.ram.label')"
                  prop="ram"
                >
                  <el-input
                    v-model.number="form.ram"
                    style="max-width: 600px"
                    :placeholder="$t('createListing.fields.ram.placeholder')"
                    type="number"
                  >
                    <template #append>
                      <el-select v-model="form.ram_unit" style="width: 80px">
                        <el-option label="MB" value="MB" />
                        <el-option label="GB" value="GB" />
                        <el-option label="TB" value="TB" />
                      </el-select>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item :label="$t('createListing.fields.color.label')">
                  <el-input
                    v-if="colors?.length === 0"
                    v-model="form.color"
                    :placeholder="
                      $t('createListing.fields.color.placeholderInput')
                    "
                  />
                  <el-select
                    v-else
                    v-model="form.color"
                    :placeholder="
                      $t('createListing.fields.color.placeholderSelect')
                    "
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
                <el-form-item
                  :label="$t('createListing.fields.condition.label')"
                  prop="state"
                >
                  <el-select
                    v-model="form.state"
                    :placeholder="
                      $t('createListing.fields.condition.placeholder')
                    "
                  >
                    <el-option
                      :label="$t('createListing.fields.condition.options.new')"
                      value="new"
                    />
                    <el-option
                      :label="
                        $t('createListing.fields.condition.options.restored')
                      "
                      value="restored"
                    />
                    <el-option
                      :label="$t('createListing.fields.condition.options.used')"
                      value="used"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item
                  :label="$t('createListing.fields.price.label')"
                  prop="price"
                >
                  <el-input
                    v-model="form.price"
                    :placeholder="$t('createListing.fields.price.placeholder')"
                    :formatter="formatPrice"
                    :parser="parsePrice"
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item
                  :label="$t('createListing.fields.currency.label')"
                >
                  <el-select
                    v-model="form.currency"
                    readonly
                    :placeholder="
                      $t('createListing.fields.currency.placeholder')
                    "
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
                :label="$t('createListing.fields.exchange')"
                border
              />
            </el-form-item>
          </div>

          <div class="form-section">
            <h2 class="section-title">
              {{ $t("account.editListing.sections.locationAndPhotos") }}
            </h2>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item
                  :label="$t('createListing.fields.region.label')"
                  prop="region_id"
                >
                  <RegionAutocomplete
                    v-model="form.region_id"
                    :placeholder="$t('createListing.fields.region.placeholder')"
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item
                  :label="$t('createListing.fields.city.label')"
                  prop="city_id"
                >
                  <CityAutocomplete
                    v-model="form.city_id"
                    :region-id="form.region_id"
                    :placeholder="$t('createListing.fields.city.placeholder')"
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
              :label="$t('createListing.fields.photos.label')"
              prop="images"
            >
              <el-upload
                ref="uploadRef"
                class="upload-demo"
                drag
                :auto-upload="false"
                :limit="8 - existingImages.length"
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                multiple
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  {{ $t("createListing.fields.photos.dragText") }}
                  <em>{{ $t("createListing.fields.photos.clickText") }}</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    {{ $t("createListing.fields.photos.tip") }}
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </div>

          <div class="form-section">
            <h2 class="section-title">
              {{ $t("account.editListing.sections.contacts") }}
            </h2>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item
                  :label="$t('createListing.fields.phone.label')"
                  prop="phone_number"
                >
                  <PhoneNumber v-model="form.phone_number" />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item
                  :label="$t('createListing.fields.telegram.label')"
                >
                  <TelegramLink v-model="form.telegram_link" />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item>
                  <el-checkbox
                    v-model="form.show_phone"
                    border
                    :label="$t('createListing.fields.showContacts')"
                  />
                </el-form-item>
              </el-col>
            </el-row>
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
