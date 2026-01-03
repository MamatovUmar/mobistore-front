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

const { $api } = useNuxtApp();
const root = useRootStore();
const { t } = useI18n();
const localePath = useLocalePath();

const loading = ref(false);
const fileList = ref<any[]>([]);
const formRef = ref<FormInstance>();
const colors = ref<string[]>([]);

const isCustomBrand = ref(false);
const isCustomModel = ref(false);

useSeoMeta({
  title: t("createListing.meta.title"),
  description: t("createListing.meta.description"),
  ogTitle: t("createListing.meta.ogTitle"),
  ogDescription: t("createListing.meta.ogDescription"),
});

const validateImages = (rule: any, value: any, callback: any) => {
  if (fileList.value.length === 0) {
    callback(new Error(t("createListing.validation.images")));
  } else {
    callback();
  }
};

const validateBrand = (rule: any, value: any, callback: any) => {
  if (!form.brand_id && !form.custom_brand) {
    callback(new Error(t("createListing.validation.brand")));
  } else {
    callback();
  }
};

const validateModel = (rule: any, value: any, callback: any) => {
  if (!form.model_id && !form.custom_model) {
    callback(new Error(t("createListing.validation.model")));
  } else {
    callback();
  }
};


const rules = computed<FormRules<IListingForm & { images?: any }>>(() => ({
  title: [
    {
      required: true,
      message: t("createListing.validation.title"),
      trigger: "blur",
    },
  ],
  description: [
    {
      required: true,
      message: t("createListing.validation.description"),
      trigger: "blur",
    },
  ],
  region_id: [
    {
      required: true,
      message: t("createListing.validation.region"),
      trigger: "change",
    },
  ],
  city_id: [
    {
      required: true,
      message: t("createListing.validation.city"),
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
      message: t("createListing.validation.price"),
      trigger: "blur",
    },
  ],
  images: [{ validator: validateImages, trigger: "change" }],
  state: [
    {
      required: true,
      message: t("createListing.validation.state"),
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
      ElMessage.error(t("createListing.validation.required"));
      return;
    }

    loading.value = true;
    const payload = {
      ...form,
      price: Number(form.price),
      brand_id: form.brand_id || null,
      model_id: form.model_id || null,
      custom_brand: form.custom_brand || null,
      custom_model: form.custom_model || null,
    };
    const response = await $api<IBaseResponse<IListing>>("/ads", {
      method: "POST",
      body: payload,
    });
    if (response?.status) {
      ElMessage.success(t("createListing.validation.success"));
      await saveImages(response.data?.id);
      navigateTo(localePath(`/${response.data?.alias}`));
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
    ElMessage.error(t("createListing.validation.imageUploadError"));
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
        <h1 class="page-title">{{ $t("createListing.title") }}</h1>
        <p class="page-subtitle">{{ $t("createListing.subtitle") }}</p>
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
            <h2 class="section-title">
              {{ $t("createListing.sections.main") }}
            </h2>

            <el-form-item :label="$t('createListing.fields.title.label')" prop="title">
              <el-input
                v-model="form.title"
                :placeholder="$t('createListing.fields.title.placeholder')"
              />
            </el-form-item>

            <el-form-item
              :label="$t('createListing.fields.description.label')"
              prop="description"
              class="quill-form-item"
            >
              <RichTextEditor
                v-model:content="form.description"
                :placeholder="$t('createListing.fields.description.placeholder')"
              />
            </el-form-item>
          </div>

          <div class="form-section">
            <h2 class="section-title">
              {{ $t("createListing.sections.specsAndPrice") }}
            </h2>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item
                  :label="$t('createListing.fields.brand.label')"
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
                  :label="$t('createListing.fields.model.label')"
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
                  <el-select
                    v-model="form.storage"
                    :placeholder="$t('createListing.fields.memory.placeholder')"
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
                <el-form-item
                  :label="$t('createListing.fields.ram.label')"
                  prop="ram"
                >
                  <el-select
                    v-model="form.ram"
                    :placeholder="$t('createListing.fields.ram.placeholder')"
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
                <el-form-item :label="$t('createListing.fields.color.label')">
                  <el-input
                    v-if="colors.length === 0"
                    v-model="form.color"
                    :placeholder="$t('createListing.fields.color.placeholderInput')"
                  />
                  <el-select
                    v-else
                    v-model="form.color"
                    :placeholder="$t('createListing.fields.color.placeholderSelect')"
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
                    :placeholder="$t('createListing.fields.condition.placeholder')"
                  >
                    <el-option
                      :label="$t('createListing.fields.condition.options.new')"
                      value="new"
                    />
                    <el-option
                      :label="$t('createListing.fields.condition.options.restored')"
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
                    type="number"
                    v-model="form.price"
                    :placeholder="$t('createListing.fields.price.placeholder')"
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item :label="$t('createListing.fields.currency.label')">
                  <el-select
                    v-model="form.currency"
                    :placeholder="$t('createListing.fields.currency.placeholder')"
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
              {{ $t("createListing.sections.locationAndPhotos") }}
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

            <el-form-item
              :label="$t('createListing.fields.photos.label')"
              prop="images"
            >
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
              {{ $t("createListing.sections.contacts") }}
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
                <el-form-item :label="$t('createListing.fields.telegram.label')">
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
            <el-col :span="24">
              <el-button
                type="primary"
                style="width: 100%"
                :loading="loading"
                @click="createListing"
              >
                {{ $t("createListing.buttons.preview") }}
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

  .custom-input-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
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
