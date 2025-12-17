<script setup lang="ts">
import {
  Search,
  Filter,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
} from "@element-plus/icons-vue";
import { useAdminModels } from "@/composables/useAdminModels";
import type { IModel, IModelCreatePayload, IModelImage } from "@/types/model";
import ModelForm from "@/components/admin/model/ModelForm.vue";
import ModelCreateForm from "@/components/admin/model/ModelCreateForm.vue";
import BrandAutocomplete from "@/components/autocompletes/BrandAutocomplete.vue";
import GenerateModel from "@/components/admin/model/GenerateModel.vue";

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
  createModel,
  updateModel,
  deleteModel,
  getModel,
  getModelImages,
  uploadModelImages,
  deleteModelImage,
  resetFilters,
  applyFilters,
} = useAdminModels();

onMounted(() => {
  fetchModels();
});

// State
const showFilters = ref(false);
const createDialogVisible = ref(false);
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
  image_url: "",
  colors: [],
  // Spec objects will be inited by form component
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
    const images = await getModelImages(model.id);
    currentGalleryImages.value = images;
  } catch (e: any) {
    ElMessage.error(e.message || "Не удалось загрузить данные модели");
  }
};

const handleRefresh = () => {
  fetchModels();
  ElMessage.success("Данные обновлены");
};

const handleCreateClick = () => {
  createDialogVisible.value = true;
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

    // 3. Fetch images
    currentGalleryImages.value = [];
    const images = await getModelImages(model.id);
    currentGalleryImages.value = images;
  } catch (e: any) {
    ElMessage.error(e.message || "Не удалось загрузить данные модели");
    editDialogVisible.value = false;
  } finally {
    actionLoading.value = false;
  }
};

