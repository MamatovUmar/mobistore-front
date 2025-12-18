<script setup lang="ts">
import {
  Star,
  Clock,
  MoreFilled,
  View,
  Location,
  Picture,
} from "@element-plus/icons-vue";
import type { IListing } from "~/types/ads";
import { ListingStatus } from "~/types/ads";

const { t, locale } = useI18n();
const localePath = useLocalePath();

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
      navigateTo(localePath(`/${props.listing.alias}`));
      break;
    case "edit":
      navigateTo(localePath(`/account/listings/edit/${props.listing.id}`));
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
  return new Intl.DateTimeFormat(locale.value === "uz" ? "uz-UZ" : "ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getImageUrl = (listing: IListing) => {
  return listing.images?.[0]?.url || "/no-image.png";
};

const getLocalizedCity = computed(() => {
  return locale.value === "uz" ? props.listing.city.name_uz : props.listing.city.name_ru;
});
</script>

<template>
  <div class="listing-card">
    <!-- Image Section -->
    <div class="listing-image">
      <nuxt-link :to="localePath(`/${listing.alias}`)" class="image-link">
        <img :src="getImageUrl(listing)" :alt="listing.title" />
      </nuxt-link>
      <el-tag
        :type="getStatusType(listing.status)"
        class="status-badge"
        size="small"
      >
        {{ getStatusLabel(listing.status) }}
      </el-tag>
      <div v-if="listing.images.length > 1" class="image-count">
        <el-icon><Picture /></el-icon>
        {{ listing.images.length }}
      </div>
      <!-- Dropdown on Image -->
      <el-dropdown
        class="listing-dropdown"
        trigger="click"
        @command="handleMenuAction"
      >
        <el-button type="text" class="dropdown-button">
          <el-icon :size="18">
            <MoreFilled />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="view">{{ $t("account.listings.card.view") }}</el-dropdown-item>
            <el-dropdown-item command="edit">{{ $t("account.listings.card.edit") }}</el-dropdown-item>
            <el-dropdown-item
              v-if="listing.status !== ListingStatus.ACTIVE"
              command="active"
              divided
            >
              {{ $t("account.listings.card.activate") }}
            </el-dropdown-item>
            <el-dropdown-item
              v-if="listing.status !== ListingStatus.SOLD"
              command="sold"
            >
              {{ $t("account.listings.card.sold") }}
            </el-dropdown-item>
            <el-dropdown-item
              v-if="listing.status !== ListingStatus.ARCHIVED"
              command="archived"
            >
              {{ $t("account.listings.card.toArchive") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- Content Section -->
    <div class="listing-content">
      <!-- Price -->
      <div class="price-row">
        <span class="price-amount">
          {{ formatCurrency(listing.price, listing.currency) }}
        </span>
      </div>

      <!-- Title -->
      <nuxt-link :to="localePath(`/${listing.alias}`)" class="listing-title">
        {{ listing.title }}
      </nuxt-link>

      <!-- Specs Tags -->
      <div class="listing-tags">
        <span class="tag-item">{{ listing.brand.name }}</span>
        <span class="tag-item">{{ listing.model.name }}</span>
        <span class="tag-item">{{ getStateLabel(listing.state) }}</span>
        <span v-if="listing.storage" class="tag-item"
          >{{ listing.storage }} {{ $t("account.listings.card.gb") }}</span
        >
      </div>

      <!-- Meta Row -->
      <div class="listing-meta">
        <div class="meta-item location">
          <el-icon><Location /></el-icon>
          <span>{{ getLocalizedCity }}</span>
        </div>
        <div class="meta-item date">
          <el-icon><Clock /></el-icon>
          <span>{{
            formatDate(listing.published_at || listing.created_at)
          }}</span>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="listing-stats">
        <div class="stat-item" :title="$t('account.listings.card.views')">
          <el-icon><View /></el-icon>
          <span>{{ listing.views_count }}</span>
        </div>
        <div class="stat-item" :title="$t('account.listings.card.inFavorites')">
          <el-icon><Star /></el-icon>
          <span>{{ listing.favorites_count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.listing-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--el-color-primary);
    box-shadow: 0 8px 30px rgba(59, 130, 246, 0.12);
    transform: translateY(-2px);
  }

  @media (max-width: 640px) {
    border-radius: 12px;
  }
}

.listing-image {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  overflow: hidden;

  .image-link {
    display: block;
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover img {
    transform: scale(1.03);
  }

  @media (max-width: 640px) {
    aspect-ratio: 16 / 9;
  }

  @media (max-width: 480px) {
    aspect-ratio: 4 / 3;
  }
}

.status-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 12px;
  font-weight: 600;
  padding: 0 12px;
  height: 26px;
  backdrop-filter: blur(8px);
  z-index: 2;

  @media (max-width: 640px) {
    top: 10px;
    left: 10px;
    font-size: 11px;
    height: 24px;
    padding: 0 10px;
  }
}

.image-count {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  color: #fff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  z-index: 2;

  .el-icon {
    font-size: 14px;
  }

  @media (max-width: 640px) {
    bottom: 10px;
    left: 10px;
    font-size: 12px;
    padding: 4px 10px;
  }
}

.listing-dropdown {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;

  .dropdown-button {
    width: 36px;
    height: 36px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border: none;
    transition: all 0.2s ease;
    color: #374151;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      background: #fff;
      color: var(--el-color-primary);
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  @media (max-width: 640px) {
    top: 10px;
    right: 10px;

    .dropdown-button {
      width: 32px;
      height: 32px;
      border-radius: 8px;
    }
  }
}

.listing-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;

  @media (max-width: 640px) {
    padding: 14px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-amount {
  font-size: 22px;
  font-weight: 700;
  color: var(--el-color-primary);
  letter-spacing: -0.5px;

  @media (max-width: 640px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
}

.listing-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--el-color-primary);
  }

  @media (max-width: 640px) {
    font-size: 15px;
    line-height: 1.35;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
}

.listing-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
  transition: background 0.2s ease;

  &:hover {
    background: #e5e7eb;
  }

  @media (max-width: 640px) {
    padding: 3px 8px;
    font-size: 11px;
  }
}

.listing-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid #f3f4f6;

  @media (max-width: 640px) {
    gap: 10px;
    padding-top: 8px;
  }
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;

  .el-icon {
    font-size: 14px;
    color: #9ca3af;
  }

  @media (max-width: 640px) {
    font-size: 12px;

    .el-icon {
      font-size: 13px;
    }
  }
}

.listing-stats {
  display: flex;
  gap: 16px;
  margin-top: 4px;

  @media (max-width: 640px) {
    gap: 14px;
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  cursor: help;
  transition: color 0.2s ease;

  .el-icon {
    font-size: 15px;
    color: #9ca3af;
    transition: color 0.2s ease;
  }

  &:hover {
    color: var(--el-color-primary);

    .el-icon {
      color: var(--el-color-primary);
    }
  }

  @media (max-width: 640px) {
    font-size: 12px;

    .el-icon {
      font-size: 14px;
    }
  }
}
</style>
