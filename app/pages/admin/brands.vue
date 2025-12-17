<script setup lang="ts">
import { Search, Filter, Refresh, Plus } from "@element-plus/icons-vue";
import { useAdminBrands } from "@/composables/useAdminBrands";
import type {
  IBrand,
  IBrandCreatePayload,
  IBrandUpdatePayload,
} from "@/types/brand";

definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "Бренды — Админ MobiStore",
  robots: "noindex, nofollow",
});

const {
  brands,
  pagination,
  loading,
  filters,
  page,
  limit,
  fetchBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadLogo,
  deleteLogo,
  resetFilters,
  applyFilters,
} = useAdminBrands();

// UI State
const showFilters = ref(false);
const createDialogVisible = ref(false);
const editDialogVisible = ref(false);
const selectedBrand = ref<IBrand | null>(null);
const actionLoading = ref(false);

// Fetch brands on mount
onMounted(() => {
  fetchBrands();
});

// Watch for page/limit changes
watch([page, limit], () => {
  fetchBrands();
});

// Handlers
const handleRowClick = (brand: IBrand) => {
  selectedBrand.value = brand;
  editDialogVisible.value = true;
};

const handleEdit = (brand: IBrand) => {
  selectedBrand.value = brand;
  editDialogVisible.value = true;
};

const handleCreate = async (data: IBrandCreatePayload, logo?: File) => {
  try {
    actionLoading.value = true;
    await createBrand(data, logo);
    ElMessage.success("Бренд успешно создан");
    createDialogVisible.value = false;
    fetchBrands();
  } catch (err: any) {
    ElMessage.error(err.message || "Ошибка при создании бренда");
  } finally {
    actionLoading.value = false;
  }
};

const handleUpdate = async (data: IBrandUpdatePayload) => {
  if (!selectedBrand.value) return;

  try {
    actionLoading.value = true;
    await updateBrand(selectedBrand.value.id, data);
    ElMessage.success("Бренд успешно обновлён");
    editDialogVisible.value = false;
    fetchBrands();
  } catch (err: any) {
    ElMessage.error(err.message || "Ошибка при обновлении бренда");
  } finally {
    actionLoading.value = false;
  }
};

const handleDelete = async (brand: IBrand) => {
  try {
    await ElMessageBox.confirm(
      `Вы уверены, что хотите удалить бренд "${brand.name}"? Это действие необратимо.`,
      "Удаление бренда",
      {
        confirmButtonText: "Удалить",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );

    actionLoading.value = true;
    await deleteBrand(brand.id);
    ElMessage.success("Бренд успешно удалён");

    if (selectedBrand.value?.id === brand.id) {
      editDialogVisible.value = false;
    }
  } catch (err: any) {
    if (err !== "cancel") {
      ElMessage.error(err.message || "Ошибка при удалении бренда");
    }
  } finally {
    actionLoading.value = false;
  }
};

const handleUploadLogo = async (file: File) => {
  if (!selectedBrand.value) return;

  try {
    actionLoading.value = true;
    const updatedBrand = await uploadLogo(selectedBrand.value.id, file);
    selectedBrand.value = updatedBrand;
    ElMessage.success("Логотип успешно загружен");
  } catch (err: any) {
    ElMessage.error(err.message || "Ошибка при загрузке логотипа");
  } finally {
    actionLoading.value = false;
  }
};

const handleDeleteLogo = async () => {
  if (!selectedBrand.value) return;

  try {
    await ElMessageBox.confirm(
      "Вы уверены, что хотите удалить логотип?",
      "Удаление логотипа",
      {
        confirmButtonText: "Удалить",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );

    actionLoading.value = true;
    const updatedBrand = await deleteLogo(selectedBrand.value.id);
    selectedBrand.value = updatedBrand;
    ElMessage.success("Логотип успешно удалён");
  } catch (err: any) {
    if (err !== "cancel") {
      ElMessage.error(err.message || "Ошибка при удалении логотипа");
    }
  } finally {
    actionLoading.value = false;
  }
};

const handleResetFilters = () => {
  resetFilters();
  fetchBrands();
};

const handleRefresh = () => {
  fetchBrands();
  ElMessage.success("Данные обновлены");
};

const handleSearch = () => {
  page.value = 1;
  fetchBrands();
};

const handlePageChange = (newPage: number) => {
  page.value = newPage;
};

const handleSizeChange = (newSize: number) => {
  limit.value = newSize;
  page.value = 1;
};
</script>

<template>
  <div class="admin-brands">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Бренды</h1>
      <p class="page-subtitle">Управление брендами в системе</p>
    </div>

    <!-- Toolbar -->
    <div class="page-toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="filters.search"
          placeholder="Поиск по названию..."
          :prefix-icon="Search"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        />
        <el-button
          :icon="Filter"
          :type="showFilters ? 'primary' : 'default'"
          @click="showFilters = !showFilters"
        >
          Фильтры
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-button :icon="Refresh" :loading="loading" @click="handleRefresh">
          Обновить
        </el-button>
        <el-button
          type="primary"
          :icon="Plus"
          @click="createDialogVisible = true"
        >
          Создать бренд
        </el-button>
      </div>
    </div>

    <!-- Filters -->
    <AdminBrandFilters
      v-model="filters"
      :visible="showFilters"
      @apply="applyFilters"
      @reset="handleResetFilters"
    />

    <!-- Brands Table -->
    <AdminBrandTable
      :brands="brands"
      :pagination="pagination"
      :loading="loading"
      :page="page"
      :limit="limit"
      @update:page="handlePageChange"
      @update:limit="handleSizeChange"
      @row-click="handleRowClick"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Create Dialog -->
    <AdminBrandCreateDialog
      v-model="createDialogVisible"
      :loading="actionLoading"
      @submit="handleCreate"
    />

    <!-- Edit Dialog -->
    <AdminBrandEditDialog
      v-model="editDialogVisible"
      :brand="selectedBrand"
      :loading="actionLoading"
      @submit="handleUpdate"
      @upload-logo="handleUploadLogo"
      @delete-logo="handleDeleteLogo"
    />
  </div>
</template>

<style lang="scss" scoped>
.admin-brands {
  max-width: 1400px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.page-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 280px;

  @media (max-width: 600px) {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .page-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
    justify-content: stretch;
  }

  .toolbar-left {
    flex-direction: column;
  }

  .toolbar-right {
    justify-content: flex-end;
  }
}
</style>
