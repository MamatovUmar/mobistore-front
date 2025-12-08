<script setup lang="ts">
import { Search, Plus, Refresh } from "@element-plus/icons-vue";
import { useAdminStaff } from "@/composables/useAdminStaff";
import { useRootStore } from "@/store/root";
import type { IStaffMember, IStaffUpdatePayload, UserRole } from "@/types/admin-staff";

definePageMeta({
  layout: "admin",
});

const { user } = useRootStore();

const {
  staff,
  pagination,
  loading,
  filters,
  page,
  limit,
  fetchStaff,
  fetchStaffById,
  updateStaff,
  changeRole,
  searchUsers,
} = useAdminStaff();

// UI State
const detailDrawerVisible = ref(false);
const editDrawerVisible = ref(false);
const addDialogVisible = ref(false);
const selectedStaff = ref<IStaffMember | null>(null);
const actionLoading = ref(false);
const saveLoading = ref(false);

// Fetch staff on mount
onMounted(() => {
  fetchStaff();
});

// Watch for page/limit changes
watch([page, limit], () => {
  fetchStaff();
});

// Handlers
const handleRowClick = async (member: IStaffMember) => {
  selectedStaff.value = member;
  detailDrawerVisible.value = true;

  // Fetch fresh data
  const freshData = await fetchStaffById(member.id);
  if (freshData) {
    selectedStaff.value = freshData;
  }
};

const handleEdit = (member: IStaffMember) => {
  selectedStaff.value = member;
  detailDrawerVisible.value = false;
  editDrawerVisible.value = true;
};

const handleSaveStaff = async (payload: IStaffUpdatePayload) => {
  if (!selectedStaff.value) return;

  saveLoading.value = true;
  try {
    await updateStaff(selectedStaff.value.id, payload);
    ElMessage.success("Данные сотрудника обновлены");
    editDrawerVisible.value = false;
    fetchStaff();
  } catch (err: any) {
    ElMessage.error(err.message || "Ошибка при обновлении данных");
  } finally {
    saveLoading.value = false;
  }
};

const handleChangeRole = async (member: IStaffMember, role: UserRole) => {
  actionLoading.value = true;
  try {
    const message = await changeRole(member.id, role);
    ElMessage.success(message);
    detailDrawerVisible.value = false;
    fetchStaff();
  } catch (err: any) {
    ElMessage.error(err.message || "Ошибка при изменении роли");
  } finally {
    actionLoading.value = false;
  }
};

const handleAddStaff = async (userId: number, role: UserRole) => {
  actionLoading.value = true;
  try {
    await changeRole(userId, role);
    ElMessage.success("Сотрудник успешно добавлен");
    addDialogVisible.value = false;
    fetchStaff();
  } catch (err: any) {
    ElMessage.error(err.message || "Ошибка при добавлении сотрудника");
  } finally {
    actionLoading.value = false;
  }
};

const handleRefresh = () => {
  fetchStaff();
};

const handleSearch = () => {
  page.value = 1;
  fetchStaff();
};
</script>

<template>
  <div class="admin-staff">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Сотрудники</h1>
      <p class="page-subtitle">Управление администраторами и модераторами</p>
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
      </div>
      <div class="toolbar-right">
        <el-button :icon="Refresh" @click="handleRefresh">
          Обновить
        </el-button>
        <el-button type="primary" :icon="Plus" @click="addDialogVisible = true">
          Добавить сотрудника
        </el-button>
      </div>
    </div>

    <!-- Staff Table -->
    <AdminStaffTable
      :staff="staff"
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
    <AdminStaffDetailDrawer
      v-model="detailDrawerVisible"
      :staff="selectedStaff"
      :action-loading="actionLoading"
      :current-user-id="user?.id"
      @edit="handleEdit"
      @change-role="handleChangeRole"
    />

    <!-- Edit Drawer -->
    <AdminStaffEditDrawer
      v-model="editDrawerVisible"
      :staff="selectedStaff"
      :loading="saveLoading"
      @save="handleSaveStaff"
    />

    <!-- Add Staff Dialog -->
    <AdminStaffAddStaffDialog
      v-model="addDialogVisible"
      :loading="actionLoading"
      :search-fn="searchUsers"
      @add="handleAddStaff"
    />
  </div>
</template>

<style lang="scss" scoped>
.admin-staff {
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
  }

  .toolbar-left {
    flex-direction: column;
  }

  .toolbar-right {
    justify-content: flex-end;
    flex-wrap: wrap;
  }
}
</style>