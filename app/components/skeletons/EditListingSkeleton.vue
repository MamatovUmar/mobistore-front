<template>
  <div class="edit-listing-skeleton">
    <!-- Основная информация -->
    <div class="form-section">
      <el-skeleton :rows="0" animated>
        <template #template>
          <el-skeleton-item variant="h3" style="width: 200px; height: 24px; margin-bottom: 16px" />
        </template>
      </el-skeleton>

      <!-- Название -->
      <div class="skeleton-field">
        <el-skeleton-item variant="text" style="width: 80px; height: 14px; margin-bottom: 8px" />
        <el-skeleton-item variant="rect" style="width: 100%; height: 40px; border-radius: 4px" />
      </div>

      <!-- Описание -->
      <div class="skeleton-field">
        <el-skeleton-item variant="text" style="width: 80px; height: 14px; margin-bottom: 8px" />
        <el-skeleton-item variant="rect" style="width: 100%; height: 180px; border-radius: 4px" />
      </div>
    </div>

    <!-- Характеристики и цена -->
    <div class="form-section">
      <el-skeleton :rows="0" animated>
        <template #template>
          <el-skeleton-item variant="h3" style="width: 220px; height: 24px; margin-bottom: 16px" />
        </template>
      </el-skeleton>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="skeleton-field">
            <el-skeleton-item variant="text" style="width: 60px; height: 14px; margin-bottom: 8px" />
            <el-skeleton-item variant="rect" style="width: 100%; height: 40px; border-radius: 4px" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="skeleton-field">
            <el-skeleton-item variant="text" style="width: 70px; height: 14px; margin-bottom: 8px" />
            <el-skeleton-item variant="rect" style="width: 100%; height: 40px; border-radius: 4px" />
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <div class="skeleton-field">
            <el-skeleton-item variant="text" style="width: 60px; height: 14px; margin-bottom: 8px" />
            <el-skeleton-item variant="rect" style="width: 100%; height: 40px; border-radius: 4px" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="skeleton-field">
            <el-skeleton-item variant="text" style="width: 90px; height: 14px; margin-bottom: 8px" />
            <el-skeleton-item variant="rect" style="width: 100%; height: 40px; border-radius: 4px" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="skeleton-field">
            <el-skeleton-item variant="text" style="width: 50px; height: 14px; margin-bottom: 8px" />
            <el-skeleton-item variant="rect" style="width: 100%; height: 40px; border-radius: 4px" />
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <div class="skeleton-field">
            <el-skeleton-item variant="text" style="width: 80px; height: 14px; margin-bottom: 8px" />
            <el-skeleton-item variant="rect" style="width: 100%; height: 40px; border-radius: 4px" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="skeleton-field">
            <el-skeleton-item variant="text" style="width: 50px; height: 14px; margin-bottom: 8px" />
            <el-skeleton-item variant="rect" style="width: 100%; height: 40px; border-radius: 4px" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="skeleton-field">
            <el-skeleton-item variant="text" style="width: 60px; height: 14px; margin-bottom: 8px" />
            <el-skeleton-item variant="rect" style="width: 100%; height: 40px; border-radius: 4px" />
          </div>
        </el-col>
      </el-row>

      <!-- Чекбокс -->
      <div class="skeleton-field">
        <el-skeleton-item variant="rect" style="width: 160px; height: 34px; border-radius: 4px" />
      </div>
    </div>

    <!-- Местоположение и фото -->
    <div class="form-section">
      <el-skeleton :rows="0" animated>
        <template #template>
          <el-skeleton-item variant="h3" style="width: 200px; height: 24px; margin-bottom: 16px" />
        </template>
      </el-skeleton>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="skeleton-field">
            <el-skeleton-item variant="text" style="width: 60px; height: 14px; margin-bottom: 8px" />
            <el-skeleton-item variant="rect" style="width: 100%; height: 40px; border-radius: 4px" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="skeleton-field">
            <el-skeleton-item variant="text" style="width: 60px; height: 14px; margin-bottom: 8px" />
            <el-skeleton-item variant="rect" style="width: 100%; height: 40px; border-radius: 4px" />
          </div>
        </el-col>
      </el-row>

      <!-- Фотографии -->
      <div class="skeleton-field">
        <el-skeleton-item variant="text" style="width: 140px; height: 14px; margin-bottom: 8px" />
        <div class="skeleton-images">
          <el-skeleton-item 
            v-for="i in 4" 
            :key="i" 
            variant="rect" 
            style="width: 120px; height: 120px; border-radius: 8px" 
          />
        </div>
      </div>

      <!-- Загрузка -->
      <div class="skeleton-field">
        <el-skeleton-item variant="text" style="width: 200px; height: 14px; margin-bottom: 8px" />
        <el-skeleton-item variant="rect" style="width: 100%; height: 150px; border-radius: 4px" />
      </div>
    </div>

    <!-- Контакты -->
    <div class="form-section">
      <el-skeleton :rows="0" animated>
        <template #template>
          <el-skeleton-item variant="h3" style="width: 100px; height: 24px; margin-bottom: 16px" />
        </template>
      </el-skeleton>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="skeleton-field">
            <el-skeleton-item variant="text" style="width: 70px; height: 14px; margin-bottom: 8px" />
            <el-skeleton-item variant="rect" style="width: 100%; height: 40px; border-radius: 4px" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="skeleton-field">
            <el-skeleton-item variant="text" style="width: 70px; height: 14px; margin-bottom: 8px" />
            <el-skeleton-item variant="rect" style="width: 100%; height: 40px; border-radius: 4px" />
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- Кнопки -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-skeleton-item variant="rect" style="width: 100%; height: 40px; border-radius: 4px" />
      </el-col>
      <el-col :span="12">
        <el-skeleton-item variant="rect" style="width: 100%; height: 40px; border-radius: 4px" />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.edit-listing-skeleton {
  max-width: 900px;
  margin: 0 auto;

  .form-section {
    background: var(--color-bg-primary);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  .skeleton-field {
    margin-bottom: 22px;
  }

  .skeleton-images {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