const handleCreateSubmit = async (data: IModelCreatePayload) => {
  try {
    actionLoading.value = true;
    await createModel(data);
    ElMessage.success("Модель успешно создана");
    createDialogVisible.value = false;
    fetchModels();
  } catch (e: any) {
    ElMessage.error(e.message || "Ошибка при создании");
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

// Image Handlers
const handleUploadImages = async (files: File[]) => {
  if (!selectedModel.value) return;
  try {
    // We set loading on the page or specific component?
    // Logic handled here
    actionLoading.value = true; // Block form while uploading
    await uploadModelImages(selectedModel.value.id, files);
    ElMessage.success("Изображения загружены");

    // Refresh images list
    const images = await getModelImages(selectedModel.value.id);
    currentGalleryImages.value = images;

    // Also clear pending in child?
    // The child uses `pendingFiles`, we passed just the event.
    // We might want to signal success to child.
    // Currently architecture relies on Prop update.
  } catch (e: any) {
    ElMessage.error(e.message || "Ошибка загрузки");
  } finally {
    actionLoading.value = false;
  }
};

const handleDeleteImage = async (imageId: number) => {
  if (!selectedModel.value) return;
  try {
    await ElMessageBox.confirm("Удалить изображение?", "Удаление", {
      type: "warning",
    });
    actionLoading.value = true;
    await deleteModelImage(selectedModel.value.id, imageId);
    ElMessage.success("Изображение удалено");
    // Refresh images list
    const images = await getModelImages(selectedModel.value.id);
    currentGalleryImages.value = images;
  } catch (e: any) {
    if (e !== "cancel") ElMessage.error(e.message || "Ошибка удаления");
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
    image_url: "",
    colors: [],
    battery: {},
    platform: {},
    network: {},
    display: {},
    launch: {},
    body: {},
    memory: {},
    sound: {},
    comms: {},
    features: {},
    cameras: {},
  };
};

// Filter Handlers
const resetPageFilters = () => {
  resetFilters();
  fetchModels();
};

// AI Generation Handler
const handleModelGenerated = () => {
  fetchModels(); // Refresh the list after model is created by AI
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
          @update:model-value="handleSearch"
          style="width: 200px"
        />
      </div>
      <div class="toolbar-right">
        <el-button
          :icon="Refresh"
          :loading="loading"
          @click="handleRefresh"
          size="large"
        >
          Обновить
        </el-button>
        <el-button
          type="primary"
          :icon="Plus"
          @click="handleCreateClick"
          size="large"
        >
          Создать модель
        </el-button>

        <GenerateModel @success="handleModelGenerated" />
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
            v-if="row.image_url"
            :src="row.image_url"
            :preview-src-list="[row.image_url]"
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

    <!-- Create Dialog -->
    <el-dialog
      v-model="createDialogVisible"
      title="Создание модели"
      width="900px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <ModelCreateForm
        :loading="actionLoading"
        @submit="handleCreateSubmit"
        @cancel="createDialogVisible = false"
      />
    </el-dialog>

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
        :gallery-images="currentGalleryImages"
        :loading="actionLoading"
        @submit="handleUpdateSubmit"
        @cancel="editDialogVisible = false"
        @upload-images="handleUploadImages"
        @delete-image="handleDeleteImage"
      />
    </el-dialog>

    <!-- Detail Drawer -->
    <el-drawer
      v-model="detailDrawerVisible"
      title="Информация о модели"
      direction="rtl"
      size="600px"
    >
      <div v-if="selectedModel" class="model-detail">
        <!-- Header with Image -->
        <div class="detail-header">
          <el-image
            v-if="selectedModel.image_url"
            :src="selectedModel.image_url"
            :preview-src-list="[selectedModel.image_url]"
            fit="contain"
            style="width: 100%; max-height: 300px"
            preview-teleported
          />
          <h2>{{ selectedModel.name }}</h2>
          <el-tag v-if="selectedModel.brand" type="primary" size="large">
            {{ selectedModel.brand.name }}
          </el-tag>
        </div>

        <!-- Gallery Images -->
        <div v-if="currentGalleryImages.length > 0" class="detail-section">
          <h3>Галерея</h3>
          <div class="image-grid">
            <el-image
              v-for="img in currentGalleryImages"
              :key="img.id"
              :src="img.url"
              :preview-src-list="currentGalleryImages.map((i) => i.url)"
              fit="cover"
              class="gallery-thumb"
              preview-teleported
            />
          </div>
        </div>

        <!-- Colors -->
        <div
          v-if="selectedModel.colors && selectedModel.colors.length > 0"
          class="detail-section"
        >
          <h3>Доступные цвета</h3>
          <div class="tags-list">
            <el-tag
              v-for="color in selectedModel.colors"
              :key="color"
              class="color-tag"
            >
              {{ color }}
            </el-tag>
          </div>
        </div>

        <!-- Battery -->
        <div
          v-if="
            selectedModel.battery &&
            Object.keys(selectedModel.battery).length > 0
          "
          class="detail-section"
        >
          <h3>Батарея</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item v-if="selectedModel.battery.type" label="Тип">
              {{ selectedModel.battery.type }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.battery.capacity"
              label="Емкость"
            >
              {{ selectedModel.battery.capacity }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.battery.charging"
              label="Зарядка"
            >
              {{
                Array.isArray(selectedModel.battery.charging)
                  ? selectedModel.battery.charging.join(", ")
                  : selectedModel.battery.charging
              }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- Platform -->
        <div
          v-if="
            selectedModel.platform &&
            Object.keys(selectedModel.platform).length > 0
          "
          class="detail-section"
        >
          <h3>Платформа</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item v-if="selectedModel.platform.os" label="ОС">
              {{ selectedModel.platform.os }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.platform.chipset"
              label="Процессор"
            >
              {{ selectedModel.platform.chipset }}
            </el-descriptions-item>
            <el-descriptions-item v-if="selectedModel.platform.cpu" label="CPU">
              {{ selectedModel.platform.cpu }}
            </el-descriptions-item>
            <el-descriptions-item v-if="selectedModel.platform.gpu" label="GPU">
              {{ selectedModel.platform.gpu }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- Display -->
        <div
          v-if="
            selectedModel.display &&
            Object.keys(selectedModel.display).length > 0
          "
          class="detail-section"
        >
          <h3>Экран</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item v-if="selectedModel.display.type" label="Тип">
              {{ selectedModel.display.type }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.display.size"
              label="Размер"
            >
              {{ selectedModel.display.size }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.display.resolution"
              label="Разрешение"
            >
              {{ selectedModel.display.resolution }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.display.protection"
              label="Защита"
            >
              {{ selectedModel.display.protection }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- Memory -->
        <div
          v-if="
            selectedModel.memory && Object.keys(selectedModel.memory).length > 0
          "
          class="detail-section"
        >
          <h3>Память</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item v-if="selectedModel.memory.ram" label="RAM">
              {{ selectedModel.memory.ram }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.memory.storage"
              label="Память"
            >
              {{
                Array.isArray(selectedModel.memory.storage)
                  ? selectedModel.memory.storage.join(", ")
                  : selectedModel.memory.storage
              }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.memory.internal"
              label="Внутренняя"
            >
              {{ selectedModel.memory.internal }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.memory.cardSlot"
              label="Слот карты"
            >
              {{ selectedModel.memory.cardSlot }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- Cameras -->
        <div
          v-if="
            selectedModel.cameras &&
            Object.keys(selectedModel.cameras).length > 0
          "
          class="detail-section"
        >
          <h3>Камеры</h3>

          <!-- Main Camera (structured) -->
          <div v-if="selectedModel.cameras.mainCamera">
            <h4 class="camera-subtitle">Основная камера</h4>
            <el-descriptions :column="1" border>
              <el-descriptions-item
                v-if="selectedModel.cameras.mainCamera.type"
                label="Тип"
              >
                {{ selectedModel.cameras.mainCamera.type }}
              </el-descriptions-item>
              <el-descriptions-item
                v-if="selectedModel.cameras.mainCamera.cameraSpecs?.length"
                label="Характеристики"
              >
                <div
                  v-for="spec in selectedModel.cameras.mainCamera.cameraSpecs"
                  :key="spec"
                  class="camera-spec"
                >
                  • {{ spec }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item
                v-if="selectedModel.cameras.mainCamera.features?.length"
                label="Функции"
              >
                {{ selectedModel.cameras.mainCamera.features.join(", ") }}
              </el-descriptions-item>
              <el-descriptions-item
                v-if="selectedModel.cameras.mainCamera.video?.length"
                label="Видео"
              >
                <div
                  v-for="vid in selectedModel.cameras.mainCamera.video"
                  :key="vid"
                  class="camera-spec"
                >
                  • {{ vid }}
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- Selfie Camera (structured) -->
          <div
            v-if="selectedModel.cameras.selfieCamera"
            style="margin-top: 16px"
          >
            <h4 class="camera-subtitle">Фронтальная камера</h4>
            <el-descriptions :column="1" border>
              <el-descriptions-item
                v-if="selectedModel.cameras.selfieCamera.type"
                label="Тип"
              >
                {{ selectedModel.cameras.selfieCamera.type }}
              </el-descriptions-item>
              <el-descriptions-item
                v-if="selectedModel.cameras.selfieCamera.cameraSpecs?.length"
                label="Характеристики"
              >
                <div
                  v-for="spec in selectedModel.cameras.selfieCamera.cameraSpecs"
                  :key="spec"
                  class="camera-spec"
                >
                  • {{ spec }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item
                v-if="selectedModel.cameras.selfieCamera.features?.length"
                label="Функции"
              >
                {{ selectedModel.cameras.selfieCamera.features.join(", ") }}
              </el-descriptions-item>
              <el-descriptions-item
                v-if="selectedModel.cameras.selfieCamera.video?.length"
                label="Видео"
              >
                <div
                  v-for="vid in selectedModel.cameras.selfieCamera.video"
                  :key="vid"
                  class="camera-spec"
                >
                  • {{ vid }}
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- Simple camera structure (fallback) -->
          <el-descriptions
            v-if="
              !selectedModel.cameras.mainCamera &&
              !selectedModel.cameras.selfieCamera
            "
            :column="1"
            border
          >
            <el-descriptions-item
              v-if="selectedModel.cameras.main"
              label="Основная"
            >
              {{ selectedModel.cameras.main }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.cameras.ultrawide"
              label="Широкоугольная"
            >
              {{ selectedModel.cameras.ultrawide }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.cameras.telephoto"
              label="Телефото"
            >
              {{ selectedModel.cameras.telephoto }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- Body -->
        <div
          v-if="
            selectedModel.body && Object.keys(selectedModel.body).length > 0
          "
          class="detail-section"
        >
          <h3>Корпус</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item
              v-if="selectedModel.body.dimensions"
              label="Размеры"
            >
              {{ selectedModel.body.dimensions }}
            </el-descriptions-item>
            <el-descriptions-item v-if="selectedModel.body.weight" label="Вес">
              {{ selectedModel.body.weight }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.body.build"
              label="Материал"
            >
              {{ selectedModel.body.build }}
            </el-descriptions-item>
            <el-descriptions-item v-if="selectedModel.body.sim" label="SIM">
              {{ selectedModel.body.sim }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- Network -->
        <div
          v-if="
            selectedModel.network &&
            Object.keys(selectedModel.network).length > 0
          "
          class="detail-section"
        >
          <h3>Сеть</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item
              v-if="selectedModel.network.technology"
              label="Технология"
            >
              {{ selectedModel.network.technology }}
            </el-descriptions-item>
            <el-descriptions-item v-if="selectedModel.network['2g']" label="2G">
              {{ selectedModel.network["2g"] }}
            </el-descriptions-item>
            <el-descriptions-item v-if="selectedModel.network['3g']" label="3G">
              {{ selectedModel.network["3g"] }}
            </el-descriptions-item>
            <el-descriptions-item v-if="selectedModel.network['4g']" label="4G">
              {{ selectedModel.network["4g"] }}
            </el-descriptions-item>
            <el-descriptions-item v-if="selectedModel.network['5g']" label="5G">
              {{ selectedModel.network["5g"] }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.network.speed"
              label="Скорость"
            >
              {{ selectedModel.network.speed }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- Sound -->
        <div
          v-if="
            selectedModel.sound && Object.keys(selectedModel.sound).length > 0
          "
          class="detail-section"
        >
          <h3>Звук</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item
              v-if="selectedModel.sound.loudspeaker"
              label="Динамик"
            >
              {{ selectedModel.sound.loudspeaker }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.sound.audioJack"
              label="Разъем 3.5мм"
            >
              {{ selectedModel.sound.audioJack }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- Comms -->
        <div
          v-if="
            selectedModel.comms && Object.keys(selectedModel.comms).length > 0
          "
          class="detail-section"
        >
          <h3>Связь</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item v-if="selectedModel.comms.wlan" label="WLAN">
              {{ selectedModel.comms.wlan }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.comms.bluetooth"
              label="Bluetooth"
            >
              {{ selectedModel.comms.bluetooth }}
            </el-descriptions-item>
            <el-descriptions-item v-if="selectedModel.comms.nfc" label="NFC">
              {{ selectedModel.comms.nfc }}
            </el-descriptions-item>
            <el-descriptions-item v-if="selectedModel.comms.usb" label="USB">
              {{ selectedModel.comms.usb }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.comms.positioning"
              label="Позиционирование"
            >
              {{ selectedModel.comms.positioning }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.comms.radio"
              label="Радио"
            >
              {{ selectedModel.comms.radio }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- Features -->
        <div
          v-if="
            selectedModel.features &&
            Object.keys(selectedModel.features).length > 0
          "
          class="detail-section"
        >
          <h3>Функции</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item
              v-if="selectedModel.features.sensors"
              label="Датчики"
            >
              {{ selectedModel.features.sensors }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.features.browser"
              label="Браузер"
            >
              {{ selectedModel.features.browser }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- Launch -->
        <div
          v-if="
            selectedModel.launch && Object.keys(selectedModel.launch).length > 0
          "
          class="detail-section"
        >
          <h3>Выпуск</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item
              v-if="selectedModel.launch.announced"
              label="Анонсирован"
            >
              {{ selectedModel.launch.announced }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.launch.released"
              label="Выпущен"
            >
              {{ selectedModel.launch.released }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="selectedModel.launch.status"
              label="Статус"
            >
              {{ selectedModel.launch.status }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- Meta Info -->
        <div class="detail-section">
          <h3>Дополнительно</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="ID">{{
              selectedModel.id
            }}</el-descriptions-item>
            <el-descriptions-item v-if="selectedModel.alias" label="Alias">
              {{ selectedModel.alias }}
            </el-descriptions-item>
            <el-descriptions-item label="Создано">
              {{ new Date(selectedModel.created_at).toLocaleString() }}
            </el-descriptions-item>
            <el-descriptions-item label="Обновлено">
              {{ new Date(selectedModel.updated_at).toLocaleString() }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

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
