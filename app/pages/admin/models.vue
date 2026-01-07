<script setup lang="ts">
import {
  Search,
  Refresh,
  Edit,
  Delete,
  View,
} from "@element-plus/icons-vue";
import { useAdminModels } from "@/composables/useAdminModels";
import type { IModel, IModelCreatePayload, IModelImage } from "@/types/model";
import ModelForm from "@/components/admin/model/ModelForm.vue";
import BrandAutocomplete from "@/components/autocompletes/BrandAutocomplete.vue";

definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "Модели — Админ MobiStore",
  robots: "noindex, nofollow",
});

const {
  models,
  pagination,
  loading,
  filters,
  page,
  limit,
  fetchModels,
  updateModel,
  deleteModel,
  getModel
} = useAdminModels();

onMounted(() => {
  fetchModels();
});

const config = useRuntimeConfig();

// State
const editDialogVisible = ref(false);
const detailDrawerVisible = ref(false);
const actionLoading = ref(false);

// Edit State
const selectedModel = ref<IModel | null>(null);
const currentGalleryImages = ref<IModelImage[]>([]);

// Brand selection
const selectedBrandId = ref<number>();

// Form Data binding
const formData = ref<IModelCreatePayload>({
  name: "",
  brand_id: 0,
  alias: "",
  url: "",
  image: "",
  description: "",
  specs: "",
  parsed: false,
  ram: [],
  rom: [],
  colors: [],
  display_type: "",
  display_size: "",
  battery_type: "",
});

// Watch pagination
watch([page, limit], () => {
  fetchModels();
});

// Handlers
const handleSearch = () => {
  page.value = 1;
  filters.value.brandId = selectedBrandId.value;
  fetchModels();
};

const handleViewClick = async (model: IModel) => {
  selectedModel.value = model;
  detailDrawerVisible.value = true;
  try {
    const fullModel = await getModel(model.id);
    selectedModel.value = fullModel;
  } catch (e: any) {
    ElMessage.error(e.message || "Не удалось загрузить данные модели");
  }
};

const handleRefresh = () => {
  fetchModels();
  ElMessage.success("Данные обновлены");
};

const handleEditClick = async (model: IModel) => {
  // Reset binding first to avoid showing stale data or partial data
  resetFormData();
  selectedModel.value = model;
  editDialogVisible.value = true;
  actionLoading.value = true;

  try {
    // 1. Fetch full model details
    const fullModel = await getModel(model.id);
    selectedModel.value = fullModel; // Update with full details

    // 2. Populate form data
    formData.value = JSON.parse(JSON.stringify(fullModel));
  } catch (e: any) {
    ElMessage.error(e.message || "Не удалось загрузить данные модели");
    editDialogVisible.value = false;
  } finally {
    actionLoading.value = false;
  }
};

const handleUpdateSubmit = async () => {
  if (!selectedModel.value) return;
  try {
    actionLoading.value = true;
    await updateModel(selectedModel.value.id, formData.value);
    ElMessage.success("Модель успешно обновлена");
    editDialogVisible.value = false;
    fetchModels();
  } catch (e: any) {
    ElMessage.error(e.message || "Ошибка при обновлении");
  } finally {
    actionLoading.value = false;
  }
};

