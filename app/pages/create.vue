<script setup lang="ts">
import { UploadFilled } from "@element-plus/icons-vue";
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
              <el-input placeholder="Введите название" />
            </el-form-item>

            <el-form-item label="Описание">
              <el-input type="textarea" placeholder="Введите описание" />
            </el-form-item>
          </div>

          <div class="form-section">
            <h2 class="section-title">Характеристики и цена</h2>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Бренд">
                  <el-select placeholder="Выберите бренд">
                    <el-option label="Apple" value="apple" />
                    <el-option label="Samsung" value="samsung" />
                    <el-option label="Xiaomi" value="xiaomi" />
                    <el-option label="Huawei" value="huawei" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="Модель">
                  <el-select placeholder="Выберите модель">
                    <el-option label="iPhone 16 Pro Max" value="iphone-16-pro-max" />
                    <el-option label="iPhone 16 Pro" value="iphone-16-pro" />
                    <el-option label="iPhone 16" value="iphone-16" />
                    <el-option label="iPhone 16 Plus" value="iphone-16-plus" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="Память">
                  <el-select placeholder="Выберите память">
                    <el-option label="8GB" value="8GB" />
                    <el-option label="16GB" value="16GB" />
                    <el-option label="32GB" value="32GB" />
                    <el-option label="64GB" value="64GB" />
                    <el-option label="128GB" value="128GB" />
                    <el-option label="256GB" value="256GB" />
                    <el-option label="512GB" value="512GB" />
                    <el-option label="1TB" value="1TB" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="Оперативка">
                  <el-select placeholder="Выберите оперативку">
                    <el-option label="1GB" value="1GB" />
                    <el-option label="2GB" value="2GB" />
                    <el-option label="3GB" value="3GB" />
                    <el-option label="4GB" value="4GB" />
                    <el-option label="6GB" value="6GB" />
                    <el-option label="8GB" value="8GB" />
                    <el-option label="12GB" value="12GB" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="Цвет">
                  <el-input placeholder="Введите цвет" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="Состояние">
                  <el-select placeholder="Выберите состояние">
                    <el-option label="Новый" value="new" />
                    <el-option label="Восстановлен" value="restored" />
                    <el-option label="Б/У" value="used" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="Цена">
                  <el-input placeholder="Введите цену" />
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="Валюта">
                  <el-select placeholder="Выберите валюту">
                    <el-option label="UZS" value="UZS" />
                    <el-option label="USD" value="USD" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item>
              <el-checkbox label="Возможен обмен" border />
            </el-form-item>
          </div>

          <div class="form-section">
            <h2 class="section-title">Местоположение и фото</h2>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Регион">
                  <el-select placeholder="Выберите регион">
                    <el-option label="Toshkent" value="toshkent" />
                    <el-option label="Samarqand" value="samarqand" />
                    <el-option label="Bukhara" value="bukhara" />
                    <el-option label="Fergana" value="fergana" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="Город">
                  <el-select placeholder="Выберите город">
                    <el-option label="Toshkent" value="toshkent" />
                    <el-option label="Samarqand" value="samarqand" />
                    <el-option label="Bukhara" value="bukhara" />
                    <el-option label="Fergana" value="fergana" />
                  </el-select>
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
                  <el-input placeholder="Введите телефон" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="Telegram">
                  <el-input placeholder="Введите Telegram" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <el-row :gutter="20">
            <el-col :span="10">
              <el-button type="primary" plain style="width: 100%">Сохранить в черновик</el-button>
            </el-col>

            <el-col :span="14">
              <el-button type="primary" style="width: 100%">Опубликовать</el-button>
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
