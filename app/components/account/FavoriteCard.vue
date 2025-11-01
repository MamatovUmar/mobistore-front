<script setup lang="ts">
import { Delete } from "@element-plus/icons-vue";

interface FavoriteItem {
  id: number;
  image: string;
  title: string;
  brand: string;
  model: string;
  price: string;
  currency: string;
  location: string;
  condition: string;
  seller: string;
  addedAt: string;
}

defineProps<{
  favorite: FavoriteItem;
}>();

const getConditionLabel = (condition: string) => {
  const labels: Record<string, string> = {
    new: "Новый",
    used: "Б/У",
    restored: "Восстановлен",
  };
  return labels[condition] || condition;
};

const getConditionType = (condition: string) => {
  const types: Record<string, string> = {
    new: "success",
    used: "warning",
    restored: "info",
  };
  return types[condition] || "info";
};
</script>

<template>
  <div class="favorite-card">
    <div class="card-image">
      <img :src="favorite.image" :alt="favorite.title" />
      <button class="remove-btn">
        <el-icon><Delete /></el-icon>
      </button>
      <el-tag :type="getConditionType(favorite.condition)" class="condition-badge">
        {{ getConditionLabel(favorite.condition) }}
      </el-tag>
    </div>

    <div class="card-content">
      <h3 class="card-title">{{ favorite.title }}</h3>

      <div class="card-details">
        <p class="card-brand">{{ favorite.brand }} • {{ favorite.model }}</p>
        <p class="card-seller">{{ favorite.seller }}</p>
        <p class="card-location">{{ favorite.location }}</p>
      </div>

      <div class="card-footer">
        <div class="card-price">
          <span class="price-amount">{{ favorite.price }}</span>
          <span class="price-currency">{{ favorite.currency }}</span>
        </div>
        <button class="view-btn">Смотреть</button>
      </div>

      <p class="card-date">Добавлено: {{ favorite.addedAt }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.favorite-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: var(--color-primary);

    .card-image img {
      transform: scale(1.05);
    }
  }
}

.card-image {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: var(--color-bg-secondary);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
}

.remove-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-danger);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    background: var(--color-danger);
    color: white;
    transform: scale(1.1);
  }

  .el-icon {
    font-size: 20px;
  }
}

.condition-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  font-size: 12px;
  padding: 4px 12px;
}

.card-content {
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.card-brand,
.card-seller,
.card-location {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.card-location {
  color: var(--color-text-muted);
  font-size: 13px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-light);
}

.card-price {
  display: flex;
  flex-direction: column;
}

.price-amount {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
}

.price-currency {
  font-size: 13px;
  color: var(--color-text-muted);
}

.view-btn {
  padding: 8px 16px;
  border: 1px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--color-primary);
    color: white;
  }
}

.card-date {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
}
</style>
