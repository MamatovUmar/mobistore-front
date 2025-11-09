<script setup lang="ts">
import { ref, computed } from "vue";
import { LocationInformation, Picture, Clock } from "@element-plus/icons-vue";
import type { IListing } from "~/types/ads";
import { formatCurrency } from "~/utils/formatters";
import StatusTag from "~/components/ad/StatusTag.vue";

const props = defineProps<{
  listing: IListing;
}>()

const isFavorite = ref(false);

const image = computed(() => {
  if(props.listing.images.length > 0) {
    return props.listing.images[0]?.url;
  }
  return '';
});

const hasImage = computed(() => props.listing.images.length > 0);

const toggleFavorite = (event: MouseEvent) => {
  event.stopPropagation();
  isFavorite.value = !isFavorite.value;
};
</script>

<template>
  <NuxtLink class="listing-card" :to="`/${listing.alias}`">
    <div class="listing-image-wrapper">
      <div class="listing-image" :class="{ 'no-image': !hasImage }" :style="hasImage ? { backgroundImage: `url(${image})` } : {}">
        <div v-if="!hasImage" class="no-image-placeholder">
          <el-icon :size="48" color="#dcdfe6">
            <Picture />
          </el-icon>
          <span class="no-image-text">Нет фото</span>
        </div>

        <!-- Градиентный оверлей снизу для лучшей читаемости -->
        <div v-if="hasImage" class="image-gradient" />

        <!-- Кнопка избранного -->
        <button
          class="favorite-button"
          :class="{ active: isFavorite }"
          @click="toggleFavorite"
        >
          <svg
            v-if="!isFavorite"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <svg
            v-else
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </div>

    <div class="listing-info">
      <div class="listing-header">
        <div class="listing-brand">{{ props.listing.brand.name }}</div>
        <StatusTag :state="props.listing.state" />
      </div>

      <h3 class="listing-title">{{ props.listing.title }}</h3>

      <div class="listing-price-wrapper">
        <div class="listing-price">{{ formatCurrency(props.listing.price, props.listing.currency) }}</div>
      </div>

      <div class="listing-footer">
        <div class="listing-location">
          <el-icon><LocationInformation /></el-icon>
          <span>{{ props.listing.region.name_ru }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.listing-card {
  background: var(--color-bg-primary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.04);
  text-decoration: none;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    border-color: rgba(0, 0, 0, 0.08);

    .listing-image {
      transform: scale(1.03);
    }

    .favorite-button {
      opacity: 1;
      transform: scale(1);
    }
  }

  &:active {
    transform: translateY(-2px);
  }
}

.listing-image-wrapper {
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf0 100%);
}

.listing-image {
  width: 100%;
  height: 240px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &.no-image {
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf0 100%);
  }
}

.image-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%);
  pointer-events: none;
  z-index: 1;
}

.no-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0.5;
}

.no-image-text {
  font-size: 14px;
  color: #909399;
  font-weight: 500;
}

.badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
  z-index: 2;
}

.badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &.badge-new {
    background: linear-gradient(135deg, rgba(103, 194, 58, 0.95) 0%, rgba(76, 175, 80, 0.95) 100%);
    color: white;
  }
}

.favorite-button {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #606266;
  z-index: 2;

  &:hover {
    transform: scale(1.15);
    background: rgba(255, 255, 255, 1);
    color: #f56c6c;
  }

  &:active {
    transform: scale(1.05);
  }

  &.active {
    opacity: 1;
    transform: scale(1);
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    color: white;

    &:hover {
      transform: scale(1.15);
      box-shadow: 0 6px 16px rgba(245, 108, 108, 0.4);
    }
  }

  svg {
    width: 22px;
    height: 22px;
  }
}

.listing-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.listing-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.listing-brand {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #909399 0%, #606266 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.listing-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.5;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  min-height: 48px;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-primary);
  }
}

.listing-price-wrapper {
  margin: 4px 0;
}

.listing-price {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary) 0%, #409eff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.listing-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.listing-location {
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;

  .el-icon {
    font-size: 16px;
    color: var(--color-primary);
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

// Адаптивность для мобильных устройств
@media (max-width: 768px) {
  .listing-image {
    height: 200px;
  }

  .listing-info {
    padding: 16px;
  }

  .listing-title {
    font-size: 15px;
  }

  .listing-price {
    font-size: 20px;
  }
}
</style>
