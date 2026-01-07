<script setup lang="ts">
import {
  User,
  Location,
  Phone,
  ChatDotRound,
  View,
  Star,
  Check,
  Close,
  Edit,
  Delete,
} from "@element-plus/icons-vue";
import type { IListing, ListingStatus } from "@/types/ads";
import { useAds } from "@/composables/useAds";

const props = defineProps<{
  modelValue: boolean;
  ad: IListing | null;
  isAdmin: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  approve: [ad: IListing];
  reject: [ad: IListing];
  edit: [ad: IListing];
  delete: [ad: IListing];
  "status-change": [ad: IListing];
  "ban-user": [userId: number];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const { getStatusLabel, getStatusType, getStateLabel } = useAds();

const formatPrice = (price: number, currency: string) => {
  const formatted = new Intl.NumberFormat("ru-RU").format(price);
  return currency === "USD" ? `$${formatted}` : `${formatted} сум`;
};

const formatDate = (date: string | null) => {
  if (!date) return "—";
  return new Date(date).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const currentImageIndex = ref(0);

const images = computed(() => props.ad?.images || []);

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  } else {
    currentImageIndex.value = images.value.length - 1;
  }
};

const nextImage = () => {
  if (currentImageIndex.value < images.value.length - 1) {
    currentImageIndex.value++;
  } else {
    currentImageIndex.value = 0;
  }
};

const isOnModeration = computed(() => props.ad?.status === "moderation");

watch(
  () => props.ad,
  () => {
    currentImageIndex.value = 0;
  }
);
</script>

