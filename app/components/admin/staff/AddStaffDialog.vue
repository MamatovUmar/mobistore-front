<script setup lang="ts">
import { Search, Loading } from "@element-plus/icons-vue";
import type { IAdminUser } from "@/types/admin-user";
import type { UserRole } from "@/types/admin-staff";

const props = defineProps<{
  modelValue: boolean;
  loading?: boolean;
  searchFn: (query: string) => Promise<IAdminUser[]>;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  add: [userId: number, role: UserRole];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const selectedUser = ref<IAdminUser | null>(null);
const selectedRole = ref<UserRole>("moderator");
const searchQuery = ref("");
const searchResults = ref<IAdminUser[]>([]);
const searching = ref(false);

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  {
    value: "moderator",
    label: "Модератор",
    description: "Может модерировать объявления",
  },
  {
    value: "admin",
    label: "Администратор",
    description: "Полный доступ к системе",
  },
];

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const handleSearch = async (query: string) => {
  searchQuery.value = query;

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  if (!query || query.length < 2) {
    searchResults.value = [];
    return;
  }

  searchTimeout = setTimeout(async () => {
    searching.value = true;
    try {
      searchResults.value = await props.searchFn(query);
    } finally {
      searching.value = false;
    }
  }, 300);
};

const handleSelectUser = (user: IAdminUser) => {
  selectedUser.value = user;
  searchQuery.value = "";
  searchResults.value = [];
};

const handleRemoveUser = () => {
  selectedUser.value = null;
};

const handleConfirm = () => {
  if (selectedUser.value) {
    emit("add", selectedUser.value.id, selectedRole.value);
  }
};

const handleClose = () => {
  visible.value = false;
  selectedUser.value = null;
  selectedRole.value = "moderator";
  searchQuery.value = "";
  searchResults.value = [];
};

const getUserInitials = (user: IAdminUser) => {
  const first = user.first_name?.charAt(0) || "";
  const last = user.last_name?.charAt(0) || "";
  return (first + last).toUpperCase() || user.email.charAt(0).toUpperCase();
};

const getFullName = (user: IAdminUser) => {
  const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  return name || "Без имени";
};

const canSubmit = computed(() => {
  return selectedUser.value !== null;
});
</script>

<template>
  <el-dialog
    v-model="visible"
    title="Добавить сотрудника"
    width="550px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="add-staff-content">
      <!-- User Search -->
      <div class="form-section">
        <label class="form-label">Пользователь</label>

        <template v-if="!selectedUser">
          <el-input
            v-model="searchQuery"
            placeholder="Поиск по имени, email или телефону..."
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
          />

          <div v-if="searching" class="search-loading">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>Поиск...</span>
          </div>

          <div v-else-if="searchResults.length" class="search-results">
            <div
              v-for="user in searchResults"
              :key="user.id"
              class="search-result-item"
              @click="handleSelectUser(user)"
            >
              <el-avatar :size="36" class="result-avatar">
                {{ getUserInitials(user) }}
              </el-avatar>
              <div class="result-info">
                <span class="result-name">{{ getFullName(user) }}</span>
                <span class="result-email">{{ user.email }}</span>
              </div>
            </div>
          </div>

          <div v-else-if="searchQuery.length >= 2 && !searching" class="search-empty">
            Пользователи не найдены
          </div>

          <p class="form-hint">
            Введите минимум 2 символа для поиска
          </p>
        </template>

        <template v-else>
          <div class="selected-user">
            <el-avatar :size="40" class="selected-avatar">
              {{ getUserInitials(selectedUser) }}
            </el-avatar>
            <div class="selected-info">
              <span class="selected-name">{{ getFullName(selectedUser) }}</span>
              <span class="selected-email">{{ selectedUser.email }}</span>
            </div>
            <el-button text type="danger" @click="handleRemoveUser">
              Убрать
            </el-button>
          </div>
        </template>
      </div>

      <!-- Role Selection -->
      <div class="form-section">
        <label class="form-label">Роль</label>
        <el-radio-group v-model="selectedRole" class="role-group">
          <el-radio
            v-for="option in roleOptions"
            :key="option.value"
            :value="option.value"
            class="role-option"
          >
            <div class="role-content">
              <span class="role-label">{{ option.label }}</span>
              <span class="role-description">{{ option.description }}</span>
            </div>
          </el-radio>
        </el-radio-group>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">Отмена</el-button>
      <el-button
        type="primary"
        :loading="loading"
        :disabled="!canSubmit"
        @click="handleConfirm"
      >
        Добавить
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.add-staff-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.form-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
}

// Search
.search-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.search-results {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--color-bg-secondary);
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border-light);
  }
}

.result-avatar {
  background: var(--color-primary);
  color: white;
  font-weight: 600;
  font-size: 12px;
  flex-shrink: 0;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.result-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.result-email {
  font-size: 12px;
  color: var(--color-text-muted);
}

.search-empty {
  padding: 12px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 13px;
}

// Selected User
.selected-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--color-bg-secondary);
  border-radius: 10px;
}

.selected-avatar {
  background: var(--color-primary);
  color: white;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.selected-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.selected-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.selected-email {
  font-size: 12px;
  color: var(--color-text-muted);
}

// Role Selection
.role-group {
  display: flex;
  gap: 12px;

  :deep(.el-radio) {
    height: auto;
    margin-right: 0;
  }
}

.role-option {
  padding: 16px;
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  transition: all 0.2s;

  &:has(:checked) {
    border-color: var(--color-primary);
    background: var(--el-color-primary-light-9);
  }
}

.role-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.role-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.role-description {
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
