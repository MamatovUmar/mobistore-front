<script setup lang="ts">
import { UploadFilled } from "@element-plus/icons-vue";
import BrandAutocomplete from "~/components/autocompletes/BrandAutocomplete.vue";
import ModelAutocomplete from "~/components/autocompletes/ModelAutocomplete.vue";
import RegionAutocomplete from "~/components/autocompletes/RegionAutocomplete.vue";
import CityAutocomplete from "~/components/autocompletes/CityAutocomplete.vue";
import PhoneNumber from "~/components/form/PhoneNumber.vue";
import TelegramLink from "~/components/form/TelegramLink.vue";
import type { IListingForm } from "~/types/ads";
import { ListingStatus } from "~/types/ads";
import type { IBaseResponse } from "~/types/index";

const { $api } = useNuxtApp();

const loading = ref(false);
const form = reactive<IListingForm>({
  "title": "dfsdfgh sehreythsdfgsd fghd",
  "description": "dsfgdj asdfgsdfydrjfghncv jkyfjnghd tyjghnfhj dhjdfg ndgj",
  "region_id": 5,
  "city_id": 230,
  "brand_id": 6,
  "model_id": 26152,
  "price": 34543,
  "currency": "UZS",
  "state": "new",
  "allow_trade_in": true,
  "color": "sdfgdsgd",
  "storage": 8,
  "ram": 1,
  "phone_number": "3453453453",
  "telegram_link": "https://t.me/4dsgdfg",
  "show_phone": true,
  "status": ListingStatus.ACTIVE
});

const createListing = catcher(async (status: ListingStatus) => {
  loading.value = true;
  const response = await $api<IBaseResponse<string>>("/ads", {
    method: "POST",
    body: {
      ...form,
      status
    },
  }); 
  if (response?.status) {
    ElMessage.success("Объявление создано успешно");
    navigateTo(`/${response.data}`);
  }  
  loading.value = false;
}, (e: any) => {
  loading.value = false;
  const details = e?.response?._data?.details ?? [];
  details?.forEach((detail: any) => {
    ElMessage.error(detail.errors?.join("\n"));
  });
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
        <el-form label-position="top" size="large">
          <div class="form-section">
            <h2 class="section-title">Основная информация</h2>

            <el-form-item label="Название">
              <el-input v-model="form.title" placeholder="Введите название" />
            </el-form-item>

            <el-form-item label="Описание">
              <el-input
                type="textarea"
                v-model="form.description"
                placeholder="Введите описание"
              />
            </el-form-item>
          </div>

          <div class="form-section">
            <h2 class="section-title">Характеристики и цена</h2>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Бренд">
                  <BrandAutocomplete v-model="form.brand_id" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="Модель">
                  <ModelAutocomplete
                    v-model="form.model_id"
                    :brand-id="form.brand_id"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="Память">
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

              <el-col :span="8">
                <el-form-item label="Оперативка">
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

              <el-col :span="8">
                <el-form-item label="Цвет">
                  <el-input v-model="form.color" placeholder="Введите цвет" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="Состояние">
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

              <el-col :span="8">
                <el-form-item label="Цена">
                  <el-input type="number" v-model="form.price" placeholder="Введите цену" />
                </el-form-item>
              </el-col>

              <el-col :span="8">
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
              <el-col :span="12">
                <el-form-item label="Регион">
                  <RegionAutocomplete v-model="form.region_id" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="Город">
                  <CityAutocomplete
                    v-model="form.city_id"
                    :region-id="form.region_id"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="Фотографии (макс. 8)">
              <el-upload
                class="upload-demo"
                drag
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                multiple
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  Drop file here or <em>click to upload</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    jpg/png files with a size less than 500kb
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </div>

          <div class="form-section">
            <h2 class="section-title">Контакты</h2>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Телефон">
                  <PhoneNumber v-model="form.phone_number" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="Telegram">
                  <TelegramLink v-model="form.telegram_link" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <el-row :gutter="20">
            <el-col :span="10">
              <el-button type="primary" plain style="width: 100%">
                Сохранить в черновик
              </el-button>
            </el-col>

            <el-col :span="14">
              <el-button type="primary" style="width: 100%" :loading="loading" @click="createListing(ListingStatus.ACTIVE)">
                Опубликовать
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
}
</style>
