<script setup lang="ts">
import { Search, Filter, Refresh } from "@element-plus/icons-vue";
import { useAdminApplications } from "@/composables/useAdminApplications";
import type { IApplication, ApplicationStatus } from "@/types/application";

definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "Заявки — Админ MobiStore",
  robots: "noindex, nofollow",
});

const {
  applications,
  pagination,
  loading,
  filters,
  page,
  limit,
  fetchApplications,
  updateStatus,
  deleteApplication,
  resetFilters,
  applyFilters,
} = useAdminApplications();

// UI State
const showFilters = ref(false);
const drawerVisible = ref(false);
const selectedApplication = ref<IApplication | null>(null);
const actionLoading = ref(false);

// Fetch applications on mount
onMounted(() => {
  fetchApplications();
});

// Watch for page/limit changes
watch([page, limit], () => {
  fetchApplications();
});

// Handlers
const handleRowClick = (app: IApplication) => {
  selectedApplication.value = app;
  drawerVisible.value = true;
};

const handleStatusChange = async (
  app: IApplication,
  status: ApplicationStatus
) => {
  if (app.status === status) return;

  try {
    actionLoading.value = true;
    await updateStatus(app.id, status);
    ElMessage.success("Статус заявки обновлён");

    // Update selected application if it's the same
    if (selectedApplication.value?.id === app.id) {
      selectedApplication.value = { ...selectedApplication.value, status };
    }
  } catch (err: any) {
    ElMessage.error(err.message || "Ошибка при изменении статуса");
  } finally {
    actionLoading.value = false;
  }
};

const handleDelete = async (app: IApplication) => {
  try {
    await ElMessageBox.confirm(
      `Вы уверены, что хотите удалить заявку #${app.id} от ${app.name}? Это действие необратимо.`,
      "Удаление заявки",
      {
        confirmButtonText: "Удалить",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );

    actionLoading.value = true;
    await deleteApplication(app.id);
    ElMessage.success("Заявка успешно удалена");
    drawerVisible.value = false;
  } catch (err: any) {
    if (err !== "cancel") {
      ElMessage.error(err.message || "Ошибка при удалении заявки");
    }
  } finally {
    actionLoading.value = false;
  }
};

const handleResetFilters = () => {
  resetFilters();
  fetchApplications();
};

const handleRefresh = () => {
  fetchApplications();
  ElMessage.success("Данные обновлены");
};

const handleSearch = () => {
  page.value = 1;
  fetchApplications();
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
  <div class="admin-applications">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Заявки</h1>
      <p class="page-subtitle">Управление заявками с сайта</p>
    </div>

    <!-- Toolbar -->
    <div class="page-toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="filters.search"
          placeholder="Поиск по имени, email, телефону, сообщению..."
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
      </div>
    </div>

    <!-- Filters -->
    <AdminApplicationFilters
      v-model="filters"
      :visible="showFilters"
      @apply="applyFilters"
      @reset="handleResetFilters"
    />

    <!-- Applications Table -->
    <AdminApplicationTable
      :applications="applications"
      :pagination="pagination"
      :loading="loading"
      :page="page"
      :limit="limit"
      @update:page="handlePageChange"
      @update:limit="handleSizeChange"
      @row-click="handleRowClick"
      @delete="handleDelete"
    />

    <!-- Detail Drawer -->
    <AdminApplicationDetailDrawer
      v-model="drawerVisible"
      :application="selectedApplication"
      :action-loading="actionLoading"
      @status-change="handleStatusChange"
      @delete="handleDelete"
    />
  </div>
</template>

<style lang="scss" scoped>
.admin-applications {
  max-width: 1600px;
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
  width: 380px;

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
