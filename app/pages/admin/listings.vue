<script setup lang="ts">
import { Refresh, Filter } from "@element-plus/icons-vue";
import type { IListing, ListingStatus } from "@/types/ads";
import type { IAdminAdsFilters } from "@/composables/useAdminAds";
import { useRootStore } from "@/store/root";

definePageMeta({
  layout: "admin",
});

const root = useRootStore();

const {
  loading,
  ads,
  pagination,
  stats,
  selectedAd,
  fetchAds,
  fetchStats,
  fetchModerationAds,
  fetchAdForReview,
  approveAd,
  rejectAd,
  changeStatus,
  deleteAd,
  banUserAds,
  refresh,
} = useAdminAds();

// Role-based access
const isAdmin = computed(() => root.user?.role === "admin");

// Filters
const filters = reactive<IAdminAdsFilters>({
  page: 1,
  limit: 20,
  status: undefined,
  userId: undefined,
  search: undefined,
  sortBy: "created_at",
  sortOrder: "desc",
});

const showFilters = ref(false);

// Dialogs & Drawer state
const drawerVisible = ref(false);
const rejectDialogVisible = ref(false);
const statusDialogVisible = ref(false);
const actionLoading = ref(false);

// Current ad for dialogs
const currentAd = ref<IListing | null>(null);

// Fetch data based on role
const fetchData = async () => {
  if (isAdmin.value) {
    await fetchAds(filters);
  } else {
    await fetchModerationAds(filters);
  }
};

// Handlers
const handlePageChange = (page: number) => {
  filters.page = page;
  fetchData();
};

const handleSizeChange = (size: number) => {
  filters.limit = size;
  filters.page = 1;
  fetchData();
};

const applyFilters = () => {
  filters.page = 1;
  fetchData();
};

const resetFilters = () => {
  filters.status = undefined;
  filters.userId = undefined;
  filters.search = undefined;
  filters.sortBy = "created_at";
  filters.sortOrder = "desc";
  filters.page = 1;
  fetchData();
};

const viewAd = async (ad: IListing) => {
  await fetchAdForReview(ad.id);
  drawerVisible.value = true;
};

const handleApprove = async (ad: IListing) => {
  try {
    drawerVisible.value = false;
    await ElMessageBox.confirm(
      `Одобрить объявление "${ad.title}"?`,
      "Подтверждение",
      {
        confirmButtonText: "Одобрить",
        cancelButtonText: "Отмена",
        type: "success",
      }
    );

    actionLoading.value = true;
    await approveAd(ad.id);
    await refresh(filters, isAdmin.value);
    if (isAdmin.value) await fetchStats();
  } catch {
    // Cancelled
  } finally {
    actionLoading.value = false;
  }
};

const openRejectDialog = (ad: IListing) => {
  currentAd.value = ad;
  rejectDialogVisible.value = true;
};

const handleReject = async (reason: string) => {
  if (!currentAd.value) return;

  try {
    actionLoading.value = true;
    await rejectAd(currentAd.value.id, { reason });
    rejectDialogVisible.value = false;
    await refresh(filters, isAdmin.value);
    if (isAdmin.value) await fetchStats();
  } finally {
    actionLoading.value = false;
  }
};

const openStatusDialog = (ad: IListing) => {
  currentAd.value = ad;
  statusDialogVisible.value = true;
};

const handleStatusChange = async (status: ListingStatus, reason?: string) => {
  if (!currentAd.value) return;

  try {
    actionLoading.value = true;
    await changeStatus(currentAd.value.id, { status, reason });
    statusDialogVisible.value = false;
    await refresh(filters, isAdmin.value);
  } finally {
    actionLoading.value = false;
  }
};

const handleEdit = (ad: IListing) => {
  navigateTo(`/ads/${ad.alias}/edit`);
};

