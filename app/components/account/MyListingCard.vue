<script setup lang="ts">
import { Star, Clock, MoreFilled, View, Location } from "@element-plus/icons-vue";
import type { IListing } from "~/types/ads";
import { ListingStatus } from "~/types/ads";

const props = defineProps<{
  listing: IListing;
}>();

const emit = defineEmits<{
  edit: [id: number];
  view: [alias: string];
  statusChange: [];
}>();

const { getStatusLabel, getStatusType, getStateLabel, changeStatus } = useAds();

const handleMenuAction = async (action: string) => {
  switch (action) {
    case "view":
      navigateTo(`/${props.listing.alias}`);
      break;
    case "edit":
      navigateTo(`/account/listings/edit/${props.listing.id}`);
      break;
    default:
      await changeStatus(props.listing.id, action as ListingStatus);
      emit("statusChange");
      break;
  }
};



const formatDate = (dateString: string | null) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getImageUrl = (listing: IListing) => {
  return listing.images?.[0]?.url || "/no-image.png";
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};
</script>

<template>
  <div class="listing-card">
    <!-- Actions Dropdown -->
    <el-dropdown class="listing-dropdown" trigger="click" @command="handleMenuAction">
      <el-button type="text" class="dropdown-button">
        <el-icon :size="20">
          <MoreFilled />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="view">Посмотреть</el-dropdown-item>
          <el-dropdown-item command="edit">Изменить</el-dropdown-item>
          <el-dropdown-item
            v-if="listing.status !== ListingStatus.ACTIVE"
            command="active"
            divided
          >
            Активировать
          </el-dropdown-item>
          <el-dropdown-item
            v-if="listing.status !== ListingStatus.SOLD"
            command="sold"
          >
            Продано
          </el-dropdown-item>
          <el-dropdown-item
            v-if="listing.status !== ListingStatus.ARCHIVED"
            command="archived"
          >
            В архив
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- Image Section -->
    <div class="listing-image">
      <img :src="getImageUrl(listing)" :alt="listing.title">
      <el-tag :type="getStatusType(listing.status)" class="status-badge" size="small">
        {{ getStatusLabel(listing.status) }}
      </el-tag>
      <div v-if="listing.images.length > 1" class="image-count">
        {{ listing.images.length }} фото
      </div>
    </div>

    <!-- Info Section -->
    <div class="listing-info">
      <div class="listing-header">
        <nuxt-link :to="`/${listing.alias}`" class="listing-title">{{ listing.title }}</nuxt-link>
        <div class="price-amount">{{ formatCurrency(listing.price, listing.currency) }}</div>
      </div>

      <div class="listing-specs">
        <span class="spec-item">{{ listing.brand.name }}</span>
        <span class="spec-divider">•</span>
        <span class="spec-item">{{ listing.model.name }}</span>
        <span class="spec-divider">•</span>
        <span class="spec-item">{{ getStateLabel(listing.state) }}</span>
      </div>

      <div class="listing-details-row">
        <div class="detail-group">
          <span v-if="listing.storage" class="detail-item">
            <span class="detail-label">Память:</span>
            <span class="detail-value">{{ listing.storage }} ГБ</span>
          </span>
          <span v-if="listing.ram" class="detail-item">
            <span class="detail-label">RAM:</span>
            <span class="detail-value">{{ listing.ram }} ГБ</span>
          </span>
          <span v-if="listing.color" class="detail-item">
            <span class="detail-label">Цвет:</span>
            <span class="detail-value">{{ listing.color }}</span>
          </span>
        </div>
      </div>

      <div class="listing-meta">
        <div class="meta-left">
          <span class="location">
            <el-icon><Location /></el-icon>
            {{ listing.city.name_ru }}
          </span>
          <span class="date">
            <el-icon><Clock /></el-icon>
            {{ formatDate(listing.published_at || listing.created_at) }}
          </span>
        </div>
        <div class="listing-stats">
          <div class="stat-item" title="Просмотры">
            <el-icon><View /></el-icon>
            <span>{{ listing.views_count }}</span>
          </div>
          <div class="stat-item" title="В избранном">
            <el-icon><Star /></el-icon>
            <span>{{ listing.favorites_count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.listing-card {
  position: relative;
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 20px;
  padding: 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  transition: all 0.3s ease;
  align-items: start;

  &:hover {
    border-color: var(--el-color-primary);
  }

  @media (max-width: 968px) {
    grid-template-columns: 110px 1fr;
    gap: 16px;
    padding: 16px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 90px 1fr;
    gap: 12px;
    padding: 12px;
  }
}

.listing-dropdown {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 100;

  .dropdown-button {
    width: 40px;
    height: 40px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: #fff;
    border: 1px solid #e5e7eb;
    transition: all 0.2s ease;
    color: #374151;

    &:hover {
      background: #fff;
      color: var(--el-color-primary);
      border-color: var(--el-color-primary);
    }

    &:active {
      transform: translateY(0) scale(0.97);
    }
  }

  @media (max-width: 640px) {
    top: 12px;
    right: 12px;

    .dropdown-button {
      width: 36px;
      height: 36px;
    }
  }
}

.listing-image {
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f4f6;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 968px) {
    width: 110px;
    height: 110px;
  }

  @media (max-width: 640px) {
    width: 90px;
    height: 90px;
  }
}

.status-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 11px;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.image-count {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  color: #fff;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.listing-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.listing-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  width: calc(100% - 60px);

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 8px;
  }
}

.listing-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  text-decoration: none;
  &:hover {
    color: var(--el-color-primary);
  }

  @media (max-width: 640px) {
    font-size: 16px;
  }
}

.price-amount {
  font-size: 20px;
  font-weight: 700;
  color: var(--el-color-primary);
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 18px;
  }
}

.listing-specs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #6b7280;
}

.spec-item {
  font-weight: 500;
}

.spec-divider {
  color: #d1d5db;
}

.listing-details-row {
  display: flex;
  gap: 16px;
}

.detail-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  padding: 4px 10px;
  background: #f9fafb;
  border-radius: 6px;
  color: #374151;
}

.detail-label {
  color: #6b7280;
  font-weight: 500;
}

.detail-value {
  font-weight: 600;
  color: #111827;
}

.listing-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
  gap: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.location {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  gap: 5px;
  .el-icon {
    font-size: 14px;
  }
}

.date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #6b7280;

  .el-icon {
    font-size: 14px;
  }
}

.listing-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  cursor: help;

  .el-icon {
    font-size: 16px;
    color: #9ca3af;
  }

  &:hover {
    color: var(--el-color-primary);

    .el-icon {
      color: var(--el-color-primary);
    }
  }
}

</style>
