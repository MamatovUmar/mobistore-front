<script setup lang="ts">
import { Search, View, Edit, Delete, Check, Close } from "@element-plus/icons-vue";

definePageMeta({
  layout: "admin",
});

const searchQuery = ref("");
const selectedStatus = ref("");
const currentPage = ref(1);
const pageSize = ref(10);

const statusOptions = [
  { label: "Все статусы", value: "" },
  { label: "Активные", value: "active" },
  { label: "На модерации", value: "pending" },
  { label: "Отклонённые", value: "rejected" },
  { label: "Архив", value: "archived" },
];

const listings = ref([
  {
    id: 1,
    title: "iPhone 15 Pro Max 256GB",
    price: 12500000,
    seller: "Иван Петров",
    status: "active",
    views: 234,
    createdAt: "2024-03-15",
    image: "https://via.placeholder.com/60",
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra",
    price: 15800000,
    seller: "Мария Сидорова",
    status: "pending",
    views: 0,
    createdAt: "2024-03-15",
    image: "https://via.placeholder.com/60",
  },
  {
    id: 3,
    title: "Xiaomi 14 Pro",
    price: 8900000,
    seller: "Алексей Козлов",
    status: "active",
    views: 156,
    createdAt: "2024-03-14",
    image: "https://via.placeholder.com/60",
  },
  {
    id: 4,
    title: "Google Pixel 8 Pro",
    price: 11200000,
    seller: "Елена Новикова",
    status: "rejected",
    views: 0,
    createdAt: "2024-03-14",
    image: "https://via.placeholder.com/60",
  },
  {
    id: 5,
    title: "OnePlus 12",
    price: 9500000,
    seller: "Дмитрий Волков",
    status: "archived",
    views: 89,
    createdAt: "2024-03-13",
    image: "https://via.placeholder.com/60",
  },
  {
    id: 6,
    title: "iPhone 14 Pro 128GB",
    price: 9800000,
    seller: "Анна Смирнова",
    status: "pending",
    views: 0,
    createdAt: "2024-03-15",
    image: "https://via.placeholder.com/60",
  },
]);

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    active: "success",
    pending: "warning",
    rejected: "danger",
    archived: "info",
  };
  return types[status] || "info";
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: "Активно",
    pending: "На модерации",
    rejected: "Отклонено",
    archived: "В архиве",
  };
  return labels[status] || status;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price) + " сум";
};

const handleView = (row: any) => {
  console.log("View listing:", row);
};

const handleEdit = (row: any) => {
  console.log("Edit listing:", row);
};

const handleApprove = (row: any) => {
  console.log("Approve listing:", row);
};

const handleReject = (row: any) => {
  console.log("Reject listing:", row);
};

const handleDelete = (row: any) => {
  console.log("Delete listing:", row);
};
</script>

<template>
  <div class="admin-listings">
    <div class="page-toolbar">
      <div class="toolbar-filters">
        <el-input
          v-model="searchQuery"
          placeholder="Поиск объявлений..."
          :prefix-icon="Search"
          class="search-input"
          clearable
        />
        <el-select v-model="selectedStatus" placeholder="Статус" class="status-select">
          <el-option
            v-for="option in statusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>
    </div>

    <el-card class="listings-table-card">
      <el-table :data="listings" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="title" label="Объявление" min-width="280">
          <template #default="{ row }">
            <div class="listing-cell">
              <el-image
                :src="row.image"
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
                <span class="listing-price">{{ formatPrice(row.price) }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="seller" label="Продавец" width="150" />
        <el-table-column prop="status" label="Статус" width="130">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="Просмотры" width="100" align="center" />
        <el-table-column prop="createdAt" label="Дата" width="110" />
        <el-table-column label="Действия" width="180" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-tooltip content="Просмотр" placement="top">
                <el-button :icon="View" text @click="handleView(row)" />
              </el-tooltip>
              <el-tooltip v-if="row.status === 'pending'" content="Одобрить" placement="top">
                <el-button :icon="Check" text type="success" @click="handleApprove(row)" />
              </el-tooltip>
              <el-tooltip v-if="row.status === 'pending'" content="Отклонить" placement="top">
                <el-button :icon="Close" text type="warning" @click="handleReject(row)" />
              </el-tooltip>
              <el-tooltip content="Редактировать" placement="top">
                <el-button :icon="Edit" text @click="handleEdit(row)" />
              </el-tooltip>
              <el-tooltip content="Удалить" placement="top">
                <el-button :icon="Delete" text type="danger" @click="handleDelete(row)" />
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="200"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.admin-listings {
  max-width: 1400px;
}

.page-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
}

.toolbar-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-input {
  width: 320px;

  @media (max-width: 600px) {
    width: 100%;
  }
}

.status-select {
  width: 160px;
}

.listings-table-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.listing-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.listing-image {
  width: 48px;
  height: 48px;
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
  gap: 4px;
}

.listing-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.listing-price {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}
</style>
