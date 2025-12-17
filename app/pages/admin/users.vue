<script setup lang="ts">
import { Search, Filter, Refresh } from "@element-plus/icons-vue";
import { useAdminUsers } from "@/composables/useAdminUsers";
import type { IAdminUser, IAdminUserUpdatePayload } from "@/types/admin-user";

definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "Пользователи — Админ MobiStore",
  robots: "noindex, nofollow",
});

const {
  users,
  pagination,
  loading,
  filters,
  page,
  limit,
  fetchUsers,
  fetchUserById,
  updateUser,
  generatePassword,
  banUser,
  unbanUser,
  resetFilters,
  applyFilters,
} = useAdminUsers();

// UI State
const showFilters = ref(false);
const detailDrawerVisible = ref(false);
const editDrawerVisible = ref(false);
const selectedUser = ref<IAdminUser | null>(null);
const actionLoading = ref(false);
const saveLoading = ref(false);

// Fetch users on mount
onMounted(() => {
  fetchUsers();
});

// Watch for page/limit changes
watch([page, limit], () => {
  fetchUsers();
});

// Handlers
const handleRowClick = async (user: IAdminUser) => {
  selectedUser.value = user;
  detailDrawerVisible.value = true;

  // Fetch fresh user data
  const freshUser = await fetchUserById(user.id);
  if (freshUser) {
    selectedUser.value = freshUser;
  }
};

const handleEdit = (user: IAdminUser) => {
  selectedUser.value = user;
  detailDrawerVisible.value = false;
  editDrawerVisible.value = true;
};

const handleSaveUser = async (payload: IAdminUserUpdatePayload) => {
  if (!selectedUser.value) return;

  saveLoading.value = true;
  try {
    await updateUser(selectedUser.value.id, payload);
    ElMessage.success("Пользователь успешно обновлён");
    editDrawerVisible.value = false;
    fetchUsers();
  } catch (err: any) {
    ElMessage.error(err.message || "Ошибка при обновлении пользователя");
  } finally {
    saveLoading.value = false;
  }
};

const handleGeneratePassword = async (user: IAdminUser) => {
  try {
    await ElMessageBox.confirm(
      `Сгенерировать новый пароль для пользователя ${user.email}? Новый пароль будет отправлен на email.`,
      "Генерация пароля",
      {
        confirmButtonText: "Сгенерировать",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );

    actionLoading.value = true;
    const message = await generatePassword(user.id);
    ElMessage.success(message);
  } catch (err: any) {
    if (err !== "cancel") {
      ElMessage.error(err.message || "Ошибка при генерации пароля");
    }
  } finally {
    actionLoading.value = false;
  }
};

const handleBan = async (user: IAdminUser) => {
  try {
    await ElMessageBox.confirm(
      `Забанить пользователя ${user.email}? Все его активные объявления будут архивированы.`,
      "Бан пользователя",
      {
        confirmButtonText: "Забанить",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );

    actionLoading.value = true;
    const result = await banUser(user.id);
    ElMessage.success(`${result.message}. Архивировано объявлений: ${result.archivedAds}`);

    // Update user in list
    if (selectedUser.value?.id === user.id) {
      selectedUser.value = { ...selectedUser.value, is_ban: true };
    }
    fetchUsers();
  } catch (err: any) {
    if (err !== "cancel") {
      ElMessage.error(err.message || "Ошибка при бане пользователя");
    }
  } finally {
    actionLoading.value = false;
  }
};

const handleUnban = async (user: IAdminUser) => {
  try {
    await ElMessageBox.confirm(
      `Разбанить пользователя ${user.email}?`,
      "Разбан пользователя",
      {
        confirmButtonText: "Разбанить",
        cancelButtonText: "Отмена",
        type: "info",
      }
    );

    actionLoading.value = true;
    const message = await unbanUser(user.id);
    ElMessage.success(message);

    // Update user in list
    if (selectedUser.value?.id === user.id) {
      selectedUser.value = { ...selectedUser.value, is_ban: false };
    }
    fetchUsers();
  } catch (err: any) {
    if (err !== "cancel") {
      ElMessage.error(err.message || "Ошибка при разбане пользователя");
    }
  } finally {
    actionLoading.value = false;
  }
};

const handleResetFilters = () => {
  resetFilters();
  fetchUsers();
};

const handleRefresh = () => {
  fetchUsers();
};

const handleSearch = () => {
  page.value = 1;
  fetchUsers();
};
</script>

<template>
  <div class="admin-users">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Пользователи</h1>
      <p class="page-subtitle">Управление пользователями системы</p>
    </div>

    <!-- Toolbar -->
    <div class="page-toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="filters.search"
          placeholder="Поиск по имени, email, телефону..."
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
        <el-button :icon="Refresh" @click="handleRefresh">
          Обновить
        </el-button>
      </div>
    </div>

    <!-- Filters -->
    <AdminUserFilters
      v-model="filters"
      :visible="showFilters"
      @apply="applyFilters"
      @reset="handleResetFilters"
    />

    <!-- Users Table -->
    <AdminUserTable
      :users="users"
      :pagination="pagination"
      :loading="loading"
      :page="page"
      :limit="limit"
      @update:page="page = $event"
      @update:limit="limit = $event"
      @row-click="handleRowClick"
      @edit="handleEdit"
    />

    <!-- Detail Drawer -->
    <AdminUserDetailDrawer
      v-model="detailDrawerVisible"
      :user="selectedUser"
      :action-loading="actionLoading"
      @edit="handleEdit"
      @generate-password="handleGeneratePassword"
      @ban="handleBan"
      @unban="handleUnban"
    />

    <!-- Edit Drawer -->
    <AdminUserEditDrawer
      v-model="editDrawerVisible"
      :user="selectedUser"
      :loading="saveLoading"
      @save="handleSaveUser"
    />
  </div>
</template>

<style lang="scss" scoped>
.admin-users {
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
  width: 320px;

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
