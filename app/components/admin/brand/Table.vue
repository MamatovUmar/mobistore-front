<script setup lang="ts">
import { View, Edit, Delete, Loading, Picture } from "@element-plus/icons-vue";
import type { IBrand } from "@/types/brand";
import type { IPagination } from "@/types";

defineProps<{
  brands: IBrand[];
  pagination: IPagination | null;
  loading: boolean;
  page: number;
  limit: number;
}>();

const emit = defineEmits<{
  "update:page": [value: number];
  "update:limit": [value: number];
  "row-click": [brand: IBrand];
  edit: [brand: IBrand];
  delete: [brand: IBrand];
}>();

const config = useRuntimeConfig();

const getLogoUrl = (logo: string | undefined) => {
  if (!logo) return;
  if (logo.startsWith("http")) return logo;
  return `${config.public.apiBase}${logo}`;
};

const handlePageChange = (page: number) => {
  emit("update:page", page);
};

const handleSizeChange = (size: number) => {
  emit("update:limit", size);
};
</script>

<template>
  <el-card class="brands-table-card">
    <div v-if="loading && !brands.length" class="loading-state">
      <el-icon class="loading-icon" :size="32"><Loading /></el-icon>
      <span>Загрузка данных...</span>
    </div>

    <el-table
      v-else
      :data="brands"
      stripe
      class="brands-table"
      @row-click="(row: IBrand) => $emit('row-click', row)"
    >
      <el-table-column prop="id" label="ID" width="80" />

      <el-table-column label="Логотип" width="100" align="center">
        <template #default="{ row }: { row: IBrand }">
          <div class="logo-cell">
            <el-image
              v-if="row.logo"
              :src="getLogoUrl(row.logo)"
              fit="contain"
              class="brand-logo"
              :preview-src-list="[getLogoUrl(row.logo)!]"
              preview-teleported
              @click.stop
            >
              <template #error>
                <div class="logo-fallback">
                  <el-icon :size="20"><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div v-else class="logo-fallback">
              <el-icon :size="20"><Picture /></el-icon>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="Название" min-width="180">
        <template #default="{ row }">
          <span class="name-cell">{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="alias" label="Алиас" min-width="150">
        <template #default="{ row }">
          <span class="alias-cell">{{ row.alias || "—" }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="is_popular"
        label="Популярный"
        width="120"
        align="center"
      >
        <template #default="{ row }">
          <el-tag
            :type="row.is_popular ? 'success' : 'info'"
            size="small"
            effect="plain"
          >
            {{ row.is_popular ? "Да" : "Нет" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="ads_count"
        label="Объявлений"
        width="120"
        align="center"
      >
        <template #default="{ row }">
          <span class="count-cell">{{ row.ads_count || 0 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Действия" width="120" fixed="right">
        <template #default="{ row }">
          <div class="actions-cell" @click.stop>
            <el-button-group>
              <el-tooltip content="Редактировать" placement="top">
                <el-button :icon="Edit" text @click="$emit('edit', row)" />
              </el-tooltip>
              <el-tooltip content="Удалить" placement="top">
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

    <div v-if="!loading && !brands.length" class="empty-state">
      <el-empty description="Бренды не найдены" />
    </div>

    <div v-if="pagination && brands.length" class="table-pagination">
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
.brands-table-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.brands-table {
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

.logo-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: var(--color-bg-secondary);
  object-fit: contain;
}

.logo-fallback {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.name-cell {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.alias-cell {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-family: monospace;
}

.count-cell {
  font-size: 13px;
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