const handleDelete = async (ad: IListing) => {
  try {
    await ElMessageBox.confirm(
      `Вы уверены, что хотите удалить объявление "${ad.title}"? Это действие необратимо.`,
      "Удаление объявления",
      {
        confirmButtonText: "Удалить",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );

    actionLoading.value = true;
    await deleteAd(ad.id);
    drawerVisible.value = false;
    await fetchStats();
  } catch {
    // Cancelled
  } finally {
    actionLoading.value = false;
  }
};

const handleBanUser = async (userId: number) => {
  try {
    await ElMessageBox.confirm(
      `Заблокировать все объявления пользователя ID: ${userId}?`,
      "Блокировка объявлений",
      {
        confirmButtonText: "Заблокировать",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );

    actionLoading.value = true;
    await banUserAds(userId);
    await refresh(filters, isAdmin.value);
  } catch {
    // Cancelled
  } finally {
    actionLoading.value = false;
  }
};

const handleRefresh = async () => {
  await refresh(filters, isAdmin.value);
  ElMessage.success("Данные обновлены");
};

// Initial fetch
onMounted(() => {
  refresh(filters, isAdmin.value);
});
</script>

<template>
  <div class="admin-listings">
    <!-- Stats (Admin only) -->
    <AdminListingStats v-if="isAdmin" :stats="stats" />

    <!-- Toolbar -->
    <div class="page-toolbar">
      <div class="toolbar-left">
        <el-button
          :icon="Filter"
          :type="showFilters ? 'primary' : 'default'"
          @click="showFilters = !showFilters"
        >
          Фильтры
        </el-button>

        <div class="active-filters">
          <el-tag
            v-if="filters.status"
            closable
            size="small"
            @close="filters.status = undefined; applyFilters()"
          >
            Статус: {{ filters.status }}
          </el-tag>
          <el-tag
            v-if="filters.search"
            closable
            size="small"
            @close="filters.search = undefined; applyFilters()"
          >
            Поиск: {{ filters.search }}
          </el-tag>
          <el-tag
            v-if="filters.userId"
            closable
            size="small"
            @close="filters.userId = undefined; applyFilters()"
          >
            Пользователь: {{ filters.userId }}
          </el-tag>
        </div>
      </div>

      <div class="toolbar-right">
        <el-button :icon="Refresh" :loading="loading" @click="handleRefresh">
          Обновить
        </el-button>
      </div>
    </div>

    <!-- Filters -->
    <AdminListingFilters
      v-model="filters"
      :visible="showFilters"
      :is-admin="isAdmin"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <!-- Table -->
    <AdminListingTable
      :ads="ads"
      :pagination="pagination"
      :loading="loading"
      :page="filters.page ?? 1"
      :limit="filters.limit ?? 20"
      :is-admin="isAdmin"
      @update:page="handlePageChange"
      @update:limit="handleSizeChange"
      @row-click="viewAd"
      @approve="handleApprove"
      @reject="openRejectDialog"
      @edit="handleEdit"
      @delete="handleDelete"
      @status-change="openStatusDialog"
    />

    <!-- Detail Drawer -->
    <AdminListingDetailDrawer
      v-model="drawerVisible"
      :ad="selectedAd"
      :is-admin="isAdmin"
      :loading="loading"
      @approve="handleApprove"
      @reject="openRejectDialog"
      @edit="handleEdit"
      @delete="handleDelete"
      @status-change="openStatusDialog"
      @ban-user="handleBanUser"
    />

    <!-- Reject Dialog -->
    <AdminListingRejectDialog
      v-model="rejectDialogVisible"
      :ad="currentAd"
      :loading="actionLoading"
      @confirm="handleReject"
    />

    <!-- Status Dialog (Admin only) -->
    <AdminListingStatusDialog
      v-if="isAdmin"
      v-model="statusDialogVisible"
      :ad="currentAd"
      :loading="actionLoading"
      @confirm="handleStatusChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.admin-listings {
  max-width: 1600px;
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
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.active-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