<template>
  <el-drawer
    v-model="visible"
    title="Детали объявления"
    direction="rtl"
    size="600px"
    class="listing-drawer"
  >
    <template v-if="ad">
      <div class="listing-detail">
        <!-- Images Gallery -->
        <div v-if="images.length" class="detail-gallery">
          <div class="gallery-main">
            <el-image
              :src="images[currentImageIndex]?.url"
              fit="contain"
              class="main-image"
            >
              <template #error>
                <div class="image-error">
                  <el-icon :size="40"><View /></el-icon>
                </div>
              </template>
            </el-image>

            <template v-if="images.length > 1">
              <button class="gallery-nav gallery-nav--prev" @click="prevImage">
                <el-icon><arrow-left /></el-icon>
              </button>
              <button class="gallery-nav gallery-nav--next" @click="nextImage">
                <el-icon><arrow-right /></el-icon>
              </button>
            </template>
          </div>

          <div v-if="images.length > 1" class="gallery-thumbs">
            <div
              v-for="(img, idx) in images"
              :key="img.id"
              :class="['thumb', { active: idx === currentImageIndex }]"
              @click="currentImageIndex = idx"
            >
              <el-image :src="img.url" fit="cover" />
            </div>
          </div>
        </div>

        <!-- Header -->
        <div class="detail-header">
          <div class="detail-badges">
            <el-tag :type="getStatusType(ad.status)" size="large">
              {{ getStatusLabel(ad.status) }}
            </el-tag>
            <el-tag type="info" size="large">
              {{ getStateLabel(ad.state) }}
            </el-tag>
          </div>
          <span class="detail-id">#{{ ad.id }}</span>
        </div>

        <!-- Title & Price -->
        <div class="detail-section">
          <h2 class="listing-title">{{ ad.title }}</h2>
          <div class="listing-price">{{ formatPrice(ad.price, ad.currency) }}</div>
        </div>

        <!-- Description -->
        <div class="detail-section">
          <h4 class="section-title">Описание</h4>
          <div class="listing-description" v-html="ad.description"></div>
        </div>

        <!-- Specs -->
        <div class="detail-section">
          <h4 class="section-title">Характеристики</h4>
          <div class="specs-grid">
            <div class="spec-item">
              <span class="spec-label">Бренд</span>
              <span class="spec-value">{{ ad.brand?.name || ad.custom_brand }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Модель</span>
              <span class="spec-value">{{ ad.model?.name || ad.custom_model }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Память</span>
              <span class="spec-value">{{ ad.storage }} GB</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">ОЗУ</span>
              <span class="spec-value">{{ ad.ram }} GB</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Цвет</span>
              <span class="spec-value">{{ ad.color || "—" }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Trade-in</span>
              <span class="spec-value">{{ ad.allow_trade_in ? "Да" : "Нет" }}</span>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="detail-section">
          <h4 class="section-title">Местоположение</h4>
          <div class="location-info">
            <el-icon><Location /></el-icon>
            <span>{{ ad.region?.name_ru }}, {{ ad.city?.name_ru }}</span>
          </div>
        </div>

        <!-- Seller -->
        <div class="detail-section">
          <h4 class="section-title">Продавец</h4>
          <div class="seller-card">
            <div class="seller-info">
              <el-avatar :size="48" class="seller-avatar">
                <el-icon :size="24"><User /></el-icon>
              </el-avatar>
              <div class="seller-details">
                <span class="seller-name">
                  {{ ad.user?.first_name }} {{ ad.user?.last_name }}
                </span>
                <span class="seller-id">ID: {{ ad.user_id }}</span>
              </div>
            </div>

            <div class="seller-contacts">
              <div v-if="ad.phone_number" class="contact-item">
                <el-icon><Phone /></el-icon>
                <span>{{ ad.phone_number }}</span>
              </div>
              <div v-if="ad.telegram_link" class="contact-item">
                <el-icon><ChatDotRound /></el-icon>
                <span>{{ ad.telegram_link }}</span>
              </div>
            </div>

            <el-button
              v-if="isAdmin"
              type="danger"
              plain
              @click="$emit('ban-user', ad.user_id)"
            >
              Архивировать все объявления
            </el-button>
          </div>
        </div>

        <!-- Stats -->
        <div class="detail-section">
          <h4 class="section-title">Статистика</h4>
          <div class="stats-row">
            <div class="stat-item">
              <el-icon><View /></el-icon>
              <span>{{ ad.views_count }} просмотров</span>
            </div>
            <div class="stat-item">
              <el-icon><Star /></el-icon>
              <span>{{ ad.favorites_count }} в избранном</span>
            </div>
          </div>
        </div>

        <!-- Dates -->
        <div class="detail-section">
          <h4 class="section-title">Даты</h4>
          <div class="dates-grid">
            <div class="date-item">
              <span class="date-label">Создано</span>
              <span class="date-value">{{ formatDate(ad.created_at) }}</span>
            </div>
            <div class="date-item">
              <span class="date-label">Обновлено</span>
              <span class="date-value">{{ formatDate(ad.updated_at) }}</span>
            </div>
            <div class="date-item">
              <span class="date-label">Опубликовано</span>
              <span class="date-value">{{ formatDate(ad.published_at) }}</span>
            </div>
            <div v-if="ad.sold_at" class="date-item">
              <span class="date-label">Продано</span>
              <span class="date-value">{{ formatDate(ad.sold_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="detail-actions">
          <template v-if="isOnModeration">
            <el-button type="success" :icon="Check" @click="$emit('approve', ad)">
              Одобрить
            </el-button>
            <el-button type="warning" :icon="Close" @click="$emit('reject', ad)">
              Отклонить
            </el-button>
          </template>

          <template v-if="isAdmin">
            <el-button :icon="Edit" @click="$emit('status-change', ad)">
              Изменить статус
            </el-button>
            <el-button type="danger" :icon="Delete" @click="$emit('delete', ad)">
              Удалить
            </el-button>
          </template>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="loading-state">
        <el-icon class="is-loading" :size="32"><Loading /></el-icon>
        <span>Загрузка...</span>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
.listing-drawer {
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 20px 24px;
    border-bottom: 1px solid var(--color-border-light);
  }

  :deep(.el-drawer__body) {
    padding: 0;
    overflow-y: auto;
  }
}

.listing-detail {
  padding: 24px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: var(--color-text-secondary);
}

// Gallery
.detail-gallery {
  margin-bottom: 24px;
}

.gallery-main {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-bg-secondary);
  aspect-ratio: 4 / 3;
}

.main-image {
  width: 100%;
  height: 100%;
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: white;
    transform: translateY(-50%) scale(1.05);
  }

  &--prev {
    left: 12px;
  }

  &--next {
    right: 12px;
  }
}

.gallery-thumbs {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.thumb {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  opacity: 0.6;
  transition: opacity 0.2s;
  border: 2px solid transparent;

  &.active,
  &:hover {
    opacity: 1;
    border-color: var(--color-primary);
  }

  :deep(.el-image) {
    width: 100%;
    height: 100%;
  }
}

// Header
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-id {
  font-size: 14px;
  color: var(--color-text-muted);
  font-weight: 500;
}

// Sections
.detail-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

// Title & Price
.listing-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.listing-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

// Description
.listing-description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  padding: 16px;
  border-radius: 8px;
  white-space: pre-wrap;
}

// Specs
.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--color-bg-secondary);
  padding: 12px;
  border-radius: 8px;
}

.spec-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.spec-value {
  font-size: 14px;
  color: var(--color-text-primary);
  font-weight: 500;
}

// Location
.location-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  padding: 12px 16px;
  border-radius: 8px;
}

// Seller
.seller-card {
  background: var(--color-bg-secondary);
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.seller-avatar {
  background: var(--color-primary);
  color: white;
}

.seller-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.seller-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.seller-id {
  font-size: 12px;
  color: var(--color-text-muted);
}

.seller-contacts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-primary);
}

// Stats
.stats-row {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

// Dates
.dates-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.date-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--color-bg-secondary);
  padding: 12px;
  border-radius: 8px;
}

.date-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.date-value {
  font-size: 13px;
  color: var(--color-text-primary);
  font-weight: 500;
}

// Actions
.detail-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-light);
}
</style>