const handleDeleteClick = async (model: IModel) => {
  try {
    await ElMessageBox.confirm(
      `Вы уверены, что хотите удалить модель "${model.name}"?`,
      "Удаление модели",
      {
        confirmButtonText: "Удалить",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );

    actionLoading.value = true;
    await deleteModel(model.id);
    ElMessage.success("Модель успешно удалена");
    fetchModels();
  } catch (err: any) {
    if (err !== "cancel") {
      ElMessage.error(err.message || "Ошибка при удалении");
    }
  } finally {
    actionLoading.value = false;
  }
};

const resetFormData = () => {
  selectedModel.value = null;
  currentGalleryImages.value = [];
  formData.value = {
    name: "",
    brand_id: undefined as any,
    alias: "",
    url: "",
    image: "",
    description: "",
    specs: "",
    parsed: false,
    ram: [],
    rom: [],
    colors: [],
    display_type: "",
    display_size: "",
    battery_type: "",
  };
};

</script>

<template>
  <div class="admin-models">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Модели</h1>
      <p class="page-subtitle">Управление моделями устройств</p>
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
          size="large"
          @keyup="handleSearch"
          @clear="handleSearch"
        />
        <BrandAutocomplete
          v-model="selectedBrandId"
          placeholder="Все бренды"
          size="large"
          style="width: 200px"
          @update:model-value="handleSearch"
        />
      </div>
      <div class="toolbar-right">
        <el-button
          :icon="Refresh"
          :loading="loading"
          size="large"
          @click="handleRefresh"
        >
          Обновить
        </el-button>
      </div>
    </div>

    <!-- Table -->
    <el-table
      v-loading="loading"
      :data="models"
      style="width: 100%"
      stripe
      border
    >
      <el-table-column prop="id" label="ID" width="80" sortable />
      <el-table-column label="Фото" width="80">
        <template #default="{ row }">
          <el-image
            v-if="row.image"
            :src="config.public.apiUrl + row.image"
            :preview-src-list="[config.public.apiUrl + row.image]"
            fit="cover"
            style="width: 40px; height: 40px; border-radius: 4px"
            preview-teleported
          />
          <div v-else class="no-image"></div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Название" min-width="200" sortable />
      <el-table-column prop="brand.name" label="Бренд" width="150" sortable />

      <el-table-column label="Действия" width="180" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button
              :icon="View"
              size="small"
              @click="handleViewClick(row)"
            />
            <el-button
              :icon="Edit"
              size="small"
              @click="handleEditClick(row)"
            />
            <el-button
              :icon="Delete"
              type="danger"
              size="small"
              @click="handleDeleteClick(row)"
            />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination-container">
      <el-pagination
        v-if="pagination"
        v-model:current-page="page"
        v-model:page-size="limit"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        :total="pagination.total"
      />
    </div>

    <!-- Edit Dialog -->
    <el-dialog
      v-model="editDialogVisible"
      title="Редактирование модели"
      width="800px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <ModelForm
        v-if="selectedModel"
        v-model="formData"
        :model-id="selectedModel.id"
        :loading="actionLoading"
        @submit="handleUpdateSubmit"
        @cancel="editDialogVisible = false"
      />
    </el-dialog>

    <!-- Detail Drawer -->
    <el-drawer
      v-model="detailDrawerVisible"
      title="Информация о модели"
      direction="rtl"
      size="800px"
    >
      <div v-if="selectedModel" class="model-detail">
        <!-- Header with Image -->
        <div class="detail-header">
          <h2>{{ selectedModel.name }}</h2>
          <el-tag v-if="selectedModel.brand" type="primary" size="large">
            {{ selectedModel.brand.name }}
          </el-tag>
        </div>

        <div class="admin-specs-list" v-html="selectedModel.specs"></div>
      </div>
    </el-drawer>
  </div>
</template>
<style lang="scss">
.admin-specs-list #specs-list {
  max-height: fit-content;
}
</style>
<style lang="scss" scoped>
.admin-models {
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

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-input {
  width: 280px;

  @media (max-width: 600px) {
    width: 100%;
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.no-image {
  width: 40px;
  height: 40px;
  background: #f0f2f5;
  border-radius: 4px;
}

// Detail Drawer
.model-detail {
  .detail-header {
    text-align: center;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--el-border-color);

    h2 {
      margin: 16px 0 8px;
      font-size: 24px;
      font-weight: 600;
    }
  }

  .detail-section {
    margin-bottom: 24px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 12px;
      color: var(--color-text-primary);
    }
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;

    .gallery-thumb {
      width: 100%;
      height: 100px;
      border-radius: 8px;
      cursor: pointer;
    }
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .color-tag {
      margin: 0;
    }
  }

  .camera-subtitle {
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 8px;
    color: var(--color-text-secondary);
  }

  .camera-spec {
    line-height: 1.6;
    margin: 2px 0;
  }
}
</style>
