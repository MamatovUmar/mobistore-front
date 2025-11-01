<script setup lang="ts">
import { Edit, Delete, View, Star } from "@element-plus/icons-vue";

interface ListingItem {
  id: number;
  image: string;
  title: string;
  brand: string;
  model: string;
  price: string;
  currency: string;
  location: string;
  condition: string;
  status: string;
  views: number;
  favorites: number;
  publishedAt: string;
}

defineProps<{
  listing: ListingItem;
}>();

const getConditionLabel = (condition: string) => {
  const labels: Record<string, string> = {
    new: "Новый",
    used: "Б/У",
    restored: "Восстановлен",
  };
  return labels[condition] || condition;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: "Активно",
    draft: "Черновик",
    archived: "Архивировано",
  };
  return labels[status] || status;
};

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    active: "success",
    draft: "warning",
    archived: "info",
  };
  return types[status] || "info";
};
</script>

<template>
  <div class="listing-card">
    <div class="listing-image">
      <img :src="listing.image" :alt="listing.title" />
      <el-tag :type="getStatusType(listing.status)" class="status-badge">
        {{ getStatusLabel(listing.status) }}
      </el-tag>
    </div>

    <div class="listing-info">
      <div class="listing-main">
        <h3 class="listing-title">{{ listing.title }}</h3>
        <p class="listing-details">
          {{ listing.brand }} • {{ listing.model }} • {{ getConditionLabel(listing.condition) }}
        </p>
        <p class="listing-location">{{ listing.location }}</p>
      </div>

      <div class="listing-stats">
        <div class="stat-item">
          <el-icon><View /></el-icon>
          <span>{{ listing.views }}</span>
        </div>
        <div class="stat-item">
          <el-icon><Star /></el-icon>
          <span>{{ listing.favorites }}</span>
        </div>
      </div>
    </div>

    <div class="listing-price">
      <div class="price-amount">{{ listing.price }} {{ listing.currency }}</div>
      <div class="listing-date">{{ listing.publishedAt }}</div>
    </div>

    <div class="listing-actions">
      <el-button type="default" :icon="Edit" circle />
      <el-button type="primary" :icon="View" circle />
      <el-button type="danger" :icon="Delete" circle />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.listing-card {
  display: grid;
  grid-template-columns: 120px 1fr auto auto;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  transition: all 0.2s;
  align-items: center;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: var(--color-primary);
  }

  @media (max-width: 968px) {
    grid-template-columns: 100px 1fr;
    gap: 12px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 80px 1fr;
  }
}

.listing-image {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 968px) {
    width: 100px;
    height: 100px;
  }

  @media (max-width: 640px) {
    width: 80px;
    height: 80px;
  }
}

.status-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 11px;
  padding: 4px 8px;
}

.listing-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.listing-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.listing-details {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.listing-location {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0;
}

.listing-stats {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--color-text-secondary);

  .el-icon {
    font-size: 16px;
  }
}

.listing-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;

  @media (max-width: 968px) {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.price-amount {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
}

.listing-date {
  font-size: 13px;
  color: var(--color-text-muted);
}

.listing-actions {
  display: flex;
  gap: 8px;

  @media (max-width: 968px) {
    grid-column: 1 / -1;
    justify-content: flex-end;
  }
}
</style>
