<script setup lang="ts">
import {
  View,
  Check,
  Close,
  Edit,
  Delete,
  Loading,
} from "@element-plus/icons-vue";
import type { IListing, ListingStatus } from "@/types/ads";
import type { IPagination } from "@/types";
import { useAds } from "@/composables/useAds";

defineProps<{
  ads: IListing[];
  pagination: IPagination | null;
  loading: boolean;
  page: number;
  limit: number;
  isAdmin: boolean;
}>();

const emit = defineEmits<{
  "update:page": [value: number];
  "update:limit": [value: number];
  "row-click": [ad: IListing];
  approve: [ad: IListing];
  reject: [ad: IListing];
  edit: [ad: IListing];
  delete: [ad: IListing];
  "status-change": [ad: IListing];
}>();

const { getStatusLabel, getStatusType, getStateLabel } = useAds();

const formatPrice = (price: number, currency: string) => {
  const formatted = new Intl.NumberFormat("ru-RU").format(price);
  return currency === "USD" ? `$${formatted}` : `${formatted} сум`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getFirstImage = (ad: IListing) => {
  return ad.images?.[0]?.url || "";
};

const handlePageChange = (page: number) => {
  emit("update:page", page);
};

const handleSizeChange = (size: number) => {
  emit("update:limit", size);
};

const isOnModeration = (status: ListingStatus) => {
  return status === "moderation";
};
</script>

<template>
  <el-card class="listings-table-card">
    <div v-if="loading && !ads.length" class="loading-state">
      <el-icon class="loading-icon" :size="32"><Loading /></el-icon>
      <span>Загрузка данных...</span>
    </div>

    <el-table
      v-else
      :data="ads"
      stripe
      class="listings-table"
      @row-click="(row: IListing) => $emit('row-click', row)"
    >
      <el-table-column prop="id" label="ID" width="70" />

      <el-table-column prop="title" label="Объявление" min-width="300">
        <template #default="{ row }">
          <div class="listing-cell">
            <el-image
              :src="getFirstImage(row)"
              class="listing-image"
              fit="cover"
            >
              <template #error>
                <div class="image-placeholder">
                  <el-icon><View /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="listing-info">
              <span class="listing-title">{{ row.title }}</span>
              <div class="listing-meta">
                <span class="listing-price">{{ formatPrice(row.price, row.currency) }}</span>
                <el-tag size="small" type="info">{{ getStateLabel(row.state) }}</el-tag>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="user" label="Продавец" width="160">
        <template #default="{ row }">
          <div class="seller-cell">
            <span class="seller-name">
              {{ row.user?.first_name }} {{ row.user?.last_name }}
            </span>
            <span class="seller-id">ID: {{ row.user_id }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="Статус" width="140">
        <template #default="{ row }">
          <el-tag
            :type="getStatusType(row.status)"
            size="small"
            :class="{ 'status-clickable': isAdmin }"
            @click.stop="isAdmin && $emit('status-change', row)"
          >
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column v-if="isAdmin" prop="views_count" label="Просмотры" width="100" align="center" />

      <el-table-column prop="region" label="Регион" width="150">
        <template #default="{ row }">
          <span class="region-cell">
            {{ row.city?.name || row.region?.name || "—" }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="created_at" label="Создано" width="110">
        <template #default="{ row }">
          <span class="date-cell">{{ formatDate(row.created_at) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Действия" width="180" fixed="right">
        <template #default="{ row }">
          <div class="actions-cell" @click.stop>
            <el-button-group>
              <el-tooltip content="Просмотр" placement="top">
                <el-button :icon="View" text @click="$emit('row-click', row)" />
              </el-tooltip>

              <el-tooltip
                v-if="isOnModeration(row.status)"
                content="Одобрить"
                placement="top"
              >
                <el-button
                  :icon="Check"
                  text
                  type="success"
                  @click="$emit('approve', row)"
                />
              </el-tooltip>

              <el-tooltip
                v-if="isOnModeration(row.status)"
                content="Отклонить"
                placement="top"
              >
                <el-button
                  :icon="Close"
                  text
                  type="warning"
                  @click="$emit('reject', row)"
                />
              </el-tooltip>

              <el-tooltip v-if="isAdmin" content="Редактировать" placement="top">
                <el-button :icon="Edit" text @click="$emit('edit', row)" />
              </el-tooltip>

              <el-tooltip v-if="isAdmin" content="Удалить" placement="top">
                <el-button
                  :icon="Delete"
                  text
                  type="danger"
                  @click="$emit('delete', row)"
                />
              </el-tooltip>
            </el-button-group>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="!loading && !ads.length" class="empty-state">
      <el-empty description="Объявления не найдены" />
    </div>

    <div v-if="pagination && ads.length" class="table-pagination">
      <el-pagination
        :current-page="page"
        :page-size="limit"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next"
        background
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.listings-table-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.listings-table {
  width: 100%;

  :deep(.el-table__row) {
    cursor: pointer;

    &:hover {
      background-color: var(--el-table-row-hover-bg-color);
    }
  }
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

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  padding: 40px 20px;
}

.listing-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.listing-image {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  flex-shrink: 0;
  background: var(--color-bg-secondary);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.listing-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.listing-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.listing-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.listing-price {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
}

.seller-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.seller-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.seller-id {
  font-size: 11px;
  color: var(--color-text-muted);
}

.status-clickable {
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}

.region-cell {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.date-cell {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.actions-cell {
  display: flex;
  align-items: center;
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}
</style>
